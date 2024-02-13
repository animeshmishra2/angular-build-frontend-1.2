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
import { DeleiverySlotsComponent } from './deleivery-slots/deleivery-slots.component';
import { ThreshouldPurchaseOrderComponent } from './threshould-purchase-order/threshould-purchase-order.component';
import { ProductHomeComponent } from './product-master/product-home/product-home.component';
import { AttributeListComponent } from './product-master/attribute-list/attribute-list.component';
import { AttributeValueListComponent } from './product-master/attribute-value-list/attribute-value-list.component';
import { VariantAllComponent } from './product-master/variant-all/variant-all.component';

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
  { path: 'variant-all', component: VariantAllComponent },
  { path: 'product-master-home', component: ProductHomeComponent },
  { path: 'attribute-name-list', component: AttributeListComponent },
  { path: 'attribute-value-list', component: AttributeValueListComponent },
  { path: 'create-package/:id/:counter', component: CreateComponent },
  { path: '', component: AdminHomeComponent },
  { path: 'banners-offers', loadChildren: () => import('./banners-offers/banners-offers.module').then(m => m.BannersOffersModule) },
  { path: 'coupons-shiping-charges', loadChildren: () => import('./coupns-shiping-charges/coupns-shiping-charges.module').then(m => m.CoupnsShipingChargesModule) },
  { path: 'deleivery-slots', component: DeleiverySlotsComponent },
  { path: 'threshould-purchase-order', component: ThreshouldPurchaseOrderComponent },
  { path: 'package-by-branch-category', loadChildren: () => import('./package-branch-category/package-branch-category.module').then(m => m.PackageBranchCategoryModule) }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
