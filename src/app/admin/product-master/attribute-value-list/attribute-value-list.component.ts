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
import { AddAttributeNameComponent } from '../attribute-list/add-attribute-name/add-attribute-name.component';
import { AddAttributeValueComponent } from './add-attribute-value/add-attribute-value.component';
@Component({
  selector: 'app-attribute-value-list',
  templateUrl: './attribute-value-list.component.html',
  styleUrls: ['./attribute-value-list.component.scss']
})
export class AttributeValueListComponent implements OnInit {

  
  displayedColumns: string[] = ['value','created','updateby','action'];
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
    this.getAttributeValue();
  }

  getAttributeValue() {
    this.loading = true;
    this.bannerofferServ.getAttributeValueList()
      .subscribe(
        data => {
          this.storeWareData = data.data.data;
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
      this.getAttributeValue();
    },
      (error) => {
        this.alertServ.error(error);
        this.loading = false;
      });
  }
  editItem(row) { 
    console.log("row",row);
    
    const dialogRef = this.dialog.open(AddAttributeValueComponent, {
      width: '80%',
      data: { data: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAttributeValue();
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
