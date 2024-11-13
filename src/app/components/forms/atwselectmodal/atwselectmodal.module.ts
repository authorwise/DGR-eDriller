import { HilightedtextModule } from './../../tools/hilightedtext/hilightedtext.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AtwselectmodalComponent } from './atwselectmodal.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import { IonicModule } from '@ionic/angular';
@NgModule({
  declarations: [AtwselectmodalComponent],
  exports: [AtwselectmodalComponent],
  imports: [
    CommonModule,
    NzFormModule,
    NzIconModule,
    NzInputModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    HttpClientModule,
    NzListModule,
    NzEmptyModule,
    IonicModule,
    HilightedtextModule,
    NzSkeletonModule,
    ScrollingModule,
    ExperimentalScrollingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [provideHttpClient()] 
})
export class AtwselectmodalModule { }
