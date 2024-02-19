import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/shared/_service/exports/excel.service';
import { ReportApiService } from 'src/app/shared/_service/report-apis/report-api.service';
import { Store, Warehouse } from '../inventory-report/inventory-report.component';

@Component({
  selector: 'app-order-report',
  templateUrl: './order-report.component.html',
  styleUrls: ['./order-report.component.scss'],
})
export class OrderReportComponent implements OnInit {
 
  discountTypes: { [key: string]: string } = {
    'CDA': 'Cash Discount Amount',
    'CDP': 'Cash Discount Percentage',
    'COU': 'Coupon',
    'DFD': 'Dynamic Fixed Discount',
    'PKG': 'Membership Package'
  };
  tableData!: any[];
  totalRecords = 0
  dateRange!: any[] | undefined;
  stores!: any;
  loading: boolean = false
  rows = 10;
  first = 0;
  warehouses!: Warehouse[];
  selectedStore?: any =2;
  selectedWarehouse?:any=1;
  params: any = {
    field: '',
    searchTerm: '',
    idstore_warehouse:2,
    rows:10,
    first:0
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
      id: "bill_no",
      name: "Bill NO."
    },
    {
      id: "customer_name",
      name: "Customer Name"
    },
    {
      id: "store_name",
      name: "Store Name"
    },
    // {
    //   id: "category",
    //   name: "Category"
    // },
    // {
    //   id: "sub_category",
    //   name: "Sub Category"
    // }
  ]
  constructor(private apiService: ReportApiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private excelService: ExcelService) { }
  ngOnInit(): void {
    this.fetchWarehouseList()
    this.getStoreOntheBehalfOfWarehouse('1')
    this.getOrderReport()
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
  async exportExcel() {

    let tempobject = JSON.parse(JSON.stringify( this.params));
    tempobject.first = 0;
    tempobject.rows = this.totalRecords
    this.spinner.show();
    this.apiService.getOrderReport(tempobject).subscribe(
      (response) => {
        let tableData = response.orders_list

        const excelData = tableData.map((x) => {

          return {
            "BillNo / Bill Date": x.idcustomer_order +'/'+x.bill_date,
            "Customer Name / Phone No": x.customer_name + '/' + x.phone_no,
            "Store Name": x.store_name,
            "Order Type" : x.order_type,
            "Payment Type": x.payment_type,
            "Delivery Type" : x.delivery_type,
            "Membership Type" : x.membership_type,
            "Total Quantity" : x.total_quantity,
            "Total MRP" : x.total_mrp,
            "Total Discount" : x.total_discount,
            "Discount Type" : x.discount_type,
            "Extra Discount" : x.extraDisc,
            "Total CGST (%)(Rs)": (x.total_cgst_pr) / (x.total_cgst_amount),
            "Total SGST (%)(Rs)": (x.total_sgst_pr) / (x.total_sgst_amount),
            "Total IGST (%)(Rs)" : (x.totigst_pr) / (x.igst_amount),
            "Total Paid Amount" : x.total_paid_amount

            // "Quantity": x.quantity,
            // "Discount Type": x.discount_type,
            // "Total Discount": x.total_discount,
            // "CGST": x.cgst,
            // "SGST": x.sgst,
            // "Profit": x.profit_pr,
            // "Profit(Rs)": x.profit_rs,
            // "Price": x.price,
            // "Created Date": x.created_at,
            // "No of Products": x.products.length,
            // "isLoss":x.billed_in_loss
          };
        })
      
        let body:any = {
          reportName: 'Order Report'
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
        console.log(body)
        this.excelService.OrderReportNew('Order Report', excelData,body)
        this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching Product Report:', error);

        this.spinner.hide();
      }
    );
  }
  getDiscountTypeName(key: string): string {
    return this.discountTypes[key] || key;
  }

  exportPdf() { }
  clearAllData(event) {
    this.params = {
      field: '',
      searchTerm: '',
      idstore_warehouse:2,
      rows:10,
      first:0
    }
    this.dateRange = undefined
    this.getOrderReport()
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
  paginate(event) {
    console.log(event)
    this.params.first = (event.first ? event.first : 0)
    this.params.rows = (event.first ? event.first : 0) + (event.rows ? event.rows : 10)
    this.loading = true
    this.apiService.getOrderReport(this.params).subscribe(
      (response) => {
        this.tableData = response.orders_list;
        this.totalRecords = response.total
        this.loading = false
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
        this.loading = false
      }
    );
  }
  getOrderReport() {
    this.loading = true
    this.apiService.getOrderReport(this.params).subscribe(
      (response) => {
        this.tableData = response.orders_list;
        this.totalRecords = response.total
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

    this.getOrderReport()
  }
  filterBywarehouse(event) {
    this.params.idstore_warehouse = event.value
    this.selectedStore=undefined
    this.getStoreOntheBehalfOfWarehouse(event.value)
    this.getOrderReport()
  }
  filterByDate() {
    if (!this.dateRange) {
      return
    } else {
      let tempdate:any = []
      for (const [index, iterator] of this.dateRange.entries()) {
        tempdate[index] = this.formatDate(iterator)
      }
      this.params.start_date = tempdate[0]
      this.params.end_date = tempdate[1]
      this.getOrderReport()
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
      this.getOrderReport()
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
  OrderDetails(data){
    this.router.navigate(['/ggb-admin/wh-reports/products-order-details'], {
      queryParams: { data: btoa(JSON.stringify(data)) }
  })
  }
}
