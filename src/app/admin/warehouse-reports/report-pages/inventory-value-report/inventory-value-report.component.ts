import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/shared/_service/exports/excel.service';
import { ReportApiService } from 'src/app/shared/_service/report-apis/report-api.service';
import { Warehouse } from '../inventory-report/inventory-report.component';

@Component({
  selector: 'app-inventory-value-report',
  templateUrl: './inventory-value-report.component.html',
  styleUrls: ['./inventory-value-report.component.scss']
})
export class InventoryValueReportComponent implements OnInit {

  tableData!: any[];
  totalRecords = 0
  dateRange!: any[] | undefined;
  stores!: any;
  loading: boolean = false
  rows = 10;
  first = 0;
  warehouses!: Warehouse[];
  selectedStore?: any;
  selectedWarehouse?: any=1 ;
  params: any = {
    field: '',
    first:0,
    searchTerm: '',
    rows:10,
    type:'replenishment_products',
    idstore_warehouse:1
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
      id: "product",
      name: "Product"
    },
    {
      id: "barcode",
      name: "Barcode"
    }
  ]
  reportArray = [
    {
      id: "replenishment_products",
      name: "Replenishment Products"
    },
    {
      id: "critical_products",
      name: "Critical Products"
    },
 
  ]
  constructor(private apiService: ReportApiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private excelService: ExcelService) { }
  ngOnInit(): void {
    this.fetchWarehouseList();
    this.getStoreOntheBehalfOfWarehouse('1')
    this.getStockReplacementReport()
  }
  applyFilter(event) {
    console.log(event)
  }
  filterByStore(event) {
    this.params.idstore_warehouse = event.value

this.getStockReplacementReport()
  }
  filterBywarehouse(event) {
    this.params.idstore_warehouse = event.value
    this.getStoreOntheBehalfOfWarehouse(event?.value?.toString())
    this.getStockReplacementReport()
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
  fetchStoreList(): void {
    // this.spinner.show();
    this.apiService.getStoreList().subscribe(
      (response) => {
        this.stores = response;
        // this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching Store List:', error);
        // this.spinner.hide();
      }
    );
  }
  tableFilter() { }
  exportExcel() {

    let excelParams = JSON.parse(JSON.stringify( this.params));
   
    delete excelParams.page
    excelParams.first = 0
    excelParams.rows= this.totalRecords
    this.loading=true
    this.apiService.getStockReplacementReport(excelParams).subscribe(
      (response) => {
        let tableData = response.data;
        this.loading=false
        const exceldata=tableData.map(x=>{
          return{
            "Customer Order Id":x.idcustomer_order,
            "Customer Name":x.name,
            "Store Name":x.store,
            "Payment Mode":x.pay_mode,
            "Discount Type":x.discount_type,
            "Quantity":x.total_quantity,
            "CGST":x.total_cgst,
            "SGST":x.total_sgst,
            "Total Discount":x.total_discount,
            "Total Amount":x.total_price,
            "Order count":x.oreder_details.length
    
          }
        })
        let body:any = {
          reportName: 'Sales Report'
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
        console.log(excelParams,this.params)
        this.excelService.salseReport('Sales Report', exceldata,body)
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
        this.loading=false
      }
    );
    

   }
  exportPdf() { }
  clearAllData(event) {
    this.params = {
      field: '',
      first:0,
      searchTerm: '',
      rows:10,
      type:'replenishment_products',
      idstore_warehouse:1
    }
    this.searchTerm =undefined
    this.dateRange=undefined
    this.getStockReplacementReport()
  }
  paginate(event) {
    console.log(event)
    this.params.first = (event.first ? event.first : 0)
    this.params.rows = (event.first ? event.first : 0) + (event.rows ? event.rows : 10)
    this.loading = true
    this.apiService.getStockReplacementReport(this.params).subscribe(
      (response) => {
        this.tableData = response.data;
        this.totalRecords = response.total
        this.loading = false
        this.fetchWarehouseList();
        this.fetchStoreList();
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
        this.loading = false
      }
    );
  }
  getStockReplacementReport() {
    this.loading = true
    this.apiService.getStockReplacementReport(this.params).subscribe(
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
  filterByDate() {
    if (!this.dateRange) {
      return
    } else {
      let tempdate:any=[]
      for (const [index, iterator] of this.dateRange.entries()) {
        tempdate[index] = this.formatDate(iterator)
      }
      this.params.start_date = tempdate[0]
      this.params.end_date = tempdate[1]
      this.getStockReplacementReport()
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
  search() {
    if(this.searchTerm){
      this.params.searchTerm = this.searchTerm
      this.getStockReplacementReport()
    }
   
  }
  OrderDetails(data){
    this.router.navigate(['/ggb-admin/wh-reports/order-details-report'], {
      queryParams: { data: btoa(JSON.stringify(data)) }
  })
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
  selectReport(event) {
    this.params.type = event.value
    // if (this.params.report_type != 'artical_wise') {
    //   this.params.field = ''
    // }
    this.getStockReplacementReport()

  }

}
