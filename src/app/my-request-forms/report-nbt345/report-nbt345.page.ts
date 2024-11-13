import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import formData from '../../../json/reportNBT345StatusForMobile.json';
import formDataNBT345 from '../../../json/reportNBT345ForMobile.json';
import formDataNBT3 from '../../../json/reportNBT3PartForMobile.json';
import formDataNBT4 from '../../../json/reportNBT4PartForMobile.json';
import formDataNBT5 from '../../../json/reportNBT5PartForMobile.json';
import {
  IFormElement,
  IFormPreFetch,
  IFormHookItems,
  IPagingParam,
  IGWDriller,
  IFlowProcessByUser,
} from 'src/app/models/formcontrol';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  IonContent,
  LoadingController,
  ModalController,
  AlertController,
} from '@ionic/angular';
import { toFormData } from 'src/app/tools/form';
import Swal from 'sweetalert2';
import FormData from 'form-data';
import { MastercacheService } from 'src/app/share/mastercache.service';
import { FlowServiceService } from 'src/app/share/flow-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { getApiGEDrillerConfigByKey } from 'src/app/models/form.dic';
import { AxiosRequestConfig } from 'axios';
import axios from 'axios-observable';

import { ReportNbt3SubComponent } from './report-nbt3-sub/report-nbt3-sub.component';
import { ReportNbt4PipeComponent } from './report-nbt4-pipe/report-nbt4-pipe.component';
import { ReportNbt4FilterComponent } from './report-nbt4-filter/report-nbt4-filter.component';
import { ReportNbt4PumpComponent } from './report-nbt4-pump/report-nbt4-pump.component';
import { ReportNbt4RecoveryComponent } from './report-nbt4-recovery/report-nbt4-recovery.component';
import { ReportNbt5HoleComponent } from './report-nbt5-hole/report-nbt5-hole.component';
import { ReportNbt5PipeComponent } from './report-nbt5-pipe/report-nbt5-pipe.component';
import { ReportNbt5GougeComponent } from './report-nbt5-gouge/report-nbt5-gouge.component';
import { ReportNbt5FilterComponent } from './report-nbt5-filter/report-nbt5-filter.component';
import { ReportNbt5SidesealComponent } from './report-nbt5-sideseal/report-nbt5-sideseal.component';
import { ReportNbt5LayerComponent } from './report-nbt5-layer/report-nbt5-layer.component';
import { ErrorFormHandle } from 'src/app/share/error-handle';

@Component({
  selector: 'app-report-nbt345',
  templateUrl: './report-nbt345.page.html',
  styleUrls: ['./report-nbt345.page.scss'],
})
export class ReportNBT345Page implements OnInit, AfterViewInit {
  formObjElm: IFormElement;
  formObjElmNBT345: IFormElement;
  formObjElmNBT3: IFormElement;
  formObjElmNBT4: IFormElement;
  formObjElmNBT5: IFormElement;
  validateForm: FormGroup;
  stepValidateForm: FormGroup[];
  preFetch: IFormPreFetch[];
  private recordID: string;
  private processDefID: string;
  private processID: string;
  private activityID: string;
  private activityDefID: string;
  private activityName: string;
  private requestNo: string;
  public returnUrl: string;
  private gwDriller: IGWDriller;
  private nb1Status: string;
  private nb1Remarks: string;
  sendButton: string = 'ส่งข้อมูลคำขอ';
  riskChoice: boolean;
  riskStatus: string;
  listOfNBT3sub: any;
  listOfNBT4Pipe: any;
  listOfNBT4Filter: any;
  listOfNBT4Pump: any;
  listOfNBT4Recovery: any;
  listOfNBT4_1: any;
  listOfNBT5Filter: any;
  listOfNBT5Gouge: any;
  listOfNBT5Hole: any;
  listOfNBT5Layer: any;
  listOfNBT5Pipe: any;
  listOfNBT5SideSeal: any;
  listOfNBT5_1: any;
  nbt4PumpTime: string;
  nbt4RecoveryTime: string;
  totalList = 0;
  currentStep = 1;
  formHook = {};
  refElm = {};
  isLoading = false;
  sendParam: IPagingParam = {
    startOffset: 0,
    pageSize: 10,
  };
  /**
   * Hash Value
   *
   */
  hashVal = {};

  /**
   * cache when error
   */
  cacheRetry = {};
  editCache: { [key: string]: { edit: boolean; data: any } } = {};
  @ViewChild(IonContent, { static: false }) content: IonContent;
  constructor(
    private fb: FormBuilder,
    private masterCacheService: MastercacheService,
    private loadingCtrl: LoadingController,
    private flowService: FlowServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    public alertCtrl: AlertController
  ) {}

  preHooks() {
    this.formHook = {
      comDrillerPostalCode: <IFormHookItems>{
        before: (_this: any) => {
          _this.propertiesOptions.optionsBinder.properties.formDefId =
            'mtPostalCode';
        },
      },
      comDrillerTambonID: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
          _this.propertiesOptions.optionsBinder.properties.formDefId =
            'mtTambonOnly';
          this.setGrouping(_this, 'postalCode');
        },
        subscribe: [
          {
            formId: 'comDrillerPostalCode',
            cb: this.subStepForm,
          },
        ],
      },
      comDrillerAmphoeID: <IFormHookItems>{
        before: (_this: any) => {
          _this.propertiesOptions.optionsBinder.properties.formDefId =
            'mtDistrict';
          _this.isReadOnly = true;
          this.setGrouping(_this, 'tambonID');
        },
        subscribe: [
          {
            formId: 'comDrillerTambonID',
            cb: async (val: string, _this: any) => {
              this.subAP(
                val,
                _this,
                'mtTambonOnly:tambonID:',
                'amphoeID',
                'amphoeThai'
              );
            },
          },
        ],
      },
      comDrillerTambon: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
        subscribe: [
          {
            formId: 'comDrillerTambonID',
            cb: async (val: string, _this: any) => {
              this.subAP(
                val,
                _this,
                'mtTambonOnly:tambonID:',
                'tambonShortName',
                'tambonShortName'
              );
            },
          },
        ],
      },
      comDrillerAmphoe: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
          this.setGrouping(_this, 'tambonID');
        },
        subscribe: [
          {
            formId: 'tambonID',
            cb: async (val: string, _this: any) => {
              this.subAP(
                val,
                _this,
                'mtTambonOnly:tambonID:',
                'amphoeThai',
                'amphoeThai'
              );
            },
          },
        ],
      },
      comDrillerProvince: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
          this.setGrouping(_this, 'tambonID');
        },
        subscribe: [
          {
            formId: 'tambonID',
            cb: async (val: string, _this: any) => {
              this.subAP(
                val,
                _this,
                'mtTambonOnly:tambonID:',
                'provinceThai',
                'provinceThai'
              );
            },
          },
        ],
      },
      comDrillerProvinceID: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
          _this.propertiesOptions.optionsBinder.properties.groupingColumn =
            'tambonID';
        },
        subscribe: [
          {
            formId: 'comDrillerTambonID',
            cb: async (val: string, _this: any) => {
              this.subAP(
                val,
                _this,
                'mtTambonOnly:tambonID:',
                'provinceID',
                'provinceThai',
                (provinceVal: any) => {}
              );
            },
          },
        ],
      },
      drillLicenseNo: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      wellNo: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      fullname: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      addressNo: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      street: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      soi: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      tambon: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      moo: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      amphoe: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      province: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      postalCode: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      phoneNumber: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      fax: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      email: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      wellAddressNo: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      wellMoo: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      wellSoi: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      wellStreet: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      wellTambon: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      wellAmphoe: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      wellProvince: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      wellPostalCode: <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        },
      },
      risk: <IFormHookItems>{
        before: (_this: any) => {},
        subscribe: [
          {
            formId: 'risk',
            cb: async (val: string, _this: any) => {
              console.log('risk', val, _this);
              this.riskStatus = val;
              this.riskChoice = this.getRisk;
            },
          },
        ],
      },
    };
  }

  setGrouping(_this: any, keyBind: string) {
    if (_this.propertiesOptions.optionsBinder) {
      _this.propertiesOptions.optionsBinder.properties.groupingColumn = keyBind;
    } else {
      _this.propertiesOptions = {
        optionsBinder: {
          properties: {
            groupingColumn: keyBind,
          },
        },
      };
    }
  }
  subAP = async (
    val: string,
    _this: any,
    keyval: string,
    idKey: string,
    valKey: string,
    hook?: any
  ) => {
    if (_this.groupVal === val) {
      return;
    }
    if (val) {
      const keySelected = keyval + val + ':selected';
      const masterTambon = await this.masterCacheService.getMasterData(
        keySelected
      );
      if (!_this.properties.id) {
        return;
      }
      _this.groupVal = val;
      this.validateForm
        .get(_this.properties.id)
        ?.setValue(masterTambon[0][idKey]);
      if (hook) {
        hook(masterTambon[0][idKey]);
      }

      _this.inputValBack = masterTambon[0][idKey];
      _this.label = masterTambon[0][valKey];
    } else {
      this.clearValInform(_this);
    }
  };
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
  };
  clearValInform(_this: any) {
    this.validateForm.get(_this.properties.id)?.setValue('');
    _this.inputValBack = '';
    if (_this.properties.optionsBinder) {
      _this.label = _this.properties.optionsBinder.properties.emptyLabel;
    }
  }
  getActivity(el: any) {
    this.sendParam.id = this.recordID;
    this.sendParam.performer = this.processDefID + '_borer';
    this.flowService.getAssignmentByUsername(
      'GWDriller',
      this.sendParam,
      (res: any) => {
        this.closeLoading(el);
        if (!res.error) {
          this.totalList = res.total;
          console.log('getActivity', res);
          this.activityID = res.data[0].activityId;
          this.activityDefID = res.data[0].activityDefId;
          this.activityName = res.data[0].activityName;
          this.requestNo = res.data[0].requestNo;
        }
      }
    );
  }

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  ngOnInit() {
    this.riskChoice = true;
    this.formObjElm = { ...JSON.parse(formData.json) };
    this.formObjElmNBT345 = { ...JSON.parse(formDataNBT345.json) };
    this.formObjElmNBT3 = { ...JSON.parse(formDataNBT3.json) };
    this.formObjElmNBT4 = { ...JSON.parse(formDataNBT4.json) };
    this.formObjElmNBT5 = { ...JSON.parse(formDataNBT5.json) };
    // this.formObjElmNBT3.elements.forEach((element) => {
    //   console.log(element);
    // });
    // console.log(this.formObjElm.elements);
    // console.log(this.formObjElmNBT3.elements);
    // console.log(this.formObjElmNBT4.elements);
    // console.log(this.formObjElmNBT5.elements);
    this.route.queryParams.subscribe((params: any) => {
      // console.log('params', params);
      if (params.returnUrl) {
        this.returnUrl = params.returnUrl;
      } else {
        this.returnUrl = '/tabs/dgr/my-request-forms';
      }
      if (params.requestNo) {
        this.requestNo = params.requestNo;
      }
    });
    this.route.paramMap.subscribe((paramMap) => {
      if (
        !paramMap.has('recordID') ||
        !paramMap.has('processID') ||
        !paramMap.has('processDefID')
      ) {
        this.router.navigate([this.returnUrl], { replaceUrl: true });
      }
      this.recordID = paramMap.get('recordID') as any;
      this.processID = paramMap.get('processID') as any;
      this.processDefID = paramMap.get('processDefID') as any;
    });
    this.stepValidateForm = [];
    for (let i = 0; i < 4; i++) {
      this.stepValidateForm.push(this.fb.group({}));
    }
    this.validateForm = this.fb.group({});
    this.preHooks();
    this.preFetch = [];
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit : ', this.validateForm);
    console.log('ngAfterViewInit preFetch : ', this.preFetch);
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'ดึงข้อมูลรายงาน...' })
      .then(async (loadingEl) => {
        loadingEl.present();
        this.masterCacheService.preLoadGWDriller((res: any) => {
          console.log('preLoadGWDriller', res);
          if (!res.error && res.data[0]) {
            this.gwDriller = <IGWDriller>res.data[0];
          } else {
            Swal.fire({
              title: 'ไม่สามารถดึงข้อมูลช่างเจาะได้ กรุณาลองใหม่อีกครั้ง',
              icon: 'error',
              timer: 2000,
              heightAuto: false,
            }).then(() => {
              this.closeLoading(loadingEl);
              this.router.navigate(['/tabs/dgr/my-request-forms'], {
                replaceUrl: true,
              });
            });
          }
        });

        const config = getApiGEDrillerConfigByKey(
          'list_drillLicensebyRequestNoDriller'
        ) as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys(
          'sult'
        );
        config.headers['Authorization'] = 'Basic ' + userSult;
        config.headers['Accept'] = 'application/json';
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios
          .get(config.url + '?requestNo=' + this.requestNo, axiosConfig)
          .subscribe(
            (resData) => {
              this.closeLoading(loadingEl);
              console.log('license', resData, resData.data.size);
              if (
                (resData.status === 200 || resData.status === 201) &&
                resData.data.size === 1
              ) {
                this.setFormVal(resData.data.data[0]);
              } else {
                Swal.fire({
                  title: 'ไม่พบข้อมูลใบอนุญาต',
                  icon: 'error',
                  timer: 2000,
                  heightAuto: false,
                }).then(() => {
                  this.closeLoading(loadingEl);
                  this.router.navigate(['/tabs/dgr/my-request-forms'], {
                    replaceUrl: true,
                  });
                });
              }
            },
            (err) => {
              Swal.fire({
                title: 'ไม่พบข้อมูลใบอนุญาต',
                icon: 'error',
                timer: 2000,
                heightAuto: false,
              }).then(() => {
                this.closeLoading(loadingEl);
                this.router.navigate(['/tabs/dgr/my-request-forms'], {
                  replaceUrl: true,
                });
              });
            }
          );

        this.getActivity(loadingEl);

        //fetch Data sub form
        this.fetchNBT3sub();
        this.fetchNBT4Pipe();
        this.fetchNBT4Filter();
        this.fetchNBT4Pump();
        this.fetchNBT4Recovery();
        this.fetchNBT5Hole();
        this.fetchNBT5Pipe();
        this.fetchNBT5Gouge();
        this.fetchNBT5Filter();
        this.fetchNBT5SideSeal();
        this.fetchNBT5Layer();
        console.log('this.gwDriller', this.gwDriller);
      });
  }

  submitForm() {
    console.log('Before form :', this.validateForm);
    if (!this.validateForm.valid) {
      return;
    }
    for (const i of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    this.storeFormNBT345();
  }

  sendComplete() {
    console.log('sendComplete', this.validateForm);
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'ant-btn ant-btn-primary ant-btn-small',
        cancelButton: 'ant-btn ant-btn-dangerous ant-btn-small',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'ยืนยัน',
        text: 'ขอเจาะลึกลงไปเกินกว่าที่กำหนด',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          console.log('sendComplete');
          this.updateRiskForNB1();
        }
      });
  }

  createFormData(processId: string, recordId: string): FormData {
    for (const form of this.preFetch) {
      if (form.hasValue.indexOf('#assignment.processId#') === 0) {
        this.validateForm.get(form.formId)?.setValue(processId);
      }
      if (form.hasValue.indexOf('#assignment.activityId#') === 0) {
        this.validateForm.get(form.formId)?.setValue(this.activityID);
      }
      if (form.hasValue.indexOf('#assignment.activityDefId#') === 0) {
        this.validateForm.get(form.formId)?.setValue(this.activityDefID);
      }
      if (form.hasValue.indexOf('#process.recordId#') === 0) {
        this.validateForm.get(form.formId)?.setValue(recordId);
      }
    }
    this.validateForm.get('gwDrillerID')?.setValue(this.gwDriller.gwDrillerID);

    const formData = toFormData(this.validateForm.value);
    formData.append('id', recordId);
    console.log('form : ', this.validateForm);
    console.log('form data : ', formData);

    return formData;
  }

  setFormVal(resData: any) {
    for (const key of Object.keys(resData)) {
      this.validateForm.get('fullname')?.setValue(resData['drillLicenseName']);
      if (this.validateForm.get(key)) {
        console.log('current : ', this.validateForm.get(key)?.value);
        console.log('key : ', key, ': ', resData[key]);
        this.validateForm.get(key)?.setValue(resData[key]);
        console.log('after : ', this.validateForm.get(key)?.value);
      }
    }
  }

  storeFormNBT345() {
    const res = {
      processId: this.processID,
      recordId: this.recordID,
    };
    const data = this.createFormData(res.processId, res.recordId);
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'บันทึกข้อมูลคำขอ...' })
      .then(async (loadingEl) => {
        loadingEl.present();
        // Save Request
        const config = getApiGEDrillerConfigByKey(
          'reportNBT345ForMobile'
        ) as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys(
          'sult'
        );
        config.headers['Authorization'] = 'Basic ' + userSult;
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        console.log('storeFormNBT345', res, axiosConfig);
        axios.post(config.url, data, axiosConfig).subscribe(
          (resData) => {
            this.closeLoading(loadingEl);
            if (resData.status === 200 || resData.status === 201) {
              this.updateRiskForNB1();
            } else {
              ErrorFormHandle.showRetry(
                'เกิดข้อผิดพลาด',
                'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
                () => {
                  this.closeLoading(loadingEl);
                  this.storeFormNBT345();
                },
                () => {
                  this.closeLoading(loadingEl);
                }
              );
            }
          },
          (err) => {
            ErrorFormHandle.showRetry(
              'เกิดข้อผิดพลาด',
              'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
              () => {
                this.closeLoading(loadingEl);
                this.storeFormNBT345();
              },
              () => {
                this.closeLoading(loadingEl);
              }
            );
          }
        );
      })
      .catch((err) => {
        console.log(err);
        this.isLoading = false;
      });
  }

  updateRiskForNB1() {
    const formData = new FormData();
    formData.append('risk', this.riskStatus);
    formData.append('id', this.recordID);
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'บันทึกข้อมูลคำขอ...' })
      .then(async (loadingEl) => {
        loadingEl.present();
        const config = getApiGEDrillerConfigByKey(
          'reportNBT345StatusForMobile'
        ) as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys(
          'sult'
        );
        config.headers['Authorization'] = 'Basic ' + userSult;
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios.post(config.url, formData, axiosConfig).subscribe(
          (resData) => {
            this.closeLoading(loadingEl);
            console.log('updateRiskForNB1', resData);
            if (resData.status === 200 || resData.status === 201) {
              this.updateTrailFormRequest();
            } else {
              ErrorFormHandle.showRetry(
                'เกิดข้อผิดพลาด',
                'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
                () => {
                  this.closeLoading(loadingEl);
                  this.updateRiskForNB1();
                },
                () => {
                  this.closeLoading(loadingEl);
                }
              );
            }
          },
          (err) => {
            ErrorFormHandle.showRetry(
              'เกิดข้อผิดพลาด',
              'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
              () => {
                this.closeLoading(loadingEl);
                this.updateRiskForNB1();
              },
              () => {
                this.closeLoading(loadingEl);
              }
            );
          }
        );
      })
      .catch((err) => {
        console.log(err);
        this.isLoading = false;
      });
  }

  updateTrailFormRequest() {
    const data = {
      id: this.recordID,
      status: this.nb1Status,
      remarks: this.nb1Remarks,
      activityID: this.activityID,
      activityDefID: this.activityDefID,
      activityName: this.activityName,
    };
    const formData = toFormData(data);
    console.log('data', data);
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'บันทึกข้อมูลคำขอ...' })
      .then((loadingEl) => {
        loadingEl.present();

        // Save Request
        this.flowService.updateTrailFormRequest(
          this.processDefID,
          formData,
          (resData: any) => {
            this.closeLoading(loadingEl);
            if (!resData.error) {
              console.log('updateTrailFormRequest', resData);
              // this.listProcessByUser(this.processID);
              this.setActivityVariables(this.processID, this.activityID);
            } else {
              ErrorFormHandle.showRetry(
                'เกิดข้อผิดพลาด',
                'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
                () => {
                  this.closeLoading(loadingEl);
                  this.updateTrailFormRequest();
                },
                () => {
                  this.closeLoading(loadingEl);
                }
              );
            }
          },
          () => {
            ErrorFormHandle.showRetry(
              'เกิดข้อผิดพลาด',
              'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
              () => {
                this.closeLoading(loadingEl);
                this.updateTrailFormRequest();
              },
              () => {
                this.closeLoading(loadingEl);
              }
            );
          }
        );
      })
      .catch((err) => {
        console.log(err);
        this.isLoading = false;
      });
  }

  /**
   *
   * @param processId
   * Description : step 3 list process by processId
   */
  listProcessByUser(processId: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'ดึงข้อมูลคำขอ...' })
      .then((loadingEl) => {
        loadingEl.present();

        // Save Request
        this.flowService.listProcessByUser(
          'nb1',
          processId,
          (resData: IFlowProcessByUser) => {
            this.closeLoading(loadingEl);
            console.log('listProcessByUser', resData);
            if (!resData.error) {
              // send to step 4
              this.setActivityVariables(processId, resData.activityId);
            }
          },
          () => {
            ErrorFormHandle.showRetry(
              'เกิดข้อผิดพลาด',
              'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
              () => {
                this.closeLoading(loadingEl);
                this.listProcessByUser(processId);
              },
              () => {
                this.closeLoading(loadingEl);
              }
            );
          }
        );
      })
      .catch((err) => {
        console.log(err);
        this.isLoading = false;
      });
  }

  setActivityVariables(processId: string, activityId: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'ตั้งค่าข้อมูลคำขอ...' })
      .then((loadingEl) => {
        loadingEl.present();

        const paramObj: any = {
          status: this.nb1Status,
          risk: this.riskStatus,
        };

        let myParam = Object.keys(paramObj)
          .reduce(function (a: any, k) {
            a.push(k + '=' + encodeURIComponent(paramObj[k]));
            return a;
          }, [])
          .join('&');

        this.flowService.setActivityVariables(
          this.processDefID,
          processId,
          activityId,
          myParam,
          (resData: any) => {
            this.closeLoading(loadingEl);
            console.log('setActivityVariables', resData);
            if (!resData.error) {
              // this.completeProcess(processId, activityId);
              this.completeAssignment(processId, activityId);
            } else {
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
              );
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
            );
          }
        );
      });
  }
  /**
   * Step 4.1
   * @param processId
   * @param activityId
   */
  completeProcess(processId: string, activityId: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'บันทึกข้อมูลคำขอ...' })
      .then((loadingEl) => {
        loadingEl.present();

        // Save Request
        this.flowService.completeProcess(
          this.processDefID,
          processId,
          activityId,
          (resData: any) => {
            this.closeLoading(loadingEl);
            if (!resData.error) {
              // show step 4 complete send
              console.log('Complete : ', resData);
              Swal.fire({
                title: 'บันทึกข้อมูลคำขอสำเร็จ',
                icon: 'success',
                timer: 2000,
                heightAuto: false,
              }).then(() => {
                // this.router.navigateByUrl('/tabs/dgr/homes', { state: { redirectTo: '/tabs/dgr/my-request-forms' } });
                this.router.navigate(['/tabs/dgr/my-request-forms'], {
                  replaceUrl: true,
                });
              });
            } else {
              ErrorFormHandle.showRetry(
                'เกิดข้อผิดพลาด',
                'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
                () => {
                  this.closeLoading(loadingEl);
                  this.completeProcess(processId, activityId);
                },
                () => {
                  this.closeLoading(loadingEl);
                }
              );
            }
          },
          () => {
            ErrorFormHandle.showRetry(
              'เกิดข้อผิดพลาด',
              'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
              () => {
                this.closeLoading(loadingEl);
                this.completeProcess(processId, activityId);
              },
              () => {
                this.closeLoading(loadingEl);
              }
            );
          }
        );
      })
      .catch((err) => {
        console.log(err);
        this.isLoading = false;
      });
  }
  /**
   * Step 4.1
   * @param processId
   * @param activityId
   */
  completeAssignment(processId: string, activityId: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'บันทึกข้อมูลคำขอ...' })
      .then((loadingEl) => {
        loadingEl.present();

        // Save Request
        this.flowService.completeAssignment(
          this.processDefID,
          activityId,
          (resData: any) => {
            this.closeLoading(loadingEl);
            if (!resData.error) {
              // show step 4 complete send
              console.log('Complete : ', resData);
              Swal.fire({
                title: 'บันทึกข้อมูลคำขอสำเร็จ',
                icon: 'success',
                timer: 2000,
                heightAuto: false,
              }).then(() => {
                // this.router.navigateByUrl('/tabs/dgr/homes', { state: { redirectTo: '/tabs/dgr/my-request-forms' } });
                this.router.navigate(['/tabs/dgr/my-request-forms'], {
                  replaceUrl: true,
                });
              });
            } else {
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
              );
            }
          },
          () => {
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
            );
          }
        );
      })
      .catch((err) => {
        console.log(err);
        this.isLoading = false;
      });
  }
  //NBT3
  onPickNBT3sub(dataEdit: any) {
    console.log('onPickNBT3sub', dataEdit);
    const modalOptions = {
      component: ReportNbt3SubComponent,
      componentProps: dataEdit
        ? { dataEdit: { ...dataEdit } }
        : { recordID: this.recordID },
    };

    this.modalCtrl.create(modalOptions).then((modalEl) => {
      modalEl.onDidDismiss().then((modalData) => {
        console.log('ReportNbt3SubComponent', modalData);
        if (modalData?.data) {
          this.fetchNBT3sub();
        }
      });
      modalEl.present();
    });
  }

  fetchNBT3sub() {
    if (this.recordID && this.recordID === '') {
      Swal.fire({
        title: 'ไม่พบข้อมูล...',
        html: 'ไม่สามารถดึงข้อมูลรายงานการปฏิบัติงานประจำวันได้',
        icon: 'error',
        heightAuto: false,
      });
      return;
    }
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'กำลังดึงข้อมูลรายงานการปฏิบัติงานประจำวัน...',
      })
      .then(async (loadingEl: any) => {
        loadingEl.present();
        const config = getApiGEDrillerConfigByKey(
          'list_reportNBT3SubDriller'
        ) as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys(
          'sult'
        );
        if (userSult) {
          config.headers['Authorization'] = 'Basic ' + userSult;
        }
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios
          .get(config.url + '?parentID=' + this.recordID, axiosConfig)
          .subscribe(
            (resData) => {
              this.closeLoading(loadingEl);
              console.log('fetchNBT3sub resData : ', resData);
              let usageSum = 0;
              if (
                (resData.status === 200 || resData.status === 201) &&
                resData.data.size > 0
              ) {
                // imageUrlPath
                this.listOfNBT3sub = [...resData.data.data];
                const uList = [...resData.data.data];

                // console.log('uList', uList);
                // uList.forEach((v, k) => {
                //   let listImgs = [];
                //   if (v.imageMeter.indexOf(";") != -1) {
                //     let img = v.imageMeter.split(';');
                //     img.forEach(m => {
                //       listImgs.push(this.imageUrlPath + '/' + v.id + '/' + m + '.');
                //     });
                //   } else {
                //     listImgs.push(this.imageUrlPath + '/' + v.id + '/' + v.imageMeter + '.')
                //   }
                //   this.listOfNBT3sub[k].imageMeters = listImgs;

                //   if (v.use) {
                //     usageSum = parseInt(v.use) + usageSum;
                //     console.log('usageSum : ', usageSum);
                //   }
                //   this.validateForm.get('usageSum')?.setValue(usageSum);

                // })
              }
            },
            (error) => {
              this.closeLoading(loadingEl);
              Swal.fire({
                title: 'ข้อผิดพลาด...',
                html: 'ไม่สามารถดึงข้อมูลรายงานการปฏิบัติงานประจำวันได้',
                icon: 'error',
                heightAuto: false,
              });
            }
          );
      });
  }

  

  //NBT4 Pipe
  onPickNBT4Pipe(dataEdit:any) {
    this.modalCtrl
      .create({
        component: ReportNbt4PipeComponent,
        componentProps: dataEdit
        ? { dataEdit: { ...dataEdit } }
        : { recordID: this.recordID },
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          console.log('ReportNBT4PipeComponent', modalData);
          if (!modalData.data) {
            return;
          }
          this.fetchNBT4Pipe();
        });
        modalEl.present();
      });
  }
  fetchNBT4Pipe() {
    if (this.recordID && this.recordID === '') {
      Swal.fire({
        title: 'ไม่พบข้อมูล...',
        html: 'ไม่สามารถดึงข้อมูลท่อกรุได้',
        icon: 'error',
        heightAuto: false,
      });
      return;
    }
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'กำลังดึงข้อมูลท่อกรุ...',
      })
      .then(async (loadingEl: any) => {
        loadingEl.present();
        const config = getApiGEDrillerConfigByKey(
          'list_reportNBT4PipeDriller'
        ) as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys(
          'sult'
        );
        if (userSult) {
          config.headers['Authorization'] = 'Basic ' + userSult;
        }
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios
          .get(config.url + '?parentID=' + this.recordID, axiosConfig)
          .subscribe(
            (resData) => {
              this.closeLoading(loadingEl);
              console.log('fetchNBT4Pipe resData : ', resData);
              let usageSum = 0;
              if (
                (resData.status === 200 || resData.status === 201) &&
                resData.data.size > 0
              ) {
                // imageUrlPath
                this.listOfNBT4Pipe = [...resData.data.data];
                const uList = [...resData.data.data];
              }
            },
            (error) => {
              this.closeLoading(loadingEl);
              Swal.fire({
                title: 'ข้อผิดพลาด...',
                html: 'ไม่สามารถดึงข้อมูลท่อกรุได้',
                icon: 'error',
                heightAuto: false,
              });
            }
          );
      });
  }

 

  //NBT4 Filter
  onPickNBT4Filter(dataEdit:any) {
    this.modalCtrl
      .create({
        component: ReportNbt4FilterComponent,
        componentProps: dataEdit
        ? { dataEdit: { ...dataEdit } }
        : { recordID: this.recordID },
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          console.log('ReportNBT4FilterComponent', modalData);
          if (!modalData.data) {
            return;
          }
          this.fetchNBT4Filter();
        });
        modalEl.present();
      });
  }
  fetchNBT4Filter() {
    if (this.recordID && this.recordID === '') {
      Swal.fire({
        title: 'ไม่พบข้อมูล...',
        html: 'ไม่สามารถดึงข้อมูลขนาดท่อกรองหรือท่อเซาะร่องได้',
        icon: 'error',
        heightAuto: false,
      });
      return;
    }
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'กำลังดึงข้อมูลข้อมูลขนาดท่อกรองหรือท่อเซาะร่อง...',
      })
      .then(async (loadingEl: any) => {
        loadingEl.present();
        const config = getApiGEDrillerConfigByKey(
          'list_reportNBT4FilterDriller'
        ) as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys(
          'sult'
        );
        if (userSult) {
          config.headers['Authorization'] = 'Basic ' + userSult;
        }
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios
          .get(config.url + '?parentID=' + this.recordID, axiosConfig)
          .subscribe(
            (resData) => {
              this.closeLoading(loadingEl);
              console.log('fetchNBT4Filter resData : ', resData);
              let usageSum = 0;
              if (
                (resData.status === 200 || resData.status === 201) &&
                resData.data.size > 0
              ) {
                // imageUrlPath
                this.listOfNBT4Filter = [...resData.data.data];
                const uList = [...resData.data.data];
              }
            },
            (error) => {
              this.closeLoading(loadingEl);
              Swal.fire({
                title: 'ข้อผิดพลาด...',
                html: 'ไม่สามารถดึงข้อมูลขนาดท่อกรองหรือท่อเซาะร่องได้',
                icon: 'error',
                heightAuto: false,
              });
            }
          );
      });
  }

 

  //NBT4 Pump
  onPickNBT4Pump(dataEdit:any) {
    this.modalCtrl
      .create({
        component: ReportNbt4PumpComponent,
        componentProps: dataEdit
        ? { recordID: this.recordID, dataEdit: { ...dataEdit }, }
        : { recordID: this.recordID, time: this.nbt4PumpTime },
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          console.log('ReportNBT4PumpComponent', modalData);
          if (!modalData.data) {
            return;
          }
          this.fetchNBT4Pump();
        });
        modalEl.present();
      });
  }
  fetchNBT4Pump() {
    if (this.recordID && this.recordID === '') {
      Swal.fire({
        title: 'ไม่พบข้อมูล...',
        html: 'ไม่สามารถดึงข้อมูลรายละเอียดการทดสอบขณะทำการสูบน้ำจากบ่อน้ำบาดาลได้',
        icon: 'error',
        heightAuto: false,
      });
      return;
    }
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message:
          'กำลังดึงข้อมูลรายละเอียดการทดสอบขณะทำการสูบน้ำจากบ่อน้ำบาดาล...',
      })
      .then(async (loadingEl: any) => {
        loadingEl.present();
        const config = getApiGEDrillerConfigByKey(
          'list_reportNBT4PumpDriller'
        ) as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys(
          'sult'
        );
        if (userSult) {
          config.headers['Authorization'] = 'Basic ' + userSult;
        }
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios
          .get(config.url + '?parentID=' + this.recordID, axiosConfig)
          .subscribe(
            (resData) => {
              this.closeLoading(loadingEl);
              console.log('fetchNBT4Pump resData : ', resData);
              let usageSum = 0;
              if (
                (resData.status === 200 || resData.status === 201) &&
                resData.data.size > 0
              ) {
                // imageUrlPath
                this.listOfNBT4Pump = [...resData.data.data];
                const uList = [...resData.data.data];
                this.nbt4PumpTime = this.nbt4Time(resData.data.size);
              } else if (resData.data.size === 0) {
                this.nbt4PumpTime = '00';
              }
            },
            (error) => {
              this.closeLoading(loadingEl);
              Swal.fire({
                title: 'ข้อผิดพลาด...',
                html: 'ไม่สามารถดึงข้อมูลรายละเอียดการทดสอบขณะทำการสูบน้ำจากบ่อน้ำบาดาลได้',
                icon: 'error',
                heightAuto: false,
              });
            }
          );
      });
  }

  //NBT4 Recovery
  onPickNBT4Recovery(dataEdit:any) {
    this.modalCtrl
      .create({
        component: ReportNbt4RecoveryComponent,
        componentProps:  dataEdit
        ? { recordID: this.recordID, dataEdit: { ...dataEdit }, }
        : { recordID: this.recordID, time: this.nbt4RecoveryTime }
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          console.log('ReportNBT4RecoveryComponent', modalData);
          if (!modalData.data) {
            return;
          }
          this.fetchNBT4Recovery();
        });
        modalEl.present();
      });
  }
  fetchNBT4Recovery() {
    if (this.recordID && this.recordID === '') {
      Swal.fire({
        title: 'ไม่พบข้อมูล...',
        html: 'ไม่สามารถดึงข้อมูลรายละเอียดระยะน้ำคืนตัวได้',
        icon: 'error',
        heightAuto: false,
      });
      return;
    }
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'กำลังดึงข้อมูลรายละเอียดระยะน้ำคืนตัว...',
      })
      .then(async (loadingEl: any) => {
        loadingEl.present();
        const config = getApiGEDrillerConfigByKey(
          'list_reportNBT4RecoveryDriller'
        ) as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys(
          'sult'
        );
        if (userSult) {
          config.headers['Authorization'] = 'Basic ' + userSult;
        }
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios
          .get(config.url + '?parentID=' + this.recordID, axiosConfig)
          .subscribe(
            (resData) => {
              this.closeLoading(loadingEl);
              console.log('fetchNBT4Recovery resData : ', resData);
              let usageSum = 0;
              if (
                (resData.status === 200 || resData.status === 201) &&
                resData.data.size > 0
              ) {
                // imageUrlPath
                this.listOfNBT4Recovery = [...resData.data.data];
                const uList = [...resData.data.data];
                this.nbt4RecoveryTime = this.nbt4Time(resData.data.size);
              } else if (resData.data.size === 0) {
                this.nbt4RecoveryTime = '00';
              }
            },
            (error) => {
              this.closeLoading(loadingEl);
              Swal.fire({
                title: 'ข้อผิดพลาด...',
                html: 'ไม่สามารถดึงข้อมูลรายละเอียดระยะน้ำคืนตัวได้',
                icon: 'error',
                heightAuto: false,
              });
            }
          );
      });
  }

  //NBT5 Hole
  onPickNBT5Hole(dataEdit:any) {
    this.modalCtrl
      .create({
        component: ReportNbt5HoleComponent,
        componentProps: dataEdit
        ? { dataEdit: { ...dataEdit } }
        : { recordID: this.recordID },
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          console.log('ReportNBT5HoleComponent', modalData);
          if (!modalData.data) {
            return;
          }
          this.fetchNBT5Hole();
        });
        modalEl.present();
      });
  }
  fetchNBT5Hole() {
    if (this.recordID && this.recordID === '') {
      Swal.fire({
        title: 'ไม่พบข้อมูล...',
        html: 'ไม่สามารถดึงข้อมูลหลุมเจาะได้',
        icon: 'error',
        heightAuto: false,
      });
      return;
    }
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'กำลังดึงข้อมูลหลุมเจาะ...',
      })
      .then(async (loadingEl: any) => {
        loadingEl.present();
        const config = getApiGEDrillerConfigByKey(
          'list_reportNBT5HoleDriller'
        ) as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys(
          'sult'
        );
        if (userSult) {
          config.headers['Authorization'] = 'Basic ' + userSult;
        }
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios
          .get(config.url + '?parentID=' + this.recordID, axiosConfig)
          .subscribe(
            (resData) => {
              this.closeLoading(loadingEl);
              console.log('fetchNBT5Hole resData : ', resData);
              let usageSum = 0;
              if (
                (resData.status === 200 || resData.status === 201) &&
                resData.data.size > 0
              ) {
                // imageUrlPath
                this.listOfNBT5Hole = [...resData.data.data];
                const uList = [...resData.data.data];
              }
            },
            (error) => {
              this.closeLoading(loadingEl);
              Swal.fire({
                title: 'ข้อผิดพลาด...',
                html: 'ไม่สามารถดึงข้อมูลหลุมเจาะได้',
                icon: 'error',
                heightAuto: false,
              });
            }
          );
      });
  }

  //NBT5 Hole
  onPickNBT5Pipe(dataEdit:any) {
    this.modalCtrl
      .create({
        component: ReportNbt5PipeComponent,
        componentProps:  dataEdit
        ? { dataEdit: { ...dataEdit } }
        : { recordID: this.recordID },
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          console.log('ReportNBT5PipeComponent', modalData);
          if (!modalData.data) {
            return;
          }
          this.fetchNBT5Pipe();
        });
        modalEl.present();
      });
  }
  fetchNBT5Pipe() {
    if (this.recordID && this.recordID === '') {
      Swal.fire({
        title: 'ไม่พบข้อมูล...',
        html: 'ไม่สามารถดึงข้อมูลการใช้ท่อกรุได้',
        icon: 'error',
        heightAuto: false,
      });
      return;
    }
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'กำลังดึงข้อมูลการใช้ท่อกรุ...',
      })
      .then(async (loadingEl: any) => {
        loadingEl.present();
        const config = getApiGEDrillerConfigByKey(
          'list_reportNBT5PipeDriller'
        ) as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys(
          'sult'
        );
        if (userSult) {
          config.headers['Authorization'] = 'Basic ' + userSult;
        }
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios
          .get(config.url + '?parentID=' + this.recordID, axiosConfig)
          .subscribe(
            (resData) => {
              this.closeLoading(loadingEl);
              console.log('fetchNBT5Pipe resData : ', resData);
              let usageSum = 0;
              if (
                (resData.status === 200 || resData.status === 201) &&
                resData.data.size > 0
              ) {
                // imageUrlPath
                this.listOfNBT5Pipe = [...resData.data.data];
                const uList = [...resData.data.data];
              }
            },
            (error) => {
              this.closeLoading(loadingEl);
              Swal.fire({
                title: 'ข้อผิดพลาด...',
                html: 'ไม่สามารถดึงข้อมูลการใช้ท่อกรุได้',
                icon: 'error',
                heightAuto: false,
              });
            }
          );
      });
  }

  //NBT5 Gouge
  onPickNBT5Gouge(dataEdit:any) {
    this.modalCtrl
      .create({
        component: ReportNbt5GougeComponent,
        componentProps: dataEdit
        ? { dataEdit: { ...dataEdit } }
        : { recordID: this.recordID },
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          console.log('ReportNBT5GougeComponent', modalData);
          if (!modalData.data) {
            return;
          }
          this.fetchNBT5Gouge();
        });
        modalEl.present();
      });
  }
  fetchNBT5Gouge() {
    if (this.recordID && this.recordID === '') {
      Swal.fire({
        title: 'ไม่พบข้อมูล...',
        html: 'ไม่สามารถดึงข้อมูลการใช้ท่อเซาะร่องได้',
        icon: 'error',
        heightAuto: false,
      });
      return;
    }
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'กำลังดึงข้อมูลการใช้ท่อเซาะร่อง...',
      })
      .then(async (loadingEl: any) => {
        loadingEl.present();
        const config = getApiGEDrillerConfigByKey(
          'list_reportNBT5GougeDriller'
        ) as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys(
          'sult'
        );
        if (userSult) {
          config.headers['Authorization'] = 'Basic ' + userSult;
        }
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios
          .get(config.url + '?parentID=' + this.recordID, axiosConfig)
          .subscribe(
            (resData) => {
              this.closeLoading(loadingEl);
              console.log('fetchNBT5Gouge resData : ', resData);
              let usageSum = 0;
              if (
                (resData.status === 200 || resData.status === 201) &&
                resData.data.size > 0
              ) {
                // imageUrlPath
                this.listOfNBT5Gouge = [...resData.data.data];
                const uList = [...resData.data.data];
              }
            },
            (error) => {
              this.closeLoading(loadingEl);
              Swal.fire({
                title: 'ข้อผิดพลาด...',
                html: 'ไม่สามารถดึงข้อมูลการใช้ท่อเซาะร่องได้',
                icon: 'error',
                heightAuto: false,
              });
            }
          );
      });
  }

  //NBT5 Filter
  onPickNBT5Filter(dataEdit:any) {
    this.modalCtrl
      .create({
        component: ReportNbt5FilterComponent,
        componentProps:  dataEdit
        ? { dataEdit: { ...dataEdit } }
        : { recordID: this.recordID },
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          console.log('ReportNBT5FilterComponent', modalData);
          if (!modalData.data) {
            return;
          }
          this.fetchNBT5Filter();
        });
        modalEl.present();
      });
  }
  fetchNBT5Filter() {
    if (this.recordID && this.recordID === '') {
      Swal.fire({
        title: 'ไม่พบข้อมูล...',
        html: 'ไม่สามารถดึงข้อมูลท่อกรองได้',
        icon: 'error',
        heightAuto: false,
      });
      return;
    }
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'กำลังดึงข้อมูลท่อกรอง...',
      })
      .then(async (loadingEl: any) => {
        loadingEl.present();
        const config = getApiGEDrillerConfigByKey(
          'list_reportNBT5FilterDriller'
        ) as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys(
          'sult'
        );
        if (userSult) {
          config.headers['Authorization'] = 'Basic ' + userSult;
        }
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios
          .get(config.url + '?parentID=' + this.recordID, axiosConfig)
          .subscribe(
            (resData) => {
              this.closeLoading(loadingEl);
              console.log('fetchNBT5Filter resData : ', resData);
              let usageSum = 0;
              if (
                (resData.status === 200 || resData.status === 201) &&
                resData.data.size > 0
              ) {
                // imageUrlPath
                this.listOfNBT5Filter = [...resData.data.data];
                const uList = [...resData.data.data];
              }
            },
            (error) => {
              this.closeLoading(loadingEl);
              Swal.fire({
                title: 'ข้อผิดพลาด...',
                html: 'ไม่สามารถดึงข้อมูลท่อกรองได้',
                icon: 'error',
                heightAuto: false,
              });
            }
          );
      });
  }

  //NBT5 SideSeal
  onPickNBT5SideSeal(dataEdit:any) {
    this.modalCtrl
      .create({
        component: ReportNbt5SidesealComponent,
        componentProps: dataEdit
        ? { dataEdit: { ...dataEdit } }
        : { recordID: this.recordID },
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          console.log('ReportNBT5SidesealComponent', modalData);
          if (!modalData.data) {
            return;
          }
          this.fetchNBT5SideSeal();
        });
        modalEl.present();
      });
  }
  fetchNBT5SideSeal() {
    if (this.recordID && this.recordID === '') {
      Swal.fire({
        title: 'ไม่พบข้อมูล...',
        html: 'ไม่สามารถดึงข้อมูลท่อกรองได้',
        icon: 'error',
        heightAuto: false,
      });
      return;
    }
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'กำลังดึงข้อมูลท่อกรอง...',
      })
      .then(async (loadingEl: any) => {
        loadingEl.present();
        const config = getApiGEDrillerConfigByKey(
          'list_reportNBT5SideSealDriller'
        ) as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys(
          'sult'
        );
        if (userSult) {
          config.headers['Authorization'] = 'Basic ' + userSult;
        }
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios
          .get(config.url + '?parentID=' + this.recordID, axiosConfig)
          .subscribe(
            (resData) => {
              this.closeLoading(loadingEl);
              console.log('fetchNBT5Sideseal resData : ', resData);
              let usageSum = 0;
              if (
                (resData.status === 200 || resData.status === 201) &&
                resData.data.size > 0
              ) {
                // imageUrlPath
                this.listOfNBT5SideSeal = [...resData.data.data];
                const uList = [...resData.data.data];
              }
            },
            (error) => {
              this.closeLoading(loadingEl);
              Swal.fire({
                title: 'ข้อผิดพลาด...',
                html: 'ไม่สามารถดึงข้อมูลท่อกรองได้',
                icon: 'error',
                heightAuto: false,
              });
            }
          );
      });
  }

  //NBT5 Layer
  onPickNBT5Layer(dataEdit:any) {
    this.modalCtrl
      .create({
        component: ReportNbt5LayerComponent,
        componentProps: dataEdit
        ? { dataEdit: { ...dataEdit } }
        : { recordID: this.recordID },
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          console.log('ReportNBT5LayerComponent', modalData);
          if (!modalData.data) {
            return;
          }
          this.fetchNBT5Layer();
        });
        modalEl.present();
      });
  }
  fetchNBT5Layer() {
    if (this.recordID && this.recordID === '') {
      Swal.fire({
        title: 'ไม่พบข้อมูล...',
        html: 'ไม่สามารถดึงข้อมูลรายการชั้นดินหรือชั้นหินที่เจาะผ่านได้',
        icon: 'error',
        heightAuto: false,
      });
      return;
    }
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'กำลังดึงข้อมูลรายการชั้นดินหรือชั้นหินที่เจาะผ่าน...',
      })
      .then(async (loadingEl: any) => {
        loadingEl.present();
        const config = getApiGEDrillerConfigByKey(
          'list_reportNBT5LayerDriller'
        ) as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys(
          'sult'
        );
        if (userSult) {
          config.headers['Authorization'] = 'Basic ' + userSult;
        }
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios
          .get(config.url + '?parentID=' + this.recordID, axiosConfig)
          .subscribe(
            (resData) => {
              this.closeLoading(loadingEl);
              console.log('fetchNBT5Layer resData : ', resData);
              let usageSum = 0;
              if (
                (resData.status === 200 || resData.status === 201) &&
                resData.data.size > 0
              ) {
                // imageUrlPath
                this.listOfNBT5Layer = [...resData.data.data];
                const uList = [...resData.data.data];
              }
            },
            (error) => {
              this.closeLoading(loadingEl);
              Swal.fire({
                title: 'ข้อผิดพลาด...',
                html: 'ไม่สามารถดึงข้อมูลรายการชั้นดินหรือชั้นหินที่เจาะผ่านได้',
                icon: 'error',
                heightAuto: false,
              });
            }
          );
      });
  }

  //Step
  prevStep() {
    this.currentStep -= 1;
    this.scrollToTop();
  }
  nextStep() {
    for (const i of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
      if (this.stepValidateForm[this.currentStep - 1].get(i)) {
        this.stepValidateForm[this.currentStep - 1]
          .get(i)
          ?.setValue(this.validateForm.get(i)?.value);
      }
    }
    for (const i of Object.keys(
      this.stepValidateForm[this.currentStep - 1].controls
    )) {
      this.stepValidateForm[this.currentStep - 1].controls[i].markAsDirty();
      this.stepValidateForm[this.currentStep - 1].controls[
        i
      ].updateValueAndValidity();
    }
    if (!this.stepValidateForm[this.currentStep - 1].invalid) {
      this.currentStep += 1;
      this.scrollToTop();
    } else {
      let firstError = '';
      for (const i of Object.keys(
        this.stepValidateForm[this.currentStep - 1].controls
      )) {
        if (this.stepValidateForm[this.currentStep - 1].controls[i].invalid) {
          console.log(this.stepValidateForm[this.currentStep - 1].controls[i]);
          firstError = i;
          break;
        }
      }
      const fElm = document.querySelector('#' + firstError);
      if (fElm && fElm.parentElement) {
        fElm.parentElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
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

  nbt4Time(t: any) {
    // console.log(t);
    let time = '00';
    let time_a = [
      '00',
      '10',
      '20',
      '30',
      '45',
      '60',
      '80',
      '100',
      '120',
      '150',
      '180',
      '225',
      '270',
      '315',
      '360',
    ];
    time_a.forEach((v, i, a) => {
      // console.log(i, v, a);
      if (i === t) {
        time = v;
      }
    });
    return time;
  }

  get getRisk() {
    if (this.riskStatus === 'ขอเจาะลึกลงไปเกินกว่าที่กำหนด') {
      this.riskChoice = true;
      this.nb1Status = 'Drill More';
      this.nb1Remarks = 'ขอเจาะลึกลงไปเกินกว่าที่กำหนด';
      this.sendButton = 'ขอเจาะลึกลงไปเกินกว่าที่กำหนด';
    } else {
      this.riskChoice = false;
      this.nb1Status = 'Drill successfully';
      this.nb1Remarks = 'ช่างเจาะบ่อน้ำบาดาลดำเนินการเรียบร้อย';
      this.sendButton = 'ส่งข้อมูลคำขอ';
    }
    console.log(
      'this.riskChoice',
      this.riskChoice,
      this.nb1Status,
      this.nb1Remarks
    );
    return this.riskChoice;
  }
}
