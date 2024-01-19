import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { Package } from 'src/app/shared/_model/common';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { CounterService } from 'src/app/shared/_service/counter.service';
import { AddEditCountersComponent } from '../store-warehouse/add-edit-counters/add-edit-counters.component';
import { CreateLandingComponent } from './create-landing/create-landing.component';
import { EditPackageComponent } from './edit-package/edit-package.component';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss']
})
export class PackageComponent implements OnInit {


  state$: Observable<object>;
  sw: any;

  displayedColumns: string[] = ['idpackage', 'name', 'applicable_on', 'frequency', 'status', 'action'];
  dataSource: MatTableDataSource<Package>;
  package: [Package];
  loading: boolean = false;
  page: number = 1;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  

  constructor(
    public activatedRoute: ActivatedRoute, 
    private countServ: CounterService,
    private router: Router, 
    public dialog: MatDialog,
    private alertServ: AlertService,
    private apiService: ApiHttpService) {
      
    if (this.router.getCurrentNavigation()!.extras.state) {
      this.sw = this.router.getCurrentNavigation()!.extras.state!.data;
      this.getPackage();
      console.log(this.sw);
    }
    else {
      this.router.navigate(['/ggb-admin'])
    }
  }

  ngOnInit(): void {

  }

  getPackage() {
    this.loading = true;
    this.apiService.get(AppSetting.ENDPOINTS.getPackageList + "/" + this.sw.idstore_warehouse)
      .subscribe(
        data => {
          this.package = data;
          this.dataSource = new MatTableDataSource(this.package);
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

  createItem(row) {
    const dialogRef = this.dialog.open(CreateLandingComponent, {
      width: '80%',
      data: { data: row, parent: this.sw }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.package > 0) {
        this.router.navigate(["ggb-admin/create-package", result.package, this.sw.idstore_warehouse]);
      }

    });

  }

  editItem(row) {
    const dialogRef = this.dialog.open(EditPackageComponent, {
      width: '80%',
      data: { data: row }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.updated) {
        this.getPackage();
      }
    });
  }

}
