import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { IonicModule } from '@ionic/angular';

import { AboutsPageRoutingModule } from './abouts-routing.module';

import { AboutsPage } from './abouts.page';

import { NzFormModule } from 'ng-zorro-antd/form';
import { BrowserModule } from '@angular/platform-browser';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AboutsPageRoutingModule,
    NzAvatarModule,
    NzGridModule,
    NzFormModule,
    NzSpinModule
  ],
  declarations: [AboutsPage]
})
export class AboutsPageModule { }
