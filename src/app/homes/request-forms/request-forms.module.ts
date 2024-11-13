import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestFormsPageRoutingModule } from './request-forms-routing.module';

import { RequestFormsPage } from './request-forms.page';

import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ScrollingModule } from '@angular/cdk-experimental/scrolling';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NzGridModule,
    NzIconModule,
    NzListModule,
    NzSpinModule,
    RequestFormsPageRoutingModule,
    ScrollingModule,
    NzEmptyModule,
    ExperimentalScrollingModule,
  ],
  declarations: [RequestFormsPage]
})
export class RequestFormsPageModule {}
