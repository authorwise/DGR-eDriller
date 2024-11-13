import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditProfilePageRoutingModule } from './edit-profile-routing.module';

import { EditProfilePage } from './edit-profile.page';
import { NzFormModule } from 'ng-zorro-antd/form';
import { AtwformgroupModule } from '../../../app/components/forms/atwformgroup/atwformgroup.module';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditProfilePageRoutingModule,
    ReactiveFormsModule,
    NzFormModule,
    AtwformgroupModule,
    NzGridModule,
    NzButtonModule
  ],
  declarations: [EditProfilePage]
})
export class EditProfilePageModule {}
