import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosRoutingModule } from './pos-routing.module';
import { PosComponent } from './pos.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { NewOrderComponent } from './new-order/new-order.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OpenCloseCounterComponent } from './open-close-counter/open-close-counter.component';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BaseModule } from '../base/base.module';
import { RouterModule } from '@angular/router';
import { CustomerLoginRegisterComponent } from './new-order/customer-login-register/customer-login-register.component';
import { HoldOrderComponent } from './hold-order/hold-order.component';
import { ReciptComponent } from './new-order/recipt/recipt.component';
import { ConfirmOrderComponent } from './new-order/confirm-order/confirm-order.component';
import { CounterOrdersComponent } from './counter-orders/counter-orders.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { DirectiveModule } from '../directives/directive/directive.module';
import { SelectPackageComponent } from './new-order/select-package/select-package.component';
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatStepperModule } from "@angular/material/stepper";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { BatchSelectComponent } from './new-order/batch-select/batch-select.component';
import { UpgradeMembershipComponent } from './new-order/upgrade-membership/upgrade-membership.component';

@NgModule({
  declarations: [
    PosComponent,
    NewOrderComponent,
    DashboardComponent,
    OpenCloseCounterComponent,
    CustomerLoginRegisterComponent,
    HoldOrderComponent,
    ReciptComponent,
    ConfirmOrderComponent,
    CounterOrdersComponent,
    OrderDetailComponent,
    SelectPackageComponent,
    BatchSelectComponent,
    UpgradeMembershipComponent,
  ],
  imports: [
    DirectiveModule,
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    PosRoutingModule,
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatCheckboxModule
  ],
})
export class PosModule {}
