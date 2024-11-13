import { AtwselectmodalModule } from './../atwselectmodal/atwselectmodal.module';
import { AtwselectComponent } from './atwselect.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [AtwselectComponent],
  exports: [AtwselectComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    NzFormModule,
    NzIconModule,
    AtwselectmodalModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AtwselectModule { }
