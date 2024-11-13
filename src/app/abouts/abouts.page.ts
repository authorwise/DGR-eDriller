import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { LoadingController } from "@ionic/angular";

import axios from 'axios-observable';
import { AxiosRequestConfig } from 'axios';
import Swal from 'sweetalert2';
import { getApiConfigByKey, getApiGEDrillerConfigByKey } from "../models/form.dic";
import { MastercacheService } from "../share/mastercache.service";
import { IUserInfo } from "../models/formcontrol";
import { Router } from "@angular/router";

@Component({
  selector: "app-abouts",
  templateUrl: "./abouts.page.html",
  styleUrls: ["./abouts.page.scss"],
})
export class AboutsPage implements OnInit {
  public isLoading: boolean;
  userFullname: string;
  userFirstname: string;
  userLastname: string;
  validateForm!: FormGroup;
  submitForm(): void {
    console.log("submit");
  }
  gwDrillerID: string;

  menu = [
    {
      id: "1",
      menu: "editProfile",
      name: "แก้ไขข้อมูลส่วนตัว",
      "name-th": "แก้ไขข้อมูลส่วนตัว",
      "name-en": "แก้ไขข้อมูลส่วนตัว",
      menuImg: "../assets/icon/setting-menu/conversation.svg",
      menuLink: ["/", "tabs", "dgr", "abouts", "edit-profile"],
      menuAlt: "Edit Profile",
    },
    // {
    //   id: "2",
    //   menu: "changePassword",
    //   name: "เปลี่ยนรหัสผ่าน",
    //   "name-th": "เปลี่ยนรหัสผ่าน",
    //   "name-en": "เปลี่ยนรหัสผ่าน",
    //   menuImg: "../assets/icon/setting-menu/lock.svg",
    //   menuLink: ["/", "tabs", "dgr", "abouts"],
    //   menuAlt: "Change Password",
    // },
    // {
    //   id: "3",
    //   menu: "myBillTo",
    //   name: "ข้อมูลที่อยู่ใบแจ้งหนี้",
    //   "name-th": "ข้อมูลที่อยู่ใบแจ้งหนี้",
    //   "name-en": "ข้อมูลที่อยู่ใบแจ้งหนี้",
    //   menuImg: "../assets/icon/setting-menu/bookmark.svg",
    //   menuLink: ["/", "tabs", "dgr", "abouts"],
    //   menuAlt: "My BillTo",
    // },
    // {
    //   id: "4",
    //   menu: "myLicense",
    //   name: "ข้อมูลใบอนุญาต",
    //   "name-th": "ข้อมูลใบอนุญาต",
    //   "name-en": "ข้อมูลใบอนุญาต",
    //   menuImg: "../assets/icon/setting-menu/experience.svg",
    //   menuLink: ["/", "tabs", "dgr", "abouts"],
    //   menuAlt: "My License",
    // },
    // {
    //   id: "5",
    //   menu: "myRequest",
    //   name: "ข้อมูลคำขอ",
    //   "name-th": "ข้อมูลคำขอ",
    //   "name-en": "ข้อมูลคำขอ",
    //   menuImg: "../assets/icon/setting-menu/document.svg",
    //   menuLink: ["/", "tabs", "dgr", "my-request-forms"],
    //   menuAlt: "My Request",
    // },
    // {
    //   id: "6",
    //   menu: "setting",
    //   name: "ตั้งค่า",
    //   "name-th": "ตั้งค่า",
    //   "name-en": "ตั้งค่า",
    //   menuImg: "../assets/icon/setting-menu/settings.svg",
    //   menuLink: ["/", "tabs", "dgr", "abouts"],
    //   menuAlt: "Setting",
    // },
    {
      id: "7",
      menu: "editGWDriller",
      name: "เพิ่มทะเบียนช่างเจาะ",
      "name-th": "เพิ่มทะเบียนช่างเจาะ",
      "name-en": "เพิ่มทะเบียนช่างเจาะ",
      menuImg: "../assets/icon/setting-menu/document.svg",
      menuLink: ["/", "tabs", "dgr", "abouts", "edit-gwdriller"],
      menuAlt: "Edit GWDriller",
    },
  ];

  ionViewWillEnter() {
    this.isLoading = true;
  }

  ionViewDidEnter() {
    this.isLoading = false;
  }

  ionViewWillLeave() {}

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private masterCacheService: MastercacheService,
    private router: Router,
  ) {}

  ngOnInit() {
    console.log("ngOnInit : ", '');
    this.loadCheckedDriller();
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit : ", '');
  }

 
  async onLogout() {
    await this.authService.logout();
    await this.router.navigate(['/auth'], { replaceUrl: true });
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
            ((resData.status === 200 || resData.status === 201) && resData.data.size === 1)
          ) {
            this.gwDrillerID = resData.data.data[0].gwDrillerID;
            this.userFullname = resData.data.data[0].firstname + " " + resData.data.data[0].lastname;
            console.log()
          } else {
            Swal.fire({ title: 'ข้อผิดพลาด...', html: "ไม่สามารถดึงข้อมูลใบอนุญาตได้", icon: 'error', timer: 2000,heightAuto:false })
              .then(() => {
                this.router.navigate(['/tabs/dgr/my-request-forms'], { replaceUrl: true });
              })
          }
        },
        (error) => {
        }
      )
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
