import { AtwPopupSelectModalModule } from './../atw-popup-select-modal/atw-popup-select-modal.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AtwpopupselectboxComponent } from './atwpopupselectbox.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';



@NgModule({
  declarations: [AtwpopupselectboxComponent],
  exports: [AtwpopupselectboxComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    NzFormModule,
    NzIconModule,
    AtwPopupSelectModalModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AtwpopupselectboxModule { }
