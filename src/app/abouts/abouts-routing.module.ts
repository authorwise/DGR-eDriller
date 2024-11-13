import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutsPage } from './abouts.page';

const routes: Routes = [
  {
    path: '',
    component: AboutsPage
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'edit-gwdriller',
    loadChildren: () => import('./edit-gwdriller/edit-gwdriller.module').then( m => m.EditGwdrillerPageModule)
  },
  {
    path: 'new-password',
    loadChildren: () => import('./new-password/new-password.module').then( m => m.NewPasswordPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutsPageRoutingModule {}
