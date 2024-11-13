import { AtwmapmodalModule } from './../atwmapmodal/atwmapmodal.module';
import { AtwmappickerComponent } from './atwmappicker.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [AtwmappickerComponent],
  exports: [AtwmappickerComponent],
  imports: [
    CommonModule,
    AtwmapmodalModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AtwmappickerModule { }
