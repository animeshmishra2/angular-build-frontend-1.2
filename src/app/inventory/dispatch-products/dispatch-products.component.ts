import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ConfirmOrderComponent } from 'src/app/pos/new-order/confirm-order/confirm-order.component';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';

@Component({
  selector: 'app-dispatch-products',
  templateUrl: './dispatch-products.component.html',
  styleUrls: ['./dispatch-products.component.scss']
})
export class DispatchProductsComponent implements OnInit {
  //Create Requirment Request Main
  //Create Dispatch Request Disp
  //Review and Dispatch Requirment Request Disp

  displayedColumns: string[] = ['barcode', 'prod_name', 'brand', 'tax', 'action'];
  displayedColumnsSel: string[] = ['barcode', 'prod_name', 'quantity', 'action'];

  displayedColumnsDisp: string[] = ['barcode', 'prod_name', 'brand', 'action'];
  displayedColumnsDispSel: string[] = ['barcode', 'prod_name', 'batch', 'quantity', 'action'];

  isCreateReqReq: boolean = false;
  isCreateDispReq: boolean = false;
  isReviewDispReqReq: boolean = false;

  loading: boolean = false;
  search
  isExactSearch: boolean = true;
  prodSearchTxt: any = '';
  selectedProds: any = [];
  dataSource: MatTableDataSource<any>;
  dataSourceSel: MatTableDataSource<any>;
  dataSourceDisp: MatTableDataSource<any>;
  dataSourceDispSel: MatTableDataSource<any>;
  products: any = []
  @ViewChild('secondPaginator', { read: MatPaginator }) secondPaginator: MatPaginator;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selectedProdsIds: any = [];
  todayDate: Date = new Date();
  store: any = [];
  ware: any = [];
  isStoreReq: any = '0';
  selStore = 0;
  selWare = 0;
  reqType: string;
  reviewReqDetail: any;
  reviewReq: any;

  constructor(
    private alertService: AlertService,
    public dialog: MatDialog,
    private apiServ: ApiHttpService,
    private router: Router) {
    console.log(this.router.url);
    this.getSW()
    switch (this.router.url) {
      case '/inventory/create-requirement-request':
        this.isCreateReqReq = true;
        this.reqType = "Create Requirement Request";
        break;
      case '/inventory/create-dispatch-request':
        this.isCreateDispReq = true;
        this.reqType = "Create Dispatch Request";
        break;
      case '/inventory/review-dispatch-request':
        this.isReviewDispReqReq = true;
        this.reqType = "Review And Dispatch Requirement Request";
        if (this.router.getCurrentNavigation()!.extras.state) {
          this.reviewReq = this.router.getCurrentNavigation()!.extras.state!.data;
          console.log(this.reviewReq);

          this.isStoreReq = this.reviewReq.from_is_store;
          if (this.reviewReq.to_is_store == 1) {
            this.selStore = this.reviewReq.idstore_warehouse_from;
          }
          else {
            this.selWare = this.reviewReq.idstore_warehouse_from;
          }
          this.getRequestDetail();
        }
        else {
          this.router.navigate(['login'])
        }
        break;
      default:
        this.router.navigate(['login']);
        break;
    }
  }

  ngOnInit(): void {

  }

  getRequestDetail() {
    this.loading = true;
    this.apiServ.get(AppSetting.ENDPOINTS.getReqRequestDetail + `/${this.reviewReq.idstore_request}`)
      .subscribe((res) => {
        this.reviewReqDetail = res;
        this.dataSourceDispSel = new MatTableDataSource(this.reviewReqDetail);
        this.dataSourceDispSel.paginator = this.paginator;
        this.dataSourceDispSel.sort = this.sort;
        this.loading = false;
      });
  }

  getProducts() {
    this.loading = true;
    let url = AppSetting.ENDPOINTS.getProductMaster + `/${this.prodSearchTxt}`;
    if (this.isExactSearch) {
      url += '/' + 1;
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

  getSW() {
    this.loading = true;

    this.apiServ.get(AppSetting.ENDPOINTS.allSWExceptMine).subscribe(
      (data) => {
        data.forEach(sw => {
          if (sw.is_store) {
            this.store.push(sw)
          }
          else {
            this.ware.push(sw)
          }
        });
      },
      (error) => {
        this.alertService.error(error);
        this.loading = false;
      }
    );
  }


  addProduct(product) {
    product['mrp'] = null;
    product['expiry'] = [];
    this.selectedProds.push(product);
    console.log(this.selectedProds)
    this.selectedProdsIds.push(product.idproduct_master);
    this.updateSelTab()
  }

  removeProduct(product) {
    let removed = this.dialog.open(ConfirmOrderComponent, {
      data: { message: "Do you want to remove this article?", title: "Remove" }
    });

    removed.afterClosed().subscribe((result) => { 
        if(result){
          this.selectedProds = this.selectedProds.filter(elm => elm.idproduct_master != product.idproduct_master);
          var index = this.selectedProdsIds.indexOf(product.idproduct_master);
          this.selectedProdsIds.splice(index, 1);
          this.updateSelTab()
        }
    })
  }
  isDisable(row) {
    return this.selectedProdsIds.includes(row.idproduct_master);
  }
  updateSelTab() {
    this.dataSourceSel = new MatTableDataSource(this.selectedProds);
    this.dataSourceSel.paginator = this.secondPaginator;
    this.dataSourceSel.sort = this.sort;
  }

  onSubmit() {
    let dialogRef = this.dialog.open(ConfirmOrderComponent, {
      data: { message: `Are you sure to ${this.reqType}?`, title: this.reqType }
    });
    let canProceede = true;
    if (!this.isReviewDispReqReq && this.selectedProds.length == 0) {
      canProceede = false;
      this.alertService.openSnackBar("Add Some Products to Continue");
    }

    if (canProceede) {
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          let isIncomplete = false;
          let valMsg = 'Missing Details for: ';
          let allProds: any = [];
          if (this.isReviewDispReqReq) {
            this.reviewReqDetail.forEach(prod => {
              // debugger
              if (prod.quantity_sent == null || !prod.idproduct_batch || (prod.quantity_sent < 0 || prod.quantity_sent > prod.quantity)) {
                valMsg += ' -' + prod.barcode;
                isIncomplete = true;
              }
              allProds.push(prod);
            });
          }
          else {
            this.selectedProds.forEach(prod => {
              if (!prod.quantity || (!this.isCreateReqReq && !prod.batch)) {
                valMsg += ' -' + prod.barcode;
                isIncomplete = true;
              }
              allProds.push(prod);
            });
          }

          // console.log(allProds);
          // console.log(isIncomplete, this.isStoreReq, this.selStore, this.selWare);

          if (isIncomplete) {
            this.alertService.openSnackBar(valMsg);
          }
          else if (!this.isReviewDispReqReq &&
             (((this.isStoreReq == 1) && !this.selStore) || (this.isStoreReq == 0) && !this.selWare)) {
            this.alertService.openSnackBar("Select Store or Warehouse");
          }
          else {
            if (this.isReviewDispReqReq) {
              let req = {
                'idstore_request': this.reviewReq.idstore_request,
                'products': allProds,
              };
              console.log(req);
              this.apiServ.post(AppSetting.ENDPOINTS.reviewReqReq, req)
                .subscribe(
                  data => {
                    this.loading = false;
                    if (data.statusCode == 0) {
                      this.selectedProds = [];
                      this.selectedProdsIds = [];
                      this.alertService.openSnackBar("Details Updated.");
                      this.router.navigate(['inventory/requirement-request/1']);
                    }
                    else {
                      this.alertService.openSnackBar("ERROR: Unable to update.");
                    }
                  });
            }
            else {
              let store_warehouse:any = (this.isStoreReq == 1) ? this.selStore : this.selWare;
              console.log(store_warehouse);
              let req = {
                'idstore_warehouse_to': store_warehouse.idstore_warehouse,
                'products': allProds,
              };
              console.log(req);
              this.apiServ.post(AppSetting.ENDPOINTS.createReqReq, req)
                .subscribe(
                  data => {
                    this.loading = false;
                    if (data.statusCode == 0) {
                      this.selectedProds = [];
                      this.selectedProdsIds = [];
                      this.alertService.openSnackBar("Details Updated.");

                      this.router.navigate(['inventory/requirement-request']);
                    }
                    else {
                      this.alertService.openSnackBar("ERROR: Unable to update.");
                    }
                  });
            }
          }
        }
      });
    }
  }
  displayFn(storeWare) {
    console.log(storeWare);
    return storeWare ? (storeWare.idstore_warehouse + ' - ' + storeWare.name) : '';
  }

  changeBatch(event, row){
    row.idproduct_batch = event.idproduct_batch;
    row.seletedBatch = event;
  }
}
