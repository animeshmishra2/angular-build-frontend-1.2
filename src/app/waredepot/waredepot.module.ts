import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WaredepotRoutingModule } from './waredepot-routing.module';
import { WaredepotHomeComponent } from './waredepot-home/waredepot-home.component';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { BaseModule } from '../base/base.module';
import { EditNewBillComponent } from './new-bill/edit-new-bill/edit-new-bill.component';
import { NewBillComponent } from './new-bill/new-bill.component';
import { EditVendorComponent } from './vendor/edit-vendor/edit-vendor.component';
import { VendorComponent } from './vendor/vendor.component';
import { AcceptSwOrderComponent } from './order-to-warehouse/accept-sw-order/accept-sw-order.component';
import { CreateStoreWhOrderComponent } from './order-to-warehouse/create-store-wh-order/create-store-wh-order.component';
import { ManageStoreWhOrderComponent } from './order-to-warehouse/manage-store-wh-order/manage-store-wh-order.component';
import { OrderToWarehouseComponent } from './order-to-warehouse/order-to-warehouse.component';
import { DirectiveModule } from '../directives/directive/directive.module';
import { BillDetailComponent } from './new-bill/bill-detail/bill-detail.component';
import { ManageInventoryComponent } from './manage-inventory/manage-inventory.component';
import { CreditDialogComponent } from './vendor/credit-dialog/credit-dialog.component';
import { MarginDetailsDialogComponent } from './new-bill/margin-details-dialog/margin-details-dialog.component';
import { DialogPrintviewComponent } from './new-bill/dialog-printview/dialog-printview.component';
import { WarehouseDirectTransferListComponent } from './warehouse-direct-transfer-list/warehouse-direct-transfer-list.component';
import { WarehouseDirectTransferCreateComponent } from './warehouse-direct-transfer-create/warehouse-direct-transfer-create.component';
import { BillTransferListComponent } from './bill-transfer/bill-transfer-list/bill-transfer-list.component';
import { BillNewTransferComponent } from './bill-transfer/bill-new-transfer/bill-new-transfer.component';
import { AutomaticTransferListComponent } from './automatic-transfer-list/automatic-transfer-list.component';
import { AutomaticTransferProductComponent } from './automatic-transfer-product/automatic-transfer-product.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AutomaticTransferDetailsComponent } from './automatic-transfer-details/automatic-transfer-details.component';
import { AutomaticTransferRequestListComponent } from './automatic-transfer-request-list/automatic-transfer-request-list.component';
import { DirectTransferDetailsComponent } from './direct-transfer-details/direct-transfer-details.component';
import { TransfersComponent } from './transfers/transfers.component';


@NgModule({
  declarations: [
    WaredepotHomeComponent,
    VendorComponent,
    EditVendorComponent,
    NewBillComponent,
    EditNewBillComponent,
    OrderToWarehouseComponent,
    CreateStoreWhOrderComponent,
    ManageStoreWhOrderComponent,
    AcceptSwOrderComponent,
    BillDetailComponent,
    ManageInventoryComponent,
    CreditDialogComponent,
    MarginDetailsDialogComponent,
    DialogPrintviewComponent,
    WarehouseDirectTransferListComponent,
    WarehouseDirectTransferCreateComponent,
    BillTransferListComponent,
    BillNewTransferComponent,
    AutomaticTransferListComponent,
    AutomaticTransferProductComponent,
    AutomaticTransferDetailsComponent,
    AutomaticTransferRequestListComponent,
    DirectTransferDetailsComponent,
    TransfersComponent
  ],
  imports: [
    DirectiveModule,
    CommonModule,
    WaredepotRoutingModule,
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
    MatDialogModule,
    MatCheckboxModule
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class WaredepotModule { }
