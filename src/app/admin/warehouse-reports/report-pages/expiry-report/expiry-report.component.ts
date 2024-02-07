import { Component, OnInit } from '@angular/core';
import { error } from 'console';
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
  totalRecords = 0
  pieOptions: any;
  expiryList: any;
  stores!: any;
  dateRange!: any[] | undefined;
  warehouses!: any;
  selectedStore?: any = 2;
  selectedWarehouse?: any=1;
  searchTerm: any = ""
  // stateOptions: any[] = [
  //   { label: 'Product Line Wise', value: 'productLine' },
  //   { label: 'Brand Wise', value: 'brands' },
  //   { label: 'Category Wise', value: 'category' },
  //   { label: 'Sub Category Wise', value: 'sub_category' }
  // ];
  fieldsArray = [
    {
      id: "brands",
      name: "Brand Wise",
      field: "brand"
    },
    {
      id: "productLine",
      name: "Product Line Wise",
      field: "product"
    },
    {
      id: "category",
      name: "Category Wise",
      field: "category"
    },
    {
      id: "sub_category",
      name: "Sub Category Wise",
      field: "sub_category"
    }
  ]
  piaData: any = [];
  value: string = 'brands';
  tableData: any;
  params: any = {
    first: 0,
    rows: 50,
    graph_type: "brands",
    field: "brand",
    store_id: 2
  }

  constructor(private apiService: ReportApiService,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService) { }

  async ngOnInit() {
    this.fetchWarehouseList();
    this.getStoreOntheBehalfOfWarehouse('1')
    await this.getExpiryList();
  }

  getSumOfAmount(): number {
    return this.pieData.datasets[0].data.reduce((acc, value) => acc + value, 0);
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
  async exportExcel() {
    let localParams = JSON.parse(JSON.stringify( this.params));
    localParams.rows = this.totalRecords


    this.apiService.getExpiryReport(localParams).subscribe(
      async (response: any) => {

        let expiryList:any
        if(this.params.field=="product"){
          expiryList = await this.createExcelDataproduct(response.data);
        }else{
          expiryList = await this.createExcelData(response.data);
        }
     
        let body: any = {
          reportName: 'Inventry Report',
          warehouseName: this.params.graph_type
        }
        this.excelService.ExpiryReport('Expiry Report', expiryList, body)

      }, (error) => {
        console.log(error)
      }
    )
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
        this.spinner.hide();
        this.expiryList = response.data;
        console.log(this.expiryList);
        this.totalRecords = response.total
        this.piaData[0] = this.expiryList.total_expried_amount
        this.piaData[1] = this.expiryList.total_xpiring_in_30_days_amount
        this.piaData[2] = this.expiryList.total_not_expired_amount
        this.piechart(this.piaData)
        let barGraphData:any
        if(this.params.field=="product"){
          barGraphData= await this.createBarGraphdataproduct(this.expiryList)
        }else{
          barGraphData = await this.createBarGraphdata(this.expiryList)
        }
  
        console.log(barGraphData)
        this.barGraph(barGraphData)

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
  async createExcelData(object: any) {
    console.log(object)
    let excelData: any = []
    for (const key in object) {

      if (key && object[key]['totals']) {
        for await (const iterator of object[key]['totals']) {
          let object1: any = {}
          object1['Product Name'] = iterator.product_name
          object1['Expired'] = iterator.expired
          object1['Expiring In 30days Amount'] = iterator.expiring_in_30days_amount
          object1['Not Expired'] = iterator.not_expired
          excelData.push(object1)
        }
      }
    }
    return excelData
  }
  async createExcelDataproduct(object: any) {
    console.log(object)
    let excelData: any = []
    for (const key in object) {
      let object1: any = {}
      if(!(key == "total_expried_amount" || key == "total_not_expired_amount" || key == "total_xpiring_in_30_days_amount")){
          object1['Product Name'] =object[key].product_name
          object1['Expired'] = object[key].expired
          object1['Expiring In 30days Amount'] = object[key].expiring_in_30days_amount
          object1['Not Expired'] = object[key].not_expired
          excelData.push(object1)
        }
    }
    return excelData
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
  async createBarGraphdataproduct(object) {
    let lable: any = [], data1: any = [], data2: any = [], data3: any = []
    for (const key in object) {
  
      if(!(key == "total_expried_amount" || key == "total_not_expired_amount" || key == "total_xpiring_in_30_days_amount")){
          lable.push(object[key].product_name)
          data1.push(object[key].expired)
          data2.push(object[key].expiring_in_30days_amount)
          data3.push(object[key].not_expired)

        }
      


    }
    return { lable, data1, data2, data3 }
  }
  LoadBarData(string) {
    if (string == 'Next') {
      this.params.first = this.params.first + 50
      this.params.rows = this.params.rows + 50
    } else if (string == 'Previous') {
      if (this.params.first >= 50) {
        this.params.first = this.params.first - 50
        this.params.rows = this.params.rows - 50
      }
    }
    this.getExpiryList();
  }
  changeStates() {
    console.log(this.value)
    this.params.graph_type = this.value,
      this.getExpiryList()
  }
  applyFilter(event) {
    console.log(event)
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
    }
    this.getExpiryList();
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
  clearAllData() {
    this.value = 'brands';
    this.params = {
      first: 0,
      rows: 50,
      graph_type: this.value,
      field: "brand",
      store_id:2
    }
    this.searchTerm= undefined
    this.dateRange = undefined
    this.getExpiryList();
  }
  filterByStore(event) {
    this.params.store_id = event.value
    this.getExpiryList()
  }
  filterBywarehouse(event) {
    this.params.store_id = event.value
    this.getStoreOntheBehalfOfWarehouse(event?.value?.toString())
    this.getExpiryList()
  }
  selectFields(event) {
    this.params.graph_type = event.value
    let objfield: any = this.fieldsArray.find(x => x.id == event.value)
    this.params.field = objfield?.field
    this.getExpiryList()
  }
  search() {
    if(this.searchTerm){
      this.params.searchTerm = this.searchTerm
      this.getExpiryList()
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
}
