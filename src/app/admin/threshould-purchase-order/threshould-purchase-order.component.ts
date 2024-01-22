import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreWare } from 'src/app/shared/_model/store-ware';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { BannerOfferService } from 'src/app/shared/_service/banners-offers.service';
import { AddEditThresoldPurchaseOrderComponent } from './add-edit-thresold-purchase-order/add-edit-thresold-purchase-order.component';

@Component({
  selector: 'app-threshould-purchase-order',
  templateUrl: './threshould-purchase-order.component.html',
  styleUrls: ['./threshould-purchase-order.component.scss']
})
export class ThreshouldPurchaseOrderComponent implements OnInit {
  displayedColumns: string[] = ['idstore_warehouse', 'name', 'address', 'city', 'action'];
  dataSource: MatTableDataSource<StoreWare>;
  storeWareData: [StoreWare];
  loading: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isStore: boolean;

  constructor(private bannerofferServ: BannerOfferService, private alertServ: AlertService, private router: Router,
    public dialog: MatDialog, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.getThresoldPurchaseOrder();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getThresoldPurchaseOrder() {
    this.loading = true;
    this.bannerofferServ.getThresoldPurchaseOrder().subscribe(data => {
      this.storeWareData = data;
      this.dataSource = new MatTableDataSource(this.storeWareData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    }, error => {
      this.alertServ.error(error);
      this.loading = false;
    });
  }

  deleteItem(row) {
    this.bannerofferServ.deletePurchaseOrder(row?.id).subscribe((data: any) => {
      // this.cancel(false);
    }, (error) => {
      this.alertServ.error(error);
      this.loading = false;
    });
  }

  editItem(row) {
    row['is_store'] = this.isStore;
    const dialogRef = this.dialog.open(AddEditThresoldPurchaseOrderComponent, {
      width: '80%',
      data: { data: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.manual == false) {
        this.getThresoldPurchaseOrder();
        // this.alertServ.openSnackBar("Sucessfully Updated " + ((this.isStore) ? 'Store' : 'Warehouse'), "OK");
      }
    });
  }

}
