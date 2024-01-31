import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/shared/_service/exports/excel.service';
import { ReportApiService } from 'src/app/shared/_service/report-apis/report-api.service';
import { Store, Warehouse } from '../inventory-report/inventory-report.component';

@Component({
  selector: 'app-cogs-report',
  templateUrl: './cogs-report.component.html',
  styleUrls: ['./cogs-report.component.scss']
})
export class CogsReportComponent implements OnInit {


  tableData!: any[];
  totalRecords = 0
  dateRange!: any[] | undefined;
  stores!: Store[];
  loading: boolean = false
  rows = 10;
  first = 0;
  warehouses!: Warehouse[];
  selectedStore?: any;
  selectedWarehouse?:any=1;
  params: any = {
    field: '',
    searchTerm: '',
    idstore_warehouse:1,
    rows:10,
    first:0
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
      name: "Sub Category"
    }
  ]
  constructor(private apiService: ReportApiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private excelService: ExcelService) { }
  ngOnInit(): void {
    this.fetchStoreList()
    this.fetchWarehouseList()
    this.getCOGSReport()
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

    let tempobject = JSON.parse(JSON.stringify( this.params));
    tempobject.first = 0;
    tempobject.rows = this.totalRecords
    this.spinner.show();
    this.apiService.getCOGSReport(tempobject).subscribe(
      (response) => {
        let tableData = response.data
        const excelData = tableData.map((x) => {

          return {
            "Barcode": x.barcode,
            "Brand Name": x.brand_name,
            "Product Name": x.name,
            "Category Name": x.selling_price,
            "Sub Category Name": x.sub_category_name,
            "Sub Sub Category Name": x.sub_sub_category_name,
            "total_quantity": x.selling_margin_rupees,
            "COGS": x.cogs,
            "Purchase Price": x.purchase_price,
          };
        })
      
        let body:any = {
          reportName: 'COGS Report'
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
        this.excelService.COGSReport('COGS Report', excelData,body)
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
      idstore_warehouse:1,
      rows:10,
      first:0
    }
    this.dateRange = undefined
    this.getCOGSReport()
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
    this.apiService.getCOGSReport(this.params).subscribe(
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
  getCOGSReport() {
    this.loading = true
    this.apiService.getCOGSReport(this.params).subscribe(
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
    this.selectedWarehouse = undefined
    this.getCOGSReport()
  }
  filterBywarehouse(event) {
    this.params.idstore_warehouse = event.value
    this.selectedStore = undefined
    this.getCOGSReport()
  }
  filterByDate() {
    if (!this.dateRange) {
      return
    } else {
      let tempdate:any = []
      for (const [index, iterator] of this.dateRange.entries()) {
        tempdate[index] = this.formatDate(iterator)
      }
      this.params.start_date = tempdate[0]
      this.params.end_date = tempdate[1]
      this.getCOGSReport()
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
    this.getCOGSReport()
  }

}
