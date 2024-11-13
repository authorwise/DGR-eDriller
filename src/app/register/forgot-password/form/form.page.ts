import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";

import formData from "../../../../json/forgotPasswordMobile.json";
import { IFormElement, IFormPreFetch } from "src/app/models/formcontrol";
import { FormGroup, FormBuilder } from "@angular/forms";
import { IonContent, LoadingController, ModalController } from "@ionic/angular";
import { toFormData } from "src/app/tools/form";
import { getApiConfigByKey } from "src/app/models/form.dic";
import { MastercacheService } from "src/app/share/mastercache.service";
import axios from "axios-observable";
import { AxiosRequestConfig } from "axios";
import Swal from "sweetalert2";
import { Md5 } from 'ts-md5'

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit, AfterViewInit {
  formObjElm: IFormElement;
  validateForm: FormGroup;
  stepValidateForm: FormGroup[];
  preFetch: IFormPreFetch[];
  currentStep = 1;
  formHook = {};
  private uName: string;

  @ViewChild(IonContent, { static: false }) content: IonContent;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
  ) { }
  
  ngOnInit() {
    this.uName = this.activatedRoute.snapshot.paramMap.get("username") as any;
    console.log("formId : ", this.uName);
    this.formObjElm = { ...JSON.parse(formData.json) };
    this.validateForm = this.fb.group({});
    this.preFetch = [];
  }

  ngAfterViewInit() {
    
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
    const p = this.validateForm.get('password')?.value;
    const conP = this.validateForm.get('confirmPassword')?.value;
    if(p === conP){
      this.resetPassword();
    }else{
      Swal.fire({ title: 'รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบ', icon: 'error', timer: 2000,heightAuto:false }).then(() => {
        return;
      })
    }
  }

  resetPassword (){
    const p = this.validateForm.get('password')?.value;
    const username = this.uName;
    const md5P = Md5.hashStr(p)
    console.log('md5P', md5P);
    const data = {
      id: username,
      password: p
    }
    console.log('JSON', JSON.stringify(data));
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'กำลังตรวจสอบ กรุณารอสักครู่...' })
      .then(loadingEl => {
        loadingEl.present();
        const config = getApiConfigByKey("checkUser") as any;
        config.headers["Accept"] = 'application/json';
        config.headers["Access-Control-Allow-Origin"] = '*';
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios.put(config.url, data, axiosConfig)
        .subscribe(resData => {
          loadingEl.dismiss();
          console.log('resetPassword',resData, resData.data.size);
          if (resData.status === 200 || resData.status === 201) {
            Swal.fire({ title: 'กำหนดรหัสผ่านใหม่ผู้ใช้สำเร็จ', icon: 'success', timer: 2000,heightAuto:false }).then(() => {
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
