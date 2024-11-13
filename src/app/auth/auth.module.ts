import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { IonicModule } from '@ionic/angular';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { AuthPage } from './auth.page';

const routes: Routes = [
  {
    path: '',
    component: AuthPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NzFormModule,
    NzButtonModule
  ],
  declarations: [AuthPage]
})
export class AuthPageModule { }
