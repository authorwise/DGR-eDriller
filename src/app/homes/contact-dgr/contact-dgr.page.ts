import { AfterViewInit, Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoadingController, Platform } from '@ionic/angular';
import { InAppBrowser } from '@capacitor/inappbrowser';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-contact-dgr',
  templateUrl: './contact-dgr.page.html',
  styleUrls: ['./contact-dgr.page.scss'],
})
export class ContactDgrPage implements OnInit, AfterViewInit {

  public isLoading: boolean;
  public menuTitle = 'ติดต่อกรม';
  public iconList = '../../assets/icon/government.svg';
  public iconPin = '../../assets/icon/pin.svg';

  _target = '_blank';
  _options: string;
  _urlWebview = `http://www.dgr.go.th/th/contact`;

  menu = [
    {
      id: "1",
      menu: "list1",
      name: "กรมทรัพยากรน้ำบาดาล",
      "name-th": "กรมทรัพยากรน้ำบาดาล",
      "name-en": "กรมทรัพยากรน้ำบาดาล",
      menuLink: ["/", "tabs", "dgr", "homes" , "contact-us"],
      menuAlt: "document1",
    },{
      id: "2",
      menu: "list2",
      name: "สำนักทรัพยากรน้ำบาดาล 12 เขต",
      "name-th": "สำนักทรัพยากรน้ำบาดาล 12 เขต",
      "name-en": "สำนักทรัพยากรน้ำบาดาล 12 เขต",
      menuLink: ["/", "tabs", "dgr", "homes" , "contact-us"],
      menuAlt: "document2",
    },{
      id: "3",
      menu: "list3",
      name: "กระทรวงทรัพยากรธรรมชาติและสิ่งแวดล้อม",
      "name-th": "กระทรวงทรัพยากรธรรมชาติและสิ่งแวดล้อม",
      "name-en": "กระทรวงทรัพยากรธรรมชาติและสิ่งแวดล้อม",
      menuLink: ["/", "tabs", "dgr", "homes" , "contact-us"],
      menuAlt: "document3",
    },
    {
      id: "4",
      menu: "list4",
      name: "องค์การบริหารส่วนตำบล (จังหวัดถ่ายโอน)",
      "name-th": "องค์การบริหารส่วนตำบล (จังหวัดถ่ายโอน)",
      "name-en": "องค์การบริหารส่วนตำบล (จังหวัดถ่ายโอน)",
      menuLink: ["/", "tabs", "dgr", "homes" , "contact-us"],
      menuAlt: "document4",
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

  openContactUs(){
    let params = ``;
    this.platform.ready().then(async (pt) => {
      // alert('platform' + JSON.stringify(pt));
      await Browser.open({url: `${this._urlWebview}`,windowName: this._target})
      await InAppBrowser.addListener('browserClosed', () => {
        this.router.navigate(['/tabs/dgr/homes/contact-us'], { replaceUrl: true });
      });
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

  onClickMailTo(){
    var link = "mailto:system.dgr@gmail.com?subject=Contact%20DGR";     
    window.location.href = link;
  }

}
