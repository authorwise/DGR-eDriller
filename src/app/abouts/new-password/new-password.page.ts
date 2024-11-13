import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, LoadingController } from '@ionic/angular';
import formData from "../../../json/resetPasswordMobile.json";
import { AuthService } from 'src/app/auth/auth.service';
import { IFormElement, IFormHookItems, IFormPreFetch, IUserRegister } from 'src/app/models/formcontrol';
import { MastercacheService } from 'src/app/share/mastercache.service';
import { AxiosRequestConfig } from "axios";
import axios from "axios-observable";
import Swal from "sweetalert2";
import { Md5 } from 'ts-md5'
import { getApiConfigByKey } from 'src/app/models/form.dic';


@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
})
export class NewPasswordPage implements OnInit {
  backText: string = '';
  formObjElm: IFormElement;
  validateForm: FormGroup;
  stepValidateForm: FormGroup[];
  preFetch: IFormPreFetch[];
  currentStep = 1;
  formHook = {};
  userRegister: IUserRegister;
  activityId: string;
  private uName: string;
  
  @ViewChild(IonContent, { static: false }) content: IonContent;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private masterCacheService: MastercacheService,
    public _http: HttpClient
  ) { }

  preHook(){
    this.formHook = {
      'username': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        }
      },
    }
  }
  
  ngOnInit() {
    
    console.log("formId : ", this.uName);
    this.formObjElm = { ...JSON.parse(formData.json) };
    this.validateForm = this.fb.group({});
    this.preFetch = [];
    this.preHook();
  }

  async ngAfterViewInit() {
    let v = this;
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: "กำลังดึงข้อมูลใบอนุญาต...",
      })
      .then(async (loadingEl: any) => {
        loadingEl.present();
        // const userName = await this.masterCacheService.getUserInfoByKeys(
        //   "username"
        // );
        // this.validateForm.get('username')?.setValue(userName);
        // Pre Load User

        this.activatedRoute.queryParams.subscribe((params:any) => {
          if (params && params.special && params.activityId) {
            //store the temp in data
            // this.userRegister.id = JSON.parse(params.special);
            // this.userRegister.username = JSON.parse(params.special);
            this.activityId = JSON.parse(params.activityId);
            this.validateForm.get('username')?.setValue(JSON.parse(params.special));
          }
        })
        // this.masterCacheService.preLoadCurrentUser(this.preFetch, (res) => {
        //   this.closeLoading(loadingEl);
        //   if (res.error) return;
        //   this.isLoading = false;
        //   this.userRegister = res.data;
        //   console.log('masterCacheService', res, this.userRegister)
        //   this.validateForm.get('username')?.setValue(res.data.username);
        // });
        this.closeLoading(loadingEl);
      });
    
  }

  submitForm (){
    console.log("Before form :", this.validateForm);
    for (const i of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (!this.validateForm.valid) {
      return;
    }
    this.checkUser();
    console.log("form : ", this.validateForm);
  }

  checkUser(){
    const uName = this.validateForm.get('username')?.value;
    const oP = this.validateForm.get('oldPassword')?.value;
    const p = this.validateForm.get('password')?.value;
    const conP = this.validateForm.get('confirmPassword')?.value;
    if(p !== conP){
      Swal.fire({ title: 'รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบ', icon: 'error', timer: 2000,heightAuto:false }).then(() => {
        return;
      })
    }else{
      this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'กำลังตรวจสอบ กรุณารอสักครู่...' })
      .then(loadingEl => {
        loadingEl.present();
        const config = getApiConfigByKey("sso") as any;
        config.headers["Accept"] = 'application/json';
        config.headers['Authorization'] = 'Basic ' + btoa(uName + ':' + oP);
        config.headers["Content-Type"] = 'application/json';
        config.headers['Access-Control-Allow-Origin'] = '*';
        config.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Authorization, X-Auth-Token';
        config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS';
        config.headers['Allow'] = 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS';
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios.post(config.url + '?j_username=' + uName + '&j_password=' + oP, null, axiosConfig)
        .subscribe(resData => {
          this.closeLoading(loadingEl);
          console.log('checkUser',resData, resData.data.size);
          if (resData.status === 200 || resData.status === 201) {
            // this.resetPassword();
            this.checkOldpassword();
          } else {
            Swal.fire({ title: 'ไม่พบรหัสผู้ใช้นี้ในระบบ', icon: 'error', timer: 2000,heightAuto:false }).then(() => {
              this.closeLoading(loadingEl);
            })
          }
        }, err => {
          Swal.fire({ title: 'ไม่พบรหัสผู้ใช้นี้ในระบบ', icon: 'error', timer: 2000,heightAuto:false }).then(() => {
            this.closeLoading(loadingEl);
          })
        })
      
      }).catch(err => {
        this.loadingCtrl.dismiss();
        this.isLoading = false;
      })
    }
    
    
  }

  checkOldpassword(){
    const oP = this.validateForm.get('oldPassword')?.value;
    const username = this.validateForm.get('username')?.value;
    const md5P = Md5.hashStr(oP)
    console.log('md5P', md5P);
    this.authService.authSubmit(username, oP).then(resData => {
      // this.resetPassword();
      this.completeAuthenFlow();
    }).catch(err => {
      Swal.fire({ title: 'ข้อผิดพลาด...',html:'รหัสผ่าน ของท่านไม่ถูกต้อง!', icon: 'error', heightAuto:false })
    });
  }


  resetPassword (){
    const oP = this.validateForm.get('oldPassword')?.value;
    const p = this.validateForm.get('password')?.value;
    const username = this.validateForm.get('username')?.value;
    const md5P = Md5.hashStr(p)
    console.log('md5P', md5P);
    const data = {
      id: username,
      username: username,
      password: p,
    }

    var dataTest = JSON.stringify({"id":"1809900678363","username":"1809900678363","password":"1234","firstName":"จิรวัฒน์","lastName":"เพ็ชรุพันธ์","email":"null","active":1,"timeZone":"7","locale":"th_TH"});
    const dataJSON = JSON.stringify(data);
    console.log('JSON', JSON.stringify(data));
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'กำลังตรวจสอบ กรุณารอสักครู่...' })
      .then(async loadingEl => {
        loadingEl.present();
        const config = getApiConfigByKey("user") as any;
        // const userSult = await this.masterCacheService.getUserInfoByKeys('sult');
        config.headers['Authorization'] = 'Basic ' + btoa(username + ':' + oP);
        config.headers["Accept"] = 'application/json';
        config.headers["Content-Type"] = 'application/json';
        config.headers['Access-Control-Allow-Origin'] = '*';
        config.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Authorization, X-Auth-Token';
        config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS';
        config.headers['Allow'] = 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS';
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };

        axios.put(config.url, data, axiosConfig)
        // axios.get(config.url + '/' + username, axiosConfig)
          .subscribe(resData => {
            loadingEl.dismiss();
            console.log('resetPassword', resData);
            if (resData.status === 200 || resData.status === 201) {
              this.completeAuthenFlow();
              
            } else {
              Swal.fire({ title: 'ไม่พบรหัสผู้ใช้นี้ในระบบ', icon: 'error', timer: 2000,heightAuto:false }).then(() => {
                this.closeLoading(loadingEl);
              });
            }
          }, err => {
            console.log('resetPassword', err);
            Swal.fire({ title: 'ไม่พบรหัสผู้ใช้นี้ในระบบ หรือ รหัสผ่าน ของท่านไม่ถูกต้อง!', icon: 'error', timer: 2000,heightAuto:false }).then(() => {
              this.closeLoading(loadingEl);
            });
          })
        // this._http.put(config.url, { id: username, firstName: p }, options)
        // .subscribe(data => {
        //   console.log("data", data);
        // }, error => {
        //   console.log("error", error);
        // });
      }).catch(err => {
        this.loadingCtrl.dismiss();
        this.isLoading = false;
      })
  }




  completeAuthenFlow(){
    const p = this.validateForm.get('password')?.value;
    const username = this.validateForm.get('username')?.value;

    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'กำลังตรวจสอบ กรุณารอสักครู่...' })
      .then(loadingEl => {
        loadingEl.present();
        const config = getApiConfigByKey("completeAuthenticationUsers") as any;
        config.headers["Accept"] = 'application/json';
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios.post(config.url + username+'/'+this.activityId + '?message='+btoa(username + ':' + p), null, axiosConfig)
        .subscribe(resData => {
          this.closeLoading(loadingEl);
          console.log('checkUser',resData, resData.data.size);
          if (resData.status === 200 || resData.status === 201) {
            this.authService.logout();
            Swal.fire({ title: 'กำหนดรหัสผ่านใหม่ผู้ใช้สำเร็จ', icon: 'success', timer: 2000 ,heightAuto:false}).then(() => {
              this.router.navigateByUrl('/auth');
            })
           
          } else {
            Swal.fire({ title: 'ไม่พบรหัสผู้ใช้นี้ในระบบ', icon: 'error', timer: 2000,heightAuto:false }).then(() => {
              this.closeLoading(loadingEl);
            })
          }
        }, err => {
          Swal.fire({ title: 'ไม่พบรหัสผู้ใช้นี้ในระบบ', icon: 'error', timer: 2000,heightAuto:false }).then(() => {
            this.closeLoading(loadingEl);
          })
        })
      
      }).catch(err => {
        this.loadingCtrl.dismiss();
        this.isLoading = false;
      })
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
