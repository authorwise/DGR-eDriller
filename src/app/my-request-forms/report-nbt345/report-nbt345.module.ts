import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportNBT345PageRoutingModule } from './report-nbt345-routing.module';

import { ReportNBT345Page } from './report-nbt345.page';
import { BasicheaderModule } from 'src/app/components/layouts/basicheader/basicheader.module';
import { AtwformgroupModule } from 'src/app/components/forms/atwformgroup/atwformgroup.module';
import { AtwformcontrolModule } from 'src/app/components/forms/atwformcontrol/atwformcontrol.module';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';

import { ReportNBT3subModule } from './report-nbt3-sub/report-nbt3-sub.module';
import { ReportNbt4PipeModule } from './report-nbt4-pipe/report-nbt4-pipe.module';
import { ReportNBT4FilterModule } from './report-nbt4-filter/report-nbt4-filter.module';
import { ReportNBT4PumpModule } from './report-nbt4-pump/report-nbt4-pump.module';
import { ReportNBT4RecoveryModule } from './report-nbt4-recovery/report-nbt4-recovery.module';
import { ReportNBT5HoleModule } from './report-nbt5-hole/report-nbt5-hole.module';
import { ReportNBT5GougeModule } from './report-nbt5-gouge/report-nbt5-gouge.module';
import { ReportNBT5FilterModule } from './report-nbt5-filter/report-nbt5-filter.module';
import { ReportNBT5LayerModule } from './report-nbt5-layer/report-nbt5-layer.module';
import { ReportNBT5PipeModule } from './report-nbt5-pipe/report-nbt5-pipe.module';
import { ReportNBT5SidesealModule } from './report-nbt5-sideseal/report-nbt5-sideseal.module';

import { NzDividerModule } from 'ng-zorro-antd/divider';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportNBT345PageRoutingModule,
    BasicheaderModule,
    AtwformgroupModule,
    AtwformcontrolModule,
    NzStepsModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzGridModule,
    NzIconModule,
    NzTableModule,
    ReportNBT3subModule,
    ReportNbt4PipeModule,
    ReportNBT4FilterModule,
    ReportNBT4PumpModule,
    ReportNBT4RecoveryModule,
    ReportNBT5HoleModule,
    ReportNBT5GougeModule,
    ReportNBT5FilterModule,
    ReportNBT5LayerModule,
    ReportNBT5PipeModule,
    ReportNBT5SidesealModule,
    NzDividerModule
  ],
  declarations: [ReportNBT345Page]
})
export class ReportNBT345PageModule {}
