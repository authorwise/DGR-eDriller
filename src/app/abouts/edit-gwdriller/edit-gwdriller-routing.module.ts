import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditGwdrillerPage } from './edit-gwdriller.page';

const routes: Routes = [
  {
    path: '',
    component: EditGwdrillerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditGwdrillerPageRoutingModule {}
