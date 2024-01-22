import { SharedGlobalModule } from './../shared/shared-global.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { StoreWarehouseComponent } from './store-warehouse/store-warehouse.component';
import { ManageStaffComponent } from './manage-staff/manage-staff.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { BaseModule } from '../base/base.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EditStoreWareComponent } from './store-warehouse/edit-store-ware/edit-store-ware.component';
import { LoaderInterceptor } from '../shared/_helper/loader.interceptor';
import { AddEditStaffComponent } from './manage-staff/add-edit-staff/add-edit-staff.component';
import { StaffAccessComponent } from './store-warehouse/staff-access/staff-access.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ViewInventoryComponent } from './view-inventory/view-inventory.component';
import { ViewCountersComponent } from './store-warehouse/view-counters/view-counters.component';
import { AddEditCountersComponent } from './store-warehouse/add-edit-counters/add-edit-counters.component';
import { CouponComponent } from './coupon/coupon.component';
import { ManageOfferComponent } from './manage-offer/manage-offer.component';
import { AddEditOfferComponent } from './manage-offer/add-edit-offer/add-edit-offer.component';
import { DirectiveModule } from '../directives/directive/directive.module';
import { PackageComponent } from './package/package.component';
import { CreateLandingComponent } from './package/create-landing/create-landing.component';
import { CreateComponent } from './package/create/create.component';
import { EditPackageComponent } from './package/edit-package/edit-package.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CategoryComponent } from './category/category.component';
import { EditCategoryComponent } from './category/edit-category/edit-category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { EditSubCategoryComponent } from './sub-category/edit-sub-category/edit-sub-category.component';
import { BrandsComponent } from './brands/brands.component';
import { EditBrandComponent } from './brands/edit-brand/edit-brand.component';
import { SubSubCategoryComponent } from './sub-sub-category/sub-sub-category.component';
import { EditSubSubCategoryComponent } from './sub-sub-category/edit-sub-sub-category/edit-sub-sub-category.component';
import { ProductMasterComponent } from './product-master/product-master.component';
import { EditProductMasterComponent } from './product-master/edit-product-master/edit-product-master.component';
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatStepperModule } from "@angular/material/stepper";
import { ManageAccessComponent } from './store-warehouse/manage-access/manage-access.component';
import { WarehouseReportsComponent } from './warehouse-reports/warehouse-reports.component';
import { ButtonModule } from 'primeng/button';
import { AddEditSlotsComponent } from './deleivery-slots/add-edit-slots/add-edit-slots.component';
import { ThreshouldPurchaseOrderComponent } from './threshould-purchase-order/threshould-purchase-order.component';
import { DeleiverySlotsComponent } from './deleivery-slots/deleivery-slots.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
  declarations: [
    AdminComponent,
    AdminHomeComponent,
    StoreWarehouseComponent,
    EditStoreWareComponent,
    ManageStaffComponent,
    AddEditStaffComponent,
    StaffAccessComponent,
    ViewInventoryComponent,
    ViewCountersComponent,
    AddEditCountersComponent,
    CouponComponent,
    AddEditOfferComponent,
    ManageOfferComponent,
    PackageComponent,
    CreateLandingComponent,
    CreateComponent,
    EditPackageComponent,
    CategoryComponent,
    EditCategoryComponent,
    SubCategoryComponent,
    EditSubCategoryComponent,
    BrandsComponent,
    EditBrandComponent,
    SubSubCategoryComponent,
    EditSubSubCategoryComponent,
    ProductMasterComponent,
    EditProductMasterComponent,
    ManageAccessComponent,
    WarehouseReportsComponent,
    DeleiverySlotsComponent,
    ThreshouldPurchaseOrderComponent,
    AddEditSlotsComponent,
  ],
  imports: [
    DirectiveModule,
    CommonModule,
    ButtonModule,
    AdminRoutingModule,
    MatDialogModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatIconModule,
    MatSelectModule,
    BaseModule,
    HttpClientModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatMenuModule,
    MatIconModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatTooltipModule,
    NgxMaterialTimepickerModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    
  ],
})
export class AdminModule {}
