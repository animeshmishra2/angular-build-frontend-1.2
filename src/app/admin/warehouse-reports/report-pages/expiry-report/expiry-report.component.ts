import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/shared/_service/exports/excel.service';
import { ReportApiService } from 'src/app/shared/_service/report-apis/report-api.service';

export type Warehouse = {
  idstore_warehouse: number;
  name: string;
};

export type Store = {
  idstore_warehouse: number;
  name: string;
};

@Component({
  selector: 'app-expiry-report',
  templateUrl: './expiry-report.component.html',
  styleUrls: ['./expiry-report.component.scss'],
})
export class ExpiryReportComponent implements OnInit {
  data: any;
  options: any;
  pieData: any;
  pieOptions: any;
  expiryList: any;
  stores!: Store[];
  dateRange!: any[] | undefined;
  warehouses!: Warehouse[];
  selectedStore?: any;
  selectedWarehouse?: Warehouse;
  stateOptions: any[] = [
    { label: 'Product Line Wise', value: 'productLine' },
    { label: 'Brand Wise', value: 'brands' },
    { label: 'Category Wise', value: 'category' },
    { label: 'Sub Category Wise', value: 'sub_category' },
    { label: 'Sub Sub Category Wise', value: 'sub_sub_category' },
  ];
  piaData: any = []
  value: string = 'productLine';
  tableData: any;
  params: any={
    first:1,
    rows:50,
    graph_type:this.value
  }

  constructor(private apiService: ReportApiService,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService) { }

  async ngOnInit() {
    this.fetchWarehouseList();
    this.fetchStoreList();
    await this.getExpiryList();
  }

  getSumOfAmount(): number {
    return this.pieData.datasets[0].data.reduce((acc, value) => acc + value, 0);
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
  public piechart(piedata) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    this.pieData = {
      labels: ['Expired', 'Expiring in 30 days', 'Expiring after 30 days'],
      datasets: [
        {
          data: piedata,
          backgroundColor: [documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--blue-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--purple-400'), documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--blue-400')]
        }
      ]
    };

    this.pieOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
  }
  async getExpiryList() {
    this.spinner.show();
    this.apiService.getExpiryReport(this.params).subscribe(
      async (response: any) => {

        this.expiryList = response.data;
        this.piaData[0] = this.expiryList.total_expried_amount
        this.piaData[1] = this.expiryList.total_xpiring_in_30_days_amount
        this.piaData[2] = this.expiryList.total_not_expired_amount
        this.piechart(this.piaData)
        const barGraphData = await this.createBarGraphdata(this.expiryList)
        console.log(barGraphData)
        this.barGraph(barGraphData)
        this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching Warehouse List:', error);
        this.spinner.hide();
      }
    );
  }
  barGraph(barGraphData) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.data = {
      labels: barGraphData.lable,
      datasets: [
        {
          type: 'bar',
          label: 'Expired',
          backgroundColor: '#cd5c5c',
          data: barGraphData.data1,
        },
        {
          type: 'bar',
          label: 'Expiring in 30 days',
          backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
          data: barGraphData.data2,
        },
        {
          type: 'bar',
          label: 'Expiring after 30 days',
          backgroundColor: documentStyle.getPropertyValue('--green-500'),
          data: barGraphData.data3,
        },
      ],
    };
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  async createBarGraphdata(object) {
    let lable: any = [], data1: any = [], data2: any = [], data3: any = []
    for (const key in object) {
      if (key && object[key]['totals']) {
        for await (const iterator of object[key]['totals']) {
          lable.push(iterator.product_name)
          data1.push(iterator.expired)
          data2.push(iterator.expiring_in_30days_amount)
          data3.push(iterator.not_expired)

        }
      }


    }
    return { lable, data1, data2, data3 }
  }
  LoadBarData(string) {
if(string=='Next'){
  this.params.first= this.params.first + 50
  this.params.rows= this.params.rows + 50
}else if(string=='Previous'){
  if(this.params.first>50){
    this.params.first= this.params.first - 50
    this.params.rows= this.params.rows - 50
  }
}
this.getExpiryList();
  }
  changeStates(){
    console.log(this.value)
    this.params.graph_type = this.value,
    this.getExpiryList()
  }
  applyFilter(event){
    console.log(event)
  }
}
