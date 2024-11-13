import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { IFormElement, IFormPreFetch } from 'src/app/models/formcontrol';
import { MastercacheService } from 'src/app/share/mastercache.service';
import { toFormData } from 'src/app/tools/form';
import FormData from "form-data";
import axios from "axios-observable";
import Swal from "sweetalert2";
import formData from "../../../json/editGWDrillerId.json";
import { FlowServiceService } from 'src/app/share/flow-service.service';
import { ErrorFormHandle } from 'src/app/share/error-handle';
import { getApiGEDrillerConfigByKey } from 'src/app/models/form.dic';
import { AxiosRequestConfig } from 'axios';
import { Storage } from '@ionic/storage';
import { MenuHendleService } from 'src/app/share/menu-hendle.service';

@Component({
  selector: 'app-edit-gwdriller',
  templateUrl: './edit-gwdriller.page.html',
  styleUrls: ['./edit-gwdriller.page.scss'],
})
export class EditGwdrillerPage implements OnInit {

  formObjElm: IFormElement;
  validateForm: FormGroup;
  stepValidateForm: FormGroup[] = [];
  preFetch: IFormPreFetch[];
  private recordID: string;
  private processID: string;
  private gwDrillerID: string;
  private gwDrillerUsername: string;
  
  private id: string;
  currentStep = 1;
  formHook = {};
  refElm = {};

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private masterCacheService: MastercacheService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private flowService: FlowServiceService,
    private storage: Storage,
    private route: ActivatedRoute,
    private menuHendle: MenuHendleService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params : any) => {
      console.log(params); // { order: "popular" }
      this.gwDrillerID = params.gwDrillerID
      this.gwDrillerUsername = params.gwDrillerUsername
      // console.log(this.order); // popular
    }
  );
    this.formObjElm = { ...JSON.parse(formData.json) };
    // console.log(this.formObjElm);
    this.validateForm = this.fb.group({});
    this.stepValidateForm.push(this.fb.group({}));
    this.preFetch = [];
    // this.preHooks();
  }


  async loadCheckedDriller() {
    const config = getApiGEDrillerConfigByKey('list_registerGWDriller') as any;
    const userSult = await this.masterCacheService.getUserInfoByKeys('sult');
    config.headers["Authorization"] = "Basic " + userSult;
    const axiosConfig: AxiosRequestConfig = {
      headers: config.headers,
    };
    axios.get(config.url, axiosConfig)
      .subscribe(
        async (resData) => {
          console.log('resData ', resData)
          if (
            (resData.status === 200 || resData.status === 201 && resData.data.size === 1)
          ) {
            this.gwDrillerID = resData.data.data[0].gwDrillerID;
            this.gwDrillerUsername = resData.data.data[0].gwDrillerUsername;
            console.log()
          
          } else {
            Swal.fire({ title: 'ข้อผิดพลาด...', html: "ไม่สามารถดึงข้อมูลใบอนุญาตได้", icon: 'error', timer: 2000,heightAuto:false })
              .then(() => {
                // this.router.navigate(['/tabs/dgr/my-request-forms'], { replaceUrl: true });
              })
          }
        },
        (error) => {
        }
      )
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
      this.fetchFormData();
    }
  }

  async fetchFormData() {
    // let data =  await this.storage.get('user:me:desc')
    let data =  await this.storage.get('authToken')
    console.log('this.storage.set (', JSON.parse(data))
    this.gwDrillerID = this.validateForm.get("gwDrillerID")?.value
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: "กำลังดึงข้อมูลใบอนุญาต...",
      })
      .then(async (loadingEl: any) => {
        loadingEl.present();
        const config = getApiGEDrillerConfigByKey(
          "list_mtGWDrillerCheck"
        ) as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys(
          "sult"
        );
        config.headers["Authorization"] = "Basic " + userSult;
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        // + "?id=" + this.licenseID
        axios.get(config.url+'?gwDrillerID='+this.gwDrillerID, axiosConfig).subscribe(
          (resData) => {
            this.closeLoading(loadingEl);
            console.log("resData : ", resData);
            if(resData.data.size === 1){
              this.id = resData.data.data[0].id
              this.updateDrillerInfo()
            }else{
              Swal.fire({ title: 'ข้อผิดพลาด...', html: "ไม่สามารถดึงข้อมูลใบอนุญาตได้", icon: 'error', timer: 2000 , heightAuto:false})
              .then(() => {
                // this.router.navigate(['/tabs/dgr/my-request-forms'], { replaceUrl: true });
              })
            }
          },
          (error) => {
            this.closeLoading(loadingEl);
            Swal.fire({ title: 'ข้อผิดพลาด...', html: "ไม่สามารถดึงข้อมูลใบอนุญาตได้", icon: 'error', heightAuto:false})
          }
        );
      });
  }

  updateDrillerInfo() {
    const userInfo = this.createFormData(this.id, this.gwDrillerID, this.gwDrillerUsername);
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'กำลังแก้ไขข้อมูล กรุณารอสักครู่...' })
      .then(async loadingEl => {
        loadingEl.present();
        const config = getApiGEDrillerConfigByKey("editGWDriller") as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys("sult");
        config.headers["Authorization"] = "Basic " + userSult;
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios.post(config.url, userInfo, axiosConfig)
        .subscribe(resData => {
          this.closeLoading(loadingEl);
          if (resData.status === 200 || resData.status === 201) {
            this.menuHendle.setCertificateExpire(false);
            Swal.fire({ title: 'แก้ไขข้อมูลสำเร็จ', icon: 'success', timer: 2000,heightAuto:false }).then(() => {
              this.router.navigate(['/tabs/dgr/homes'], { replaceUrl: true });
            })
          } else {
            ErrorFormHandle.showRetry(
              'เกิดข้อผิดพลาด',
              'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
              () => {
                this.closeLoading(loadingEl);
                this.updateDrillerInfo();
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
              this.updateDrillerInfo();
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

  closeLoading(el: any = null) {
    if (el) {
      el.dismiss();
    } else {
      this.loadingCtrl.dismiss();
    }
    this.isLoading = false;
  }

  createFormData(id: string, gwDrillerID: string, gwDrillerUsername: string ): FormData {
    for (const form of this.preFetch) {
      if (form.hasValue.indexOf("#currentUser.username#") === 0) {
        this.validateForm.get(form.formId)?.setValue(gwDrillerUsername);
      }
    }
    const formData = toFormData(this.validateForm.value);
    formData.append("id", id);
    console.log("form : ", this.validateForm);
    console.log("form data : ", formData);

    return formData;
  }
}
