import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StoreRequest } from 'src/app/shared/_model/store-request';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { CounterService } from 'src/app/shared/_service/counter.service';
import { StoreWareService } from 'src/app/shared/_service/store-ware.service';
import { AddEditCountersComponent } from '../add-edit-counters/add-edit-counters.component';
import * as moment from 'moment';

@Component({
  selector: 'app-view-counters',
  templateUrl: './view-counters.component.html',
  styleUrls: ['./view-counters.component.scss']
})
export class ViewCountersComponent implements OnInit {

  
  state$: Observable<object>;
  sw: any;

  displayedColumns: string[] = ['idstore_request_detail', 'name', 'live_status', 'action'];
  dataSource: MatTableDataSource<StoreRequest>;
  StoreData: [StoreRequest];
  loading: boolean = false;
  page: number = 1;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public activatedRoute: ActivatedRoute, private countServ: CounterService,
    private router: Router,public dialog: MatDialog,
    private alertServ: AlertService,) {
    if (this.router.getCurrentNavigation()!.extras.state) {
      this.sw = this.router.getCurrentNavigation()!.extras.state!.data;
      this.getCounters();
      console.log(this.sw);
      
    }
    else {
      this.router.navigate(['/ggb-admin'])
    }
  }

  ngOnInit(): void {

  }

  getCounters() {
    this.loading = true;
    this.countServ.getSWCounters(this.sw.idstore_warehouse)
      .subscribe(
        data => {
          this.StoreData = data;
          this.dataSource = new MatTableDataSource(this.StoreData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.loading = false;
        },
        error => {
          this.alertServ.error(error);
          this.loading = false;
        });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editItem(row) {
    const dialogRef = this.dialog.open(AddEditCountersComponent, {
      width: '80%',
      data: { data: row, parent: this.sw }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.manual == false) {
        this.getCounters();
        this.alertServ.openSnackBar("Sucessfully Updated Counter", "OK");
      }

    });

  }
  getLive(row){
    if(row.idstaff > 0)
    {
      return "Active From: " + moment(row.created_at).format('DD-MM-YY h:mm a');
    }
    return "Inactive";
  }
}
