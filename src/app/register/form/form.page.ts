import { ErrorFormHandle } from './../../share/error-handle';
import { environment } from './../../../environments/environment';
import { LoadingController } from '@ionic/angular';
import { IUserRegister, IUserInfoForm, IGWDriller } from './../../models/formcontrol';
import { MastercacheService } from './../../share/mastercache.service';
import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import formData from '../../../json/registerGWDriller.json';
import { IFormElement, IFormPreFetch, IFormHookItems } from '../../models/formcontrol';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import axios from 'axios-observable';
import { AuthService } from 'src/app/auth/auth.service';
import Swal from 'sweetalert2';
import { AxiosRequestConfig } from 'axios';
import { getApiListConfigByKey, getApiConfigByKey, getApiGEDrillerConfigByKey } from 'src/app/models/form.dic';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit, AfterViewInit {
  formObjElm: IFormElement;
  validateForm: FormGroup;
  stepValidateForm: FormGroup[] = [];
  preFetch: IFormPreFetch[];
  private gwID: string;
  currentStep = 1;
  formHook = {};
  refElm = {};
  isLoading = false;
  licenseeStatus: string;

  cardId: string;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private masterCacheService: MastercacheService,
    private loadingCtrl: LoadingController,
    private authService: AuthService
  ) { }


  preHooks() {
    this.formHook = {

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
      _this.groupVal = val;
      this.validateForm.get(_this.properties.id)?.setValue(masterTambon[0][idKey]);
      if (hook) {
        hook(masterTambon[0][idKey])
      }

      _this.inputValBack = masterTambon[0][idKey];
      _this.label = masterTambon[0][valKey];
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

  goBack() {
    this.router.navigate(['/register'], { replaceUrl: true });
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation() as any;

    if (navigation.extras.state && navigation.extras.state.cardId) {
      this.cardId = navigation.extras.state.cardId;
    }

    /* init form */
    this.formObjElm = { ...JSON.parse(formData.json) };
    console.log('formObjElm', this.formObjElm)
    this.formObjElm.elements.forEach((element:any) => {
      console.log(element);
    });
    this.validateForm = this.fb.group({});
    this.stepValidateForm.push(this.fb.group({}));
    this.preFetch = [];
    this.preHooks();
    /* end init form */
  }

  ngAfterViewInit() {
    this.validateForm.get('gwDrillerUserID')?.setValue(this.cardId);
    this.validateForm.get('gwDrillerUsername')?.setValue(this.cardId);
    this.validateForm.get('gwPassword')?.setValue('');
    this.validateForm.get('gwConfirmPassword')?.setValue('');
    this.validateForm.get('gwDrillerUsername')?.clearValidators();
    // this.validateForm.get('gwDrillerUsername').setValidators([Validators.required, Validators.pattern('^(?=.{3,50}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._@]+(?<![_.@])$')]);
    this.validateForm.get('gwDrillerUsername')?.setValidators([Validators.required, Validators.pattern('^[A-Za-z0-9_@]+')]);
  }

  closeLoading(el: any) {
    if (el) {
      el.dismiss();
    } else {
      this.loadingCtrl.dismiss();
    }
    this.isLoading = false;
  }

  submitForm() {
    // this.checkDrillerID();
    // this.checkAge();
    console.log('Before form :', this.validateForm);
    for (const i of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (!this.validateForm.valid) {
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
      return;
    }

    if(!this.isValidEmail(this.stepValidateForm[this.currentStep - 1].get('email')?.value)){
      Swal.fire({ title: 'ข้อผิดพลาด...',html:'กรุณากรอกอีเมล์ให้ถูกต้อง', icon: 'warning', heightAuto:false });
    }else{
      console.log('After validate : ', this.validateForm);
      const {
        gwDrillerID,
      } = <IGWDriller>this.validateForm.value;
      if(gwDrillerID && gwDrillerID !== ''){
        this.checkPassword();
      }
    }
   
  }

  isValidEmail(email: string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
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
    this.checkUser(); 
  }
  
  checkPassword(){
    const p = this.validateForm.get('gwPassword')?.value;
    const conP = this.validateForm.get('gwConfirmPassword')?.value;
    if(p === conP){
      this.checkDrillerID()
    }else{
      Swal.fire({ title: 'รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบ', icon: 'error', timer: 2000,heightAuto:false }).then(() => {
        return;
      })
      return;
    }
  }

  checkDrillerID() {
    const {
      gwDrillerID,
      firstname,
      lastname
    } = <IUserInfoForm>this.validateForm.value;
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'กำลังตรวจสอบ...' })
      .then(async loadingEl => {
        loadingEl.present();
        const config = getApiGEDrillerConfigByKey("list_mtGWDrillerCheck") as any;
        config.headers["Accept"] = 'application/json';
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios.get(config.url + `?gwDrillerID=${gwDrillerID}&firstname=${firstname}&lastname=${lastname}`, axiosConfig)
        .subscribe(resData => {
          this.closeLoading(loadingEl);
          console.log('checkDrillerID', resData);
          if (resData.status === 200 || resData.status === 201) {
            if (resData.data.total === 1) {
              this.validateForm.get('gwDrillerID')?.setValue(resData.data.data[0].gwDrillerID);
              this.gwID = resData.data.data[0].id;
              this.checkAge();
            } else {
              Swal.fire({ title: 'ไม่พบเลขที่หนังสือรับรองนี้ หรือชื่อไม่ตรงกับในระบบ', icon: 'error', timer: 2000,heightAuto:false }).then(() => {
                this.validateForm.get('gwDrillerID')?.setErrors({ 'incorrect': true })
                const fElm = document.querySelector('#gwDrillerID');
                if (fElm && fElm.parentElement) {
                  fElm.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
              })
              return;
            }
          } else {
            ErrorFormHandle.showRetry(
              'เกิดข้อผิดพลาด',
              'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
              () => {
                this.closeLoading(loadingEl);
                this.checkDrillerID();
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
              this.checkDrillerID();
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
  checkUser() {
    const {
      gwDrillerUserID,
    } = <IUserInfoForm>this.validateForm.value;
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'กำลังตรวจสอบ...' })
      .then(async loadingEl => {
        loadingEl.present();
        const config = getApiGEDrillerConfigByKey("list_registerGWDrillerCheck") as any;
        config.headers["Accept"] = 'application/json';
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios.get(config.url + `?gwDrillerUserID=${gwDrillerUserID}`, axiosConfig)
        .subscribe(resData => {
          this.closeLoading(loadingEl);
          console.log('checkUser', resData);
          if (resData.status === 200 || resData.status === 201) {
            if (resData.data.total !== 1) {
              this.checkUsername();
            } else {
              ErrorFormHandle.showRetry(
                'มีเลขบัตรประชาชน / เลขนิติบุคคล อยู่แล้วในระบบ',
                'ต้องการไปยังหน้าลืมรหัสผ่านหรือไม่ ?',
                () => {
                  this.closeLoading(loadingEl);
                  this.goBack();
                },
                () => {
                  this.closeLoading(loadingEl);
                  this.validateForm.get('licenseeUserID')?.setErrors({ 'incorrect': true })
                  const fElm = document.querySelector('#licenseeUserID');
                  if (fElm && fElm.parentElement) {
                    fElm.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }
              )
              return;
            }
          } else {
            ErrorFormHandle.showRetry(
              'เกิดข้อผิดพลาด',
              'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
              () => {
                this.closeLoading(loadingEl);
                this.checkUser();
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
              this.checkUser();
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

  checkUsername() {
    const {
      gwDrillerUsername,
    } = <IUserInfoForm>this.validateForm.value;
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'กำลังตรวจสอบ...' })
      .then(async loadingEl => {
        loadingEl.present();
        const config = getApiGEDrillerConfigByKey("list_registerGWDrillerCheck") as any;
        config.headers["Accept"] = 'application/json';
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios.get(config.url + `?gwDrillerUsername=${gwDrillerUsername}`, axiosConfig)
        .subscribe(resData => {
          this.closeLoading(loadingEl);
          console.log('checkUsername', resData);
          if (resData.status === 200 || resData.status === 201) {
            if (resData.data.size !== 1) {
              this.addUser();
            } else {
              ErrorFormHandle.showRetry(
                'มี Username อยู่แล้วในระบบ',
                'ต้องการไปยังหน้าลืมรหัสผ่านหรือไม่ ?',
                () => {
                  this.closeLoading(loadingEl);
                  this.goBack();
                },
                () => {
                  this.closeLoading(loadingEl);
                  this.validateForm.get('gwDrillerUsername')?.setErrors({ 'incorrect': true })
                  const fElm = document.querySelector('#gwDrillerUsername');
                  if (fElm && fElm.parentElement) {
                    fElm.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }
              )
              return;
            }
          } else {
            ErrorFormHandle.showRetry(
              'เกิดข้อผิดพลาด',
              'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
              () => {
                this.closeLoading(loadingEl);
                this.checkUsername();
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
              this.checkUsername();
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

  addUser() {
    const {
      gwDrillerUserID,
      gwDrillerUsername,
      gwPassword,
      firstname,
      lastname,
      email,
    } = <IUserInfoForm>this.validateForm.value;

    const userSend: IUserRegister = {
      id: gwDrillerUsername!,
      username: gwDrillerUsername!,
      password: gwPassword!,
      firstName: firstname,
      lastName: lastname,
      email: email,
      active: 1,
      timeZone: "7",
      locale: 'th_TH'
    }

    this.isLoading = true;

    this.loadingCtrl
      .create({ keyboardClose: true, message: 'กำลังลงทะเบียน กรุณารอสักครู่...' })
      .then(async loadingEl => {
        loadingEl.present();
        const config = getApiConfigByKey("licenseeRegister") as any;
        config.headers["Accept"] = 'application/json';
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios.post(config.url, userSend, axiosConfig)
        .subscribe(resData => {
          this.closeLoading(loadingEl);
          if (resData.status === 200 || resData.status === 201) {
            this.authenUser();
          } else {
            ErrorFormHandle.showRetry(
              'เกิดข้อผิดพลาด',
              'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
              () => {
                this.closeLoading(loadingEl);
                this.addUser();
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
              this.addUser();
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

  private authenUser() {
    const {
      gwDrillerUserID,
      gwDrillerUsername,
      gwPassword
    } = <IUserInfoForm>this.validateForm.value;

    const userAuth:any = {
      username: gwDrillerUsername,
      password: gwPassword,
    }
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'กำลังลงทะเบียน กรุณารอสักครู่...' })
      .then(loadingEl => {
        loadingEl.present();

        this.authService.login(userAuth)
          .subscribe(resData => {
            this.closeLoading(loadingEl);
            this.assignUser('registeredBorer', userAuth.username);
          }, errRes => {
            loadingEl.dismiss();
            ErrorFormHandle.showRetry(
              'เกิดข้อผิดพลาด',
              'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
              () => {
                this.closeLoading(loadingEl);
                this.authenUser();
              },
              () => {
                this.closeLoading(loadingEl);
              }
            )
          });
      })
  }

  /**
   * Step AssignUser to Organization
   * @param organization 
   * @param username 
   */
  assignUser(organization: string, username: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'กำลังลงทะเบียน กรุณารอสักครู่...' })
      .then(async loadingEl => {
        loadingEl.present();
        const config = getApiConfigByKey("assignUserToOrganization") as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys("sult");
        config.headers["Authorization"] = "Basic " + userSult;
        config.headers["Accept"] = 'application/json';
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios.post(config.url + '/' + organization + '/' + username, null , axiosConfig)
        .subscribe(resData => {
          this.closeLoading(loadingEl);
          if (resData.status === 200 || resData.status === 201) {
            this.assignUserToGroup('dgrDriller', username);
          } else {
            ErrorFormHandle.showRetry(
              'เกิดข้อผิดพลาด',
              'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
              () => {
                this.closeLoading(loadingEl);
                this.assignUser(organization, username);
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
              this.assignUser(organization, username);
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

  /**
   * Step AssignUser to Group
   * @param group 
   * @param username 
   */
  assignUserToGroup(group: string, username: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'กำลังลงทะเบียน กรุณารอสักครู่...' })
      .then(async loadingEl => {
        loadingEl.present();
        const config = getApiConfigByKey("assignUserToGroup") as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys("sult");
        config.headers["Authorization"] = "Basic " + userSult;
        config.headers["Accept"] = 'application/json';
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios.post(config.url + '/' + group + '/' + username, null , axiosConfig)
        .subscribe(resData => {
          this.closeLoading(loadingEl);
          if (resData.status === 200 || resData.status === 201) {
            this.addUserInfo();
          } else {
            ErrorFormHandle.showRetry(
              'เกิดข้อผิดพลาด',
              'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
              () => {
                this.closeLoading(loadingEl);
                this.assignUserToGroup(group, username);
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
              this.assignUserToGroup(group, username);
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

  addUserInfo() {
    const {
      firstname,
      lastname,
    } = <IUserInfoForm>this.validateForm.value;
    // this.validateForm.get('gwPassword')?.setValue('');
    // this.validateForm.get('gwConfirmPassword')?.setValue('');
    this.validateForm.get('fullname')?.setValue(firstname + ' ' + lastname);
    const userInfo = <IUserInfoForm>this.validateForm.value
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'กำลังลงทะเบียน กรุณารอสักครู่...' })
      .then(async loadingEl => {
        loadingEl.present();
        const config = getApiGEDrillerConfigByKey("registerGWDriller") as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys("sult");
        config.headers["Authorization"] = "Basic " + userSult;
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios.post(config.url, userInfo, axiosConfig)
        .subscribe(resData => {
          this.closeLoading(loadingEl);
          if (resData.status === 200 || resData.status === 201) {
            this.updateGWDrillerInfo();
          } else {
            ErrorFormHandle.showRetry(
              'เกิดข้อผิดพลาด',
              'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
              () => {
                this.closeLoading(loadingEl);
                this.addUserInfo();
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
              this.addUserInfo();
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
  updateGWDrillerInfo() {
    const {
      gwDrillerUserID,
      gwDrillerUsername,
    } = <IUserInfoForm>this.validateForm.value;
    const userInfo = {
      id:this.gwID,
      gwDrillerUsername: gwDrillerUsername
    }
    this.isLoading = true;
    console.log('updateGWDrillerInfo', gwDrillerUsername);

    this.loadingCtrl
      .create({ keyboardClose: true, message: 'กำลังลงทะเบียน กรุณารอสักครู่...' })
      .then(async loadingEl => {
        loadingEl.present();
        const config = getApiGEDrillerConfigByKey("update_mtGWDriller") as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys("sult");
        config.headers["Authorization"] = "Basic " + userSult;
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios.post(config.url, userInfo, axiosConfig)
        .subscribe(resData => {
          this.closeLoading(loadingEl);
          if (resData.status === 200 || resData.status === 201) {
            // this.startAuthenFlow();
            Swal.fire({ title: 'ลงทะเบียนช่างเจาะสำเร็จ', icon: 'success', timer: 2000,heightAuto:false }).then(() => {
              this.authService.logout();
            })
          } else {
            ErrorFormHandle.showRetry(
              'เกิดข้อผิดพลาด',
              'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
              () => {
                this.closeLoading(loadingEl);
                this.addUserInfo();
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
              this.addUserInfo();
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


  
  startAuthenFlow() {
    const {
      gwDrillerUsername,
      email,
    } = <IUserInfoForm>this.validateForm.value;

    const data = {
      "email": email
    }
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'กำลังลงทะเบียน กรุณารอสักครู่...' })
      .then(async loadingEl => {
        loadingEl.present();
        const config = getApiConfigByKey("authenticationUsers") as any;
        config.headers["Accept"] = 'application/json';
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios.post(config.url+gwDrillerUsername, data, axiosConfig)
        .subscribe(resData => {
          loadingEl.dismiss();
          if (resData.status === 200 || resData.status === 201) {
            Swal.fire({ title: 'ลงทะเบียนผู้ใช้สำเร็จ', icon: 'success', timer: 2000,heightAuto:false }).then(() => {
              this.authService.logout();
              this.router.navigateByUrl('/auth');
            })
          } else {
            ErrorFormHandle.showRetry(
              'เกิดข้อผิดพลาด',
              'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
              () => {
                this.startAuthenFlow();
                this.closeLoading(loadingEl);
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
              this.startAuthenFlow();
              this.closeLoading(loadingEl);
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
}
