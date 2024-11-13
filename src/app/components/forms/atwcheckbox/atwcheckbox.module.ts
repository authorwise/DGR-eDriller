import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AtwcheckboxComponent } from './atwcheckbox.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';



@NgModule({
  declarations: [AtwcheckboxComponent],
  exports: [AtwcheckboxComponent],
  imports: [
    CommonModule,
    NzCheckboxModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AtwcheckboxModule { }
