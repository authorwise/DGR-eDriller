import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomesPage } from './homes.page';

const routes: Routes = [
  {
    path: '',
    component: HomesPage,
  },
  {
    path: 'guide',
    loadChildren: () => import('./guide/guide.module').then( m => m.GuidePageModule)
  },
  {
    path: 'contact-dgr',
    loadChildren: () => import('./contact-dgr/contact-dgr.module').then( m => m.ContactDgrPageModule)
  },
  {
    path: 'dgr-news',
    loadChildren: () => import('./dgr-news/dgr-news.module').then( m => m.DgrNewsPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomesPageRoutingModule {}
