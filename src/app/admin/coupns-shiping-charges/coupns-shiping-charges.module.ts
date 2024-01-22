import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoupnsShipingChargesComponent } from './coupns-shiping-charges.component';
import { CoupnsComponent } from './coupns/coupns.component';
import { ShipingChargesComponent } from './shiping-charges/shiping-charges.component';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: CoupnsShipingChargesComponent },
  { path: 'coupons', component: CoupnsComponent },
  { path: 'shiping-charges', component: ShipingChargesComponent },
]

@NgModule({
  declarations: [
    CoupnsShipingChargesComponent,
    CoupnsComponent,
    ShipingChargesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule
  ]
})
export class CoupnsShipingChargesModule { }
