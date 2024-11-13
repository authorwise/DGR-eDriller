import { GoogleCloundVisionService } from './../share/google-clound-vision.service';
import { UploadImageService } from './../share/upload-image.service';
import { UserLoginDto, IUserStoreDto } from './../models/usercontrol';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { AuthService } from './auth.service';
import { IFormCtrlLoop } from './../models/formcontrol';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios-observable';
import Swal from 'sweetalert2';
import { getApiConfigByKey } from '../models/form.dic';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  @ViewChild('filePicker') filePicker: ElementRef<HTMLInputElement>;
  imgServices = new UploadImageService();
  imageDataBase64: string | File;
  usePicker = false;


  isLoading = false;
  isLogin = true;
  validateForm!: FormGroup;
  listOfControl: Array<IFormCtrlLoop> = [
    {
      id: 'f1',
      controlInstance: 'username',
      label: 'ชื่อผู้ใช้',
      placeholder: 'กรอกข้อมูลผู้ใช้',
      errorTip: 'กรุณากรอก username ที่ถูกต้อง',
      type: 'text',
      validators: [Validators.required, Validators.min(2)]
    },
    {
      id: 'f2',
      controlInstance: 'password',
      label: 'รหัสผ่าน',
      errorTip: 'กรุณากรอก password ที่ถูกต้อง',
      placeholder: 'กรอกรหัสผ่าน',
      type: 'password',
      validators: [Validators.required, Validators.min(2)]
    },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
    
    this.validateForm = this.fb.group({});

    for (const list of this.listOfControl) {
      this.validateForm.addControl(list.controlInstance, new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }));
    }
  }

  onAuthSubmit() {

    if (!this.validateForm.valid) {
      return;
    }
    for (const i of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    // this.checkAuthentication(this.validateForm.value);
    this.authentication(this.validateForm.value);
    // this.athService.login(this.validateForm.value);
  }

  checkAuthentication(formUser: UserLoginDto) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        const config = getApiConfigByKey("getAuthenticationUsers") as any;
        config.headers["Accept"] = 'application/json';
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios.get(config.url+formUser.username+'?appId=dgrEservice&processDefId=dgrEservice%23latest%23authenticationUsers&activityDefId=authenticationForm', axiosConfig)
        .subscribe(resData => {
          loadingEl.dismiss();
          if (resData.status === 200 || resData.status === 201) {
            console.log('resData : ', resData);
            console.log('resData : ', resData.data.length > 0);
           
            if(resData.data.length > 0){
              console.log('resData : ', '/new-password');
              let navigationExtras: NavigationExtras = {
                queryParams: {
                  special: JSON.stringify(formUser.username),
                  activityId: JSON.stringify(resData.data[0].activityId)
                }
              };
              this.router.navigate(['/new-password'],navigationExtras);
            } else {
              this.authentication(this.validateForm.value);
            }
            // 
            // Swal.fire({ title: 'ลงทะเบียนผู้ใช้สำเร็จ', icon: 'success', timer: 2000 }).then(() => {
            //   this.authService.logout();
            // })
          } else {
            Swal.fire({ title: 'ข้อผิดพลาด...',html:'ชื่อผู้ใช้ หรือ รหัสผ่าน ของท่านไม่ถูกต้อง!', icon: 'error', heightAuto:false })
            
          }
        }, err => {
          Swal.fire({ title: 'ข้อผิดพลาด...',html:'ชื่อผู้ใช้ หรือ รหัสผ่าน ของท่านไม่ถูกต้อง!', icon: 'error', heightAuto:false })
        })
      }).catch(err => {
        console.log(err);
      })
  }


  authentication(formUser: UserLoginDto) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        let authObs!: Observable<AxiosResponse<IUserStoreDto>>;
        if (this.isLogin) {
          authObs = this.authService.login(formUser);
        }
        authObs.subscribe(resData => {
          this.isLoading = false;
          loadingEl.dismiss();
          this.router.navigate(['/tabs/dgr/homes'], { replaceUrl: true });
        }, errRes => {
          loadingEl.dismiss();
          Swal.fire({ title: 'ข้อผิดพลาด...',html:'ชื่อผู้ใช้ หรือ รหัสผ่าน ของท่านไม่ถูกต้อง!', icon: 'error', heightAuto:false })
        });
      }).catch(err => {
        console.log(err);
      })
  }

}
