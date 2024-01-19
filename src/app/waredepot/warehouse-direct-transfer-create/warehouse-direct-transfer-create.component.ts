import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BatchSelectComponent } from 'src/app/pos/new-order/batch-select/batch-select.component';
import { ConfirmOrderComponent } from 'src/app/pos/new-order/confirm-order/confirm-order.component';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { AuthenticationService } from 'src/app/shared/_service/authentication.service';

@Component({
  selector: 'app-warehouse-direct-transfer-create',
  templateUrl: './warehouse-direct-transfer-create.component.html',
  styleUrls: ['./warehouse-direct-transfer-create.component.scss']
})
export class WarehouseDirectTransferCreateComponent implements OnInit {

  //Create Requirment Request Main
  //Create Dispatch Request Disp
  //Review and Dispatch Requirment Request Disp

  displayedColumns: string[] = ['barcode', 'prod_name', 'brand', 'tax', 'action'];
  displayedColumnsSel: string[] = ['barcode', 'prod_name', 'quantity', 'action'];

  displayedColumnsDisp: string[] = ['barcode', 'prod_name', 'brand', 'action'];
  displayedColumnsDispSel: string[] = ['barcode', 'prod_name', 'batch', 'quantity', 'action'];
  dataSourceSelColumnDet: string[] = ['barcode', 'prod_name', 'batch', 'availableQty'];

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
  dataSourceSelDet: MatTableDataSource<any>;
  products: any = []
  @ViewChild('secondPaginator', { read: MatPaginator }) secondPaginator: MatPaginator;
  @ViewChild('selectedPaginator', { read: MatPaginator }) selectedPaginator: MatPaginator;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('printTable') printTable: ElementRef;
  selectedProdsIds: any = [];
  todayDate: Date = new Date();
  store: any = [];
  ware: any = [];
  isStoreReq: any = '0';
  selStore: any[] = [];
  selWare = 0;
  reqType: string;
  reviewReqDetail: any;
  reviewReq: any;
  batchArray: any;
  finalArray: any;

  constructor(
    private alertService: AlertService,
    public dialog: MatDialog,
    private apiServ: ApiHttpService,
    private router: Router, private authenticationService: AuthenticationService,) {

    this.getSW();
    if (this.authenticationService.currentUserValue) {


    }
  }

  ngOnInit(): void {
    this.getRequestDetail();
  }

  getRequestDetail() {
    this.loading = true;
    this.apiServ.get(AppSetting.ENDPOINTS.getReqRequestDetail + `/1`)
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
    let url = AppSetting.ENDPOINTS.getBatch + `/${this.prodSearchTxt}`;
    if (this.isExactSearch) {
      url += '/' + 1;
    }
    this.apiServ.get(url).subscribe(
      (data) => {
        this.products = data;
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
            this.store.push(sw);

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
    this.selStore?.forEach((store: any) => {
      if (!this.dataSourceSelColumnDet.includes(store?.name)) {
        this.dataSourceSelColumnDet.push(store?.name);
      }
      store['quantity_rec'] = 0;
      product[store?.name + '-' + product?.name] = store;
    });
    if (product?.batches?.length > 1) {
      const dialogRef = this.dialog.open(BatchSelectComponent, {
        width: '80%',
        data: { data: product.batches }
      });
      dialogRef.afterClosed().subscribe(result => {
        let selPack;

        if (result && result.selected_batch) {
          selPack = result.selected_batch;
        }
        product.selected_batch = selPack;
        this.selectedProds.push(product);
        this.updateSelTab();
      });
    } else {
      this.selectedProds.push(product);
      this.updateSelTab();
    }
    this.selectedProdsIds.push(product.idproduct_master);
    this.updateSelTab();
  }

  getAvailableQty(rowData: any) {
    const duppRowData = { ...rowData };
    let totalQty = 0;
    this.selStore?.forEach((store: any) => {
      const _currStoreObj = duppRowData[(store?.name + '-' + duppRowData?.name)];
      totalQty += (_currStoreObj || 0);
      rowData[(store?.name + '-' + duppRowData?.name)] = Number(duppRowData[(store?.name + '-' + duppRowData?.name)]) > 0 ? Number(duppRowData[(store?.name + '-' + duppRowData?.name)]) : 0;
    });
    
    return (rowData?.quantity - totalQty);
  }

  removeProduct(product) {
    let removed = this.dialog.open(ConfirmOrderComponent, {
      data: { message: "Do you want to remove this article?", title: "Remove" }
    });

    removed.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedProds = this.selectedProds.filter(elm => elm.idproduct_master != product.idproduct_master);
        var index = this.selectedProdsIds.indexOf(product.idproduct_master);
        this.selectedProdsIds.splice(index, 1);
        this.updateSelTab();
      }
    })
  }
  isDisable(row) {
    return this.selectedProdsIds.includes(row.idproduct_master);
  }
  updateSelTab() {
    this.dataSourceSel = new MatTableDataSource(this.selectedProds);
    this.dataSourceSel.paginator = this.selectedPaginator;
    this.dataSourceSel.sort = this.sort;
    this.dataSourceSelDet = new MatTableDataSource(this.selectedProds);

    this.dataSourceSelDet.paginator = this.selectedPaginator;
    this.dataSourceSelDet.sort = this.sort;
  }

  onChangeStore() {
    this.prodSearchTxt = '';
    this.products = [];
    this.dataSource = new MatTableDataSource(this.products);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.selectedProds = [];
    this.selectedProdsIds = [];
    this.updateSelTab();
  }

  onSubmit() {

    if (this.selStore?.length == 0) {
      this.alertService.openSnackBar("Please select at least one store.");
      return;
    }
    if (this.dataSourceSelDet?.data?.length == 0) {
      this.alertService.openSnackBar("Please select at least one product.");
      return;
    }
    let paylodData: any[] = [];
    this.selStore?.forEach((store: any) => {
      const allProducts: any[] = [];

      this.dataSourceSelDet?.data?.forEach((product: any) => {
        let dupProduct: any = { ...product };
        dupProduct.selected_batch = { ...dupProduct.selected_batch };
        const _currStoreObj = (dupProduct[(store?.name + '-' + dupProduct?.name)] || 0);
        delete dupProduct[(store?.name + '-' + dupProduct?.name)];
        dupProduct['idproduct_batch'] = dupProduct?.selected_batch?.idproduct_batch;

        if (_currStoreObj >= 0) {
          console.log('_currStoreObj: ', _currStoreObj);
          dupProduct.selected_batch['quantity_rec'] = _currStoreObj;
          allProducts?.push(dupProduct.selected_batch);
        }
      });

      const finalObj: any = {
        current_warehouse_id: this.authenticationService.currentUserValue.idwarehouse,
        to_warehouse_id: store?.idstore_warehouse,
        request_type: 2,
        products: allProducts
      };
      paylodData?.push(finalObj)
    });


    let dialogRef = this.dialog.open(ConfirmOrderComponent, {
      data: { message: `Are you sure to Trasfer?`, title: this.reqType }
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
          if (isIncomplete) {
            this.alertService.openSnackBar(valMsg);
          }
          else {
            this.apiServ.post(AppSetting.ENDPOINTS.storeinventory, paylodData)
              .subscribe(
                data => {
                  this.loading = false;
                  if (data) {
                    this.selectedProds = [];
                    this.selectedProdsIds = [];
                    this.batchArray = [];
                    this.alertService.openSnackBar("Details Updated.");
                    this.router.navigate(['/warehouse/warehouse-direct-transfer-list']);
                  }
                  else {
                    this.alertService.openSnackBar("ERROR: Unable to update.");
                  }
                });
            // if (this.selectedProds){
            //   this.getBatch();
            // } else {
            //   this.alertService.openSnackBar("no btach Fetched,add Product");
            // }
          }
        }
      });
    }
  }
  getBatch() {

    if (this.selectedProds?.length) {
      this.batchArray = this.selectedProds.map(obj => obj.idproduct_master);
      this.loading = true;
      const params = {
        storeId: 1,
        id: this.batchArray // Array parameter
      };
      let url = AppSetting.ENDPOINTS.getBatch;
      this.apiServ.getWithParams(url, params).subscribe(
        (data) => {

          this.finalArray = data.map(obj1 => {
            const matchingObj = this.selectedProds.find(obj2 => obj2.idproduct_master === obj1.idproduct_master);
            if (matchingObj) {
              return { ...obj1, quantity: matchingObj.quantity };
            }
            return obj1;
          });
          let req = {
            "current_warehouse_id": this.authenticationService.currentUserValue.idwarehouse,
            "to_warehouse_id": this.selStore['is_store'],
            "request_type": 1,
            'products': this.finalArray,
          };

          this.apiServ.post(AppSetting.ENDPOINTS.storeinventory, req)
            .subscribe(
              data => {
                this.loading = false;
                if (data) {
                  this.selectedProds = [];
                  this.selectedProdsIds = [];
                  this.batchArray = [];
                  this.alertService.openSnackBar("Details Updated.");
                  this.router.navigate(['/warehouse/warehouse-direct-transfer-list']);
                }
                else {
                  this.alertService.openSnackBar("ERROR: Unable to update.");
                }
              });
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
    } else {
      this.alertService.openSnackBar("ERROR: Unable to add.");
    }




  }
  displayFn(storeWare) {

    return storeWare ? (storeWare.idstore_warehouse + ' - ' + storeWare.name) : '';
  }

  changeBatch(event, row) {
    row.idproduct_batch = event.idproduct_batch;
    row.seletedBatch = event;
  }

}
