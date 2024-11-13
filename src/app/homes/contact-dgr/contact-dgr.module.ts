import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactDgrPageRoutingModule } from './contact-dgr-routing.module';

import { ContactDgrPage } from './contact-dgr.page';

import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactDgrPageRoutingModule,
    NzGridModule,
    NzIconModule,
    NzListModule,
    NzSpinModule,
  ],
  declarations: [ContactDgrPage]
})
export class ContactDgrPageModule {}
