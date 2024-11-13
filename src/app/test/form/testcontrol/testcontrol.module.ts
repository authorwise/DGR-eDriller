import { AtwformgroupModule } from './../../../components/forms/atwformgroup/atwformgroup.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestcontrolPageRoutingModule } from './testcontrol-routing.module';

import { TestcontrolPage } from './testcontrol.page';
import { AtwformcolumnModule } from '../../../components/forms/atwformcolumn/atwformcolumn.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestcontrolPageRoutingModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    AtwformgroupModule
  ],
  declarations: [TestcontrolPage]
})
export class TestcontrolPageModule { }
