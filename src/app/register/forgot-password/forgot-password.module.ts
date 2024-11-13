import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotPasswordPageRoutingModule } from './forgot-password-routing.module';
import { AtwformgroupModule } from 'src/app/components/forms/atwformgroup/atwformgroup.module';
import { AtwformcontrolModule } from 'src/app/components/forms/atwformcontrol/atwformcontrol.module';

import { ForgotPasswordPage } from './forgot-password.page';
import { BasicheaderModule } from '../../components/layouts/basicheader/basicheader.module'
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotPasswordPageRoutingModule,
    BasicheaderModule,
    ReactiveFormsModule,
    NzGridModule,
    NzButtonModule,
    AtwformgroupModule,
    AtwformcontrolModule
  ],
  declarations: [ForgotPasswordPage],
})
export class ForgotPasswordPageModule {}
