import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { OrderService } from 'src/app/shared/_service/order.service';

@Component({
  selector: 'app-req-req-detail',
  templateUrl: './req-req-detail.component.html',
  styleUrls: ['./req-req-detail.component.scss']
})
export class ReqReqDetailComponent implements OnInit {

  currentDate = new Date();
  search: string;
  from_date: string;
  to_date: string;
  list: any[] = [];
  displayedColumns: string[] = [
    'barcode',
    'brand',
    'prod_name',
    'quantity',
    'squantity',
    'rquantity',
    'batch',
  ];
  dataSource: MatTableDataSource<any>;
  loading: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  order;

  constructor(
    private apiServ: ApiHttpService,
    public location: ActivatedRoute,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReqReqDetailComponent>,
  ) {
    this.order = data.data;
  }

  ngOnInit(): void {
    this.getOrder();
  }

  getOrder() {
    this.loading = true;
      this.apiServ.get(AppSetting.ENDPOINTS.getReqRequestDetail + `/${this.order.idstore_request}`)
      .subscribe((res) => {
          this.list = res;
          this.dataSource = new MatTableDataSource(this.list);
          this.loading = false;
      });
  }
}
