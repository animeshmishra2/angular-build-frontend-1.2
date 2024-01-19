import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ConfirmOrderComponent } from 'src/app/pos/new-order/confirm-order/confirm-order.component';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';

@Component({
  selector: 'app-bill-transfer-list',
  templateUrl: './bill-transfer-list.component.html',
  styleUrls: ['./bill-transfer-list.component.scss']
})
export class BillTransferListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'amount', 'items', 'action'];
  dataSource: MatTableDataSource<any>;
  loading: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isMyReqReq: boolean = true;

  from_date: string;
  to_date: string;
  todayDate: Date = new Date();
  status: string = 'all';
  reqs: any = [];
  moment = moment;
  constructor(
    private apiServ: ApiHttpService,
    private alertServ: AlertService,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute) {
    this.route.paramMap.subscribe(paramMap => {
      this.isMyReqReq = (paramMap.get('recreq')) ? false : true;
    });
    console.log(this.isMyReqReq);

  }
  ngOnInit(): void {
    this.getAll();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAll() {
    this.loading = true;
    let req = {
      'valid_from': (this.from_date) ? moment(this.from_date).format('YYYY-MM-DD') : moment().subtract(30, 'days').format('YYYY-MM-DD'),
      'valid_till': (this.to_date) ? moment(this.to_date).format('YYYY-MM-DD') : moment().add(1, 'days').format('YYYY-MM-DD'),
      'idvendor': 0,
      bill_number: ""
    }
    this.apiServ.post(AppSetting.ENDPOINTS.getVendorPurchaseBills, req)
      .subscribe(
        data => {
          this.reqs = data.data;
          this.dataSource = new MatTableDataSource(this.reqs);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.loading = false;
        },
        error => {
          this.alertServ.error(error);
          this.loading = false;
        });
  }

  accept(row) {
    let dialogRef = this.dialog.open(ConfirmOrderComponent, {
      data: { message: `Are you sure to Accept this delivery and Sync Inventory?`, title: 'Sync Inventory' }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let req = {
          'idstore_request': row.idstore_request
        };
        this.apiServ.post(AppSetting.ENDPOINTS.acceptReqReq, req)
          .subscribe(
            data => {
              if (data.statusCode == 0) {
                this.alertServ.openSnackBar("Inventory Sync Success.");
                this.getAll();
              }
              else {
                this.alertServ.openSnackBar("Error in Inventory Sync.");
              }
              this.loading = false;
            },
            error => {
              this.alertServ.error(error);
              this.loading = false;
            });
      }
    });
  }
  transfer(event) {
    console.log("event ", event);
    this.router.navigate(['/warehouse/bill-transfer/new-transfer'], {
      state: { data: event } // Pass object using state
    });
  }
}
