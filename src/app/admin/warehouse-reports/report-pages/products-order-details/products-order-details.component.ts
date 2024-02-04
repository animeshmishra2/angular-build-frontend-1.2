import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/shared/_service/exports/excel.service';
import { ReportApiService } from 'src/app/shared/_service/report-apis/report-api.service';
import { Store, Warehouse } from '../inventory-report/inventory-report.component';

@Component({
  selector: 'app-products-order-details',
  templateUrl: './products-order-details.component.html',
  styleUrls: ['./products-order-details.component.scss']
})
export class ProductsOrderDetailsComponent implements OnInit {

  tableData!: any[];
  totalRecords = 0
  dateRange!: any[] | undefined;
  stores!: Store[];
  loading: boolean = false
  rows = 10;
  first = 0;
  warehouses!: Warehouse[];
  selectedStore?: Store | undefined;
  selectedWarehouse?: Warehouse | undefined;
  params: any = {
    field: '',
    searchTerm: ''
  }
  searchTerm: any
  routeData:any
  idstore_warehouse: any;
  todayDate = new Date()
  fpicker: any;
  tpicker: any;
  selectedRecords: any
  exportColumns: any = [];
  constructor(private apiService: ReportApiService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private excelService: ExcelService) { }
  ngOnInit(): void {

    this.route.queryParams.subscribe(parsam => {
      this.routeData = JSON.parse(atob(parsam.data));
      this.tableData=this.routeData['products']
      this.totalRecords= this.tableData.length
    });

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
  exportExcel() { }
  exportPdf() { }
  clearAllData(event) {
    this.params = {}
    this.dateRange=undefined
  }
  paginate(event) {
    console.log(event)
    this.params.page = ((event.first ? event.first : 0) / (event.rows ? event.rows : 25)) + 1
    this.loading = true
    this.apiService.getSalesReport(this.params).subscribe(
      (response) => {
        this.tableData = response.data.data;
        this.totalRecords = response.data.total
        this.loading = false
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
        this.loading = false
      }
    );
  }
  getSalesReport() {
    this.loading = true
    this.apiService.getSalesReport(this.params).subscribe(
      (response) => {
        this.tableData = response.data.data;
        this.totalRecords = response.data.total
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
    this.getSalesReport()
  }
  filterByDate() {
    if (!this.dateRange) {
      return
    } else {
      for (const [index, iterator] of this.dateRange.entries()) {
        this.dateRange[index] = this.formatDate(iterator)
      }
      this.params.start_date = this.dateRange[0]
      this.params.end_date = this.dateRange[1]
      this.getSalesReport()
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
    this.getSalesReport()
  }
  OrderDetails(data){
    console.log(data)
    this.router.navigate([])
  }

}
