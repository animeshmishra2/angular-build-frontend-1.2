import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
import { StoreRequest } from 'src/app/shared/_model/store-request';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { StoreWareService } from 'src/app/shared/_service/store-ware.service';

@Component({
  selector: 'app-order-to-warehouse',
  templateUrl: './order-to-warehouse.component.html',
  styleUrls: ['./order-to-warehouse.component.scss']
})
export class OrderToWarehouseComponent implements OnInit {

  displayedColumns: string[] = ['idstore_request', 'name', 'dispatch_date', 'created_at', 'status', 'action'];
  dataSource: MatTableDataSource<StoreRequest>;
  StoreData: [StoreRequest];
  loading: boolean = false;
  page:number = 1;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private StoreServ: StoreWareService,
    private router:Router,
    private alertServ: AlertService,) {
  }
  ngOnInit(): void {
    this.getStores();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getStores() {
    this.loading = true;
    this.StoreServ.getAllStoreOrders(this.page)
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
  editItem(row) {
    this.router.navigate(['/ggb-admin/manage-sw-order'], { state: { data: row } });
  }

  getDispatchStatus(status){
    let stat:string;
    switch(status){
      case 1:
      stat = "Pending";
      break;
      case 2:
      stat = "Dispatched";
      break;
      case 3:
      stat = "Accepted";
      break;
      case 4:
      stat = "Discrepency";
      break;
      default:
        stat = "Unknown"
    }
    return stat;
  }

  acceptItem(row){
    this.router.navigate(['/ggb-admin/accept-sw-order'], { state: { data: row } });
  }
}
