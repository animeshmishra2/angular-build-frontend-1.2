import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { AuthenticationService } from 'src/app/shared/_service/authentication.service';
import { CartService } from 'src/app/shared/_service/cart.service';
import { ProductService } from 'src/app/shared/_service/product.service';

@Component({
  selector: 'app-warehouse-reports',
  templateUrl: './warehouse-reports.component.html',
  styleUrls: ['./warehouse-reports.component.scss']
})
export class WarehouseReportsComponent implements OnInit {

  
  displayedColumns: string[] = ['barcode', 'prod_name','brand', 'quantity', 'mrp', 'sp', 'quantity', 'idp', 'action'];
  loading: boolean = false;
  name: string;
  type: string;
  bl1: string;
  bl2: string;
  bl3: string;
  bl4: string;
  bl5: string;
  bl6: string;
  bl7: string;
  bl8: string;
  bl9: string;
  bl10: string;
  bl11: string;
  bl12: string;
  bl13: string;
  bl14: string;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  products: any = [];
  search: string;
  dataSource: MatTableDataSource<any>;
  currentUser: any;
  isExactSearch = true;
  customInput: Subject<string> = new Subject();
  from_date: string;
  to_date: string;
  todayDate: Date = new Date();

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
    this.getProducts();
    // this.customInput.pipe(debounceTime(350)).subscribe(value => {
    //   this.search = value;
    //   if (value.length > 0) {
    //     this.getProducts(value);
    //   } else {
    //     this.getProducts('1');
    //   }
    // });
  }

  doSearch(barcode) {
    this.customInput.next(barcode);
  }

  getProducts() {
    this.loading = true;

    let req = {
      'valid_from': (this.from_date) ? moment(this.from_date).format('YYYY-MM-DD') : moment().subtract(30, 'days').format('YYYY-MM-DD'),
      'valid_till': (this.to_date) ? moment(this.to_date).format('YYYY-MM-DD') : moment().add(1, 'days').format('YYYY-MM-DD'),
      }
    // this.apiService.post(AppSetting.ENDPOINTS.counterOrders, req)
    //   .subscribe(
    //     data => {
    //       console.log(data);
    //       this.list = data.data;
    //       this.dataSource = new MatTableDataSource(this.list);
    //       this.dataSource.paginator = this.paginator;
    //       this.dataSource.sort = this.sort;
    //       this.from_date = req.valid_from;
    //       this.to_date = req.valid_till;
    //       },
    //     error => {
    //       this.alertService.openSnackBar(error);
    //       this.loading = false;
    //     });
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
        
        this.getProducts();
      },
      error => {
        this.alertService.error(error);
        this.loading = false;
    });
  }


}
