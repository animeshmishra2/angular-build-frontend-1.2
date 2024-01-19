import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BillTransferListComponent } from './bill-transfer-list/bill-transfer-list.component';
import { BillNewTransferComponent } from './bill-new-transfer/bill-new-transfer.component';
import { BillDetailsTransferComponent } from './bill-details-transfer/bill-details-transfer.component';
import { MatTableModule } from '@angular/material/table';
import { BilTrnasferRequestedListComponent } from './bil-trnasfer-requested-list/bil-trnasfer-requested-list.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'list' },
  { path: 'list', component: BillTransferListComponent },
  { path: 'new-transfer', component: BillNewTransferComponent },
  { path: 'list-transfer', component: BilTrnasferRequestedListComponent },
]

@NgModule({
  declarations: [
    BillDetailsTransferComponent,
    BilTrnasferRequestedListComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatTableModule
  ]
})
export class BillTransferModule { }
