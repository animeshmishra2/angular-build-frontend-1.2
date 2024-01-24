import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreWare } from 'src/app/shared/_model/store-ware';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { BannerOfferService } from 'src/app/shared/_service/banners-offers.service';
import { StoreWareService } from 'src/app/shared/_service/store-ware.service';
import { AddEditCoupnsComponent } from './add-edit-coupns/add-edit-coupns.component';
@Component({
  selector: 'app-coupns',
  templateUrl: './coupns.component.html',
  styleUrls: ['./coupns.component.scss']
})
export class CoupnsComponent implements OnInit {


  displayedColumns: string[] = ['name', 'usable_days', 'isgeneral', 'active_from', 'active_till',
    'minordervalue', 'discount', 'uptomax_amount', 'created_at',
    'action'];
  dataSource: MatTableDataSource<StoreWare>;
  storeWareData: [StoreWare];
  loading: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isStore: boolean;

  constructor(private bannerofferServ: BannerOfferService,
    private alertServ: AlertService, private router: Router,
    public dialog: MatDialog, private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.getAllCoupns();
  }

  getAllCoupns() {
    this.loading = true;
    this.bannerofferServ.getAllCoupns()
      .subscribe(
        data => {
          this.storeWareData = data;
          this.dataSource = new MatTableDataSource(this.storeWareData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.loading = false;
        },
        error => {
          this.alertServ.error(error);
          this.loading = false;
        });
  }
  deleteItem(row) {
    this.bannerofferServ.deleteCoupons(row?.idcoupon).subscribe((data: any) => {
      this.getAllCoupns();
    },
      (error) => {
        this.alertServ.error(error);
        this.loading = false;
      });
  }
  editItem(row) {
    row['is_store'] = this.isStore;
    const dialogRef = this.dialog.open(AddEditCoupnsComponent, {
      width: '80%',
      data: { data: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.manual == false) {
        this.getAllCoupns();
        // this.alertServ.openSnackBar("Sucessfully Updated " + ((this.isStore) ? 'Store' : 'Warehouse'), "OK");
      }
    });

  }
  counters(row) {
    this.router.navigate(['/ggb-admin/view-counters'], { state: { data: row } });
  }

  package(row) {
    console.log(row);

    this.router.navigate(['/ggb-admin/view-package'], { state: { data: row } });
  }
  manageStaffAccess(row) {
    this.router.navigate(['/ggb-admin/staff-access'], { state: { data: row } });
  }

}
