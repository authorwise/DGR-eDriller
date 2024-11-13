import { HttpClientModule } from '@angular/common/http';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AtwmapmodalComponent } from './atwmapmodal.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



@NgModule({
  declarations: [AtwmapmodalComponent],
  exports: [AtwmapmodalComponent],
  imports: [
    CommonModule,
    NzIconModule,
    NzFormModule,
    FormsModule,
    NzButtonModule,
    NzInputModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AtwmapmodalModule { }
