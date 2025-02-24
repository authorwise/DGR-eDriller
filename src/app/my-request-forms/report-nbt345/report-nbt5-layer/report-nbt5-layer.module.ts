import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ReportNbt5LayerComponent } from './report-nbt5-layer.component';
import { BasicheaderModule } from 'src/app/components/layouts/basicheader/basicheader.module';
import { AtwformgroupModule } from 'src/app/components/forms/atwformgroup/atwformgroup.module';
import { AtwformcontrolModule } from 'src/app/components/forms/atwformcontrol/atwformcontrol.module';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';

@NgModule({
  
  declarations: [ReportNbt5LayerComponent],
  exports: [ReportNbt5LayerComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NzFormModule,
    NzInputModule,
    BasicheaderModule,
    AtwformgroupModule,
    AtwformcontrolModule,
    NzStepsModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzGridModule,
    NzIconModule,
    NzTableModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportNBT5LayerModule {}
