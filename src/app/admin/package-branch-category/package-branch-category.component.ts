import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreWare } from 'src/app/shared/_model/store-ware';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { StoreWareService } from 'src/app/shared/_service/store-ware.service';
import { AddEditPackageBrandCategoryComponent } from './add-edit-package-brand-category/add-edit-package-brand-category.component';
import { EditUpdateBrandCategryComponent } from './edit-update-brand-categry/edit-update-brand-categry.component';

@Component({
  selector: 'app-package-branch-category',
  templateUrl: './package-branch-category.component.html',
  styleUrls: ['./package-branch-category.component.scss']
})
export class PackageBranchCategoryComponent implements OnInit {

  displayedColumns: string[] = ['applicable_for', 'applicable_on', 'valid_from', 'valid_till','status', 'action'];
  dataSource: MatTableDataSource<StoreWare>;
  storeWareData: [StoreWare];
  loading: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isStore: boolean;
  sw: any;

  constructor(private storeWareServ: StoreWareService,
    private alertServ: AlertService, private router: Router,
    public dialog: MatDialog, private route: ActivatedRoute) {
      if (this.router.getCurrentNavigation()!.extras.state) {
        this.sw = this.router.getCurrentNavigation()!.extras.state!.data;
      }
      else {
        this.router.navigate(['/ggb-admin'])
      }
  }
  ngOnInit(): void {
    this.isStore = (this.route.snapshot.paramMap.get('type') === 'store') ? true : false;
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
    this.storeWareServ.getAllPackageList(this.sw.idstore_warehouse)
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

  AddItem() {
    const dialogRef = this.dialog.open(AddEditPackageBrandCategoryComponent, {
      width: '80%',
      data: { data: this.sw.idstore_warehouse }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.manual == false) {
        this.getStoreWares();
        this.alertServ.openSnackBar("Sucessfully Created ", "OK");
      }
    });

  }
  editItem(row){
    this.storeWareServ.getbyIdpackage(row?.iddiscount)
    .subscribe(
      data => {
        const dialogRef = this.dialog.open(EditUpdateBrandCategryComponent, {
          width: '80%',
          data: { data: data }
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result && result.manual == false) {
            this.getStoreWares();
            this.alertServ.openSnackBar("Sucessfully Updated ", "OK");
          }
        });
      },
      error => {
        this.alertServ.error(error);
        this.loading = false;
      });
   
  }
}
