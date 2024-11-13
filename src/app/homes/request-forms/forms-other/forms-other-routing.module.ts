import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormsOtherPage } from './forms-other.page';

const routes: Routes = [
  {
    path: '',
    component: FormsOtherPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormsOtherPageRoutingModule {}
