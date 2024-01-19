import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StoreRequest } from 'src/app/shared/_model/store-request';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { StoreWareService } from 'src/app/shared/_service/store-ware.service';

@Component({
  selector: 'app-manage-store-wh-order',
  templateUrl: './manage-store-wh-order.component.html',
  styleUrls: ['./manage-store-wh-order.component.scss']
})
export class ManageStoreWhOrderComponent implements OnInit {

  state$: Observable<object>;
  order: any;

  displayedColumns: string[] = ['idstore_request_detail', 'name', 'barcode', 'quantity', 'quantity_sent', 'batch'];
  dataSource: MatTableDataSource<StoreRequest>;
  StoreData: [StoreRequest];
  loading: boolean = false;
  page: number = 1;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public activatedRoute: ActivatedRoute, private StoreServ: StoreWareService,
    private router: Router,
    private alertServ: AlertService,) {
    if (this.router.getCurrentNavigation()!.extras.state) {
      this.order = this.router.getCurrentNavigation()!.extras.state!.data;
      this.getOrderDetail();
    }
    else {
      this.router.navigate(['/ggb-admin/order-to-warehouse'])
    }
  }

  ngOnInit(): void {

  }

  getOrderDetail() {
    this.loading = true;
    this.StoreServ.getStoreOrderDetail(this.order.idstore_request)
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

  dispatch() {
    this.loading = true;
    this.StoreServ.dispatchStoreOrder(this.StoreData)
      .subscribe(
        data => {
          this.loading = false;
          this.router.navigate(['/ggb-admin/order-to-warehouse'])
        },
        error => {
          this.alertServ.error(error);
          this.loading = false;
        });
  }

  getBatchName(currBatch, row){
    if(currBatch.name == "BASE")
    {
      row.selected_batch = currBatch.idproduct_batch;
    }
    return currBatch.name + ' - ' + currBatch.mrp
  }

}
