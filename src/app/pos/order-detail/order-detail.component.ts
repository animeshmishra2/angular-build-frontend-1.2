import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { OrderService } from 'src/app/shared/_service/order.service';
import * as moment from 'moment';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  currentDate = new Date();
  search: string;
  from_date: string;
  to_date: string;
  list: any[] = [];
  isCancel: boolean = false;
  displayedColumns: string[] = [
    'brand',
    'prod_name',
    'description',
    'hsn',
    'quantity',
    'unit_mrp',
    'sgst_percent',
    'cgst_percent',
    'discount',
    'total_price',
    'unit_selling_price',
    'pkg',
    'return_exch',
    'select'
  ];
  selection = new SelectionModel<any>(true, []);
  dataSource: MatTableDataSource<any>;
  loading: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  order;

  constructor(
    private orderServ: OrderService,
    public location: ActivatedRoute,
    public router: Router,
    public apiServ: ApiHttpService,
    public alertService: AlertService,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    // public dialogRef: MatDialogRef<OrderDetailComponent>,
  ) {
    if (this.router.getCurrentNavigation()!.extras.state) {
      let stateData = this.router.getCurrentNavigation()!.extras.state!.data;
      console.log(stateData);
      this.order = stateData.data;
      this.isCancel = stateData.is_cancel;
      console.log(this.isCancel);
    }
    else {
      this.router.navigate(['/pos/counter-order'])
    }
  }

  ngOnInit(): void {
    this.getOrder();
  }

  getOrder() {
    this.loading = true;
    this.location.params.subscribe((data) => {
      this.orderServ.getOrderDetails(this.order['idcustomer_order']).subscribe((res) => {
        if (res.statusCode == 0) {
          this.list = res.data;
          this.dataSource = new MatTableDataSource(this.list);
        }
        this.loading = false;
      });
    });
  }

  doSearch(event) { }
  printReceipt() {
    let req = this.order['idcustomer_order'];
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`${AppSetting.UI_SUBPATH}/pos/recipt/${req}`])
    );
    console.log(url);

    window.open(url, '_blank');
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = (this.dataSource) ? this.dataSource.data.length : 0;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  cancelOrder(cancelComplete = true) {
    if (cancelComplete) {
      this.selection.select(...this.dataSource.data);
    }
    console.log(this.selection.selected);
    let req = {
      idcustomer_order: this.order.idcustomer_order,
      order_to_cancel: this.selection.selected
    };

    this.loading = true;
    this.location.params.subscribe((data) => {
      this.apiServ.post(AppSetting.ENDPOINTS.cancelOrder, req).subscribe((res) => {
        if (res.statusCode == 0) {
          this.alertService.openSnackBar("Order Cancelled");
          this.getOrder();
          this.printReceipt();
        }
        else {
          this.alertService.openSnackBar("Error: Unable to cancel.")
        }
        this.loading = false;
      });
    });

  }

  returnActive(row) {
    let isReturnDisable = true;
    if(row.status == 0)
    {
      return isReturnDisable;
    }
    if (row.has_return_rule === 'Y') {
      let ordDate = moment(this.order['created_at']).startOf('day');
      var currDate = moment().startOf('day');
      let dayWindow = currDate.diff(ordDate, 'days');      
      if (dayWindow >= 0 && dayWindow < row.return_duration) {
        isReturnDisable = false;
      }
    }
    return isReturnDisable;
  }
}
