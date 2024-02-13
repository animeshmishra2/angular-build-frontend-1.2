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
import { AddNewVariantComponent } from './add-new-variant/add-new-variant.component';
import { DisableVariantComponent } from './disable-variant/disable-variant.component';

@Component({
  selector: 'app-variant-all',
  templateUrl: './variant-all.component.html',
  styleUrls: ['./variant-all.component.scss']
})
export class VariantAllComponent implements OnInit {

  displayedColumns: string[] = ['name', 'barcode', 'hsn', 'attribute','created', 'action'];
  loading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  products: any = [];
  search: string;
  dataSource: MatTableDataSource<any>;
  currentUser: any;
  isExactSearch = true;
  customInput: Subject<string> = new Subject();
  sw: any;

  constructor(
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    public router: Router,
    public cartServ: CartService,
    public dialog: MatDialog,
    public apiServ: ApiHttpService
  ) {
    if (this.router.getCurrentNavigation()!.extras.state) {
      this.sw = this.router.getCurrentNavigation()!.extras.state!.data;
    }
    console.log("thiss",this.sw);
    
    if (this.sw){
      console.log("true");
      
      this.getProducts();
    }
   }
  ngOnInit(): void {
   
   
  }

  doSearch(barcode) {
    this.customInput.next(barcode);
  }
  getProducts() {
    this.loading = true;
    let url = AppSetting.ENDPOINTS.getProductvariants + `/${this.sw?.idproduct_master}`;
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

  // manageVarient(row: any) {
  //   const dialogRef = this.dialog.open(ManageVarientComponent, {
  //     width: '80%',
  //     data: { data: row }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result && result.manual == false) {
  //       this.getProducts(1);
  //       this.alertService.openSnackBar("Sucessfully Updated ", "OK");
  //     }
  //   });
  // }

  editItem() {
    const dialogRef = this.dialog.open(AddNewVariantComponent, {
      width: '100%',
      data: { data: this.sw }
    });

    dialogRef.afterClosed().subscribe(result => {
      // if (result) {
      //   this.getProducts(1);
      //   this.alertService.openSnackBar("Sucessfully Updated ", "OK");
      // }

    });

  }

  editVariant(data) {
    const dialogRef = this.dialog.open(AddNewVariantComponent, {
      width: '100%',
      data: { data: data }
    });

    dialogRef.afterClosed().subscribe(result => {
      // if (result) {
      //   this.getProducts(1);
      //   this.alertService.openSnackBar("Sucessfully Updated ", "OK");
      // }

    });

  }

  Disable(row) {
    const dialogRef = this.dialog.open(DisableVariantComponent, {
      width: '100%',
      data: { data: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      // if (result) {
      //   this.getProducts(1);
      //   this.alertService.openSnackBar("Sucessfully Updated ", "OK");
      // }

    });
    // this.alertService.confirmDialog("Are you sure to Delete").subscribe((res) => {
    //   console.log("res",res);
    //   console.log("row",row);
    //   if (res == true) {
    //     let req = {
    //       idproduct_variant : row?.idproduct_variant,
    //       attributes : row?.attributes
    //     }
    //     let url = AppSetting.ENDPOINTS.disableVariant;
    //     this.apiServ.patch(url, req).subscribe((data: any) => {
    //     },
    //       (error) => {
    //         this.alertService.error(error);
    //         this.loading = false;
    //       });
    //   } else {
    //     return
    //   }
     
    // });
    
  }

}
