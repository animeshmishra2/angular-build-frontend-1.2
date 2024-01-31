import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from 'src/app/shared/_service/order.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as moment from 'moment';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { AuthenticationService } from 'src/app/shared/_service/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { Router } from '@angular/router';
import { ChangeStatusOnlineOrderComponent } from './change-status-online-order/change-status-online-order.component';
@Component({
  selector: 'app-online-order',
  templateUrl: './online-order.component.html',
  styleUrls: ['./online-order.component.scss']
})
export class OnlineOrderComponent implements OnInit {

  currentDate = new Date();
  search: string;
  from_date: string;
  to_date: string;
  todayDate: Date = new Date();
  list: any[] = [];
  counter: string = "current";
  orderNum: string = '';
  totalAmount: number = 0;
  totalCash: number = 0;
  totalOnline: number = 0;
  order_type: number = 0;
  pay_mode: string = '';
  displayedColumns: string[] = [
    'counterName',
    'idcustomer_order',
    'idcustomer',
    'pay_mode',
    'total_quantity',
    'total_price',
    'bill_date',
    'status',
    'action',
  ];
  dataSource: MatTableDataSource<any>;
  loading: boolean = false;
  moment = moment;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private orderServ: OrderService,
    public dialog: MatDialog,
    private apiService: ApiHttpService,
    private alertService: AlertService,
    private router: Router,
    private authSer: AuthenticationService,) { }

  ngOnInit(): void {
    this.getOrder();
  }

  getOrder() {
    this.loading = true;

    // let req = {
    //   'valid_from': (this.from_date) ? moment(this.from_date).format('YYYY-MM-DD') : moment().subtract(30, 'days').format('YYYY-MM-DD'),
    //   'valid_till': (this.to_date) ? moment(this.to_date).format('YYYY-MM-DD') : moment().add(1, 'days').format('YYYY-MM-DD'),
    //   'order_number': this.orderNum,
    //   'order_type': this.order_type,
    //   'pay_mode': this.pay_mode,
    //   'idcounter': (this.counter == 'current') ? this.authSer.currentUserValue.counter_detail[0].idcounter : 0
    // }
    this.apiService.get(AppSetting.ENDPOINTS.getonlineOrders)
      .subscribe(
        data => {
          this.list = data;
          this.dataSource = new MatTableDataSource(this.list);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          // this.from_date = req.valid_from;
          // this.to_date = req.valid_till;
          this.totalAmount = 0;
          this.totalCash = 0;
          this.totalOnline = 0;
          this.list.forEach(ord => {
            if (ord.pay_mode === "cash") {
              this.totalCash += ord.total_price;
            }
            else {
              this.totalOnline += ord.total_price;
            }
            this.totalAmount += ord.total_price;
          });
        },
        error => {
          this.alertService.openSnackBar(error);
          this.loading = false;
        });
  }

  openOrder(row, isCancel = false) {
      this.router.navigate(['/pos/cancel-order'], {
        state: {
          data: {
            data: row,
            is_cancel: isCancel
          }
        }
      });
  }

  changeStatus(row) {
    const dialogRef = this.dialog.open(ChangeStatusOnlineOrderComponent, {
      width: '80%',
      data: { data: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.getAllCoupns();
        // this.alertServ.openSnackBar("Sucessfully Updated " + ((this.isStore) ? 'Store' : 'Warehouse'), "OK");
      }
    });

  }

}
