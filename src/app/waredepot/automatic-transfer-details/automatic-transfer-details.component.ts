import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
@Component({
  selector: 'app-automatic-transfer-details',
  templateUrl: './automatic-transfer-details.component.html',
  styleUrls: ['./automatic-transfer-details.component.scss']
})
export class AutomaticTransferDetailsComponent implements OnInit {

  currentDate = new Date();
  search: string;
  from_date: string;
  to_date: string;
  displayedColumns: string[] = [
    'prod_name',
    'barcode',
    'totalquantity',
    'sendq',
    'receivedq',
    'batch',
    'batchmrp',
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
    public dialogRef: MatDialogRef<AutomaticTransferDetailsComponent>,
  ) {
    this.bill = data.data;
  }

  ngOnInit(): void {
    this.getBillDetail();
   
    
  }

  getBillDetail() {
    this.loading = true;
    this.apiService.get(AppSetting.ENDPOINTS.getAutotransferDetails + `/${this.bill?.id}`).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    });
  }
}
