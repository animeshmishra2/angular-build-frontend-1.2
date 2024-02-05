import { TotalPurchaseReportComponent } from './report-pages/total-purchase-report/total-purchase-report.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehouseReportsComponent } from './warehouse-reports.component';
import { InventoryReportComponent } from './report-pages/inventory-report/inventory-report.component';
import { OrderReportComponent } from './report-pages/order-report/order-report.component';
import { MarginReportComponent } from './report-pages/margin-report/margin-report.component';
import { CategoryReportComponent } from './report-pages/category-report/category-report.component';
import { TransferReportComponent } from './report-pages/transfer-report/transfer-report.component';
import { TotalPendencyComponent } from './report-pages/total-pendency/total-pendency.component';
import { DiscountReportComponent } from './report-pages/discount-report/discount-report.component';
import { SubSubCategoryComponent } from './report-pages/sub-sub-category/sub-sub-category.component';
import { SubCategoryComponent } from './report-pages/sub-category/sub-category.component';
import { ReciptComponent } from 'src/app/pos/new-order/recipt/recipt.component';
import { ExpiryReportComponent } from './report-pages/expiry-report/expiry-report.component';
import { SalesReportComponent } from './report-pages/sales-report/sales-report.component';
import { OrderDetailsReportComponent } from './report-pages/order-details-report/order-details-report.component';
import { CogsReportComponent } from './report-pages/cogs-report/cogs-report.component';
import { PerformanceReportComponent } from './report-pages/performance-report/performance-report.component';
import { StockReplacementReportComponent } from './report-pages/stock-replacement-report/stock-replacement-report.component';
import { ProductsOrderDetailsComponent } from './report-pages/products-order-details/products-order-details.component';
import { InventoryValueReportComponent } from './report-pages/inventory-value-report/inventory-value-report.component';

const routes: Routes = [
  {
    path: 'recipt/:orderId',
    component: ReciptComponent,
  },
  { path: "inventory-report", component: InventoryReportComponent },
  { path: "order-report", component: OrderReportComponent },
  { path: "expiry-report", component: ExpiryReportComponent },
  { path: "margin-report", component: MarginReportComponent },
  { path: "order-details-report", component: OrderDetailsReportComponent },
  { path: "category-report", component: CategoryReportComponent },
  { path: "total-purchase-report", component: TotalPurchaseReportComponent },
  { path: "transfer-report", component: TransferReportComponent},
  { path: "total-pendency", component: TotalPendencyComponent },
  { path: "discount-and-schemes-report", component: DiscountReportComponent },
  { path: "sub-category", component: SubCategoryComponent },
  { path: "sub-sub-category", component: SubSubCategoryComponent },
  { path: "sales-report", component: SalesReportComponent },
  { path: "cogs-report", component: CogsReportComponent },
  { path: "performance-report", component: PerformanceReportComponent },
  { path: "replacement-report", component: StockReplacementReportComponent },
  { path: "products-order-details", component: ProductsOrderDetailsComponent },
  { path: "inventory-value-report", component: InventoryValueReportComponent },
  { path: '', component: WarehouseReportsComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WRRoutingModule { }


