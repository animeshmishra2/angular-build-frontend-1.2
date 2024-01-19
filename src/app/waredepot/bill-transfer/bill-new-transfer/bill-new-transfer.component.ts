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
    private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.getSW();
    this.route.paramMap.subscribe((params) => {
      const navigationState = window.history.state;
      if (navigationState && navigationState.data) {
        this.receivedData = navigationState.data;
        console.log("receivedData", this.receivedData);

        if (this.receivedData?.purchase_details?.length > 0) {
          this.dataSourceSelDet = new MatTableDataSource(this.receivedData?.purchase_details);
          this.dataSourceSelDet.paginator = this.paginator;
          this.dataSourceSelDet.sort = this.sort;
        }
      } else {
        this.router.navigate(['/warehouse/bill-transfer/list'])
      }
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
      this.dataSourceSelDet?.data?.forEach((product: any) => {
        const dupProduct: any = { ...product };
        const _currStoreObj = (dupProduct[(store?.name + '-' + dupProduct?.prod_name)] || 0);
        delete dupProduct[(store?.name + '-' + dupProduct?.prod_name)];

        const productObj = {
          idvendor_purchases_detail: dupProduct?.idvendor_purchases,
          idstore_warehouse: store?.idstore_warehouse,
          batch: "New",
          mrp: dupProduct?.mrp,
          quantity: _currStoreObj,
          idproduct_master: dupProduct?.idproduct_master
        }
        paylodData?.push(productObj);
      });
    });

    const finalObj: any = {
      idvendor: this.receivedData?.idvendor,
      products: paylodData
    };
    console.log('finalObj: ', finalObj);

    const dialogRef = this.dialog.open(ConfirmOrderComponent, {
      data: { message: `Are you sure to Trasfer?`, title: this.reqType }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiServ.post(AppSetting.ENDPOINTS.billWiseTransfer, finalObj).subscribe(data => {
          if (data) {
            this.alertService.openSnackBar("Details Updated.");
            this.router.navigate(['/warehouse/warehouse-direct-transfer-list']);
          } else {
            this.alertService.openSnackBar("ERROR: Unable to update.");
          }
        });
      }
    });
  }
}
