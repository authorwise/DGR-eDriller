import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyRequestFormsPageRoutingModule } from './my-request-forms-routing.module';

import { MyRequestFormsPage } from './my-request-forms.page';
import { ScrollingModule } from '@angular/cdk-experimental/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyRequestFormsPageRoutingModule,
    ScrollingModule,
    NzEmptyModule,
    ExperimentalScrollingModule,
    NzDividerModule,
    NzGridModule,
    NzIconModule,
    NzListModule,
    NzIconModule,
    NzSpinModule,
    NzPaginationModule,
    NzSkeletonModule
  ],
  declarations: [MyRequestFormsPage]
})
export class MyRequestFormsPageModule { }
