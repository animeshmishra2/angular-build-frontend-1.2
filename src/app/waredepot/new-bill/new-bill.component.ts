import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { AuthenticationService } from 'src/app/shared/_service/authentication.service';
import { OrderService } from 'src/app/shared/_service/order.service';
import { BillDetailComponent } from './bill-detail/bill-detail.component';
import { EditNewBillComponent } from './edit-new-bill/edit-new-bill.component';
import { trigger } from '@angular/animations';

@Component({
  selector: 'app-new-bill',
  templateUrl: './new-bill.component.html',
  styleUrls: ['./new-bill.component.scss']
})
export class NewBillComponent implements OnInit {
  currentDate = new Date();
  search: string;
  from_date: string;
  to_date: string;
  todayDate: Date = new Date();
  list: any[] = [];
  vendors: any[] = [];
  vendor: any = 0;
  orderNum: string = '';
  totalAmount: number = 0;
  totalPaid: number = 0;
  totalPending: number = 0;
  displayedColumns: string[] = [
    'bill_number',
    'vendor',
    'total',
    'pending_value',
    'bill_remark',
    'items',
    'paid',
    'created_at',
    'action',
  ];
  dataSource: MatTableDataSource<any>;
  loading: boolean = false;
  moment = moment;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalarticleAmount: number = 0;

  constructor(private orderServ: OrderService,
    public dialog: MatDialog,
    private apiService: ApiHttpService,
    private alertService: AlertService,
    private authSer: AuthenticationService,) { }

  ngOnInit(): void {
    this.getAll();
    this.getVendors();
  }

  getAll() {
    this.loading = true;
    let req = {
      'valid_from': (this.from_date) ? moment(this.from_date).format('YYYY-MM-DD') : moment().subtract(30, 'days').format('YYYY-MM-DD'),
      'valid_till': (this.to_date) ? moment(this.to_date).format('YYYY-MM-DD') : moment().add(1, 'days').format('YYYY-MM-DD'),
      'bill_number': this.orderNum,
      'idvendor': (this.vendor == 'all') ? 0 : this.vendor
    }
    this.apiService.post(AppSetting.ENDPOINTS.getVendorBills, req)
      .subscribe(
        data => {
          this.list = data.data;
          this.dataSource = new MatTableDataSource(this.list);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.from_date = req.valid_from;
          this.to_date = req.valid_till;
          this.totalAmount = 0;
          this.totalPaid = 0;
          this.totalPending = 0;
          this.list.forEach(ord => {
            this.totalPaid += ord.paid;
            this.totalPending += (ord.total - ord.paid);
            this.totalAmount += ord.total;
            this.totalarticleAmount += Number(ord.pending_value);
          });
        },
        error => {
          this.alertService.openSnackBar(error);
          this.loading = false;
        });
  }

  editItem(row) {
    const dialogRef = this.dialog.open(EditNewBillComponent, {
      width: '90%',
      maxHeight: '90vh',
      data: { data: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("trigger",result);
      
      if (result && result.manual == false) {
        this.getAll();
        this.alertService.openSnackBar("Sucessfully Updated ", "OK");
      }

    });
  }
  openDetails(row){
    const dialogRef = this.dialog.open(BillDetailComponent, {
      width: '80%',
      data: { data: row }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  getVendors() {
    this.loading = true;
    this.apiService.get(AppSetting.ENDPOINTS.vendor)
      .subscribe(
        data => {
          this.vendors = data;
          this.loading = false;
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }
}
