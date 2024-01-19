import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BillTransferListComponent } from './bill-transfer-list/bill-transfer-list.component';
import { BillNewTransferComponent } from './bill-new-transfer/bill-new-transfer.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'list' },
  { path: 'list', component: BillTransferListComponent },
  { path: 'new-transfer', component: BillNewTransferComponent },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class BillTransferModule { }
