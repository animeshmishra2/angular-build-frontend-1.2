import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/shared/_service/exports/excel.service';
import { ReportApiService } from 'src/app/shared/_service/report-apis/report-api.service';
import { Warehouse } from '../inventory-report/inventory-report.component';
import { FormControl } from '@angular/forms';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'moment';
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
const moment: any = _moment;
@Component({
  selector: 'app-performance-report',
  templateUrl: './performance-report.component.html',
  styleUrls: ['./performance-report.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PerformanceReportComponent implements OnInit {
  currentDate = new Date()
  date = new FormControl(moment());
  chosenYearHandler(normalizedYear: Moment, dp: any) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    let tempdata = new Date(ctrlValue)
    this.params.year = tempdata.getFullYear();
    this.getYearOverYearGrowth()
    dp.close();
  }
  users = [
    {
      name: 'User 1',
      email: 'user1@example.com',
      profileImage: 'assets/icons/best-vendor.jpg',
      backgroundColor: '#ffcccb',
    },
    {
      name: 'User 2',
      email: 'user2@example.com',
      profileImage: 'assets/icons/best-vendor.jpg',
      backgroundColor: '#a5d8e1',
    },
    {
      name: 'User 3',
      email: 'user3@example.com',
      profileImage: 'assets/icons/best-vendor.jpg',
      backgroundColor: '#ffd700',
    },
  ];

  constructor(private apiService: ReportApiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private excelService: ExcelService) { }
  bestVendor: any;
  worstVendor: any;
  yearGrowth: any;

  tableData!: any[];
  totalRecords = 0
  dateRange!: any[] | undefined;
  stores!: any;
  loading: boolean = false
  rows = 10;
  first = 0;

  warehouses!: Warehouse[];
  selectedStore?: any = 2;
  selectedWarehouse?: any = 1;
  params: any = {
    field: '',
    searchTerm: '',
    idstore_warehouse: 2,
    rows: 10,
    first: 0,
    year:this.currentDate.getFullYear()
  }
  searchTerm: any
  from_date: any;
  to_date: any;
  idstore_warehouse: any;
  todayDate = new Date()
  fpicker: any;
  tpicker: any;
  selectedRecords: any
  exportColumns: any = [];
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
      id: "product",
      name: "Product Name"
    },
    // {
    //   id: "customer_name",
    //   name: "Customer Name"
    // },
    // {
    //   id: "store_name",
    //   name: "Store Name"
    // },
    {
      id: "category",
      name: "Category"
    },
    {
      id: "sub_category",
      name: "Sub Category"
    }
  ]

  ngOnInit(): void {
    this.fetchWarehouseList()
    this.getStoreOntheBehalfOfWarehouse('1')
    this.getYearOverYearGrowth()
    this.performanceReport()
  }
  performanceReport() {

    this.apiService.getPerformanceReport().subscribe(
      (response) => {
      
        console.log(response)
        this.bestVendor = response?.data?.top_seller
        this.worstVendor = response?.data?.worst_seller
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
      })
  }
  applyFilter(event) {
    console.log(event)
  }
  fetchStoreList(): void {

    this.apiService.getStoreList().subscribe(
      (response) => {
        this.stores = response;

      },
      (error) => {
        console.error('Error fetching Store List:', error);

      }
    );
  }

  tableFilter() { }
  async exportExcel() {

    let tempobject = JSON.parse(JSON.stringify(this.params));
    tempobject.first = 0;
    tempobject.rows = this.totalRecords
    this.spinner.show();
    this.apiService.getYearOverYearGrowth(tempobject).subscribe(
      (response) => {
        let tableData = response.data

        const excelData = tableData.map((x) => {

          return {
            "Barcode": x.barcode.toString(),
            "Brand Name": x.brand_name,
            "Product Name": x.name,
            "Category Name": x.category_name,
            "Sub Category Name": x.sub_category_name,
            "Sub Sub Category Name": x.sub_sub_category_name,
            "Purchase Price": x.purchase_price,
            "growth": x.growth,
       
          };
        })

        let body: any = {
          reportName: 'Performance Report',
          report_type: 'Year over Year Report',
          year:this.params.year
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
        this.excelService.yearOverYeraReport('Order Report', excelData, body)
        this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching Product Report:', error);

        this.spinner.hide();
      }
    );
  }
  exportPdf() { }
  clearAllData(event) {
    this.params = {
      field: '',
      searchTerm: '',
      idstore_warehouse: 2,
      rows: 10,
      first: 0,
      year:this.currentDate.getFullYear()
    }
    this.dateRange = undefined
    this.getYearOverYearGrowth()
  }
  fetchWarehouseList(): void {
    // this.spinner.show();
    this.apiService.getWarehouseList().subscribe(
      (response) => {
        this.warehouses = response;
        // this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching Warehouse List:', error);
        // this.spinner.hide();
      }
    );
  }
  paginate(event) {
    console.log(event)
    this.params.first = (event.first ? event.first : 0)
    this.params.rows = (event.first ? event.first : 0) + (event.rows ? event.rows : 10)
    this.loading = true
    this.apiService.getYearOverYearGrowth(this.params).subscribe(
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
  getYearOverYearGrowth() {
    this.loading = true
    this.apiService.getYearOverYearGrowth(this.params).subscribe(
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
  filterByStore(event) {
    this.params.idstore_warehouse = event.value

    this.getYearOverYearGrowth()
  }
  filterBywarehouse(event) {
    this.params.idstore_warehouse = event.value
    this.selectedStore = undefined
    this.getStoreOntheBehalfOfWarehouse(event.value)
    this.getYearOverYearGrowth()
  }
  filterByDate() {
    if (!this.dateRange) {
      return
    } else {
      let tempdate: any = []
      for (const [index, iterator] of this.dateRange.entries()) {
        tempdate[index] = this.formatDate(iterator)
      }
      this.params.start_date = tempdate[0]
      this.params.end_date = tempdate[1]
      this.getYearOverYearGrowth()
    }
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
  selectFields(event) {
    this.params.field = event.value

  }
  search(value) {
    this.params.searchTerm = value
    if(!value){
      this.params.field =""
    }
    this.getYearOverYearGrowth()
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
  OrderDetails(data) {
    this.router.navigate(['/ggb-admin/wh-reports/products-order-details'], {
      queryParams: { data: btoa(JSON.stringify(data)) }
    })
  }
}
