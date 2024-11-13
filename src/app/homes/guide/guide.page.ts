import { AfterViewInit, Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoadingController, Platform } from '@ionic/angular';
import { InAppBrowser } from '@capacitor/inappbrowser';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.page.html',
  styleUrls: ['./guide.page.scss'],
})
export class GuidePage implements OnInit, AfterViewInit {
  public isLoading: boolean;
  public menuTitle = 'คู่มือประชาชน';
  public iconList = '../../assets/icon/government.svg';

  _target = '_blank';
  _options: string;
  _urlWebview = `${environment.fileHost}/dgrusermanual/manual/`;
  
 menu = [
    {
      id: "1",
      menu: "doc1",
      name: "คู่มือการขอรับใบอนุญาตเจาะน้ำบาดาลหรือใช้น้ำบาดาล กรณีเสนอคณะอนุกรรมการพิจารณา",
      "name-th": "คู่มือการขอรับใบอนุญาตเจาะน้ำบาดาลหรือใช้น้ำบาดาล กรณีเสนอคณะอนุกรรมการพิจารณา",
      "name-en": "คู่มือการขอรับใบอนุญาตเจาะน้ำบาดาลหรือใช้น้ำบาดาล กรณีเสนอคณะอนุกรรมการพิจารณา",
      menuLink: ["/", "tabs", "dgr", "homes" , "guide"],
      menuPDF: "1. การขอรับใบอนุญาตเจาะน้ำบาดาลหรือใช้น้ำบาดาล กรณีไม่เสนอคณะอนุกรรมการพิจารณา.pdf",
      menuAlt: "document1",
    },{
      id: "2",
      menu: "doc2",
      name: "คู่มือการขอรับใบอนุญาตเจาะน้ำบาดาลหรือใช้น้ำบาดาล กรณีไม่เสนอคณะอนุกรรมการพิจารณา",
      "name-th": "คู่มือการขอรับใบอนุญาตเจาะน้ำบาดาลหรือใช้น้ำบาดาล กรณีไม่เสนอคณะอนุกรรมการพิจารณา",
      "name-en": "คู่มือการขอรับใบอนุญาตเจาะน้ำบาดาลหรือใช้น้ำบาดาล กรณีไม่เสนอคณะอนุกรรมการพิจารณา",
      menuLink: ["/", "tabs", "dgr", "homes" , "guide"],
      menuPDF: "2. การขอรับใบอนุญาตเจาะน้ำบาดาลหรือใช้น้ำบาดาล กรณีเสนอคณะอนุกรรมการพิจารณา.pdf",
      menuAlt: "document2",
    },{
      id: "3",
      menu: "doc3",
      name: "คู่มือการแก้ไขใบอนุญาตประกอบกิจการน้ำบาดาล กรณีเสนอคณะอนุกรรมการพิจารณา",
      "name-th": "คู่มือการแก้ไขใบอนุญาตประกอบกิจการน้ำบาดาล กรณีเสนอคณะอนุกรรมการพิจารณา",
      "name-en": "คู่มือการแก้ไขใบอนุญาตประกอบกิจการน้ำบาดาล กรณีเสนอคณะอนุกรรมการพิจารณา",
      menuLink: ["/", "tabs", "dgr", "homes" , "guide"],
      menuPDF: "3. การแก้ไขใบอนุญาตประกอบกิจการน้ำบาดาล กรณีเสนอคณะอนุกรรมการพิจารณา.pdf",
      menuAlt: "document3",
    },
    {
      id: "4",
      menu: "doc4",
      name: "คู่มือการแก้ไขใบอนุญาตประกอบกิจการน้ำบาดาล กรณีไม่เสนอคณะอนุกรรมการฯ พิจารณา",
      "name-th": "คู่มือการแก้ไขใบอนุญาตประกอบกิจการน้ำบาดาล กรณีไม่เสนอคณะอนุกรรมการฯ พิจารณา",
      "name-en": "คู่มือการแก้ไขใบอนุญาตประกอบกิจการน้ำบาดาล กรณีไม่เสนอคณะอนุกรรมการฯ พิจารณา",
      menuLink: ["/", "tabs", "dgr", "homes" , "guide"],
      menuPDF: "4. การต่ออายุใบอนุญาตประกอบกิจการน้ำบาดาล.pdf",
      menuAlt: "document4",
    },{
      id: "5",
      menu: "doc5",
      name: "คู่มือการต่ออายุใบอนุญาตประกอบกิจการน้ำบาดาล",
      "name-th": "คู่มือการต่ออายุใบอนุญาตประกอบกิจการน้ำบาดาล",
      "name-en": "คู่มือการต่ออายุใบอนุญาตประกอบกิจการน้ำบาดาล",
      menuLink: ["/", "tabs", "dgr", "homes", "guide"],
      menuPDF: "5. คู่มือ การแก้ไขใบอนุญาตฯ ไม่เสนอคณะอนุฯ.pdf",
      menuAlt: "document5",
    },{
      id: "6",
      menu: "doc6",
      name: "การขอโอนใบอนุญาตประกอบกิจการน้ำบาดาล",
      "name-th": "การขอโอนใบอนุญาตประกอบกิจการน้ำบาดาล",
      "name-en": "การขอโอนใบอนุญาตประกอบกิจการน้ำบาดาล",
      menuLink: ["/", "tabs", "dgr", "homes", "guide"],
      menuPDF: "6. คู่มือ การขอโอนใบอนุญาต ประกอบกิจการน้ำบาดาล.pdf",
      menuAlt: "document6",
    },{
      id: "7",
      menu: "doc7",
      name: "การขอรับใบแทนใบอนุญาตประกอบกิจการน้ำบาดาล",
      "name-th": "การขอรับใบแทนใบอนุญาตประกอบกิจการน้ำบาดาล",
      "name-en": "การขอรับใบแทนใบอนุญาตประกอบกิจการน้ำบาดาล",
      menuLink: ["/", "tabs", "dgr", "homes", "guide"],
      menuPDF: "7. คู่มือ การขอรับใบแทนใบอนุญาต ประกอบกิจการน้ำบาดาล.pdf",
      menuAlt: "document7",
    },{
      id: "8",
      menu: "doc8",
      name: "การขอแจ้งการเลิกกิจการ",
      "name-th": "การขอแจ้งการเลิกกิจการ",
      "name-en": "การขอแจ้งการเลิกกิจการ",
      menuLink: ["/", "tabs", "dgr", "homes", "guide"],
      menuPDF: "8. คู่มือ การขอเลิกใช้น้ำบาดาล.pdf",
      menuAlt: "document8",
    }
    
  ];

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private platform: Platform
  ) { }
  
  ngOnInit() {
    console.log("ngOnInit : ", '');
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit : ", '');
    
  }

  openUserManual(pdfOrder: string){
    let params = ``;
    this.platform.ready().then(async (pt) => {
      // alert('platform ' + JSON.stringify(pt));
      let cordova = JSON.stringify(pt).match(/cordova/g)
      let android = JSON.stringify(pt).match(/android/g)
      if((android && android.length > 0) || (cordova && cordova.length > 0)){
        this._target = "_system";
      }
      if ((android && android.length > 0) || (cordova && cordova.length > 0)) {
        let downloadUrl = `${this._urlWebview}${pdfOrder}`
        await Browser.open({url: downloadUrl,windowName: this._target})
          .then((res: any) => console.log(res))
          .catch((error: any) => console.error(error));
      } else {
        // const browser = this.iab.create(`${this._urlWebview}${pdfOrder}`, this._target, this._options);
        await Browser.open({url: `${this._urlWebview}${pdfOrder}`,windowName: this._target})
        await InAppBrowser.addListener('browserClosed', () => {
          this.router.navigate(['/tabs/dgr/homes/guide'], { replaceUrl: true });
        });
      }

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

}