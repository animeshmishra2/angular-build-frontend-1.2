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
  dateRange!: any[] | undefined;
  stores: any;
  loading: boolean = false
  warehouses!: Warehouse[];
  selectedStore?: any;
  searchTerm: any = ""
  selectedWarehouse?: any = 1;
  params: any = {
    field: '',
    first: 0,
    searchTerm: '',
    rows: 10,
    idstore_warehouse: 1,
    additional_filter: '',
    margin_type: '',
    filter_filed_1: '',
    filter_filed_2: ''
  }
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

  additionalfields = [
    {
      id: "purchase_margin",
      name: "Purchase Margin"
    },
    {
      id: "profit_margin",
      name: "Profit Margin"
    },
    {
      id: "discount_margin",
      name: "Discount Margin"
    }
  ]

  margintype = [
    {
      id: "with_tax",
      name: "With Tax"
    },
    {
      id: "without_tax",
      name: "Without Tax"
    }
  ]
  filterpercent = [
    {
      id: "0-5",
      name: "0-5%"
    },
    {
      id: "5-10",
      name: "5-10%"
    },
    {
      id: "10-15",
      name: "10-15%"
    },
    {
      id: "15-20",
      name: "15-20%"
    },{
      id: "20-25",
      name: "20-25%"
    },
    {
      id: "25-30",
      name: "25-30%"
    },
    {
      id: "30-35",
      name: "30-35%"
    },
    {
      id: "35-40",
      name: "35-40%"
    },
    {
      id: "40-45",
      name: "40-45%"
    },
    {
      id: "45-50",
      name: "45-50%"
    },
    {
      id: "50-55",
      name: "50-55%"
    },
    {
      id: "55-60",
      name: "55-60%"
    },
    {
      id: "60-65",
      name: "60-65%"
    },
    {
      id: "65-70",
      name: "65-70%"
    },
    {
      id: "70-75",
      name: "70-75%"
    },
    {
      id: "75-80",
      name: "75-80%"
    },
    {
      id: "80-85",
      name: "80-85%"
    },
    {
      id: "85-90",
      name: "85-90%"
    },
    {
      id: "90-95",
      name: "90-95%"
    },
    {
      id: "95-100",
      name: "95-100%"
    }
  ]

  totalRecords: any
  first = 0
  stats: any;
  constructor(private apiService: ReportApiService, private spinner: NgxSpinnerService, private excelService: ExcelService) { }

  ngOnInit(): void {
    this.fetchWarehouseList();
    this.getProductReportStateDate()
    this.getStoreOntheBehalfOfWarehouse('1')
    this.fetchProductReport();

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
  getProductReportStateDate(): void {
    let tempStats = JSON.parse(JSON.stringify(this.params))
    delete tempStats?.first
    delete tempStats?.rows
    this.apiService.getProductReportStateDate(tempStats).subscribe(
      (response) => {
        this.stats = response?.data

        // this.stats =  Object.entries(response);;
        // this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching Store List:', error);
        // this.spinner.hide();
      }
    );
  }
  fetchProductReport(): void {
    this.getProductReportStateDate()
    this.spinner.show();
    this.loading = true
    this.apiService.getProductReport(this.params).subscribe(
      (response) => {
        this.tableData = response.data
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
    this.getProductReportStateDate()
    this.apiService.getProductReport(this.params).subscribe(
      (response) => {
        this.tableData = response.data
        this.totalRecords = response.total
        this.loading = false
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
        this.loading = false
      }
    );
  }
  async exportExcel() {

    let tempobject = JSON.parse(JSON.stringify(this.params));
    tempobject.first = 0;
    tempobject.rows = this.totalRecords
    this.spinner.show();
    this.getProductReportStateDate()
    this.apiService.getProductReport(tempobject).subscribe(
      (response) => {
        let tableData = response.data;
        console.log("tableData",tableData);
        
        const excelData = tableData.map((x) => {

          return {
            "Barcode": x.barcode,
            "Brand": x.brand_name,
            "Name": x.name,
            "Category Name": x.category_name,
            "Sub Category Name": x.sub_category_name,
            "HSN": x.hsn,
            "Selling Price": x.selling_price,
            "Selling Price With GST" : x.selling_price_with_gst,
            "Purchase Price": x.purchase_price,
            "Purchase Price With GST" : x.purchase_price_with_gst,
            "MRP": x.mrp,
            "Profit Margin With Tax %": x.unit_profit_margin_with_tax_pr,
            "Profit Margin With Tax Rs": x.unit_profit_margin_with_tax_rupees,

            "Profit Margin Without Tax %": x.unit_profit_margin_without_tax_pr,
            "Profit Margin Without Tax Rs": x.unit_profit_margin_without_tax_rupees,

            "Purchase Margin With Tax Rs": x.unit_purchase_margin_with_tax_rupees,
            "Purchase Margin With Tax %": x.unit_purchase_margin_with_tax_pr,

            "Purchase Margin Without Tax Rs": x.unit_purchase_margin_without_tax_rupees,
            "Purchase Margin Without Tax %": x.unit_purchase_margin_without_tax_pr,

            "Discount Margin With Tax %": x.discount_per_unit_with_tax_pr,
            "Discount Margin With Tax Rs": x.discount_per_unit_with_tax_rupees,

            "Discount Margin Without Tax %": x.discount_per_unit_without_tax_pr,
            "Discount Margin Without Tax Rs": x.discount_per_unit_without_tax_rupees,
            // // "Selling Margin age": x.selling_margin_percentage,
            // // "Selling Margin amount": x.selling_margin_rupees,
            // // "Purchase Margin age": x.purchase_margin_percentage,
            // // "Purchase Margin amount": x.purchase_margin_rupees,
            // // "Discount Margin age": x.discount_pr,
            // // "Discount Margin amount": x.discount_amount,
          };
        })

        let body: any = {
          reportName: 'Margin Report'
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
        this.excelService.marginReportNew('Margin Report', excelData, body)
        this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching Product Report:', error);

        this.spinner.hide();
      }
    );


    // const excelData = this.tableData.map((x) => {

    //   return {
    //     "Barcode": x.barcode,
    //     "Name": x.name,
    //     "Category Name": x.category_name,
    //     "Selling Price": x.selling_price,
    //     "Purchase Price": x.purchase_price,
    //     "Selling Margin age": x.selling_margin_percentage,
    //     "Selling Margin amount": x.selling_margin_rupees,
    //     "Purchase Margin age": x.purchase_margin_percentage,
    //     "Purchase Margin amount": x.purchase_margin_rupees,
    //   };
    // })
    // this.excelService.marginReport('Margin Report', excelData)
  }
  clearAllData(event) {
    event.clear()
    this.dateRange = undefined
    this.selectedWarehouse = 1
    this.selectedStore = undefined
    this.searchTerm = undefined
    this.params = {
      field: '',
      first: 0,
      searchTerm: '',
      rows: 10,
      idstore_warehouse: 1
    }
    this.fetchProductReport();
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
    }
    this.getProductReportStateDate()
    this.spinner.show();
    this.loading = true
    this.apiService.getProductReport(this.params).subscribe(
      (response) => {
        this.tableData = response.data
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
  selectFields(event) {
    this.params.field = event.value
    this.searchTerm = undefined

  }
  additionalFilter(event) {
    this.params.additional_filter = event.value
    this.searchTerm = undefined

  }
  margintypeFields(event) {
    this.params.margin_type = event.value
    this.searchTerm = undefined

  }
  percentageFields(event) {
    console.log("value",event);
    
    // this.params.field = event.value;
    const range = event.value.split('-').map(item => parseInt(item));
    this.params.filter_filed_1 = range[0]; // value of lower bound
    this.params.filter_filed_2 = range[1];
    this.searchTerm = undefined

  }
  search() {

    if (this.searchTerm) {
      this.params.searchTerm = this.searchTerm
      this.loading = true
      this.getProductReportStateDate()
      this.apiService.getProductReport(this.params).subscribe(
        (response) => {
          this.tableData = response.data
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
  filterByStore(event) {
    this.params.idstore_warehouse = event.value

    this.fetchProductReport()
  }
  filterBywarehouse(event) {
    this.params.idstore_warehouse = event.value
    this.getStoreOntheBehalfOfWarehouse(event?.value?.toString())
    this.fetchProductReport()
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
