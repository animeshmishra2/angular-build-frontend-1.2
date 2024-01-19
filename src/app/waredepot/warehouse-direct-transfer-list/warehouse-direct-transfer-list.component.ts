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
// import { ReqReqDetailComponent } from './req-req-detail/req-req-detail.component';

@Component({
  selector: 'app-warehouse-direct-transfer-list',
  templateUrl: './warehouse-direct-transfer-list.component.html',
  styleUrls: ['./warehouse-direct-transfer-list.component.scss']
})
export class WarehouseDirectTransferListComponent implements OnInit {

  displayedColumns: string[] = ['idstore_request', 'req', 'status', 'request_date', 'updated_at', 'action'];
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
      'status': (this.status.toLowerCase() == 'all') ? null : this.status,
      'isMyReqReq': this.isMyReqReq
    }
    this.apiServ.post(AppSetting.ENDPOINTS.allStoreRequest, req)
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
  editItem(row) {
    // const dialogRef = this.dialog.open(ReqReqDetailComponent, {
    //   width: '80%',
    //   data: { data: row }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result && result.manual == false) {
    //     this.getAll();
    //     this.alertServ.openSnackBar("Sucessfully Updated ", "OK");
    //   }
    // });
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
  createNew() {
    this.router.navigate(['/warehouse/warehouse-direct-transfer-create']);
  }
  review(row) {
    this.router.navigate(['inventory/review-dispatch-request'], { state: { data: row } });
  }

}
