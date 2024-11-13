import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IonContent, LoadingController } from '@ionic/angular';
import formData from "src/json/checkUsernameMobile.json";
import { IFormElement, IFormPreFetch } from 'src/app/models/formcontrol';
import { toFormData } from 'src/app/tools/form';
import { Router } from '@angular/router';
import { AxiosRequestConfig } from 'axios';
import { getApiConfigByKey } from 'src/app/models/form.dic';
import axios from 'axios-observable';
import Swal from 'sweetalert2';
import { ErrorFormHandle } from 'src/app/share/error-handle';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit, AfterViewInit {
  formObjElm: IFormElement;
  validateForm: FormGroup;
  preFetch: IFormPreFetch[];
  currentStep = 1;
  formHook = {};
  isLoading = false;
  @ViewChild(IonContent, { static: false }) content: IonContent;

  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.formObjElm = { ...JSON.parse(formData.json) };
    // console.log(this.formObjElm.elements);
    this.validateForm = this.fb.group({});
    this.preFetch = [];
  }

  ngAfterViewInit (){
    
  }

  submitForm(){
    for (const i of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    console.log("Before form :", this.validateForm);
    if (!this.validateForm.valid) {
      return;
    }    

    console.log("form : ", this.validateForm);
    this.checkUser();
  }

  checkUser(){
    const frmData = this.validateForm.value;
    // if(frmData.username === 'admin' || frmData.username === 'user'){
    //   Swal.fire({ title: 'ไม่พบรหัสผู้ใช้นี้ในระบบ', icon: 'error', timer: 2000 }).then(() => {
    //     return;
    //   })
    // }
    
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'กำลังตรวจสอบ กรุณารอสักครู่...' })
      .then(loadingEl => {
        loadingEl.present();
        const config = getApiConfigByKey("checkLicenseeUserID") as any;
        config.headers["Accept"] = 'application/json';
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios.get(config.url + '?licenseeUserID=' + frmData.licenseeUserID, axiosConfig)
        .subscribe(resData => {
          loadingEl.dismiss();
          console.log('checkUser',resData, resData.data.size);
          if ((resData.status === 200 || resData.status === 201) && resData.data.size === 1) {
            const resLicenseeUserID = resData.data.data[0].licenseeUserID;
            const resLicenseeUsername = resData.data.data[0].licenseeUsername;
            console.log('resLicenseeUserID' + resLicenseeUserID + ':'  + frmData.licenseeUserID);
            if(resLicenseeUserID === frmData.licenseeUserID && resLicenseeUsername !== ''){
              this.router.navigate(['/register/forgot-password/form/' + resLicenseeUsername]);
            } else {
              Swal.fire({ title: 'ไม่พบรหัสผู้ใช้นี้ในระบบ', icon: 'error', timer: 2000,heightAuto:false }).then(() => {
                this.closeLoading(loadingEl);
              })
            }
            
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

  closeLoading(el: any) {
    if (el) {
      el.dismiss();
    } else {
      this.loadingCtrl.dismiss();
    }
    this.isLoading = false;
  }


}
