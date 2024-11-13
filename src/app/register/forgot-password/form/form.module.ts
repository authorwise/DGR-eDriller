import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormPageRoutingModule } from './form-routing.module';

import { FormPage } from './form.page';
import { AtwformgroupModule } from 'src/app/components/forms/atwformgroup/atwformgroup.module';
import { AtwformcontrolModule } from 'src/app/components/forms/atwformcontrol/atwformcontrol.module';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormPageRoutingModule,
    AtwformgroupModule,
    AtwformcontrolModule,
    NzStepsModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzGridModule,
    NzIconModule,
    NzTableModule,
  ],
  declarations: [FormPage]
})
export class FormPageModule {}
