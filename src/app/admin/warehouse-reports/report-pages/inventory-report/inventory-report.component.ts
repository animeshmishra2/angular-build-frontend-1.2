import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem, MessageService } from 'primeng/api';
import { ReportApiService } from 'src/app/shared/_service/report-apis/report-api.service';

export interface Product {
  Order_No: number;
  Date: string;
  Counter_Name: number;
  Customer_name: string;
  Biller_name: string;
  Discount_Coupon: string;
  Profit_per_bill: number;
}

export type Warehouse = {
  idstore_warehouse: number;
  name: string;
};

export type Store = {
  idstore_warehouse: number;
  name: string;
};

@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrls: ['./inventory-report.component.scss'],
})
export class InventoryReportComponent implements OnInit {
  tableData!: any[];
  dateRange!: Date[];
  stores!: Store[];
  warehouses!: Warehouse[];
  selectedStore?: any;
  selectedWarehouse?: Warehouse;
  constructor(
    private apiService: ReportApiService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.fetchWarehouseList();
  }

  fetchWarehouseList(): void {
    this.spinner.show();
    this.apiService.getWarehouseList().subscribe(
      (response) => {
        this.warehouses = response;
        this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
        this.spinner.hide();
      }
    );
  }

  fetchInventoryReport(event: any): void {
    this.spinner.show();
    const storeId = event.idstore_warehouse;
    this.apiService.getInventoryReport(storeId).subscribe(
      (response) => {
        this.tableData = response.data;
        this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
        this.spinner.hide();
      }
    );
  }

  filterByDate() {
    const storeId = this.selectedWarehouse?.idstore_warehouse!;
    if(!this.dateRange){
      return
    }
    this.spinner.show();
    this.apiService.getInventoryReportByDate(storeId, this.dateRange).subscribe(
      (response) => {
        this.tableData = response.data;
        this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
        this.spinner.hide();
      }
    );
  }
}
