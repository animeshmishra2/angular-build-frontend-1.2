import { Component, OnInit } from '@angular/core';
import { Store, Warehouse } from '../inventory-report/inventory-report.component';
import { ReportApiService } from 'src/app/shared/_service/report-apis/report-api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/shared/_service/exports/excel.service';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss']
})
export class SalesReportComponent implements OnInit {

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
  params: any = {}
  from_date: any;
  to_date: any;
  todayDate = new Date()
  fpicker: any;
  tpicker: any;
  selectedRecords:any
  exportColumns:any=[]
  constructor(  private apiService: ReportApiService,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService) { }
  ngOnInit(): void {
    this.getSalesReport()
  }
  applyFilter(event) {
    console.log(event)
  }
  tableFilter() { }
  exportExcel() { }
  exportPdf() { }
  clearAllData(event){}
  paginate(event){
    console.log(event)
    this.params.page = ((event.first? event.first:0)/(event.rows? event.rows:25) ) + 1
    this.loading=true
    this.apiService.getSalesReport(this.params).subscribe(
      (response) => {
        this.tableData = response.data.data;
        this.totalRecords=response.data.total
        this.loading=false
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
        this.loading=false
      }
    );
  }
  getSalesReport(){
    this.loading=true
    this.apiService.getSalesReport(this.params).subscribe(
      (response) => {
        this.tableData = response.data.data;
        this.totalRecords=response.data.total
        this.loading=false
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
        this.loading=false
      }
    );
  }
}
