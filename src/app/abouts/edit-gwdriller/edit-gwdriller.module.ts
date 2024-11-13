import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditGwdrillerPageRoutingModule } from './edit-gwdriller-routing.module';

import { EditGwdrillerPage } from './edit-gwdriller.page';
import { AtwformgroupModule } from 'src/app/components/forms/atwformgroup/atwformgroup.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditGwdrillerPageRoutingModule,
    ReactiveFormsModule,
    NzFormModule,
    AtwformgroupModule,
    NzGridModule,
    NzButtonModule
  ],
  declarations: [EditGwdrillerPage]
})
export class EditGwdrillerPageModule {}
