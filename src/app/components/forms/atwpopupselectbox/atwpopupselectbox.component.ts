import { AtwPopupSelectModalComponent } from './../atw-popup-select-modal/atw-popup-select-modal.component';
import { Component, OnInit, Input, AfterContentInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import axios from 'axios-observable';
import { MastercacheService } from '../../../share/mastercache.service';
import { IFormHookItems } from '../../../models/formcontrol';
import { getApiConfigByKey, getApiListConfigByKey } from '../../../models/form.dic';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

@Component({
  selector: 'app-atwpopupselectbox',
  templateUrl: './atwpopupselectbox.component.html',
  styleUrls: ['./atwpopupselectbox.component.scss'],
})
export class AtwpopupselectboxComponent implements OnInit, AfterContentInit {
  @Input() properties: any;
  @Input() formId: string;
  @Input() validateForm: FormGroup;
  @Input() formHook: any;
  @Input() visibilityControl: string;
  @Input() visibilityValue: string;
  @Input() isError: any;

  propertiesOptions: any;
  isReadOnly = false;
  groupVal: any;

  inputValBack: string = '';
  label: string = '';
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

  ngOnInit() {
    this.propertiesOptions = this.properties;
    this.inputValBack = this.properties.value;
    this.headerConfig = getApiListConfigByKey(this.properties.listId) || getApiConfigByKey('masterdata');

    this.getLabelFromValBack();

    this.validateForm.get(this.properties.id)?.valueChanges.subscribe(val => {
      console.log('popup self change : ', this.properties.id, ': ', val, ' : ', this.inputValBack, ' : ', this.label);
      if(!this.label || !this.inputValBack){
        this.inputValBack = val;
        this.getLabelFromValBack();
      }
    })

    if (!this.propertiesOptions.visibilityControl && this.visibilityControl) {
      this.propertiesOptions.visibilityControl = this.visibilityControl;
      this.propertiesOptions.visibilityValue = this.visibilityValue;
    }

    if (!this.formHook[this.properties.id]) return;
    if (this.formHook[this.properties.id] && typeof this.formHook[this.properties.id].before !== 'undefined') {
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
    if (!this.inputValBack || this.inputValBack === '') {
      return;
    }
    const masterDataId = this.properties.listId;
    const labelColName = this.properties.displayField;
    const idColName = this.properties.idField;
    const headers = this.createHeader();
    const masterKey = masterDataId + ':' + idColName + ':' + this.inputValBack;
    const dataValue = await this.masterCacheService.getMasterData(masterKey);
    console.log('popup :', masterKey, labelColName, dataValue)
    if (dataValue) {
      this.label = dataValue[labelColName];
    } else {

      try {
        const userData = await this.storage.get('authToken');
        if (userData) {
          headers['Authorization'] = 'Basic ' + JSON.parse(userData).sult;
        }
        const paramData = '?' + this.properties.optionsBinder.properties.idColumn + '=' + 1;
        axios.get(this.headerConfig.url + masterDataId + 'Mobile' + paramData, { headers: headers }).subscribe(
          async data => {
            if (data.status === 200 || data.status === 201) {
              this.label = [...data.data.data][0][labelColName];
              await this.masterCacheService.setMasterData(masterKey, [...data.data.data][0]);
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
  get formTrace() {
    return this.validateForm.get(this.properties.id);
  }

  showPicker() {
    this.isOpen = true;
    this.modalCtrl.create({
      component: AtwPopupSelectModalComponent,
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
          this.label = resultData.data.selected[this.properties.displayField];
          this.inputValBack = resultData.data.selected[this.properties.idField];
          this.validateForm.get(this.properties.id)?.setValue(this.inputValBack);
        }
      }
    );
    return false;
  }

  ngAfterContentInit(): void {
    this.hookGenerate();
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
