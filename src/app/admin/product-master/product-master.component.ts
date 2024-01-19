import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { AuthenticationService } from 'src/app/shared/_service/authentication.service';
import { CartService } from 'src/app/shared/_service/cart.service';
import { EditProductMasterComponent } from './edit-product-master/edit-product-master.component';

@Component({
  selector: 'app-product-master',
  templateUrl: './product-master.component.html',
  styleUrls: ['./product-master.component.scss']
})
export class ProductMasterComponent implements OnInit {

  displayedColumns: string[] = ['idproduct_master', 'barcode', 'name', 'brand', 'category', 'action'];
  loading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  products: any = [];
  search: string;
  dataSource: MatTableDataSource<any>;
  currentUser: any;
  isExactSearch = true;
  customInput: Subject<string> = new Subject();

  constructor(
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    public router: Router,
    public cartServ: CartService,
    public dialog: MatDialog,
    public apiServ:ApiHttpService
  ) { }
  ngOnInit(): void {
    this.currentUser = this.authenticationService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(['login']);
    }
    this.getProducts('1');
    this.customInput.pipe(debounceTime(350)).subscribe(value => {
      this.search = value;
      if (value.length > 0) {
        this.getProducts(value);
      } else {
        this.getProducts('1');
      }
    });
  }

  doSearch(barcode) {
    this.customInput.next(barcode);
  }
  getProducts(barcode) {
    this.loading = true;
    let url = AppSetting.ENDPOINTS.getProductMaster + `/${barcode}`;
    if(this.isExactSearch && barcode != '1'){
      url += '/'+1;
    }
    this.apiServ.get(url).subscribe(
      (data) => {
        this.products = data;
        console.log(this.products);
        
        this.dataSource = new MatTableDataSource(this.products);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        this.alertService.error(error);
        this.loading = false;
      }
    );
  }
  
  editItem(row) {
    const dialogRef = this.dialog.open(EditProductMasterComponent, {
      width: '80%',
      data: { data: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.manual == false) {
        this.getProducts(1);
        this.alertService.openSnackBar("Sucessfully Updated ", "OK");
      }

    });

  }
}
