import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
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
  totalRecords = 0
  dateRange!: any[] | undefined;
  stores!: Store[];
  loading: boolean = false
  rows = 10;
  first = 0;
  warehouses!: Warehouse[];
  selectedStore?:any;
  selectedWarehouse?:any = 1
  searchTerm: any;
  selectedfield: any
  // brand,category,sub_category and barcode
  fieldsArray = [
    {
      id: "brand",
      name: "Brand"
    },
    {
      id: "barcode",
      name: "Barcode"
    },
    {
      id: "category",
      name: "Category"
    },
    {
      id: "sub_category",
      name: "Sub Category"
    }
  ]
  params: any = {
    first: 0,
    rows: 10,
    searchTerm: "",
    field: ""
  }
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
    let tempobject = JSON.parse(JSON.stringify( this.params));
    tempobject.first = 0;
    tempobject.rows = this.totalRecords
    this.spinner.show();
    this.apiService.getInventoryReport(tempobject).subscribe(
      (response) => {
        const excelData = response.data.map((x) => {

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
        let body:any = {
          reportName: 'Inventry Report'
        }
        if(this.selectedStore){
          body.warehouseName= this.stores.find(x=> {
            if(x.idstore_warehouse== this.selectedStore){
              return x.name
            }
            return
          })
        }else{
          if(this.selectedWarehouse){
            body.warehouseName= this.warehouses.find(x=> {
              if(x.idstore_warehouse== this.selectedWarehouse){
                return x.name
              }
              return
          })
        }
        }
        console.log(body)
        this.excelService.getInventoryReport('Inventry Report', excelData, body)
        this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching Product Report:', error);

        this.spinner.hide();
      }
    );

  }
  exportPdf() {
    this.excelService
  }

  fetchInventoryReport(event?: any, type?: string): void {
    this.spinner.show();
    console.log(event,this.selectedWarehouse,this.selectedStore)
    if (type == "Store") {
   
      this.selectedWarehouse = undefined
    }
    if (type == "Warehouses") {
      this.selectedStore = undefined
    }
    let temparray: any = []
    if (this.dateRange && this.dateRange.length > 1) {
      for (const [index, iterator] of this.dateRange.entries()) {
        temparray[index] = this.formatDate(iterator)
      }
      this.params.start_date = temparray[0]
      this.params.end_date = temparray[1]
    }
    this.loading = true
    this.params.idstore_warehouse = event?.value
    this.apiService.getInventoryReport(this.params).subscribe(
      (response) => {
        this.tableData = response.data;
        this.totalRecords = response.total
        this.spinner.hide();
        this.loading = false
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
        this.spinner.hide();
        this.loading = false
      }
    );
  }

  filterByDate() {


    if (!this.dateRange) {
      return
    } else {
      let temparray: any = []
      for (const [index, iterator] of this.dateRange.entries()) {
        temparray[index] = this.formatDate(iterator)
      }
      this.params.start_date = temparray[0]
      this.params.end_date = temparray[1]
    }
    this.spinner.show();
    this.loading = true
    this.apiService.getInventoryReportByDate(this.params).subscribe(
      (response) => {
        this.tableData = response.data;
        this.totalRecords = response.total
        this.spinner.hide();
        this.loading = false
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
        this.spinner.hide();
        this.loading = false
      }
    );
  }
  clearAllData(event) {
    event.clear()
    this.dateRange = undefined
    this.selectedWarehouse = 1
    this.selectedStore = undefined
    this.searchTerm = ""
    this.params = {
      first: 0,
      rows: 10,
      searchTerm: "",
      field: ""
    }
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
    if (date == null || d.toString() == "Invalid Date") {
      return null
    }

    return [year, month, day].join('-');
  }

  paginate(event) {
    console.log(event)
    this.params.first = (event.first ? event.first : 0)
    this.params.rows = (event.first ? event.first : 0) + (event.rows ? event.rows : 10)
    this.loading = true
    this.apiService.getInventoryReport(this.params).subscribe(
      (response) => {
        this.tableData = response.data;
        this.totalRecords = response.total
        this.loading = false
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
        this.loading = false
      }
    );
  }
  selectFields(event) {
    this.params.field = event.value

  }
  search(value) {
    this.params.searchTerm = value
    this.loading = true
    this.apiService.getInventoryReport(this.params).subscribe(
      (response) => {
        this.tableData = response.data;
        this.totalRecords = response.total

        this.loading = false
      },
      (error) => {
        console.error('Error fetching Product Report:', error);

        this.loading = false
      }
    );
  }
}
