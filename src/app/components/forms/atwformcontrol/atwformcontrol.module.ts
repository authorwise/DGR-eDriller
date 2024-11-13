import { NzInputModule } from 'ng-zorro-antd/input';
import { AtwpopupselectboxModule } from './../atwpopupselectbox/atwpopupselectbox.module';
import { AtwmappickerModule } from './../atwmappicker/atwmappicker.module';
import { AtwspreadsheetpickerModule } from './../atwspreadsheetpicker/atwspreadsheetpicker.module';
import { AtwhiddenModule } from './../atwhidden/atwhidden.module';
import { AtwselectModule } from './../atwselect/atwselect.module';
import { AtwuploadModule } from './../atwupload/atwupload.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

import { AtwcheckboxModule } from './../atwcheckbox/atwcheckbox.module';
import { AtwdatepickerModule } from './../atwdatepicker/atwdatepicker.module';
import { AtwradioModule } from './../atwradio/atwradio.module';
import { AtwformcontrolComponent } from './atwformcontrol.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@NgModule({
  declarations: [AtwformcontrolComponent],
  exports: [AtwformcontrolComponent],
  imports: [
    CommonModule,
    NzFormModule,
    AtwradioModule,
    NzDatePickerModule,
    AtwdatepickerModule,
    AtwcheckboxModule,
    AtwuploadModule,
    FormsModule,
    ReactiveFormsModule,
    AtwselectModule,
    AtwhiddenModule,
    AtwmappickerModule,
    AtwpopupselectboxModule,
    NzInputModule,
    AtwspreadsheetpickerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AtwformcontrolModule { }
