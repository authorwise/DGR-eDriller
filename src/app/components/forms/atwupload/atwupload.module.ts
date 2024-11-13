import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AtwuploadComponent } from './atwupload.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
@NgModule({
  declarations: [AtwuploadComponent],
  exports: [AtwuploadComponent],
  imports: [
    CommonModule,
    NzUploadModule,
    NzIconModule,
    NzButtonModule,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzModalModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AtwuploadModule { }
