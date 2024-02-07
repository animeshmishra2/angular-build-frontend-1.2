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
  selectedStore?: any;
  selectedWarehouse?: any = 1
  params:any = {
    field: '',
    first:0,
    searchTerm: '',
    rows:10,
    idstore_warehouse: 1
  }
  stats: any;
  from_date: any;
  to_date: any;
  todayDate = new Date()
  fpicker: any;
  tpicker: any;
  selectedRecords: any
  exportColumns: any = []
  searchTerm: any = ""
  fieldsArray = [
    {
      id: "brand",
      name: "Brand"
    },
    {
      name: "Bill No",
      id: "bill_no"
    },
    {
      id: "barcode",
      name: "Barcode"
    },
    {
      id: "vendor",
      name: "Vendor"
    },
    {
      id: "category",
      name: "Category"
    },
    {
      id: "sub_category",
      name: "Sub Category"
    },
    {
      name: "Product Name",
      id: "product"
    },
    {
      name: "Expiry",
      id: "expiry"
    },
    {
      name: "HSN",
      id: "hsn"
    }
    
  ]
  constructor(private apiService: ReportApiService,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService) { }
  ngOnInit(): void {
    this.getPurchaseOrderReport()
  }
  applyFilter(event) {
    console.log(event)
  }
  tableFilter() { }
  exportExcel() {

    let excelParams = JSON.parse(JSON.stringify( this.params));
    delete excelParams.page
    excelParams.first = 0
    excelParams.rows = this.totalRecords
    this.loading = true
    this.getPurchaseOrderReportStateDate()
    this.apiService.getPurchaseOrderReport(excelParams).subscribe(
      (response) => {
        let temp = response.data;
        delete temp['gross_total'];
        let tableData: any = []
        if (Object.values(temp) && Object.values(temp).length > 0) {

          tableData = Object.values(temp);
        } else {
          tableData = []
        }
        this.totalRecords = response.total
        this.loading = false

        const exceldata = tableData.map(x => {
          return {
            "Product Name": x.name,
            "Vendor Name": x.vendor_name,
            "Category": x.category_name,
            "Sub Category": x.sub_category_name,
            "Brand": x.brand_name,
            "HSN": x.hsn,
            "Barcode": x.barcode,
            "MRP": x.mrp,
            "Taxable Purchase Price (Rs)": x.unit_purchase_price,
            "Purchase Price with Tax": (x.unit_purchase_price + (x.cgst_amount + x.sgst_amount)/x.quantity),
            "Purchase Margin (%)": (((x.mrp -((x.unit_purchase_price + (x.cgst_amount + x.sgst_amount)/x.quantity))))/x.mrp) * 100 ,
            "Quantity": x.quantity,
            "CGST Amount":x.cgst_amount?x.cgst_amount:0,
            "CGST %": x.cgst_amount?x.cgst_amount:0,
            "SGST Amount": x.sgst_amount?x.sgst_amount:0,
            "SGST %": x.sgst?x.sgst:0,
            "IGST Amount": x.igst_amount?x.igst_amount:0,
            "IGST %": x.igst?x.igst:0,
            "Selling Price": x.selling_price,
            "Unit Price": x.unit_purchase_price,
            "Taxable Amount": x.taxable_amount,
            "Amount with tax": x.amount_with_tax
          }
        })
        let body: any = {
          reportName: 'Purchase Report'
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
        this.excelService.purchaseReport('Purchase Report', exceldata, body)
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
        this.loading = false
      }
    );


  }
  exportPdf() { }
  clearAllData(event) {
    event.clear()
    this.dateRange = undefined
    this.selectedWarehouse = 1
    this.searchTerm = undefined
    this.selectedStore = undefined
    this.params = {
      field: '',
      first:0,
      searchTerm: '',
      rows:10
    }
    this.getPurchaseOrderReport()
  }
  paginate(event) {
    console.log(event)
    this.params.first = (event.first ? event.first : 0)
    this.params.rows = (event.first ? event.first : 0) + (event.rows ? event.rows : 10)
    this.loading = true
    this.getPurchaseOrderReportStateDate()
    this.apiService.getPurchaseOrderReport(this.params).subscribe(
      (response) => {
        let temp = response.data;
        delete temp['gross_total'];
        if (Object.values(temp) && Object.values(temp).length > 0) {

          this.tableData = Object.values(temp);
        } else {
          this.tableData = []
        }
        this.totalRecords = response.total
        this.loading = false
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
        this.loading = false
      }
    );
  }

  formatAmount(amount: number): string {
    if (amount >= 1e6) {
      const millions = Math.floor(amount / 1e5);
      const remainder = amount % 1e5;
      const thousands = Math.floor(remainder / 1e3);
      const hundreds = remainder % 1e3;
      
      let formattedAmount = '';
      if (millions > 0) {
        formattedAmount += millions + ' Lakh ';
      }
      if (thousands > 0) {
        formattedAmount += thousands + ' Thousand ';
      }
      if (hundreds > 0) {
        formattedAmount += hundreds.toFixed(0) + ' Rupee';
      }
      return formattedAmount.trim();
    } else if (amount >= 1e3) {
      const thousands = Math.floor(amount / 1e3);
      const hundreds = amount % 1e3;
      let formattedAmount = thousands + ' Thousand ';
      if (hundreds > 0) {
        formattedAmount += hundreds.toFixed(0) + ' Rupee';
      }
      return formattedAmount;
    } else {
      return amount.toFixed(0) + ' Rupee';
    }
  }

  getPurchaseOrderReport() {
    this.loading = true
    this.getPurchaseOrderReportStateDate()
    this.apiService.getPurchaseOrderReport(this.params).subscribe(
      (response) => {
        let temp = response.data;
        delete temp['gross_total'];
        if (Object.values(temp) && Object.values(temp).length > 0) {

          this.tableData = Object.values(temp);
        } else {
          this.tableData = []
        }
        this.totalRecords = response.total
        this.loading = false
        this.fetchWarehouseList()
        this.fetchStoreList()
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
    }
this.getPurchaseOrderReportStateDate()
    this.loading = true
    this.apiService.getPurchaseOrderReport(this.params).subscribe(
      (response) => {
        let temp = response.data;
        delete temp['gross_total'];
        if (Object.values(temp) && Object.values(temp).length > 0) {

          this.tableData = Object.values(temp);
        } else {
          this.tableData = []
        }
        this.totalRecords = response.total
        this.loading = false
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
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
  filterByStore(event) {
    this.params.idstore_warehouse = event.value
    this.selectedWarehouse = undefined
    this.getPurchaseOrderReport()
  }
  filterBywarehouse(event) {
    this.params.idstore_warehouse = event.value
    this.selectedStore = undefined
    this.getPurchaseOrderReport()
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
  selectFields(event) {
    this.params.field = event.value
    this.searchTerm = undefined

  }
  search() {
  
    if (this.searchTerm) {
      this.params.searchTerm = this.searchTerm
      this.getPurchaseOrderReport()
    }

  }
  getPurchaseOrderReportStateDate(): void {
    let tempStats = JSON.parse(JSON.stringify(this.params))
    delete tempStats?.first
    delete tempStats?.rows
    this.apiService.getPurchaseOrderReportStateDate(tempStats).subscribe(
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
