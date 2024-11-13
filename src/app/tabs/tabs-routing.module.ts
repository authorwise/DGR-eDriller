import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'dgr',
    component: TabsPage,
    children: [
      {
        path: 'homes',
        children: [
          {
            path: '',
            loadChildren: () => import('../homes/homes.module').then(m => m.HomesPageModule)
          }
        ]
      },
      {
        path: 'my-request-forms',
        children: [
          {
            path: '',
            loadChildren: () => import('../my-request-forms/my-request-forms.module').then(m => m.MyRequestFormsPageModule)
          }
        ]
      },
      {
        path: 'abouts',
        children: [
          {
            path: '',
            loadChildren: () => import('../abouts/abouts.module').then(m => m.AboutsPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/dgr/homes',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/dgr/homes',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
