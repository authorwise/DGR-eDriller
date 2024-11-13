import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ReportNBT11T2PageRoutingModule } from "./report-nbt11-t2-routing.module";

import { ReportNBT11T2Page } from "./report-nbt11-t2.page";
import { BasicheaderModule } from "src/app/components/layouts/basicheader/basicheader.module";
import { AtwformgroupModule } from "src/app/components/forms/atwformgroup/atwformgroup.module";
import { AtwformcontrolModule } from "src/app/components/forms/atwformcontrol/atwformcontrol.module";
import { NzStepsModule } from "ng-zorro-antd/steps";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzIconModule } from "ng-zorro-antd/icon";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportNBT11T2PageRoutingModule,
    BasicheaderModule,
    AtwformgroupModule,
    AtwformcontrolModule,
    NzStepsModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzGridModule,
    NzIconModule,
  ],
  declarations: [ReportNBT11T2Page],
})
export class ReportNBT11T2PageModule {}
