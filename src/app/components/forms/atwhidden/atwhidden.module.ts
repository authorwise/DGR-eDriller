import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AtwhiddenComponent } from './atwhidden.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [AtwhiddenComponent],
  exports: [AtwhiddenComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AtwhiddenModule { }
