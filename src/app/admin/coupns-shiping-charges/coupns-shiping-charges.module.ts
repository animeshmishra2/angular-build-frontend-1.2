import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoupnsShipingChargesComponent } from './coupns-shiping-charges.component';
import { CoupnsComponent } from './coupns/coupns.component';
import { ShipingChargesComponent } from './shiping-charges/shiping-charges.component';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, Routes } from '@angular/router';
import { DirectiveModule } from 'src/app/directives/directive/directive.module';
import { ButtonModule } from 'primeng/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { BaseModule } from 'src/app/base/base.module';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddEditShippingChargesComponent } from './shiping-charges/add-edit-shipping-charges/add-edit-shipping-charges.component';
import { AddEditCoupnsComponent } from './coupns/add-edit-coupns/add-edit-coupns.component';

const routes: Routes = [
  { path: '', component: CoupnsShipingChargesComponent },
  { path: 'coupons', component: CoupnsComponent },
  { path: 'shiping-charges', component: ShipingChargesComponent },
]

@NgModule({
  declarations: [
    CoupnsShipingChargesComponent,
    CoupnsComponent,
    ShipingChargesComponent,
    AddEditShippingChargesComponent,
    AddEditCoupnsComponent
  ],
  imports: [
    MatCardModule,
    RouterModule.forChild(routes),
    CommonModule,
    DirectiveModule,
    CommonModule,
    ButtonModule,
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
    MatToolbarModule,
    MatProgressBarModule,
    MatMenuModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatTooltipModule
  ]
})
export class CoupnsShipingChargesModule { }
