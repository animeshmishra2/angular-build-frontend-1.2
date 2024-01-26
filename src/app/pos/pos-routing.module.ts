import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CounterOrdersComponent } from './counter-orders/counter-orders.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HoldOrderComponent } from './hold-order/hold-order.component';
import { NewOrderComponent } from './new-order/new-order.component';
import { ReciptComponent } from './new-order/recipt/recipt.component';
import { OpenCloseCounterComponent } from './open-close-counter/open-close-counter.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OnlineOrderComponent } from './online-order/online-order.component';

// const routes: Routes = [{ path: '', component: PosComponent }];
const routes: Routes = [
  {
    path: 'new-order',
    component: NewOrderComponent,
  },
  {
    path: 'recipt/:id',
    component: ReciptComponent,
  },
  {
    path: 'hold-order',
    component: HoldOrderComponent,
  },
  {
    path: 'open-counter',
    component: OpenCloseCounterComponent,
  },
  {
    path: 'close-counter',
    component: OpenCloseCounterComponent,
  },
  { path: 'counter-order', component: CounterOrdersComponent },
  { path: 'online-order', component: OnlineOrderComponent },
  // { path: 'counter-order/:id', component: OrderDetailComponent },
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'cancel-order', component: OrderDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PosRoutingModule {}
