import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";

import { FormGroup, FormBuilder } from "@angular/forms";
import { IFormPreFetch, IFormElement } from "src/app/models/formcontrol";
import { IonContent, LoadingController } from "@ionic/angular";
import { MastercacheService } from "../../../share/mastercache.service";
import axios from "axios-observable";
import { AxiosRequestConfig } from "axios";
import Swal from "sweetalert2";
import { getApiConfigByKey } from "src/app/models/form.dic";

@Component({
  selector: "app-request-renewal-license",
  templateUrl: "./request-renewal-license.page.html",
  styleUrls: ["./request-renewal-license.page.scss"],
})
export class RequestRenewalLicensePage implements OnInit, AfterViewInit {
  public formObjElm: IFormElement;
  public preFetch: IFormPreFetch[];
  public currentStep = 1;
  public formHook = {};
  @ViewChild(IonContent, { static: false }) content: IonContent;
  public isLoading = false;
  public setSegment: any;
  public datalist: any;
  public iconDrill = '../../../assets/icon/icon_license_drill.svg';
  public iconUsage = '../../../assets/icon/icon_license_usage.svg';

  constructor(
    private fb: FormBuilder,
    private masterCacheService: MastercacheService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.setSegment = "drill";
    this.fetchLicense("drill");
  }

  //Step
  prevStep() {
    this.currentStep -= 1;
    this.scrollToTop();
  }
  nextStep() {
    this.currentStep += 1;
    this.scrollToTop();
  }
  scrollToTop() {
    this.content.scrollToTop(1000);
  }

  ngAfterViewInit() {}

  closeLoading(el: any = null) {
    if (el) {
      el.dismiss();
    } else {
      this.loadingCtrl.dismiss();
    }
    this.isLoading = false;
  }

  segmentChanged(ev: any) {
    this.setSegment = ev.detail.value;
    console.log("Segment changed : ", ev.detail.value);
    this.fetchLicense(ev.detail.value);
  }

  fetchLicense(type: any = "drill") {
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: "กำลังดึงข้อมูลใบอนุญาต...",
      })
      .then(async (loadingEl: any) => {
        loadingEl.present();
        const config = getApiConfigByKey("licenseActiveNBT21") as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys("sult");
        config.headers["Authorization"] = "Basic " + userSult;
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios.get(config.url + "?licenseType=" + type, axiosConfig).subscribe(
          (resData) => {
            this.closeLoading(loadingEl);
            if (
              (resData.status === 200 || resData.status === 201) &&
              resData.data &&
              resData.data.data &&
              resData.data.data[0]
            ) {
              // complete load data
              console.log(resData.data.data);
              this.datalist = resData.data.data;
            } else {
              Swal.fire({ title: 'ข้อผิดพลาด...',html:'ไม่สามารถดึงข้อมูลผู้ใช้ได้', icon: 'error', heightAuto:false })
            }
          },
          (error) => {
            this.closeLoading(loadingEl);
            Swal.fire({ title: 'ข้อผิดพลาด...',html:'ไม่สามารถดึงข้อมูลผู้ใช้ได้', icon: 'error', heightAuto:false })
          }
        );
      });
  }

  getDataFormat(dateStr: string, hastime = false) {
    const dateDate = new Date(dateStr);
    let res = '';
    res += dateDate.getDate() + '/';
    res += (dateDate.getMonth() + 1) + '/';
    res += dateDate.getFullYear() + 543;

    if (hastime) {
      res += ' ' + dateDate.getHours() + ':' + dateDate.getMinutes();
    }
    return res;
  }
}
