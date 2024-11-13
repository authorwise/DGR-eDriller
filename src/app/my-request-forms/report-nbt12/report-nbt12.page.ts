import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";

import formData from "../../../json/reportNBT12ForMobile.json";
import { IFormElement, IFormPreFetch, IUserRegister, IFormHookItems, IPagingParam, IAjaxStartFlowResponse } from 'src/app/models/formcontrol';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonContent, LoadingController } from '@ionic/angular';
import { toFormData } from 'src/app/tools/form';
import { MastercacheService } from 'src/app/share/mastercache.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FlowServiceService } from 'src/app/share/flow-service.service';
import FormData from "form-data";
import { getApiListConfigByKey, getApiGEDrillerConfigByKey } from 'src/app/models/form.dic';
import { AxiosRequestConfig } from 'axios';
import axios from "axios-observable";
import Swal from "sweetalert2";
import { ErrorFormHandle } from "src/app/share/error-handle";

@Component({
  selector: "app-report-nbt12",
  templateUrl: "./report-nbt12.page.html",
  styleUrls: ["./report-nbt12.page.scss"],
})
export class ReportNBT12Page implements OnInit, AfterViewInit {
  formObjElm: IFormElement;
  validateForm: FormGroup;
  stepValidateForm: FormGroup[];
  preFetch: IFormPreFetch[];
  private recordID: string;
  private processDefID: string;
  private processID: string;
  private activityID: string;
  private activityDefID: string;
  private activityName: string;
  private userInfo: IUserRegister;
  private formId: string;
  private licenseID: string;
  returnUrl: string;
  isLoading = false;
  currentStep = 1;
  formHook = {};
  refElm:any = {};
  hashVal:any = {};
  sendParam: IPagingParam = {
    startOffset: 0,
    pageSize: 10
  }
  totalList = 0;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private masterCacheService: MastercacheService,
    private activatedRoute: ActivatedRoute,
    private flowService: FlowServiceService,
    private router: Router
  ) {}

  preHooks() {
    this.formHook = {
      'licenseType': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        }, 
      },
      'usageLicenseNo': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        }, 
      },
      'wellNo': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        }, 
      },
      'wellSize': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        }, 
      },
      'wellDepth': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        }, 
      },
      'licenseName': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        }, 
      },
      'gwDrillerName': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        }, 
      },
      'gwDrillerID': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        }, 
      },
      'postalCode': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
          _this.propertiesOptions.optionsBinder.properties.formDefId = 'mtPostalCode';
        }
      },
      'tambonID': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
          this.setGrouping(_this, 'postalCode');
        },
      },
      'localID': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
          this.refElm['localID'] = _this;
          this.setGrouping(_this, 'tambonID');
        },
      },
      'amphoeID': <IFormHookItems>{
        before: (_this: any) => {
          _this.propertiesOptions.optionsBinder.properties.formDefId = 'mtDistrict';
          _this.isReadOnly = true;
          this.setGrouping(_this, 'tambonID');
        },
      },
      'provinceID': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
          _this.propertiesOptions.optionsBinder.properties.groupingColumn = 'tambonID';
        },
      },
      'addressNo': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      'moo': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      'soi': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      'street': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      'wellPostalCode': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
          _this.propertiesOptions.optionsBinder.properties.formDefId = 'mtPostalCode';
        }
      },
      'wellTambonID': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
          this.setGrouping(_this, 'wellPostalCode');
        },
      },
      'wellLocalID': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
          this.refElm['wellLocalID'] = _this;
          this.setGrouping(_this, 'wellTambonID');
        },
      },
      'wellAmphoeID': <IFormHookItems>{
        before: (_this: any) => {
          _this.propertiesOptions.optionsBinder.properties.formDefId = 'mtDistrict';
          _this.isReadOnly = true;
          this.setGrouping(_this, 'wellTambonID');
        },
      },
      'wellProvinceID': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
          _this.propertiesOptions.optionsBinder.properties.groupingColumn = 'tambonID';
        },
      },
      'wellAddressNo': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      'wellMoo': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      'wellSoi': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      'wellStreet': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      'reasonType1': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      'reasonType2': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      'reasonType3': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      'reasonType4': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      'reasonType5': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      'reasonType6': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      'reasonType7': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      'reasonTypeOther': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
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

  getActivity(el: any) {
    this.sendParam.id = this.recordID;
    this.sendParam.performer = this.processDefID + '_borer';
    this.flowService.getAssignmentByUsername('GWDriller', this.sendParam, (res: any) => {
      this.closeLoading(el);
      if (!res.error) {
        this.totalList = res.total;
        console.log('getActivity', res);
        this.activityID = res.data[0].activityId;
        this.activityDefID = res.data[0].activityDefId;
        this.activityName = res.data[0].activityName;
      }
    })
  }

  ngOnInit() {
    this.formObjElm = { ...JSON.parse(formData.json) };
    // console.log(this.formObjElm.elements);
    // this.formObjElm.elements.forEach((element) => {
    //   // console.log(element.properties.);
    // });
    this.stepValidateForm = [];
    for (let i = 0; i < 2; i++) {
      this.stepValidateForm.push(this.fb.group({}));
    }
    this.validateForm = this.fb.group({});
    this.preHooks();
    this.preFetch = [];

    this.activatedRoute.queryParams.subscribe((params:any) => {
      // console.log('params', params);
      if (params.returnUrl) {
        this.returnUrl = params.returnUrl;
      } else {
        this.returnUrl = '/tabs/dgr/my-request-forms';
      }
      this.licenseID = params.licenseID;
      console.log('licenseID', this.licenseID);
    });
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('recordID') || !paramMap.has('processDefID') || !paramMap.has('processID')) {
        this.router.navigate([this.returnUrl], { replaceUrl: true });
        return;
      }
      this.recordID = paramMap.get('recordID') as any;
      this.processDefID = paramMap.get('processDefID') as any;
      this.processID = paramMap.get('processID') as any;

    });
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit : ", this.validateForm);
    console.log("ngAfterViewInit preFetch : ", this.preFetch);
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'กำลังดึงข้อมูล ผู้ใช้...' }).then(loadingEl => {
        loadingEl.present();

        const res = {
          processId: this.processID,
          recordId: this.recordID
        }

        // Pre Load User
        this.masterCacheService.preLoadCurrentUser(this.preFetch, (res:any) => {
          this.closeLoading(loadingEl);
          if (res.error) return;
          this.hashVal['currentUser'] = res.data;
          this.userInfo = <IUserRegister>res.data;
          this.isLoading = false;
          this.mapHashUserDataToForm();
        });
        
        this.fetchFormData();
        this.flowService.getFormByRecordID('cancel', res, (resData: any) => {
          if (!resData.error) {
            console.log('getFormByRecordID', resData);
            this.setFormByRecordID(resData);
          }
          this.closeLoading(loadingEl);
        }, () => {
          ErrorFormHandle.showRetry(
            'เกิดข้อผิดพลาด',
            'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
            () => {
              this.closeLoading(loadingEl);
              this.ngAfterViewInit();
            },
            () => {
              this.closeLoading(loadingEl);
            }
          )
        });

        this.getActivity(loadingEl);
        
      }).catch(err => {
        console.log(err);
        this.isLoading = false;
      });
  }

  submitForm() {
    console.log("Before form :", this.validateForm);
    if (!this.validateForm.valid) {
      return;
    }
    for (const i of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if(this.validateForm.valid){
      this.storeFormRequest();
    }
  }

  setFormByRecordID(resData: any) {
    for (const key of Object.keys(resData)) {
      if (this.validateForm.get(key)) {
        const value = resData[key];
        console.log("current : ", this.validateForm.get(key)?.value);
        console.log("key : ", key, ": ", resData[key]);        
        const exceptKey = ['activityID', 'activityDefID', 'activityName', 'modifiedByName', 'modifiedBy', 'dateCreated', 'dateModified', 'createdBy', 'createdByName', 'postalCode', 'tambonID', 'localID', 'amphoeID', 'provinceID', , 'wellPostalCode', 'wellTambonID', 'wellLocalID', 'wellAmphoeID', 'wellProvinceID'];
        if(!exceptKey.includes(key)){
          console.log('setFormByRecordID not in key', key, value);
          this.validateForm.get(key)?.setValue(value);
        }
      }
    }
    console.log("after setFormByRecordID : ", this.validateForm.value);
  }

  setFormVal(resData: any) {
    let postalCode = '';
    let tambonID = '';
    let amphoeID  = '';
    let localID  = '';
    let provinceID  = '';
    let wellPostalCode = '';
    let wellTambonID = '';
    let wellAmphoeID  = '';
    let wellLocalID  = '';
    let wellProvinceID  = '';
    for (const key of Object.keys(resData)) {
      if (this.validateForm.get(key)) {
        const value = resData[key];
        console.log("current : ", this.validateForm.get(key)?.value);
        console.log("key : ", key, ": ", resData[key]);        
        switch(key){
          case 'requesterStatus':
            this.validateForm.get(key)?.setValue(resData[key]);
            this.validateForm.get('requesterStatusTmp')?.setValue(resData[key]);
          break;
          default:
            const exceptKey = ['activityID', 'activityDefID', 'activityName', 'modifiedByName', 'modifiedBy', 'dateCreated', 'dateModified', 'createdBy', 'createdByName', 'postalCode', 'tambonID', 'localID', 'amphoeID', 'provinceID', , 'wellPostalCode', 'wellTambonID', 'wellLocalID', 'wellAmphoeID', 'wellProvinceID'];
            if(!exceptKey.includes(key)){
              this.validateForm.get(key)?.setValue(value);
            }else{
              switch(key){
                case 'postalCode':
                  postalCode = value;
                break;
                case 'tambonID':
                  tambonID = value;
                break;
                case 'localID':
                  localID = value;
                break;
                case 'amphoeID':
                  amphoeID = value;
                break;
                case 'provinceID':
                  provinceID = value;
                break;
                case 'wellPostalCode':
                  wellPostalCode = value;
                break;
                case 'wellTambonID':
                  wellTambonID = value;
                break;
                case 'wellLocalID':
                  wellLocalID = value;
                break;
                case 'wellAmphoeID':
                  wellAmphoeID = value;
                break;
                case 'wellProvinceID':
                  wellProvinceID = value;
                break;
              }
            }
          break;
        }
       
      }
    }
    this.validateForm.get('postalCode')?.setValue(postalCode);
    this.validateForm.get('tambonID')?.setValue(tambonID);
    this.validateForm.get('amphoeID')?.setValue(amphoeID);
    this.validateForm.get('provinceID')?.setValue(provinceID);
    this.validateForm.get('localID')?.setValue(localID);
    this.validateForm.get('wellPostalCode')?.setValue(wellPostalCode);
    this.validateForm.get('wellTambonID')?.setValue(wellTambonID);
    this.validateForm.get('wellAmphoeID')?.setValue(wellAmphoeID);
    this.validateForm.get('wellProvinceID')?.setValue(wellProvinceID);
    this.validateForm.get('wellLocalID')?.setValue(wellLocalID);
    console.log("after : ", this.validateForm.value);
  }

  createFormData(processId: string, recordId: string): FormData {
    for (const form of this.preFetch) {
      if (form.hasValue.indexOf("#assignment.processId#") === 0) {
        this.validateForm.get(form.formId)?.setValue(processId);
      }
      if (form.hasValue.indexOf("#process.recordId#") === 0) {
        this.validateForm.get(form.formId)?.setValue(recordId);
      }
    }
    const formData = toFormData(this.validateForm.value);
    formData.append("id", recordId);
    console.log("form : ", this.validateForm);
    console.log("form data : ", formData);
    return formData;
  }

  mapHashUserDataToForm() {
    for (const form of this.preFetch) {
      if (form.hasValue.indexOf('#currentUser') === 0) {
        const nameKey = form.hasValue.replace(/#/gi, '').replace('currentUser.', '');
        const val = nameKey !== 'fullName' ? this.hashVal['currentUser'][nameKey] : this.hashVal['currentUser']['firstName'] + ' ' + this.hashVal['currentUser']['lastName'];
        this.validateForm.get(form.formId)?.setValue(val)
      }
    }
  }

  fetchFormData() {
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: "กำลังดึงข้อมูลใบอนุญาต...",
      })
      .then(async (loadingEl: any) => {
        loadingEl.present();
        const config = getApiGEDrillerConfigByKey(
          "list_usageLicenseDriller"
        ) as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys(
          "sult"
        );
        config.headers["Authorization"] = "Basic " + userSult;
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios.get(config.url + "?id=" + this.licenseID, axiosConfig).subscribe(
          (resData) => {
            this.closeLoading(loadingEl);
            console.log("resData : ", resData);
            if(resData.data.size === 1){
              this.setFormVal(resData.data.data[0]);
            }else{
              Swal.fire({ title: 'ข้อผิดพลาด...', html: "ไม่สามารถดึงข้อมูลใบอนุญาตได้", icon: 'error', timer: 2000,heightAuto:false })
              .then(() => {
                this.router.navigate(['/tabs/dgr/my-request-forms'], { replaceUrl: true });
              })
            }
          },
          (error) => {
            this.closeLoading(loadingEl);
            Swal.fire({ title: 'ข้อผิดพลาด...', html: "ไม่สามารถดึงข้อมูลใบอนุญาตได้", icon: 'error',heightAuto:false })
          }
        );
      });
  }

  /**
   *
   * @param res : response after start flow
   * @param data : data in form
   * Description : Step 2 send form data for store
   */
  storeFormRequest() {
    const res = {
      processId: this.processID,
      recordId: this.recordID
    }
    const data = this.createFormData(res.processId, res.recordId);
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'บันทึกข้อมูลคำร้องขอ...' }).then(loadingEl => {
        loadingEl.present();
        // Save Request
        this.flowService.storeFormRequest('nbt12', res, data, (resData: any) => {
          this.closeLoading(loadingEl);
          if (!resData.error) {
            // send to step 3
            this.setActivityVariables(res.processId, this.activityID);
          }
        }, () => {
          ErrorFormHandle.showRetry(
            'เกิดข้อผิดพลาด',
            'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
            () => {
              this.closeLoading(loadingEl);
              this.storeFormRequest();
            },
            () => {
              this.closeLoading(loadingEl);
            }
          )
        });

      }).catch(err => {
        console.log(err);
        this.isLoading = false;
      });
  }

  setActivityVariables(processId: string, activityId: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'ตั้งค่าข้อมูลคำขอ...' })
      .then(loadingEl => {
        loadingEl.present();

        const paramObj:any = {
          status: "create NBT12",
        }

        let myParam = Object.keys(paramObj).reduce(function (a:any, k) { a.push(k + '=' + encodeURIComponent(paramObj[k])); return a }, []).join('&');

        this.flowService.setActivityVariables(
          'cancel',
          processId,
          activityId,
          myParam,
          (resData: any) => {

            this.closeLoading(loadingEl);
            console.log('setActivityVariables', resData);
            if (!resData.error) {
              this.completeAssignment(processId, activityId);
            }else{
              ErrorFormHandle.showRetry(
                'เกิดข้อผิดพลาด',
                'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
                () => {
                  this.closeLoading(loadingEl);
                  this.setActivityVariables(processId, activityId);
                },
                () => {
                  this.closeLoading(loadingEl);
                }
              )
            }

          },
          () => {
            ErrorFormHandle.showRetry(
              'เกิดข้อผิดพลาด',
              'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
              () => {
                this.closeLoading(loadingEl);
                this.setActivityVariables(processId, activityId);
              },
              () => {
                this.closeLoading(loadingEl);
              }
            )
          }
        )
      })
  }
  
  /**
   * Step 4.1
   * @param processId 
   * @param activityId 
   */
  completeAssignment(processId: string, activityId: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'บันทึกข้อมูลคำขอ...' }).then(loadingEl => {
        loadingEl.present();

        // Save Request
        this.flowService.completeAssignment('cancel', activityId, (resData: any) => {
          this.closeLoading(loadingEl);
          if (!resData.error) {
            // show step 4 complete send
            console.log('Complete : ', resData);
            Swal.fire({ title: 'บันทึกข้อมูลคำขอสำเร็จ', icon: 'success', timer: 2000,heightAuto:false }).then(() => {
              // this.router.navigateByUrl('/tabs/dgr/homes', { state: { redirectTo: '/tabs/dgr/my-request-forms' } });
              this.router.navigate(['/tabs/dgr/my-request-forms'], { replaceUrl: true });
            })
          }else{
            ErrorFormHandle.showRetry(
              'เกิดข้อผิดพลาด',
              'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
              () => {
                this.closeLoading(loadingEl);
                this.completeAssignment(processId, activityId);
              },
              () => {
                this.closeLoading(loadingEl);
              }
            )
          }
        }, () => {
          ErrorFormHandle.showRetry(
            'เกิดข้อผิดพลาด',
            'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
            () => {
              this.closeLoading(loadingEl);
              this.completeAssignment(processId, activityId);
            },
            () => {
              this.closeLoading(loadingEl);
            }
          )
        });

      }).catch(err => {
        console.log(err);
        this.isLoading = false;
      });
  }

  //Step
  prevStep() {
    this.currentStep -= 1;
    this.scrollToTop();
  }
  nextStep() {
    console.log('nextStep', this.validateForm)
    for (const i of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
      if (this.stepValidateForm[this.currentStep - 1].get(i)) {
        this.stepValidateForm[this.currentStep - 1].get(i)?.setValue(this.validateForm.get(i)?.value);
      }
    }
    for (const i of Object.keys(this.stepValidateForm[this.currentStep - 1].controls)) {
      this.stepValidateForm[this.currentStep - 1].controls[i].markAsDirty();
      this.stepValidateForm[this.currentStep - 1].controls[i].updateValueAndValidity();
    }
    if (!this.stepValidateForm[this.currentStep - 1].invalid) {
      this.currentStep += 1;
      this.scrollToTop();
    } else {
      let firstError = '';
      for (const i of Object.keys(this.stepValidateForm[this.currentStep - 1].controls)) {
        if (this.stepValidateForm[this.currentStep - 1].controls[i].invalid) {
          console.log(this.stepValidateForm[this.currentStep - 1].controls[i]);
          firstError = i;
          break;
        }
      }
      const fElm = document.querySelector('#' + firstError);
      if (fElm && fElm.parentElement) {
        fElm.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
  scrollToTop() {
    this.content.scrollToTop(1000);
  }

  closeLoading(el: any = null) {
    if (el) {
      el.dismiss();
    } else {
      this.loadingCtrl.dismiss();
    }
    this.isLoading = false;
  }
  
  
}
