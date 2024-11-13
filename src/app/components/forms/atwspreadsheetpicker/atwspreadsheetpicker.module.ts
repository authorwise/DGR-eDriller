import { AtwspreadsheetpickerComponent } from './atwspreadsheetpicker.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AtwspreadsheetmodalComponent } from '../atwspreadsheetmodal/atwspreadsheetmodal.component';

@NgModule({
  declarations: [AtwspreadsheetpickerComponent,AtwspreadsheetmodalComponent],
  exports: [AtwspreadsheetpickerComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AtwspreadsheetpickerModule { }
