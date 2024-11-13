import { Component, OnInit, AfterViewInit } from '@angular/core';
import Swal from 'sweetalert2';
import { LoadingController, Platform } from '@ionic/angular';
import axios from "axios-observable";
import { environment } from 'src/environments/environment';
import { IAjaxSendConfig } from 'src/app/models/formcontrol';
import { AxiosRequestConfig } from 'axios';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { InAppBrowser } from '@capacitor/inappbrowser';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-dgr-news',
  templateUrl: './dgr-news.page.html',
  styleUrls: ['./dgr-news.page.scss'],
})
export class DgrNewsPage implements OnInit, AfterViewInit {
  isLoading = false;
  menuTitle = 'ข่าวประชาสัมพันธ์';
  newsPage = '17';
  // rssContents: string;
  rssContents:any[] = [];
  _target = '_blank';
  _options: string;
  _urlWebview = '';

  constructor(
    private loadingCtrl: LoadingController,
    private _http: HttpClient,
    private platform: Platform
  ) { }
  
  ngOnInit() {

  }

  ngAfterViewInit() {
    this.fetchRssNews();
    
  }

  fetchRssNews() {
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: "กำลังดึงข้อมูล...",
      })
      .then((loadingEl: any) => {
        loadingEl.present();
        const headers = {
          "Accept": 'application/xml',
          "Content-Type": 'application/rss+xml',
          // "Access-Control-Allow-Origin": '*',
          // "Access-Control-Allow-Credentials": true,
          // "X-Requested-With": 'XMLHttpRequest',
          // "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,PUT,OPTIONS",
          // "Access-Control-Allow-Headers": "*",
          // "useCredentails": true,
        };
        const axiosConfig: AxiosRequestConfig = {
          headers: headers,
        };

        //environment.dgrNews + '/' + this.newsPage
        // let fetchRssUrl = environment.dgrNews + '/' + this.newsPage;
        // let fetchRssUrl = 'https://www.bot.or.th/App/RSS/fxrate-all.xml';
        // let fetchRssUrl = 'https://devdactic.com/feed/';
        let fetchRssUrl = environment.dgrNews + '/' + 'dgrnews/index.php?news=' + this.newsPage;

        axios.get(fetchRssUrl, axiosConfig)
        .subscribe((resData) => {
            console.log('fetchRssNews', resData)
            this.closeLoading(loadingEl);
            if (
              (resData.status === 200 || resData.status === 201) &&
              resData.data
            ) {
              this.rssContents = resData.data;
            } else {
              Swal.fire({ title: '',html:'ไม่พบข้อมูล', icon: 'warning', heightAuto:false })
            }
          },
          (error) => {
            this.closeLoading(loadingEl);
            // Swal.fire("ข้อผิดพลาด...", "ไม่สามารถดึงข้อมูล" + this.menuTitle + " : " + error, "error");
            Swal.fire({ title: 'ข้อผิดพลาด...',html:'ไม่สามารถดึงข้อมูล', icon: 'error', heightAuto:false })
          }
        );
        // this._http.get(fetchRssUrl, options).subscribe((res: any) => {
        //   console.log('res', res)
        // })
      });
  }

  openNews(link: string){
    let params = ``;
    this._urlWebview = link;
    this.platform.ready().then(async (pt) => {
      // alert('platform' + JSON.stringify(pt));
      await Browser.open({url: `${this._urlWebview}`,windowName: this._target})
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
