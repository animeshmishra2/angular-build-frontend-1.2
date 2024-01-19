import { createComponent } from '@angular/compiler/src/core';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminComponent } from './admin.component';
import { BrandsComponent } from './brands/brands.component';
import { CategoryComponent } from './category/category.component';
import { ManageOfferComponent } from './manage-offer/manage-offer.component';
import { ManageStaffComponent } from './manage-staff/manage-staff.component';
import { CreateComponent } from './package/create/create.component';
import { PackageComponent } from './package/package.component';
import { ProductMasterComponent } from './product-master/product-master.component';
import { AddEditCountersComponent } from './store-warehouse/add-edit-counters/add-edit-counters.component';
import { ManageAccessComponent } from './store-warehouse/manage-access/manage-access.component';
import { StoreWarehouseComponent } from './store-warehouse/store-warehouse.component';
import { ViewCountersComponent } from './store-warehouse/view-counters/view-counters.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { SubSubCategoryComponent } from './sub-sub-category/sub-sub-category.component';
import { EditStoreWareComponent } from './store-warehouse/edit-store-ware/edit-store-ware.component';
import { WarehouseReportsComponent } from './warehouse-reports/warehouse-reports.component';
import { GstReportComponent } from './gst-report/gst-report.component';

const routes: Routes = [
  { path: "store-warehouse/:type", component: StoreWarehouseComponent },
  { path: "gst-reports", component: GstReportComponent },
  { path: "manage-store", component: EditStoreWareComponent },
  { path: 'staff', component: ManageStaffComponent },
  { path: 'staff-access', component: ManageAccessComponent },
  { path: 'view-counters', component: ViewCountersComponent },
  { path: 'manage-counters', component: AddEditCountersComponent },
  { path: 'manage-offer', component: ManageOfferComponent },
  { path: 'view-package', component: PackageComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'brand', component: BrandsComponent },
  { path: 'sub-category', component: SubCategoryComponent },
  { path: 'sub-sub-category', component: SubSubCategoryComponent },
  { path: 'wh-reports', loadChildren: () => import('./warehouse-reports/wr.module').then(m => m.WRModule) },
  { path: 'product-master', component: ProductMasterComponent },
  { path: 'create-package/:id/:counter', component: CreateComponent },
  { path: '', component: AdminHomeComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
