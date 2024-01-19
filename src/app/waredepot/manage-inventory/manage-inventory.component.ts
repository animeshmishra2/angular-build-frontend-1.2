import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { AuthenticationService } from 'src/app/shared/_service/authentication.service';
import { CartService } from 'src/app/shared/_service/cart.service';
import { OrderService } from 'src/app/shared/_service/order.service';
import { ProductService } from 'src/app/shared/_service/product.service';
import { UserService } from 'src/app/shared/_service/user.service';

@Component({
  selector: 'app-manage-inventory',
  templateUrl: './manage-inventory.component.html',
  styleUrls: ['./manage-inventory.component.scss'],
})
export class ManageInventoryComponent implements OnInit {
  displayedColumns: string[] = ['barcode', 'prod_name','brand', 'quantity', 'ltype', 'mrp', 'sp', 'quantity', 'idp', 'action'];
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
    private prodServ: ProductService,
    private alertService: AlertService,
    public router: Router,
    public cartServ: CartService,
    public dialog: MatDialog,
    private httpServ: ApiHttpService
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
    this.prodServ.getProductsByBarcode(barcode, this.isExactSearch).subscribe(
      (data) => {
        this.products = data.data;
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
  
  updateQty(p) {
    this.loading = true;
    console.log(p);
    
    this.httpServ.post(AppSetting.ENDPOINTS.updateInventorySP,
      {
        "idproduct_master": p["idproduct_master"],
        "idinventory": p["idinventory"],
        "idstore_warehouse": this.currentUser.idwarehouse,
        "selling_price": !(+p["nselling_price"]) ? p["selling_price"] : +p["nselling_price"],
        "instant_discount_percent": !(+p["ninstant_discount_percent"]) ? p["instant_discount_percent"] : +p["ninstant_discount_percent"],
        "listing_type": p["listing_type"],
      }
    ).subscribe(
      data => {
        this.loading = false;
        this.alertService.openSnackBar("Product Updated");
        console.log(this.search);
        
        const searchTxt = (!!this.search) ? this.search : 1;
        console.log(searchTxt);
        
        this.getProducts(searchTxt);
      },
      error => {
        this.alertService.error(error);
        this.loading = false;
    });
  }
}
