import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { AtwformcontrolModule } from './../../../components/forms/atwformcontrol/atwformcontrol.module';
import { AtwformgroupModule } from './../../../components/forms/atwformgroup/atwformgroup.module';
import { BasicheaderModule } from './../../../components/layouts/basicheader/basicheader.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestRenewalLicensePageRoutingModule } from './request-renewal-license-routing.module';

import { RequestRenewalLicensePage } from './request-renewal-license.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestRenewalLicensePageRoutingModule,
    BasicheaderModule,
    AtwformgroupModule,
    AtwformcontrolModule,
    NzStepsModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzGridModule,
    NzIconModule
  ],
  declarations: [RequestRenewalLicensePage]
})
export class RequestRenewalLicensePageModule {}
