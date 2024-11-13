import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'tabs', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthPageModule),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
    canActivate: [AuthGuard],
  },
  // {
  //   path: 'testcontrol',
  //   loadChildren: () =>
  //     import('./test/form/testcontrol/testcontrol.module').then(
  //       (m) => m.TestcontrolPageModule
  //     ),
  // },
  {
    path: 'my-request-forms',
    loadChildren: () =>
      import('./my-request-forms/my-request-forms.module').then(
        (m) => m.MyRequestFormsPageModule
      ),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./register/register.module').then((m) => m.RegisterPageModule),
  },
  // {
  //   path: 'new-password',
  //   loadChildren: () =>
  //     import('./abouts/new-password/new-password.module').then(
  //       (m) => m.NewPasswordPageModule
  //     ),
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
