import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyRequestFormsPage } from './my-request-forms.page';

const routes: Routes = [
  {
    path: '',
    component: MyRequestFormsPage
  },
  {
    path: 'report-nbt11-t2',
    loadChildren: () => import('./report-nbt11-t2/report-nbt11-t2.module').then( m => m.ReportNBT11T2PageModule)
  },
  {
    path: 'report-nbt11-t2-and-nbt345-nb1',
    loadChildren: () => import('./report-nbt11-t2-and-nbt345-nb1/report-nbt11-t2-and-nbt345-nb1.module').then( m => m.ReportNBT11T2AndNBT345NB1PageModule)
  },
  {
    path: 'answer/:processDefID/:processID/:recordID',
    loadChildren: () => import('./answer/answer.module').then( m => m.AnswerPageModule)
  },
  {
    path: 'report-nbt345/:processDefID/:processID/:recordID',
    loadChildren: () => import('./report-nbt345/report-nbt345.module').then( m => m.ReportNBT345PageModule)
  },
  {
    path: 'report-nbt4/:processDefID/:processID/:recordID',
    loadChildren: () => import('./report-nbt4/report-nbt4.module').then( m => m.ReportNbt4PageModule)
  },
  {
    path: 'report-nbt12/:processDefID/:processID/:recordID',
    loadChildren: () => import('./report-nbt12/report-nbt12.module').then( m => m.ReportNBT12PageModule)
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyRequestFormsPageRoutingModule {}
