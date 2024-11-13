import { AtwformcolumnComponent } from './atwformcolumn.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { AtwformcontrolModule } from '../atwformcontrol/atwformcontrol.module';
import { NzGridModule } from 'ng-zorro-antd/grid';

@NgModule({
  declarations: [AtwformcolumnComponent],
  exports: [AtwformcolumnComponent],
  imports: [
    CommonModule,
    AtwformcontrolModule,
    NzFormModule,
    NzGridModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AtwformcolumnModule { }
