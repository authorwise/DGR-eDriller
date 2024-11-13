import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DgrNewsPageRoutingModule } from './dgr-news-routing.module';

import { DgrNewsPage } from './dgr-news.page';

import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DgrNewsPageRoutingModule,
    NzGridModule,
    NzIconModule,
    NzListModule,
    NzSpinModule,
  ],
  declarations: [DgrNewsPage]
})
export class DgrNewsPageModule {}
