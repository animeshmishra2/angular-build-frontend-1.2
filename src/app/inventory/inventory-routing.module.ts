import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatchProductsComponent } from './dispatch-products/dispatch-products.component';
import { RequirementRequestComponent } from './requirement-request/requirement-request.component';

const routes: Routes = [
  { path: '', redirectTo: 'requirement-request', pathMatch: 'full' },
  { path: 'requirement-request/:recreq', component: RequirementRequestComponent },
  { path: 'requirement-request', component: RequirementRequestComponent },
  { path: 'create-requirement-request', component: DispatchProductsComponent },
  { path: 'create-dispatch-request', component: DispatchProductsComponent },
  { path: 'review-dispatch-request', component: DispatchProductsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class InventoryRoutingModule { }
