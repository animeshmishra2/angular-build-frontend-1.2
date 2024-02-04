import { Component, OnInit } from '@angular/core';
import { Warehouse } from '../inventory-report/inventory-report.component';
import { ReportApiService } from 'src/app/shared/_service/report-apis/report-api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/shared/_service/exports/excel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss']
})
export class SalesReportComponent implements OnInit {

  tableData!: any[];
  totalRecords = 0
  dateRange!: any[] | undefined;
  stores!: any;
  loading: boolean = false
  rows = 10;
  first = 0;
  warehouses!: Warehouse[];
  selectedStore?: any = 2;
  selectedWarehouse?: any = 1;
  stats: any
  params: any = {
    field: '',
    first: 0,
    searchTerm: '',
    rows: 10,
    report_type: 'artical_wise',
    idstore_warehouse: 2
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
    // {
    //   id: "customer",
    //   name: "Customer Name"
    // },
    // {
    //   id: "pay_mode",
    //   name: "Payment Mode"
    // },
    // {
    //   id: "discount_type",
    //   name: "Discount Type"
    // }
  ]
  reportArray = [
    {
      id: "product_wise",
      name: "Product Wise"
    },
    {
      id: "category_wise",
      name: "Category Wise"
    },
    {
      id: "top_selling",
      name: "Top Selling"
    },
    {
      id: "artical_wise",
      name: "Customer Wise"
    },
    {
      id: "inventory_status",
      name: "Inventory Status"
    }
  ]
  constructor(private apiService: ReportApiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private excelService: ExcelService) { }
  ngOnInit(): void {
    this.fetchWarehouseList();
    this.getStoreOntheBehalfOfWarehouse('1')
    this.getSalesReport()
  }
  applyFilter(event) {
    console.log(event)
  }
  filterByStore(event) {
    this.params.idstore_warehouse = event.value
    this.getSalesReport()
  }
  filterBywarehouse(event) {
    this.params.idstore_warehouse = event.value
    this.getStoreOntheBehalfOfWarehouse(event?.value?.toString())
    this.getSalesReport()
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

    let excelParams = JSON.parse(JSON.stringify(this.params));

    delete excelParams.page
    excelParams.first = 0
    excelParams.rows = this.totalRecords
    this.loading = true
    this.getSalesOrderReportStateDate();
    this.apiService.getSalesReport(excelParams).subscribe(
      (response) => {
        let tableData = response.data;
        this.loading = false
        if (this.params.report_type == 'artical_wise') {
          const exceldata = tableData.map(x => {
            return {
              "Barcode": x.barcode,
              "Customer Order Id": x.idcustomer_order,
              "Customer Name": x.customer_name,
              "Store Name": x.store,
              "Brand": x.brand_name,
              "Category Name": x.category_name,
              "Sub Category Name": x.sub_category_name,
              "Payment Mode": x.pay_mode,
              "Discount Type": x.discount_type,
              "Quantity": x.quantity,
              "MRP": x.mrp,
              "Purchase Price": x.purchase_price,
              "Selling Price": x.selling_price,
              "CGST": x.total_cgst,
              "SGST": x.total_sgst,
              "Total Discount": x.discount,
              "Total Amount": x.total_price,
            }
          })
          let body: any = {
            reportName: 'Sales Report'
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
          this.excelService.salseReport('Sales Report', exceldata, body)
        }
        if (this.params.report_type == 'product_wise') {
          const exceldata = tableData.map(x => {
            return {
              "Barcode": x.barcode,
              "Product Name": x.name,
              "Brand": x.brand_name,
              "Category Name": x.category_name,
              "Sub Category Name": x.sub_category_name,
              "Units Sold": x.units_sold,
              // "Price": x.price,
              "Revenue": x.revenue,

            }
          })
          let body: any = {
            reportName: 'Sales Report',
            report_type: "Product Wise"
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

          this.excelService.commanSalseReport('Sales Report', exceldata, body)

        }
        if (this.params.report_type == 'category_wise') {
          const exceldata = tableData.map(x => {
            return {
              "Product Name": x.name,
              "Units Sold": x.units_sold,
              "Revenue": x.revenue
            }
          })
          let body: any = {
            reportName: 'Sales Report',
            report_type: "Category Wise"
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

          this.excelService.commanSalseReport('Sales Report', exceldata, body)
        }
        if (this.params.report_type == 'top_selling') {
          const exceldata = tableData.map(x => {
            return {
              "Barcode": x.barcode,
              "Rank": x.rank.toString(),
              "Product Name": x.name,
              "Brand": x.brand_name,
              "Category Name": x.category_name,
              "Sub Category Name": x.sub_category_name,
              // "Price": x.price,
              "Units Sold": x.units_sold,
              "Revenue": x.revenue
            }
          })
          let body: any = {
            reportName: 'Sales Report',
            report_type: "Top Selling"
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

          this.excelService.commanSalseReport('Sales Report', exceldata, body)
        }
        if (this.params.report_type == 'inventory_status') {
          const exceldata = tableData.map(x => {
            return {

              "Barcode": x.barcode,
              "Product Name": x.name,
              "Brand": x.brand_name,
              "Category Name": x.category_name,
              "Sub Category Name": x.sub_category_name,
              "stock_quantity": x.stock_quantity,
              "Stock Value": x.stock_value,
            }
          })
          let body: any = {
            reportName: 'Sales Report',
            report_type: "Inventory Status"
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

          this.excelService.commanSalseReport('Sales Report', exceldata, body)
        }

      },
      (error) => {
        console.error('Error fetching Product Report:', error);
        this.loading = false
      }
    );


  }
  exportPdf() { }
  clearAllData() {
    this.params = {
      field: '',
      first: 0,
      searchTerm: '',
      rows: 10,
      report_type: 'artical_wise',
      idstore_warehouse: 2
    }
    this.searchTerm= undefined
    this.dateRange = undefined
    this.getSalesReport()
  }
  paginate(event) {
    console.log(event)
    this.params.first = (event.first ? event.first : 0)
    this.params.rows = (event.first ? event.first : 0) + (event.rows ? event.rows : 10)
    this.loading = true
    this.getSalesOrderReportStateDate();
    this.apiService.getSalesReport(this.params).subscribe(
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
  getSalesReport() {
    this.loading = true
    this.getSalesOrderReportStateDate();
    this.apiService.getSalesReport(this.params).subscribe(
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
      let tempdate: any = []
      for (const [index, iterator] of this.dateRange.entries()) {
        tempdate[index] = this.formatDate(iterator)
      }
      this.params.start_date = tempdate[0]
      this.params.end_date = tempdate[1]
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
  selectReport(event) {
    this.params.report_type = event.value
      this.params.field = ''
    this.getSalesReport()

  }
  search() {
    if (this.searchTerm) {
      this.params.searchTerm = this.searchTerm
      this.getSalesReport()
    }

  }
  OrderDetails(data) {
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
  getSalesOrderReportStateDate(): void {
    let tempStats = JSON.parse(JSON.stringify(this.params))
    delete tempStats?.first
    delete tempStats?.rows
    this.apiService.getSalesOrderReportStateDate(tempStats).subscribe(
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
}
