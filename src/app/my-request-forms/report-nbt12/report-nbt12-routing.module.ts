import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportNBT12Page } from './report-nbt12.page';

const routes: Routes = [
  {
    path: '',
    component: ReportNBT12Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportNBT12PageRoutingModule {}
