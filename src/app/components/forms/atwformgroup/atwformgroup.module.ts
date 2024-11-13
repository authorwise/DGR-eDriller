import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AtwformcolumnModule } from './../atwformcolumn/atwformcolumn.module';
import { AtwformgroupComponent } from './atwformgroup.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzDividerModule } from 'ng-zorro-antd/divider';


@NgModule({
  declarations: [AtwformgroupComponent],
  exports: [AtwformgroupComponent],
  imports: [
    CommonModule,
    NzDividerModule,
    AtwformcolumnModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AtwformgroupModule { }
