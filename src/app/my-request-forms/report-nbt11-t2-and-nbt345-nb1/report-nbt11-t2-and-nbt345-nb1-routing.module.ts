import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportNBT11T2AndNBT345NB1Page } from './report-nbt11-t2-and-nbt345-nb1.page';

const routes: Routes = [
  {
    path: '',
    component: ReportNBT11T2AndNBT345NB1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportNBT11T2AndNBT345NB1PageRoutingModule {}
