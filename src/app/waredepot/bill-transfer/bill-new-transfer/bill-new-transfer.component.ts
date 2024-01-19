import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BatchSelectComponent } from 'src/app/pos/new-order/batch-select/batch-select.component';
import { ConfirmOrderComponent } from 'src/app/pos/new-order/confirm-order/confirm-order.component';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { AuthenticationService } from 'src/app/shared/_service/authentication.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-bill-new-transfer',
  templateUrl: './bill-new-transfer.component.html',
  styleUrls: ['./bill-new-transfer.component.scss']
})
export class BillNewTransferComponent implements OnInit {

  dataSourceSelColumnDet: string[] = ['barcode', 'prod_name', 'batch', 'availableQty'];
  dataSourceSelDet: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  store: any = [];
  isStoreReq: any = '0';
  selStore: any[] = [];
  reqType: string;
  reviewReqDetail: any;
  receivedData: any;

  constructor(private alertService: AlertService,
    public dialog: MatDialog,
    private apiServ: ApiHttpService,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,) {

  }

  ngOnInit(): void {
    this.getSW();
    this.route.paramMap.subscribe((params) => {
      const navigationState = window.history.state;
      if (navigationState && navigationState.data) {
        this.receivedData = navigationState.data;
        console.log("receivedData", this.receivedData);

        // if (this.receivedData?.idvendor_purchases) {
        //   this.apiServ.get(AppSetting.ENDPOINTS.getVendorBillDetail + `/${ this.receivedData?.idvendor_purchases}`).subscribe((res) => {
        //     this.dataSourceSelDet = new MatTableDataSource(res);
        //     this.dataSourceSelDet.paginator = this.paginator;
        //     this.dataSourceSelDet.sort = this.sort;
        //   });
          
        // }

        if (this.receivedData?.idvendor_purchases) {
          this.apiServ.get(AppSetting.ENDPOINTS.getVendorBillDetail + `/${this.receivedData?.idvendor_purchases}`).subscribe((res) => {
            // Assuming res is an array of items with an 'id' property
        
            const observables = res.map(item => 
              this.apiServ.post(AppSetting.ENDPOINTS.getBatchBillwise,{ idproduct_master: item.idproduct_master }).pipe(
                map(details => ({ ...item, batches: details.data[0].available_batches }))  // Merge details with the original item
              )
            );
        
            forkJoin(observables).subscribe(updatedData => {
              this.dataSourceSelDet = new MatTableDataSource(updatedData);
              this.dataSourceSelDet.paginator = this.paginator;
              this.dataSourceSelDet.sort = this.sort;
            });
          });
        }
        console.log(" this.dataSourceSelDet?.data", this.dataSourceSelDet?.data);
        
      } else {
        this.router.navigate(['/warehouse/bill-transfer/list']);
      }
    });
  }
  getBillDetail() {
    // this.loading = true;
    this.apiServ.get(AppSetting.ENDPOINTS.getVendorBillDetail + `/${ this.receivedData?.idvendor_purchases}`).subscribe((res) => {
      // this.dataSource = new MatTableDataSource(res);
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
      // this.loading = false;

    });
  }
  getSW() {
    this.apiServ.get(AppSetting.ENDPOINTS.allSWExceptMine).subscribe((data) => {
      data.forEach(sw => {
        if (sw.is_store) {
          this.store.push(sw);
        }
      });
    },
      (error) => {
        this.alertService.error(error);
      });
  }

  getAvailableQty(rowData: any) {
    const duppRowData = { ...rowData };
    let totalQty = 0;
    this.selStore?.forEach((store: any) => {
      const _currStoreObj = duppRowData[(store?.name + '-' + duppRowData?.prod_name)];
      totalQty += (_currStoreObj || 0);
      rowData[(store?.name + '-' + duppRowData?.prod_name)] = Number(duppRowData[(store?.name + '-' + duppRowData?.prod_name)]) > 0 ? Number(duppRowData[(store?.name + '-' + duppRowData?.prod_name)]) : 0;
    });
    return (rowData?.quantity - totalQty);
  }

  resetQTY() {
    this.dataSourceSelDet?.data?.forEach((data: any) => {
      this.selStore?.forEach((store: any, index: number) => {
        store['quantity_rec'] = 0;
        data[store?.name + '-' + data?.prod_name] = 0;
      });
    });
  }

  onChangeStore() {
    this.resetQTY();
    this.dataSourceSelDet?.data?.forEach((data: any) => {
      let available = this.getAvailableQty(data);
      this.selStore?.forEach((store: any, index: number) => {
        if (!this.dataSourceSelColumnDet.includes(store?.name)) {
          this.dataSourceSelColumnDet.push(store?.name);
        }

        const storeQTY = (index == (this.selStore?.length - 1)) ? available : Math.floor(available / this.selStore?.length);
        available -= storeQTY;
        data[store?.name + '-' + data?.prod_name] = store['quantity_rec'] = storeQTY;
      });
    });
  }

  changeBatch(event, row){
    row['idproduct_batch'] = event.idproduct_batch;
    row['selected_batch'] = event;
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

    const paylodData: any[] = [];
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
      const productObj = {
        idstore_warehouse_from: this.authenticationService.currentUserValue.idwarehouse,
        to_warehouse_id: store?.idstore_warehouse,
        request_type: 2,
        products: allProducts
      }
      paylodData?.push(productObj)
    });
    const dialogRef = this.dialog.open(ConfirmOrderComponent, {
      data: { message: `Are you sure to Trasfer?`, title: this.reqType }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiServ.post(AppSetting.ENDPOINTS.billWiseTransfer, paylodData).subscribe(data => {
          if (data) {
            this.alertService.openSnackBar("Details Updated.");
            this.router.navigate(['/warehouse/bill-transfer/list']);
          } else {
            this.alertService.openSnackBar("ERROR: Unable to update.");
          }
        });
      }
    });
  }
}
