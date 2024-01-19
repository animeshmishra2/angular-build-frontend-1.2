import { Component, OnInit } from '@angular/core';
import { Store, Warehouse } from '../inventory-report/inventory-report.component';
import { ReportApiService } from 'src/app/shared/_service/report-apis/report-api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/shared/_service/exports/excel.service';

@Component({
  selector: 'app-total-purchase-report',
  templateUrl: './total-purchase-report.component.html',
  styleUrls: ['./total-purchase-report.component.scss']
})
export class TotalPurchaseReportComponent implements OnInit {
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
    this.getPurchaseOrderReport()
  }
  applyFilter(event) {
    console.log(event)
  }
  tableFilter() { }
  exportExcel() { }
  exportPdf() { }
  clearAllData(event){
    event.clear()
    this.dateRange=undefined
    this.selectedWarehouse = undefined
    this.selectedStore = undefined
    this.params={}
    this.getPurchaseOrderReport()
  }
  paginate(event){
    console.log(event)
    this.params.page = ((event.first? event.first:0)/(event.rows? event.rows:25) ) + 1
    this.loading=true
    this.apiService.getPurchaseOrderReport(this.params).subscribe(
      (response) => {
        let temp = response.data.data;
        delete temp.gross_totald
        if(Object.values(temp) && Object.values(temp).length>0){

          this.tableData = Object.values(temp);
        }else{
          this.tableData=[]
        }
        this.totalRecords=response.data.total
        this.loading=false
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
        this.loading=false
      }
    );
  }
  getPurchaseOrderReport(){
    this.loading=true
    this.apiService.getPurchaseOrderReport(this.params).subscribe(
      (response) => {
        let temp = response.data.data;
        delete temp.gross_totald
        if(Object.values(temp) && Object.values(temp).length>0){

          this.tableData = Object.values(temp);
        }else{
          this.tableData=[]
        }
        this.totalRecords=response.data.total
        this.loading=false
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
        this.loading=false
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

    this.loading=true
    this.apiService.getPurchaseOrderReport(this.params).subscribe(
      (response) => {
        let temp = response.data.data;
        delete temp.gross_totald
        if(Object.values(temp) && Object.values(temp).length>0){

          this.tableData = Object.values(temp);
        }else{
          this.tableData=[]
        }
        this.totalRecords=response.data.total
        this.loading=false
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
        this.loading=false
    
      }
    );
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

}
