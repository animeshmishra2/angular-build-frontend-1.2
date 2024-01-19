import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageInventoryComponent } from './manage-inventory/manage-inventory.component';
import { EditNewBillComponent } from './new-bill/edit-new-bill/edit-new-bill.component';
import { NewBillComponent } from './new-bill/new-bill.component';
import { AcceptSwOrderComponent } from './order-to-warehouse/accept-sw-order/accept-sw-order.component';
import { CreateStoreWhOrderComponent } from './order-to-warehouse/create-store-wh-order/create-store-wh-order.component';
import { ManageStoreWhOrderComponent } from './order-to-warehouse/manage-store-wh-order/manage-store-wh-order.component';
import { OrderToWarehouseComponent } from './order-to-warehouse/order-to-warehouse.component';
import { VendorComponent } from './vendor/vendor.component';
import { WaredepotHomeComponent } from './waredepot-home/waredepot-home.component';
import { WarehouseDirectTransferListComponent } from './warehouse-direct-transfer-list/warehouse-direct-transfer-list.component';
import { WarehouseDirectTransferCreateComponent } from './warehouse-direct-transfer-create/warehouse-direct-transfer-create.component';
import { GuardGuard } from '../guards/guard.guard';
import { AutomaticTransferListComponent } from './automatic-transfer-list/automatic-transfer-list.component';
import { AutomaticTransferProductComponent } from './automatic-transfer-product/automatic-transfer-product.component';
import { AutomaticTransferRequestListComponent } from './automatic-transfer-request-list/automatic-transfer-request-list.component';

const routes: Routes = [
  { path: '', component: WaredepotHomeComponent },

  { path: 'order-to-warehouse', component: OrderToWarehouseComponent },
  { path: 'create-order-store-ware', component: CreateStoreWhOrderComponent },
  { path: 'manage-sw-order', component: ManageStoreWhOrderComponent },
  { path: 'accept-sw-order', component: AcceptSwOrderComponent },
  {
    path: 'vendor',
    component: VendorComponent,
  },
  {
    path: 'bills',
    component: NewBillComponent,
  },
  {
    path: 'add-edit-bill',
    component: EditNewBillComponent,
  },
  {
    path: 'inventory',
    component: ManageInventoryComponent,
  },
  {
    path: 'warehouse-direct-transfer-list',
    component: WarehouseDirectTransferListComponent,
  },
  {
    path: 'warehouse-direct-transfer-create',
    component: WarehouseDirectTransferCreateComponent,
  },
  {
    path: 'bill-transfer',
    canActivate: [GuardGuard],
    loadChildren: () => import('./bill-transfer/bill-transfer.module').then(m => m.BillTransferModule)
  },
  {
    path: 'automatic-transfer-list',
    component: AutomaticTransferListComponent,
  },
  {
    path: 'automatic-transfer-product',
    component: AutomaticTransferProductComponent,
  },
  {
    path: 'automatic-transfer-request-list',
    component: AutomaticTransferRequestListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WaredepotRoutingModule { }
