import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClipboardsPageRoutingModule } from './clipboards-routing.module';

import { ClipboardsPage } from './clipboards.page';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ClipboardsPageRoutingModule,
    SharedModule,
  ],
  declarations: [ClipboardsPage],
})
export class ClipboardsPageModule {}
