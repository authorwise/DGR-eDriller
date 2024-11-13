import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportNBT345Page } from './report-nbt345.page';

const routes: Routes = [
  {
    path: '',
    component: ReportNBT345Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportNBT345PageRoutingModule {}
