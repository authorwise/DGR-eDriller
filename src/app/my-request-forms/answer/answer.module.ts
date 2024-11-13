import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnswerPageRoutingModule } from './answer-routing.module';

import { AnswerPage } from './answer.page';
import { BasicheaderModule } from 'src/app/components/layouts/basicheader/basicheader.module';
import { AtwformgroupModule } from 'src/app/components/forms/atwformgroup/atwformgroup.module';
import { AtwformcontrolModule } from 'src/app/components/forms/atwformcontrol/atwformcontrol.module';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnswerPageRoutingModule,
    BasicheaderModule,
    AtwformgroupModule,
    AtwformcontrolModule,
    NzStepsModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzGridModule,
    NzIconModule
  ],
  declarations: [AnswerPage]
})
export class AnswerPageModule {}
