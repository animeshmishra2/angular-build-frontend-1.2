import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReportApiService } from 'src/app/shared/_service/report-apis/report-api.service';
import { Store, Warehouse } from '../inventory-report/inventory-report.component';
import { LazyLoadEvent } from 'primeng/api';
import { ExcelService } from 'src/app/shared/_service/exports/excel.service';

@Component({
  selector: 'app-margin-report',
  templateUrl: './margin-report.component.html',
  styleUrls: ['./margin-report.component.scss'],
})
export class MarginReportComponent implements OnInit {
  tableData!: any[];
  dateRange!: any[]|undefined;
  stores: any;
  loading:boolean=false
  warehouses!: Warehouse[];
  selectedStore?: Store | undefined;
  selectedWarehouse?: Warehouse | undefined;
  params:any={}
  totalRecords:any
  first=0
  constructor(private apiService: ReportApiService,private spinner: NgxSpinnerService,   private excelService: ExcelService) {}

  ngOnInit(): void {
    this.fetchProductReport();
    this.fetchWarehouseList();
    this.fetchStoreList()
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
  fetchProductReport(): void {

    this.spinner.show();
    this.apiService.getProductReport(this.params).subscribe(
      (response) => {
        this.tableData = response.data.data
        this.totalRecords=response.data.total
        this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
        this.spinner.hide();
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

      paginate(event){
        console.log(event)
        this.params.page = ((event.first? event.first:0)/(event.rows? event.rows:50) ) + 1
        this.loading=true
        this.apiService.getProductReport(this.params).subscribe(
          (response) => {
            this.tableData =  response.data.data
            this.totalRecords=response.data.total
            this.loading=false
          },
          (error) => {
            console.error('Error fetching Product Report:', error);
            this.loading=false
          }
        );
      }
      async exportExcel() {
   
        const excelData = this.tableData.map((x) => {
    
          return {
            "Barcode": x.barcode,
            "Name": x.name,
            "Category Name": x.category_name,
            "Selling Price": x.selling_price,
            "Purchase Price": x.purchase_price,
            "Selling Margin age": x.selling_margin_percentage,
            "Selling Margin amount": x.selling_margin_rupees,
            "Purchase Margin age": x.purchase_margin_percentage,
            "Purchase Margin amount": x.purchase_margin_rupees,
          };
        })
        this.excelService.marginReport('Margin Report', excelData)
      }
      clearAllData(event){
        event.clear()
        this.dateRange=undefined
        this.selectedWarehouse = undefined
        this.selectedStore = undefined
        this.params={}
    
      }
}
