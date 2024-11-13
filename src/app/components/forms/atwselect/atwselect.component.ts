import { HttpErrorResponse } from '@angular/common/http';
import { MastercacheService } from './../../../share/mastercache.service';
import { Component, OnInit, Input, SimpleChanges, OnChanges, AfterContentInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AtwselectmodalComponent } from '../atwselectmodal/atwselectmodal.component';
import { FormGroup } from '@angular/forms';
import { IFormHookItems } from '../../../models/formcontrol';
import { Storage } from '@ionic/storage';
import axios from 'axios-observable';
import { getApiConfigByKey } from '../../../models/form.dic';

@Component({
  selector: 'app-atwselect',
  templateUrl: './atwselect.component.html',
  styleUrls: ['./atwselect.component.scss'],
})
export class AtwselectComponent implements OnInit, AfterContentInit {
  @Input() properties: any;
  @Input() formId: string;
  @Input() validateForm: FormGroup;
  @Input() formHook: any;
  @Input() visibilityControl: string;
  @Input() visibilityValue: string;

  propertiesOptions: any;
  isReadOnly = false;
  groupVal: any;

  inputValBack: string;
  label: string;
  isOpen = false;
  iconStyle = {
    position: 'absolute',
    right: '5px',
    top: '8px',
  }
  private headerConfig: any;
  constructor(
    private modalCtrl: ModalController,
    private masterCacheService: MastercacheService,
    private storage: Storage
  ) { }

  get isError() {
    return this.validateForm.get(this.properties.id)
  }
  ngOnInit() {
    // this.inputValBack = this.inputVal ? this.inputVal : '';
    this.inputValBack = this.properties.value;
    this.propertiesOptions = this.properties;
    this.headerConfig = getApiConfigByKey('masterdata');

    this.getLabelFromValBack();

    // console.log('AtwselectComponent', this.headerConfig, this.properties);

    this.validateForm.get(this.properties.id)?.valueChanges.subscribe(val => {
      if (!this.label || this.label === this.properties.optionsBinder.properties.emptyLabel || !this.inputValBack) {
        this.inputValBack = val;
        this.getLabelFromValBack();
      }
      console.log('self change : ', this.properties.id, ': ', val, ' : ', this.inputValBack, this.label);
    })
    // console.log('atw Select', this.propertiesOptions, this.headerConfig);
    if (!this.propertiesOptions.visibilityControl && this.visibilityControl) {
      this.propertiesOptions.visibilityControl = this.visibilityControl;
      this.propertiesOptions.visibilityValue = this.visibilityValue;
    }
    if (this.formHook && this.formHook[this.properties.id] && typeof this.formHook[this.properties.id].before !== 'undefined') {
      this.formHook[this.properties.id].before(this);
    }
  }
  createHeader() {
    const headers = {} as any;
    headers['Content-Type'] = 'application/json; charset=utf-8';
    for (const key in this.headerConfig.headers) {
      headers[key] = this.headerConfig.headers[key];
    }

    return headers;
  }
  async getLabelFromValBack() {
    if (!this.inputValBack || this.inputValBack === '' || this.inputValBack.indexOf('#')===0) {
      return;
    }
    const masterDataId = this.properties.optionsBinder.properties.formDefId;
    const labelColName = this.properties.optionsBinder.properties.labelColumn;
    const idColName = this.properties.optionsBinder.properties.idColumn;
    const headers = this.createHeader();
    const masterKey = masterDataId + ':' + idColName + ':' + this.inputValBack;
    const dataValue = await this.masterCacheService.getMasterData(masterKey);
    console.log('getLabelFromValBack', this.properties.id, labelColName,masterKey, 'dataValue', dataValue)
    if (dataValue) {
      if(dataValue[0] && dataValue[0][labelColName]){
        this.label = dataValue[0][labelColName];
        // console.log('isObj' + labelColName ,dataValue[0], dataValue)
      }else{
        this.label = dataValue[labelColName];
      }
      
    } else {

      try {
        const userData = await this.storage.get('authToken');
        if (userData) {
          headers['Authorization'] = 'Basic ' + JSON.parse(userData).sult;
        }

        const paramData = '?' + this.properties.optionsBinder.properties.idColumn + '=' + this.inputValBack;

        axios.get(this.headerConfig.url + masterDataId + 'Mobile' + paramData, { headers: headers }).subscribe(
          async data => {
            if (data.status === 200 || data.status === 201) {
              const resData = [...data.data.data].find(item => {
                return item[this.properties.optionsBinder.properties.idColumn] === this.inputValBack
              });

              if(!resData){
                return;
              }
              
              this.label = resData[labelColName];
              await this.masterCacheService.setMasterData(masterKey, resData);
              await this.masterCacheService.setMasterData(masterKey + ':selected', resData);
            }
          },
          (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              console.log('Client-side error occured.');
            } else {
              console.log('Server-side error occured.');
            }
          }
        )
      } catch (error) {

      }
    }
  }

  ngAfterContentInit(): void {
    this.hookGenerate();
  }

  initVal() { }

  showPicker() {
    this.isOpen = true;
    this.modalCtrl.create({
      component: AtwselectmodalComponent,
      componentProps: {
        selectedValue: this.inputValBack,
        properties: this.propertiesOptions
      }
    }).then(modelEl => {
      modelEl.present();
      return modelEl.onDidDismiss();
    }).then(
      resultData => {
        this.isOpen = false;
        if (resultData.role === 'confirm') {
          const props = this.properties.optionsBinder.properties;
          this.label = resultData.data.selected[props.labelColumn];
          this.inputValBack = resultData.data.selected[props.idColumn];
          this.validateForm.get(this.properties.id)?.setValue(this.inputValBack);
        }
      }
    );
  }

  getDisplaySelect() {
    return this.inputValBack !== '' ? this.label : this.properties.optionsBinder.properties.emptyLabel;
  }

  hookGenerate() {
    if (this.formHook && this.formHook[this.properties.id]) {
      const hooks: IFormHookItems = this.formHook[this.properties.id];

      if (typeof hooks.remaps !== 'undefined') {
        hooks.remaps(this, this.propertiesOptions.visibilityValue);
        this.validateForm
          .get(this.propertiesOptions.visibilityControl)?.valueChanges.subscribe((val) => {
            hooks.remaps(this, val);
          });
      }

      if (!hooks.subscribe) {
        return;
      }
      const _this = this;
      for (const sub of hooks.subscribe) {
        this.validateForm.get(sub.formId)?.valueChanges.subscribe((val) => { sub.cb(val, _this, sub.formId) });
      }
    }
  }
}
