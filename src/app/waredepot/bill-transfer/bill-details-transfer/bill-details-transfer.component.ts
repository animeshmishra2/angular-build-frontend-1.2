import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';

@Component({
  selector: 'app-bill-details-transfer',
  templateUrl: './bill-details-transfer.component.html',
  styleUrls: ['./bill-details-transfer.component.scss']
})
export class BillDetailsTransferComponent implements OnInit {

  currentDate = new Date();
  search: string;
  from_date: string;
  to_date: string;
  displayedColumns: string[] = [
    'prod_name',
    'hsn',
    'quantity',
    'mrp',
    'selling_price',
    'product_price',
    'copartner_price',
    'land_price',
    'unit_purchase_price',
    'total',
    'expiry',
  ];
  dataSource: MatTableDataSource<any>;
  loading: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  bill;

  constructor(
    private apiService: ApiHttpService,
    public location: ActivatedRoute,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BillDetailsTransferComponent>,
  ) {
    this.bill = data.data;
    console.log("bill",this.bill);
  }

  ngOnInit(): void {
    this.getBillDetail();
   
    
  }

  getBillDetail() {
    this.loading = true;
    this.apiService.get(AppSetting.ENDPOINTS.getVendorBillDetail + `/${this.bill?.id}`).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    });
  }
}
