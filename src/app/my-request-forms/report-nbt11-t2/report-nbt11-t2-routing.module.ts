import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportNBT11T2Page } from './report-nbt11-t2.page';

const routes: Routes = [
  {
    path: '',
    component: ReportNBT11T2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportNBT11T2PageRoutingModule {}
