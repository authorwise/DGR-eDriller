import { keyToMap } from './../../../models/form.dic';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import axios from 'axios-observable';
import { MastercacheService } from '../../../share/mastercache.service';
import { getApiListConfigByKey, getApiConfigByKey } from '../../../models/form.dic';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-atw-popup-select-modal',
  templateUrl: './atw-popup-select-modal.component.html',
  styleUrls: ['./atw-popup-select-modal.component.scss'],
})
export class AtwPopupSelectModalComponent implements OnInit {
  @Input() selectedValue: string;
  @Input() properties: any;

  inputValue: string;
  backVal: any;
  options = [];
  cacheOptions:any = [];
  headerConfig: any;

  dataList = [];
  searchVal: string = '';
  isLoading: boolean = false;
  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private masterStorage: MastercacheService,
  ) { }
  submitForm() {
    this.searchVal = this.inputValue;
    this.cacheOptions = [...this.options].filter((item:any) => {
      let found = false;
      for (const key in item) {
        found = item[key].indexOf(this.searchVal) > -1
      }
      return found;
    });
  }
  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
  ngOnInit() {
    this.backVal = this.selectedValue;

    this.headerConfig = getApiListConfigByKey(this.properties.listId);
    // console.log('popup', this.headerConfig, this.properties.listId);
    if (!this.headerConfig) {
      this.headerConfig = getApiConfigByKey('masterdata');
      this.headerConfig.haslogin = '';
    } else {
      this.headerConfig.haslogin = 'L';
    }


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
  createHeader() {
    const headers = {} as any;
    headers['Content-Type'] = 'application/json; charset=utf-8';
    for (const key in this.headerConfig.headers) {
      headers[key] = this.headerConfig.headers[key];
    }

    return headers;
  }

  closeLoading(loadingEl:any) {
    loadingEl.dismiss();
    this.isLoading = false;
  }

  async loadMasterOptions(loadingEl:any, force = false) {
    loadingEl.present();

    const headers = this.createHeader();

    const userData = await this.storage.get('authToken');
    headers['Authorization'] = 'Basic ' + JSON.parse(userData).sult;

    const masterDataId = this.properties.listId;
    const masterKey = masterDataId;
    try {

      const masterCache = await this.masterStorage.getMasterData(masterKey);
      console.log('popup masterCache', masterCache, 'masterDataId' + masterDataId, this.headerConfig.url + masterDataId + this.headerConfig.haslogin + 'Mobile');
      if (masterCache && !force) {
        // console.log('masterCache', masterCache, force);
        this.options = [...masterCache] as any;
        this.cacheOptions = [...this.options];
        this.closeLoading(loadingEl);
      } else {
        axios.get(this.headerConfig.url + masterDataId + this.headerConfig.haslogin + 'Mobile', { headers: headers }).subscribe(
          async (data) => {
            if (data.status === 200 || data.status === 201) {
              this.options = [...data.data.data] as any;
              this.cacheOptions = [...this.options];
              // console.log('loadMasterOptions popup', this.options);
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
  async buttonClick(item: any) {
    const keySelected = this.properties.listId + ':' + this.properties.idField + ':' + item[this.properties.idField] + ':selected';
    await this.masterStorage.setMasterData(keySelected, [{ ...item }]);
    this.backVal = item[this.properties.idField];
    this.modalCtrl.dismiss({ selected: item }, 'confirm');
  }

  getKeyToMap(key: string ): string{
    return keyToMap[key]  || '';
  }
}
