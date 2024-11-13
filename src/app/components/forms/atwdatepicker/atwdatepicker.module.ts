import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AtwdatepickerComponent } from './atwdatepicker.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';

@NgModule({
  declarations: [AtwdatepickerComponent],
  exports: [AtwdatepickerComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    NzFormModule,
    NzIconModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AtwdatepickerModule { }
