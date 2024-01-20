import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';

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
  constructor(
    private apiServ: ApiHttpService,
    private alertService: AlertService,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute) {
      
  }
  ngOnInit(): void {
    this.getSW();
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
}
