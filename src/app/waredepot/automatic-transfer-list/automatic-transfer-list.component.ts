import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { AutomaticTransferDetailsComponent } from '../automatic-transfer-details/automatic-transfer-details.component';

@Component({
  selector: 'app-automatic-transfer-list',
  templateUrl: './automatic-transfer-list.component.html',
  styleUrls: ['./automatic-transfer-list.component.scss']
})
export class AutomaticTransferListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'address', 'city', 'pincode', 'action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumnsRequest: string[] = [
    'id',
    'store_to',
    'dipatch_date',
    'action'
  ];
  dataSourceRequst: MatTableDataSource<any>;
  loading: boolean = false;
  @ViewChild(MatPaginator) paginatorrequest: MatPaginator;
  @ViewChild(MatSort) sortrequest: MatSort;
  constructor(
    private apiServ: ApiHttpService,
    private alertService: AlertService,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute) {
      
  }
  ngOnInit(): void {
    this.getSW();
    this.getBillDetail();
  }
  getSW() {
    this.apiServ.get(AppSetting.ENDPOINTS.allSWExceptMine).subscribe(
      (data) => {
       this.dataSource = new MatTableDataSource (data);
      },
      (error) => {
        this.alertService.error(error);
      }
    );
  }

  transfer(event) {
    console.log("event ", event);
    this.router.navigate(['/warehouse/automatic-transfer-product'], {
      state: { data: event } // Pass object using state
    });
  }

  openDetails(row){
    console.log("row",row);
    
    const dialogRef = this.dialog.open(AutomaticTransferDetailsComponent, {
      width: '80%',
      data: { data: row }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  transferRequestList(event) {
    console.log("event ", event);
    this.router.navigate(['/warehouse/automatic-transfer-request-list'], {
      state: { data: event } // Pass object using state
    });
  }

  getBillDetail() {
    this.loading = true;
    this.apiServ.get(AppSetting.ENDPOINTS.getAutorequestList).subscribe((res) => {
      console.log("response",res);
      
      this.dataSourceRequst = new MatTableDataSource(res);
      this.dataSourceRequst.paginator = this.paginatorrequest;
      this.dataSourceRequst.sort = this.sortrequest;
      this.loading = false;
    });
  }
}
