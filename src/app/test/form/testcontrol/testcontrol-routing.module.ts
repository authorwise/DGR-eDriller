import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestcontrolPage } from './testcontrol.page';

const routes: Routes = [
  {
    path: '',
    component: TestcontrolPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestcontrolPageRoutingModule {}
