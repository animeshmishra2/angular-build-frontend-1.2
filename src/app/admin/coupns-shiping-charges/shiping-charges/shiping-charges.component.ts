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
import { AddEditShippingChargesComponent } from './add-edit-shipping-charges/add-edit-shipping-charges.component';
// import { AddEditBannerComponent } from './add-edit-banner/add-edit-banner.component';
@Component({
  selector: 'app-shiping-charges',
  templateUrl: './shiping-charges.component.html',
  styleUrls: ['./shiping-charges.component.scss']
})
export class ShipingChargesComponent implements OnInit {

  
  displayedColumns: string[] = ['title','orderamount','shipingcharge','updateby','action'];
  dataSource: MatTableDataSource<StoreWare>;
  storeWareData: [StoreWare];
  loading: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isStore: boolean;

  constructor(private bannerofferServ: BannerOfferService,
    private alertServ: AlertService, private router:Router,
    public dialog: MatDialog, private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.isStore = (this.route.snapshot.paramMap.get('type') === 'store') ? true : false;
    this.getBanners();
  }

  getBanners() {
    this.loading = true;
    this.bannerofferServ.getShipingcharges()
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
    this.bannerofferServ.deleteShipingCharge(row?.id).subscribe((data: any) => {
      this.getBanners();
    },
      (error) => {
        this.alertServ.error(error);
        this.loading = false;
      });
  }
  editItem(row) { 
    console.log("row",row);
    
    row['is_store'] = this.isStore;
    const dialogRef = this.dialog.open(AddEditShippingChargesComponent, {
      width: '80%',
      data: { data: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.manual == false) {
        this.getBanners();
        // this.alertServ.openSnackBar("Sucessfully Updated " + ((this.isStore) ? 'Store' : 'Warehouse'), "OK");
      }
    });

  }
  counters(row) {
    this.router.navigate(['/ggb-admin/view-counters'], { state: { data: row } });
  }

  package(row){
    console.log(row);
    
    this.router.navigate(['/ggb-admin/view-package'], { state: { data: row } });
  }
  manageStaffAccess(row){
    this.router.navigate(['/ggb-admin/staff-access'], { state: { data: row } });
  }

}
