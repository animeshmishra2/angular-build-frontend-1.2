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
@Component({
  selector: 'app-attribute-list',
  templateUrl: './attribute-list.component.html',
  styleUrls: ['./attribute-list.component.scss']
})
export class AttributeListComponent implements OnInit {

  
  displayedColumns: string[] = ['name','created','updateby','action'];
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
    this.getAttribute();
  }

  getAttribute() {
    this.loading = true;
    this.bannerofferServ.getAttributeList()
      .subscribe(
        data => {
          console.log("data",data);
          
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
  // deleteItem(row) {
  //   this.alertServ.confirmDialog("Are you sure to Delete").subscribe((res) => {
  //     console.log("res",res);
  //     if (res == true) {
  //       this.bannerofferServ.deleteShipingCharge(row?.id).subscribe((data: any) => {
  //         this.getAttribute();
  //       },
  //         (error) => {
  //           this.alertServ.error(error);
  //           this.loading = false;
  //         });
  //     } else {
  //       return
  //     }
     
  //   });
    
  // }
  editItem(row) { 
    console.log("row",row);
    
    row['is_store'] = this.isStore;
    const dialogRef = this.dialog.open(AddAttributeNameComponent, {
      width: '80%',
      data: { data: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAttribute();
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
