import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WRRoutingModule } from './wr-routing.module';
import { ReportComponent } from './report/report.component';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from 'src/app/shared/component/header/header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BaseModule } from 'src/app/base/base.module';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventoryReportComponent } from './report-pages/inventory-report/inventory-report.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DirectiveModule } from 'src/app/directives/directive/directive.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TitleCasePipe } from 'src/app/shared/pipes/title-case.pipe';
import { MatGridListModule } from '@angular/material/grid-list';
import { SharedGlobalModule } from 'src/app/shared/shared-global.module';
import { GstReportComponent } from '../gst-report/gst-report.component';
import { OrderReportComponent } from './report-pages/order-report/order-report.component';
import { ExpiryReportComponent } from './report-pages/expiry-report/expiry-report.component';
import { MarginReportComponent } from './report-pages/margin-report/margin-report.component';
import { CategoryReportComponent } from './report-pages/category-report/category-report.component';
import { TotalPurchaseReportComponent } from './report-pages/total-purchase-report/total-purchase-report.component';
import { SubCategoryComponent } from './report-pages/sub-category/sub-category.component';
import { SubSubCategoryComponent } from './report-pages/sub-sub-category/sub-sub-category.component';
import { TransferReportComponent } from './report-pages/transfer-report/transfer-report.component';
import { TotalPendencyComponent } from './report-pages/total-pendency/total-pendency.component';
import { DiscountReportComponent } from './report-pages/discount-report/discount-report.component';
import { GstReportService } from '../gst-report/gst-report.service';
import {PaginatorModule} from 'primeng/paginator';
import { SalesReportComponent } from './report-pages/sales-report/sales-report.component';
import { OrderDetailsReportComponent } from './report-pages/order-details-report/order-details-report.component';
import { CogsReportComponent } from './report-pages/cogs-report/cogs-report.component';
import { PerformanceReportComponent } from './report-pages/performance-report/performance-report.component';
import { StockReplacementReportComponent } from './report-pages/stock-replacement-report/stock-replacement-report.component';
import { ProductsOrderDetailsComponent } from './report-pages/products-order-details/products-order-details.component';
import { InventoryValueReportComponent } from './report-pages/inventory-value-report/inventory-value-report.component';

@NgModule({
  declarations: [
    ReportComponent,
    InventoryReportComponent,
    TitleCasePipe,
    GstReportComponent,
    OrderReportComponent,
    ExpiryReportComponent,
    MarginReportComponent,
    CategoryReportComponent,
    TotalPurchaseReportComponent,
    SubCategoryComponent,
    SubSubCategoryComponent,
    TransferReportComponent,
    TotalPendencyComponent,
    DiscountReportComponent,
    SalesReportComponent,
    OrderDetailsReportComponent,
    CogsReportComponent,
    PerformanceReportComponent,
    StockReplacementReportComponent,
    ProductsOrderDetailsComponent,
    InventoryValueReportComponent,
  ],
  imports: [
    CommonModule,
    SharedGlobalModule,
    PaginatorModule,
    FlexLayoutModule,
    DirectiveModule,
    WRRoutingModule,
    MatIconModule,
    MatFormFieldModule,
    MatPaginatorModule,
    BaseModule,
    ReactiveFormsModule,
    FormsModule,
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
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatGridListModule,
  ],
  providers: [GstReportService],
})
export class WRModule {}
