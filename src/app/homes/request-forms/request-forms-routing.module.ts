import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { RequestFormsPage } from "./request-forms.page";

const routes: Routes = [
  {
    path: "",
    component: RequestFormsPage,
  },
  {
    path: 'forms-other',
    loadChildren: () => import('./forms-other/forms-other.module').then( m => m.FormsOtherPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestFormsPageRoutingModule {}
