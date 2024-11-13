import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactDgrPage } from './contact-dgr.page';

const routes: Routes = [
  {
    path: '',
    component: ContactDgrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactDgrPageRoutingModule {}
