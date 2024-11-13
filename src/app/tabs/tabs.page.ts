import { Component, OnInit } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Router } from '@angular/router';
import { MenuHendleService } from '../share/menu-hendle.service';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  certificateExpire = false;
  subscription: any;
  constructor(
    private router: Router,
    private menuHendle: MenuHendleService) {
      this.subscription = this.menuHendle.getCertificateExpire()
      .subscribe(item => {
        this.selectedNavItem(item)
        console.log('itemMenu ', item)
      });
     }

     selectedNavItem(item: boolean) {
      this.certificateExpire = item;
    }

  ngOnInit() {
    if(Capacitor.isNativePlatform()){
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setBackgroundColor({color:'#006400'});
    StatusBar.setStyle({style:Style.Light});
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
