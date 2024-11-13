import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormsOtherPageRoutingModule } from './forms-other-routing.module';

import { FormsOtherPage } from './forms-other.page';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { ScrollingModule } from '@angular/cdk-experimental/scrolling';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormsOtherPageRoutingModule,
    NzGridModule,
    NzSpinModule,
    NzListModule,
    NzIconModule,
    ScrollingModule,
    NzEmptyModule,
  ],
  declarations: [FormsOtherPage]
})
export class FormsOtherPageModule {}
