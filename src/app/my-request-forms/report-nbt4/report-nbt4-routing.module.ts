import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportNbt4Page } from './report-nbt4.page';

const routes: Routes = [
  {
    path: '',
    component: ReportNbt4Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportNbt4PageRoutingModule {}
