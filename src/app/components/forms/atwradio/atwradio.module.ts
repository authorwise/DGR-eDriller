import { ReactiveFormsModule } from '@angular/forms';
import { AtwradioComponent } from './atwradio.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';


@NgModule({
  declarations: [AtwradioComponent],
  exports: [AtwradioComponent],
  imports: [
    CommonModule,
    NzDividerModule,
    NzRadioModule,
    NzToolTipModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AtwradioModule { }
