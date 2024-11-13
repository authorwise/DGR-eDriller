import { IUserInfo, IUserInfoForm } from './../../models/formcontrol';
import { getApiConfigByKey, getApiGEDrillerConfigByKey } from 'src/app/models/form.dic';
import { LoadingController } from '@ionic/angular';
import { Component, OnInit, AfterViewInit } from "@angular/core";

import formData from "../../../json/editInfoGWDriller.json";
import { IFormElement, IFormPreFetch, IFormHookItems } from "../../models/formcontrol";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MastercacheService } from '../../share/mastercache.service';
import axios from 'axios-observable';
import { AxiosRequestConfig } from 'axios';
import Swal from 'sweetalert2';
import { ErrorFormHandle } from 'src/app/share/error-handle';
import { Router } from '@angular/router';
import { toFormData } from 'src/app/tools/form';
import FormData from 'form-data';

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.page.html",
  styleUrls: ["./edit-profile.page.scss"],
})
export class EditProfilePage implements OnInit, AfterViewInit {
  formObjElm: IFormElement;
  validateForm: FormGroup;
  stepValidateForm: FormGroup[] = [];
  preFetch: IFormPreFetch[];
  private recordID: string;
  currentStep = 1;
  formHook = {};
  refElm = {};

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private masterCacheService: MastercacheService,
    private loadingCtrl: LoadingController,
    private router: Router
  ) { }

  preHooks() {
    this.formHook = {
      'gwDrillerUsername': <IFormHookItems> {
        before: (_this: any) => {
          _this.isReadOnly = true;
        }
      },
      'gwDrillerUserID': <IFormHookItems> {
        before: (_this: any) => {
          _this.isReadOnly = true;
        }
      },
      'postalCode': <IFormHookItems>{
        before: (_this: any) => {
          _this.propertiesOptions.optionsBinder.properties.formDefId = 'mtPostalCode';
        }
      },
      'tambonID': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
          _this.propertiesOptions.optionsBinder.properties.formDefId = 'mtTambonOnly';
          this.setGrouping(_this, 'postalCode');
        },
        subscribe: [
          {
            formId: 'postalCode',
            cb: this.subStepForm
          }
        ]
      },
      'amphoeID': <IFormHookItems>{
        before: (_this: any) => {
          _this.propertiesOptions.optionsBinder.properties.formDefId = 'mtDistrict';
          _this.isReadOnly = true;
          this.setGrouping(_this, 'tambonID');
        },
        subscribe: [
          {
            formId: 'tambonID',
            cb: async (val: string, _this: any) => {
              this.subAP(val, _this, 'mtTambonOnly:tambonID:', 'amphoeID', 'amphoeThai');
            }
          }
        ]
      },
      'provinceID': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
          _this.propertiesOptions.optionsBinder.properties.groupingColumn = 'tambonID';
        },
        subscribe: [
          {
            formId: 'tambonID',
            cb: async (val: string, _this: any) => {
              this.subAP(val, _this, 'mtTambonOnly:tambonID:', 'provinceID', 'provinceThai', (provinceVal: any) => {  
                console.log('provinceID', provinceVal);
              });
            }
          }
        ]
      },
      'tambon': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
        subscribe: [
          {
            formId: 'tambonID',
            cb: async (val: string, _this: any) => {
              this.subAP(val, _this, 'mtTambonOnly:tambonID:', 'tambonShortName', 'tambonShortName');
            }
          }
        ]
      },
      'amphoe': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
          this.setGrouping(_this, 'tambonID')
        },
        subscribe: [
          {
            formId: 'tambonID',
            cb: async (val: string, _this: any) => {
              this.subAP(val, _this, 'mtTambonOnly:tambonID:', 'amphoeThai', 'amphoeThai');
            }
          }
        ]
      },
      'province': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
          this.setGrouping(_this, 'tambonID');
        },
        subscribe: [
          {
            formId: 'tambonID',
            cb: async (val: string, _this: any) => {
              this.subAP(val, _this, 'mtTambonOnly:tambonID:', 'provinceThai', 'provinceThai');
            }
          }
        ]
      },
    }
  }

  subAP = async (val: string, _this: any, keyval: string, idKey: string, valKey: string, hook?: any) => {
    if (_this.groupVal === val) {
      return;
    }
    if (val) {

      const keySelected = keyval + val + ':selected'
      const masterTambon = await this.masterCacheService.getMasterData(keySelected);
      if (!_this.properties.id) {
        return;
      }

      console.log('this.properties : ', _this.properties.id, ': ', masterTambon);
      if (!masterTambon) {
        // _this.getLabelFromValBack();
        return;
      }
      let item = masterTambon;
      if (!masterTambon[idKey]) {
        item = masterTambon[0];
      }

      _this.groupVal = val;
      this.validateForm.get(_this.properties.id)?.setValue(item[idKey]);
      if (hook) {
        hook(item[idKey])
      }

      _this.inputValBack = item[idKey];
      _this.label = item[valKey];
    } else {
      this.clearValInform(_this);
    }
  }

  subStepForm = (val: string, _this: any) => {

    if (_this.groupVal !== val) {
      if (!val || val === '') {
        _this.isReadOnly = true;
      } else {
        _this.isReadOnly = false;
      }
      this.clearValInform(_this);
      _this.propertiesOptions.visibilityValue = val;
      _this.groupVal = val;
    }

  }

  clearValInform(_this: any) {
    this.validateForm.get(_this.properties.id)?.setValue('');
    _this.inputValBack = '';
    if (_this.properties.optionsBinder) {
      _this.label = _this.properties.optionsBinder.properties.emptyLabel;
    }
  }

  setGrouping(_this: any, keyBind: string) {
    if (_this.propertiesOptions.optionsBinder) {
      _this.propertiesOptions.optionsBinder.properties.groupingColumn = keyBind;
    } else {
      _this.propertiesOptions = {
        optionsBinder: {
          properties: {
            groupingColumn: keyBind
          }
        }
      }
    }
  }

  submitForm() {
    console.log('Before form validate : ', this.validateForm.value);
    for (const i of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (!this.validateForm.valid) {
      let firstError = '';
      for (const i of Object.keys(this.validateForm.controls)) {
        if (this.validateForm.controls[i].invalid) {
          firstError = i;
          break;
        }
      }
      const fElm = document.querySelector('#' + firstError);
      if (fElm && fElm.parentElement) {
        fElm.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    this.checkAge();
  }

  ngOnInit() {
    /* init form */
    this.formObjElm = { ...JSON.parse(formData.json) };
    // console.log(this.formObjElm);
    this.validateForm = this.fb.group({});
    this.stepValidateForm.push(this.fb.group({}));
    this.preFetch = [];
    this.preHooks();
    /* end init form */
  }

  ngAfterViewInit() {
    // this.fetchGWDrillerUser();
    this.fetchRegisterGWDriller();
  }

  closeLoading(el: any = null) {
    if (el) {
      el.dismiss();
    } else {
      this.loadingCtrl.dismiss();
    }
    this.isLoading = false;
  }

  updateUserInfo() {
    const userInfo = this.createFormData(this.recordID);
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'กำลังแก้ไขข้อมูล กรุณารอสักครู่...' })
      .then(async loadingEl => {
        loadingEl.present();
        const config = getApiGEDrillerConfigByKey("updateGWDriller") as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys("sult");
        config.headers["Authorization"] = "Basic " + userSult;
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios.post(config.url, userInfo, axiosConfig)
        .subscribe(resData => {
          this.closeLoading(loadingEl);
          if (resData.status === 200 || resData.status === 201) {
            Swal.fire({ title: 'แก้ไขข้อมูลสำเร็จ', icon: 'success', timer: 2000 ,heightAuto:false}).then(() => {
              this.router.navigate(['/tabs/dgr/abouts'], { replaceUrl: true });
            })
          } else {
            ErrorFormHandle.showRetry(
              'เกิดข้อผิดพลาด',
              'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
              () => {
                this.closeLoading(loadingEl);
                this.updateUserInfo();
              },
              () => {
                this.closeLoading(loadingEl);
              }
            )
          }
        }, err => {
          ErrorFormHandle.showRetry(
            'เกิดข้อผิดพลาด',
            'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
            () => {
              this.closeLoading(loadingEl);
              this.updateUserInfo();
            },
            () => {
              this.closeLoading(loadingEl);
            }
          )
        })

      }).catch(err => {
        this.loadingCtrl.dismiss();
        this.isLoading = false;
      })
  }

  createFormData(recordId: string): FormData {
    const {
      firstname,
      lastname,
    } = <IUserInfoForm>this.validateForm.value;
    this.validateForm.get('fullname')?.setValue(firstname + ' ' + lastname);

    const formData = toFormData(this.validateForm.value);
    formData.append('id', recordId);
    console.log('form : ', this.validateForm);
    console.log('form data : ', formData);

    return formData;
  }

  fetchGWDrillerUser() {
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'กำลังดึงข้อมูลผู้ใช้...'
      })
      .then(
        async (loadingEl: any) => {
          loadingEl.present();
          const config = getApiConfigByKey('mtGWDrillerMobileDriller') as any;
          const userSult = await this.masterCacheService.getUserInfoByKeys('sult');
          config.headers['Authorization'] = 'Basic ' + userSult;
          const axiosConfig: AxiosRequestConfig = {
            headers: config.headers
          }
          axios.get(config.url, axiosConfig)
            .subscribe(
              (resData) => {
                this.closeLoading(loadingEl);
                if (
                  (resData.status === 200 || resData.status === 201)
                  &&
                  resData.data
                  &&
                  resData.data.data
                  &&
                  resData.data.data[0]
                ) {
                  // complete load data
                  console.log('fetchGWDrillerUser', resData.data.data[0]);

                } else {
                  Swal.fire({ title: 'ข้อผิดพลาด...',html:'ไม่สามารถดึงข้อมูลผู้ใช้ได้', icon: 'error', heightAuto:false })
                }
              },
              (error) => {
                this.closeLoading(loadingEl);
                Swal.fire({ title: 'ข้อผิดพลาด...',html:'ไม่สามารถดึงข้อมูลผู้ใช้ได้', icon: 'error', heightAuto:false })
              }
            )

        }
      )
  }

  fetchRegisterGWDriller() {
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'กำลังดึงข้อมูลผู้ใช้...'
      })
      .then(
        async (loadingEl: any) => {
          loadingEl.present();
          const config = getApiGEDrillerConfigByKey('list_registerGWDriller') as any;
          const userSult = await this.masterCacheService.getUserInfoByKeys('sult');
          config.headers['Authorization'] = 'Basic ' + userSult;
          const axiosConfig: AxiosRequestConfig = {
            headers: config.headers
          }
          axios.get(config.url, axiosConfig)
            .subscribe(
              (resData) => {
                this.closeLoading(loadingEl);
                if (
                  (resData.status === 200 || resData.status === 201)
                  &&
                  resData.data
                  &&
                  resData.data.data
                  &&
                  resData.data.data[0]
                ) {
                  // complete load data
                  console.log('registerGWDriller',resData.data.data[0]);
                  const userInfo: IUserInfoForm = resData.data.data[0];

                  if (userInfo.provinceID) {
                    delete userInfo.provinceID;
                  }
                  if (userInfo.amphoeID) {
                    delete userInfo.amphoeID;
                  }
                  let postalCode = '';
                  let provinceID = '';
                  let tambonID = '';
                  let amphoeID = '';
                  this.recordID = userInfo['id' as keyof IUserInfoForm] as any;
                  for (const key of Object.keys(userInfo)) {

                    if (this.validateForm.get(key)) {
                      console.log('current : ', this.validateForm.get(key)?.value);
                      console.log('key : ', key, ': ', userInfo[key as keyof IUserInfoForm]);
                      switch(key){
                        case 'postalCode':
                          postalCode = userInfo[key];
                        break;
                        case 'tambonID':
                          tambonID = userInfo[key];
                        break;
                        default:
                          this.validateForm.get(key)?.setValue(userInfo[key as keyof IUserInfoForm]);
                        break;
                      }
                      console.log('after : ', this.validateForm.get(key)?.value);
                    }
                    this.validateForm.get('postalCode')?.setValue(postalCode);
                    this.validateForm.get('tambonID')?.setValue(tambonID);
                  }

                } else {
                  Swal.fire({ title: 'ข้อผิดพลาด...',html:'ไม่สามารถดึงข้อมูลผู้ใช้ได้', icon: 'error', heightAuto:false })
                }
              },
              (error) => {
                this.closeLoading(loadingEl);
                Swal.fire({ title: 'ข้อผิดพลาด...',html:'ไม่สามารถดึงข้อมูลผู้ใช้ได้', icon: 'error', heightAuto:false })
              }
            )

        }
      )
  }

  checkAge() {
    const {
      birthDate,
    } = <IUserInfoForm>this.validateForm.value;
    let getBirthDate = new Date(birthDate);
    let curDate = new Date();
    let yearBirthDate = getBirthDate.getFullYear();
    let yearCompare = curDate.getFullYear() - 20;
    if (yearBirthDate > yearCompare) {
      
      Swal.fire({ title: 'ผู้สมัครต้องมีอายุ 20 ปีบริบูรณ์ขึ้นไป', icon: 'error', timer: 2000,heightAuto:false }).then(() => {
        // setTimeout(e=>{
          this.validateForm.get('birthDate')?.setErrors({ 'incorrect': true })
          const fElm = document.querySelector('#birthDate');
          if (fElm && fElm.parentElement) {
            fElm.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        // }, 100)
        return;
      })
      return;
    }
    this.updateUserInfo(); 
  }
}
