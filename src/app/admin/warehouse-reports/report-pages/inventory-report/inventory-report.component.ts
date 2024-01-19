import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { ExcelService } from 'src/app/shared/_service/exports/excel.service';
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
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrls: ['./inventory-report.component.scss'],
})
export class InventoryReportComponent implements OnInit {
  tableData!: any[];
  totalRecords=0
  dateRange!: any[]|undefined;
  stores!: Store[];
  loading:boolean=false
  rows=10;
  first=0;
  warehouses!: Warehouse[];
  selectedStore?: Store | undefined;
  selectedWarehouse?: Warehouse | undefined;
  params:any={}
  constructor(
    private apiService: ReportApiService,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService
  ) { }

  ngOnInit(): void {
    this.fetchWarehouseList();
    this.fetchStoreList()
    this.fetchInventoryReport();
  }

  fetchWarehouseList(): void {
    this.spinner.show();
    this.apiService.getWarehouseList().subscribe(
      (response) => {
        this.warehouses = response;
        this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching Warehouse List:', error);
        this.spinner.hide();
      }
    );
  }
  fetchStoreList(): void {
    this.spinner.show();
    this.apiService.getStoreList().subscribe(
      (response) => {
        this.stores = response;
        this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching Store List:', error);
        this.spinner.hide();
      }
    );
  }

  async exportExcel() {
    const excelData = this.tableData.map((x) => {

      return {
        "Barcode": x.product_barcode,
        "Product Name": x.product_name,
        "Category": x.category,
        "Sub Category": x.sub_category,
        "Sub Sub Category": x.sub_sub_category,
        "Brand": x.brands,
        "Quantity Left": x.total_quantity,
      };
    })
    this.excelService.exportAsExcelFile('Inventry Report', excelData, 'Reports')
  }
  exportPdf() {
    this.excelService
  }

  fetchInventoryReport(event?: any, type?: string): void {
    this.spinner.show();
    if (type == "Store") {
      this.selectedWarehouse = undefined
    }
    if (type == "Warehouses") {
      this.selectedStore = undefined
    }
    if(this.dateRange&& this.dateRange.length>1){
      for (const [index,iterator] of this.dateRange.entries()) {
        this.dateRange[index]= this.formatDate(iterator)
       }
       this.params.start_date= this.dateRange[0]
       this.params.end_date= this.dateRange[1]
    }
    this.params.idstore_warehouse=event?.value
    this.apiService.getInventoryReport(this.params).subscribe(
      (response) => {
        this.tableData = response.data;
        this.totalRecords=response.total
        this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
        this.spinner.hide();
      }
    );
  }

  filterByDate() {

   
    if (!this.dateRange) {
      return
    }else{
   for (const [index,iterator] of this.dateRange.entries()) {
    this.dateRange[index]= this.formatDate(iterator)
   }
   this.params.start_date= this.dateRange[0]
   this.params.end_date= this.dateRange[1]
    }
    this.spinner.show();
    this.apiService.getInventoryReportByDate(this.params).subscribe(
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
  clearAllData(event){
    event.clear()
    this.dateRange=undefined
    this.selectedWarehouse = undefined
    this.selectedStore = undefined
    this.params={}
    this.fetchInventoryReport();
  }
  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
      if(date==null || d.toString()=="Invalid Date")
      { 
        return null
      }

    return [year, month, day].join('-');
  }

  paginate(event){
    console.log(event)
    this.params.first = (event.first? event.first:0) + 1
    this.params.rows = (event.first? event.first:0) + (event.rows? event.rows:50) 
    this.loading=true
    this.apiService.getInventoryReport(this.params).subscribe(
      (response) => {
        this.tableData = response.data;
        this.totalRecords=response.total
        this.loading=false
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
        this.loading=false
      }
    );
  }
}
