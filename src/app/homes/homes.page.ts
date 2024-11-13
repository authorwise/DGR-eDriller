import { Router } from '@angular/router';

import { Component, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { getApiGEDrillerConfigByKey } from '../models/form.dic';
import { LoadingController } from '@ionic/angular';
import { MastercacheService } from '../share/mastercache.service';
import { AxiosRequestConfig } from 'axios';
import axios from "axios-observable";
import Swal from "sweetalert2";
import moment from 'moment';
import { MenuHendleService } from '../share/menu-hendle.service';
@Component({
  selector: 'app-homes',
  templateUrl: './homes.page.html',
  styleUrls: ['./homes.page.scss'],
})
export class HomesPage implements OnInit {
  certificateExpire = false;
  subscription: any;
  menu = [
    {
      id: '1',
      menu: 'note',
      name: 'ดำเนินการ',
      'name-th': 'ดำเนินการ',
      'name-en': 'ดำเนินการ',
      menuImg: '../../assets/icon-menu/note.svg',
      menuLink: ['/', 'tabs', 'dgr', 'my-request-forms'],
      menuAlt: 'Note',
      disabledMenu: this.certificateExpire
    }, {
      id: '2',
      menu: 'manual',
      name: 'คู่มือประชาชน',
      'name-th': 'คู่มือประชาชน',
      'name-en': 'คู่มือประชาชน',
      menuImg: '../../assets/icon-menu/manual.svg',
      menuLink: ['/', 'tabs', 'dgr', 'homes', 'guide'],
      menuAlt: 'Manual',
      disabledMenu: 'false'
    }, {
      id: '3',
      menu: 'Promotion',
      name: 'ข่าวประชาสัมพันธ์',
      'name-th': 'ข่าวประชาสัมพันธ์',
      'name-en': 'ข่าวประชาสัมพันธ์',
      menuImg: '../../assets/icon-menu/promotion.svg',
      menuLink: ['/', 'tabs', 'dgr', 'homes', 'dgr-news'],
      menuAlt: 'Promotion',
      disabledMenu: 'false'
    }, {
      id: '4',
      menu: 'Contact',
      name: 'ติดต่อกรม',
      'name-th': 'ติดต่อกรม',
      'name-en': 'ติดต่อกรม',
      menuImg: '../../assets/icon-menu/contact.svg',
      menuLink: ['/', 'tabs', 'dgr', 'homes', 'contact-dgr'],
      menuAlt: 'Contact',
      disabledMenu: 'false'
    }
  ]

  isLoading = false;
  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private masterCacheService: MastercacheService,
    private storage: Storage,
    private menuHendle: MenuHendleService) {
    this.subscription = this.menuHendle.getCertificateExpire()
      .subscribe(item => {
        this.selectedNavItem(item)
        console.log('itemMenu ', item)
        this.menu = [
          {
            id: '1',
            menu: 'note',
            name: 'ดำเนินการ',
            'name-th': 'ดำเนินการ',
            'name-en': 'ดำเนินการ',
            menuImg: '../../assets/icon-menu/note.svg',
            menuLink: ['/', 'tabs', 'dgr', 'my-request-forms'],
            menuAlt: 'Note',
            disabledMenu: this.certificateExpire
          }, {
            id: '2',
            menu: 'manual',
            name: 'คู่มือประชาชน',
            'name-th': 'คู่มือประชาชน',
            'name-en': 'คู่มือประชาชน',
            menuImg: '../../assets/icon-menu/manual.svg',
            menuLink: ['/', 'tabs', 'dgr', 'homes', 'guide'],
            menuAlt: 'Manual',
            disabledMenu: 'false'
          }, {
            id: '3',
            menu: 'Promotion',
            name: 'ข่าวประชาสัมพันธ์',
            'name-th': 'ข่าวประชาสัมพันธ์',
            'name-en': 'ข่าวประชาสัมพันธ์',
            menuImg: '../../assets/icon-menu/promotion.svg',
            menuLink: ['/', 'tabs', 'dgr', 'homes', 'dgr-news'],
            menuAlt: 'Promotion',
            disabledMenu: 'false'
          }, {
            id: '4',
            menu: 'Contact',
            name: 'ติดต่อกรม',
            'name-th': 'ติดต่อกรม',
            'name-en': 'ติดต่อกรม',
            menuImg: '../../assets/icon-menu/contact.svg',
            menuLink: ['/', 'tabs', 'dgr', 'homes', 'contact-dgr'],
            menuAlt: 'Contact',
            disabledMenu: 'false'
          }
        ]
      });
  }
  selectedNavItem(item: boolean) {
    this.certificateExpire = item;
  }
  test(){
    this.menu = []
  }
  ngOnInit() {
    const navigation = this.router.getCurrentNavigation() as any;

    if (navigation.extras.state && navigation.extras.state.redirectTo) {
      this.router.navigateByUrl(navigation.extras.state.redirectTo)
    }

    this.masterCacheService.preLoadRegisterGWDriller((res: any) => {
      console.log('preLoadGWDriller', res);
      if (!res.error && res.data[0]) {
        // this.gwDriller = <IGWDriller>res.data[0];
      } else {
        // Swal.fire({ title: 'ไม่สามารถดึงข้อมูลช่างเจาะได้ กรุณาลองใหม่อีกครั้ง', icon: 'error', timer: 2000 }).then(() => {
        //   this.closeLoading(loadingEl);
        //   this.router.navigate(['/tabs/dgr/my-request-forms'], { replaceUrl: true });
        // })
      }
    })
    this.loadCheckedDriller();

  }

  ionViewWillEnter() {
    // this.testData.fetchData();
  }

  openHome() {

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
        async (resData:any) => {
          console.log('resData ', resData)
          if (
            ((resData.status === 200 || resData.status === 201) && resData.data.size === 1)
          ) {
            console.log(resData.status,resData.data.size)
            let gwDrillerID = resData.data.data[0].gwDrillerID;
            let gwDrillerUsername = resData.data.data[0].gwDrillerUsername;
            this.fetchFormData(gwDrillerID, gwDrillerUsername);
          } else {
            Swal.fire({ title: 'ข้อผิดพลาด...',html:'ไม่สามารถดึงข้อมูลใบอนุญาตได้', icon: 'error', timer: 2000, heightAuto:false })
              .then(() => {
                // this.router.navigate(['/tabs/dgr/my-request-forms'], { replaceUrl: true });
              })
          }
        },
        (error) => {
        }
      )
  }


  async fetchFormData(gwDrillerID:any, gwDrillerUsername:any) {
    // let data =  await this.storage.get('user:me:desc')
    let data = await this.storage.get('authToken')
    console.log('this.storage.set (', JSON.parse(data))

    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: "กำลังดึงข้อมูลใบอนุญาต...",
      })
      .then(async (loadingEl: any) => {
        loadingEl.present();
        const config = getApiGEDrillerConfigByKey(
          "list_mtGWDrillerForFormLMobile"
        ) as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys(
          "sult"
        );
        config.headers["Authorization"] = "Basic " + userSult;
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        // + "?id=" + this.licenseID
        // +'?gwDrillerID='+gwDrillerID
        axios.get(config.url + '?gwDrillerID=' + gwDrillerID, axiosConfig).subscribe(
          (resData) => {
            this.closeLoading(loadingEl);
            console.log("resData : ", resData);
            if (resData.data.size === 1) {
              console.log(resData.data.data[0].certificateExpireDate)
              console.log(moment().format("YYYY-MM-DD"))

              let certificateExpireDate = resData.data.data[0].certificateExpireDate;
              let dateNow = moment().format("YYYY-MM-DD")
              if (dateNow > certificateExpireDate) {
                this.menuHendle.setCertificateExpire(true);
                Swal.fire({ title: 'ใบอนุญาตหมดอายุ', html: "เพิ่มใบอนุญาตใหม่?", icon: 'warning', timer: 2000 ,heightAuto:false})
                  .then(() => {
                    this.router.navigate(['/tabs/dgr/abouts/edit-gwdriller'], { queryParams: { gwDrillerID: gwDrillerID, gwDrillerUsername: gwDrillerUsername } });
                  })
                console.log('true')
              } else {
                this.menuHendle.setCertificateExpire(false);
              }
              // this.setFormVal(resData.data.data[0]);
            } else if (resData.data.size === 0) {
              this.menuHendle.setCertificateExpire(true);
              Swal.fire({ title: 'ใบอนุญาตหมดอายุ', html: "เพิ่มใบอนุญาตใหม่?", icon: 'warning', confirmButtonText: 'Yes', showCancelButton: true,heightAuto:false })
                .then(data => {
                  console.log(data)
                  if(data.isConfirmed == true){
                    this.router.navigate(['/tabs/dgr/abouts/edit-gwdriller'], { queryParams: { gwDrillerID: gwDrillerID, gwDrillerUsername: gwDrillerUsername } });
                  }
                })
            } else {
              this.menuHendle.setCertificateExpire(false);
            }
          },
          (error) => {
            this.closeLoading(loadingEl);
            Swal.fire({ title: 'ข้อผิดพลาด...',html:'ไม่สามารถดึงข้อมูลใบอนุญาตได้', icon: 'error', heightAuto:false })
          }
        );
      });
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
