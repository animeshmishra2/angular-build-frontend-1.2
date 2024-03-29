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
    idstore_warehouse: 1
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
        let tableData = response.data
        const excelData = tableData.map((x) => {

          return {
            "Barcode": x.barcode,
            "Brand": x.brand_name,
            "Name": x.name,
            "Category Name": x.category_name,
            "Sub Category Name": x.sub_category_name,
            "HSN": x.hsn,
            "Selling Price": x.selling_price,
            "Purchase Price": x.purchase_price,
            "MRP": x.mrp,
            "Discount": x.discount,
            "Selling Margin age": x.selling_margin_percentage,
            "Selling Margin amount": x.selling_margin_rupees,
            "Purchase Margin age": x.purchase_margin_percentage,
            "Purchase Margin amount": x.purchase_margin_rupees,
            "Discount Margin age": x.discount_pr,
            "Discount Margin amount": x.discount_amount,
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
        this.excelService.marginReport('Margin Report', excelData, body)
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
