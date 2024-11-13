import { MastercacheService } from './../../../share/mastercache.service';
import { IFormOptionsBinderProps } from './../../../models/formcontrol';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { getApiConfigByKey } from 'src/app/models/form.dic';
import { Storage } from '@ionic/storage';
import axios from 'axios-observable';

@Component({
  selector: 'app-atwselectmodal',
  templateUrl: './atwselectmodal.component.html',
  styleUrls: ['./atwselectmodal.component.scss'],
})
export class AtwselectmodalComponent implements OnInit {
  @Input() selectedValue: string;
  @Input() properties: any;
  inputValue: string;
  options:any = [];
  cacheOptions:any = [];
  page = 0;
  loading = false;
  maximumPages = 3;
  searchVal = '';
  private headerConfig: any;
  isLoading = false;
  binderProp: IFormOptionsBinderProps;
  backVal: any;
  dataList = [];

  hStyle = {
    height: window.innerHeight
  }
  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private masterStorage: MastercacheService,
  ) { };
  ngOnInit() {
    this.backVal = this.selectedValue;
    this.headerConfig = getApiConfigByKey('masterdata');
    this.binderProp = this.properties.optionsBinder.properties;
    if (this.properties.options.length > 0) {
      this.options = this.properties.options;
      this.cacheOptions = this.properties.options;
    } else {
      this.isLoading = true;
      this.loadingCtrl
        .create({ keyboardClose: true, message: 'กำลังดึงข้อมูล...' }).then(loadingEl => {
          this.loadMasterOptions(loadingEl);
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.isLoading = false;
        });
    }

  }

  loadSult() { }

  createHeader() {
    const headers = {} as any;
    headers['Content-Type'] = 'application/json; charset=utf-8';
    for (const key in this.headerConfig.headers) {
      headers[key] = this.headerConfig.headers[key];
    }

    return headers;
  }
  async loadMasterOptions(loadingEl:any, force = false) {
    loadingEl.present();

    const headers = this.createHeader();

    const userData = await this.storage.get('authToken');
    if (userData) {
      headers['Authorization'] = 'Basic ' + JSON.parse(userData).sult;
    }
    
    const masterDataId = this.properties.optionsBinder.properties.formDefId;
    const masterKey = masterDataId + (this.properties.visibilityValue ? ':' + (this.properties.optionsBinder.properties.groupingColumn ? this.properties.optionsBinder.properties.groupingColumn + ':' : '') + this.properties.visibilityValue : '');
    try {
      const paramData = this.properties.visibilityValue && this.properties.optionsBinder.properties.groupingColumn ? '?' + this.properties.optionsBinder.properties.groupingColumn + '=' + this.properties.visibilityValue : '';
      console.log('masterDataId',masterDataId,this.properties);
      
      console.log('masterKey',masterKey);
      const masterCache = await this.masterStorage.getMasterData(masterKey);
      if (masterCache && masterCache.length > 0 && !force) {
       if (this.properties.optionsBinder.properties.groupingColumn && this.properties.visibilityValue) {
          this.options = [...masterCache].filter(item => {
            return item[this.properties.optionsBinder.properties.groupingColumn] === this.properties.visibilityValue
          }) as any;
        } else {
          this.options = [...masterCache] as any;
        }

        this.cacheOptions = [...this.options];
        this.closeLoading(loadingEl);
      } else {
        axios.get(this.headerConfig.url + masterDataId + 'Mobile' + paramData, { headers: headers }).subscribe(
          async (data) => {
            if (data.status === 200 || data.status === 201) {
              if (this.properties.optionsBinder.properties.groupingColumn && this.properties.visibilityValue) {
                this.options = [...data.data.data].filter(item => {
                  return item[this.properties.optionsBinder.properties.groupingColumn] === this.properties.visibilityValue
                }) as any;
              } else {
                this.options = [...data.data.data] as any;
              }
              this.cacheOptions = [...this.options];
              await this.masterStorage.setMasterData(masterKey, this.options);
            }
            this.closeLoading(loadingEl);
          },
          (err: HttpErrorResponse) => {
            this.closeLoading(loadingEl);
            if (err.error instanceof Error) {
              console.log('Client-side error occured.');
            } else {
              console.log('Server-side error occured.');
            }
          }
        );
      }

    } catch (error) {
      console.log(error);
      this.closeLoading(loadingEl);
    }
  }
  closeLoading(loadingEl:any) {
    loadingEl.dismiss();
    this.isLoading = false;
  }
  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
  submitForm() {
    this.searchVal = this.inputValue;
    this.cacheOptions = [...this.options].filter(item => item[this.binderProp.labelColumn].indexOf(this.searchVal) > -1) as any;
  }
  // ngOnChanges(changes: SimpleChanges) { }
  doRefresh(event:any) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'กำลังดึงข้อมูล...' }).then(loadingEl => {
        this.loadMasterOptions(loadingEl, true);
        event.target.complete();
      }).catch(err => {
        console.log(err);
        event.target.complete();
      }).finally(() => {
        this.isLoading = false;
      });
  }

  async buttonClick(item: any) {
    const keySelected = this.binderProp.formDefId + ':' + this.binderProp.idColumn + ':' + item[this.binderProp.idColumn] + ':selected';
    await this.masterStorage.setMasterData(keySelected, [{ ...item }]);
    this.backVal = item[this.binderProp.idColumn];
    console.log(item);
    this.modalCtrl.dismiss({ selected: item }, 'confirm');
  }
}