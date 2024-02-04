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
  stores!: any;
  loading: boolean = false
  rows = 10;
  first = 0;
  warehouses!: Warehouse[];
  selectedStore?: any;
  selectedWarehouse?: any = 1
  searchTerm: any;
  selectedfield: any
  stats: any
  // brand,category,sub_category and barcode
  fieldsArray = [
    {
      id: "product",
      name: "Product Name"
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
      name: "sub_category"
    },
    {
      id: "brand",
      name: "Brand"
    }
  ]
  params: any = {
    first: 0,
    rows: 10,
    searchTerm: "",
    field: "",
    idstore_warehouse:1
  }
  lat: number;
  lng: number;
  constructor(
    private apiService: ReportApiService,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService
  ) {
    this.getLocation()
  }

  ngOnInit(): void {
    this.fetchWarehouseList();
    this.getStoreOntheBehalfOfWarehouse('1')
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
    let tempobject = JSON.parse(JSON.stringify(this.params));
    tempobject.first = 0;
    tempobject.rows = this.totalRecords
    this.spinner.show();
    this.getInventoryReportStateDate()
    this.apiService.getInventoryReport(tempobject).subscribe(
      (response) => {
        const excelData = response.data.map((x) => {

          return {
            "Barcode": x.barcode,
            "Brand": x.brand_name,
            "Product Name": x.product_name,
            "Category": x.category_name,
            "Sub Category": x.sub_category_name,
            "HSN": x.hsn,
            "Expiry": x.expiry,
            "MRP": x.mrp,
            "Quantity Left": x.total_quantity,
            "Purchase Price": x.purchase_price,
            "Purchase Cost": x.purchase_cost,
          };
        })
        let body: any = {
          reportName: 'Inventry Report'
        }
        if (this.selectedStore) {
          body.warehouseName = this.stores.find(x => {
            if (x.idstore_warehouse == this.selectedStore) {
              return x.name
            }
            return
          })
        } else {
          if (this.selectedWarehouse) {
            body.warehouseName = this.warehouses.find(x => {
              if (x.idstore_warehouse == this.selectedWarehouse) {
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

  fetchInventoryReport(): void {
    this.spinner.show();
    let temparray: any = []
    if (this.dateRange && this.dateRange.length > 1) {
      for (const [index, iterator] of this.dateRange.entries()) {
        temparray[index] = this.formatDate(iterator)
      }
      this.params.start_date = temparray[0]
      this.params.end_date = temparray[1]
    }
    this.getInventoryReportStateDate();
    this.loading = true
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
    this.getInventoryReportStateDate()
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
      field: "",
      idstore_warehouse:1
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
    this.getInventoryReportStateDate()
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
  search() {
    if(this.searchTerm){
      this.params.searchTerm = this.searchTerm
      this.loading = true
      this.getInventoryReportStateDate()
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
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          console.log(this.lat);
          console.log(this.lng);
        }
      },
        (error: GeolocationPositionError) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  getStoreOntheBehalfOfWarehouse(data) {
    this.apiService.getStoreOntheBehalfOfWarehouse(data).subscribe(
      (response) => {
        this.stores = response;
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
      }
    );
  }
  filterByStore(event) {
    this.params.idstore_warehouse = event.value
    this.fetchInventoryReport()
  }
  filterBywarehouse(event) {
    this.params.idstore_warehouse = event.value
    this.getStoreOntheBehalfOfWarehouse(event.value)
    this.fetchInventoryReport()
  }
  getInventoryReportStateDate(): void {
    let tempStats= JSON.parse(JSON.stringify(this.params))
    delete tempStats?.first
    delete tempStats?.rows
        this.apiService.getInventoryReportStateDate(tempStats).subscribe(
          (response) => {
            this.stats =  response?.data
            
            // this.stats =  Object.entries(response);;
            // this.spinner.hide();
          },
          (error) => {
            console.error('Error fetching Store List:', error);
            // this.spinner.hide();
          }
        );
      }
}
