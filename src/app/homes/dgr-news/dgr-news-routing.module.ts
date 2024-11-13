import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DgrNewsPage } from './dgr-news.page';

const routes: Routes = [
  {
    path: '',
    component: DgrNewsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DgrNewsPageRoutingModule {}
