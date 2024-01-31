import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreWare } from 'src/app/shared/_model/store-ware';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { StoreWareService } from 'src/app/shared/_service/store-ware.service';
import { EditStoreWareComponent } from './edit-store-ware/edit-store-ware.component';

@Component({
  selector: 'app-store-warehouse',
  templateUrl: './store-warehouse.component.html',
  styleUrls: ['./store-warehouse.component.scss']
})
export class StoreWarehouseComponent implements OnInit {

  displayedColumns: string[] = ['idstore_warehouse', 'name', 'address', 'city', 'action'];
  dataSource: MatTableDataSource<StoreWare>;
  storeWareData: [StoreWare];
  loading: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isStore: boolean;

  constructor(private storeWareServ: StoreWareService,
    private alertServ: AlertService, private router:Router,
    public dialog: MatDialog, private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    console.log(this.route.snapshot.paramMap.get('type'));

    this.isStore = (this.route.snapshot.paramMap.get('type') === 'store') ? true : false;
    console.log(this.isStore);
    this.getStoreWares();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getStoreWares() {
    this.loading = true;
    console.log(this.isStore);

    this.storeWareServ.getStoresWare({ 'is_store': this.isStore })
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
  editItem(row) { 
    row['is_store'] = this.isStore;
    const dialogRef = this.dialog.open(EditStoreWareComponent, {
      width: '80%',
      data: { data: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.manual == false) {
        this.getStoreWares();
        this.alertServ.openSnackBar("Sucessfully Updated " + ((this.isStore) ? 'Store' : 'Warehouse'), "OK");
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

  coupn(row){
    console.log("rowww",row);
    
    this.router.navigate(['/ggb-admin/package-by-branch-category'], { state: { data: row } });
  }
}

