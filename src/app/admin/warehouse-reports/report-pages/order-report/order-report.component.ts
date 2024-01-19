import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem } from 'primeng/api';
import { ReportApiService } from 'src/app/shared/_service/report-apis/report-api.service';

export interface Product {
  Order_No: number;
  Date: string;
  Counter_Name: number;
  Customer_name: string;
  Biller_name: string;
  Discount_Coupon: string;
  Profit_per_bill: number;
}

@Component({
  selector: 'app-order-report',
  templateUrl: './order-report.component.html',
  styleUrls: ['./order-report.component.scss'],
})
export class OrderReportComponent implements OnInit {
  dateRange!: Date[]
  products: Product[] = [
    {
      Order_No: 3147483644,
      Date: '2023-11-07T14:14:38.000000Z',
      Counter_Name: 13,
      Customer_name: 'John Doe',
      Biller_name: 'Test User',
      Discount_Coupon: 'CDA',
      Profit_per_bill: 218,
    },
    {
      Order_No: 2247483644,
      Date: '2023-12-07T14:14:38.000000Z',
      Counter_Name: 14,
      Customer_name: 'Peter Hemavan',
      Biller_name: 'Test User',
      Discount_Coupon: 'CDA',
      Profit_per_bill: 128,
    },
    {
      Order_No: 2147483644,
      Date: '2023-12-03T14:14:38.000000Z',
      Counter_Name: 12,
      Customer_name: 'Thomas Smith',
      Biller_name: 'Test User',
      Discount_Coupon: 'CDA',
      Profit_per_bill: 348,
    },
  ];
  tableData?: any

  actionMenuItems: MenuItem[];
  selectedProduct?: Product;
  selectedProducts: Product[];
  showOrder: boolean = false;

  constructor(private apiService: ReportApiService, private spinner: NgxSpinnerService){}
async ngOnInit() {
    this.actionMenuItems = [
      {
        label: 'View Bill',
        icon: 'pi pi-eye',
        command: (event) => {
          this.viewBill(event);
        },
      },
      {
        label: 'Print Bill',
        icon: 'pi pi-print',
        command: () => {
          this.printBill();
        },
      },
    ];
  }

  fetchProductReport(): void {
    this.spinner.show();
    this.apiService.getProductReport().subscribe(
      (response) => {
        this.tableData = response.orders_list
        this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
        this.spinner.hide();
      }
    );
  }

  passEvent(product) {
    this.selectedProduct = undefined;
    this.selectedProduct = product;
    this.selectedProducts = [product]
    console.log(this.selectedProduct);
  }

  viewBill(product) {
    this.showOrder = true;
  }

  printBill() {}

  calculateTotalQuantity(): number {
    // Implement the logic to calculate the total quantity
    return this.products.reduce((total, product) => total + (product.Profit_per_bill || 0), 0);
  }

  filterByDate(){
    let test = this.products.filter((product: any)=>{product.Date > this.dateRange[0] && product.Date < this.dateRange[1]})
    console.log(test);

  }
}
