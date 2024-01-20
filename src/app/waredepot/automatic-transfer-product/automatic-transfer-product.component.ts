import { Component,  OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmOrderComponent } from 'src/app/pos/new-order/confirm-order/confirm-order.component';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';

@Component({
  selector: 'app-automatic-transfer-product',
  templateUrl: './automatic-transfer-product.component.html',
  styleUrls: ['./automatic-transfer-product.component.scss']
})
export class AutomaticTransferProductComponent implements OnInit {

  dataSourceSelColumnDet: string[] = ['isChecked', 'barcode','product_name','eDate', 'batch',  'warwhouseQuantity', 'transferQuantity'];
  dataSourceSelDet: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  reqType: string;
  receivedData: any;
  currWarehouse: any;

  constructor(private alertService: AlertService,
    public dialog: MatDialog,
    private apiServ: ApiHttpService,
    private router: Router,
    private route: ActivatedRoute) {
      this.currWarehouse = JSON.parse(localStorage.getItem('currentUser')!)
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const navigationState = window.history.state;
      if (navigationState && navigationState.data) {
        this.receivedData = navigationState.data;
        this.getTransferProductData();
      } else {
        this.router.navigate(['/warehouse/automatic-transfer-list'])
      }
    });
  }

  getTransferProductData() {
    this.apiServ.getParamsData(AppSetting.ENDPOINTS.inventoryTresholdProduct, this.receivedData?.idstore_warehouse).subscribe((data: any) => {
      const expiryProduct = (data && data[0] && data[0]?.products?.expiry_in_10days_products) || [];
      const tresoldProduct = (data && data[0] && data[0]?.products?.threshold_products) || [];
      tresoldProduct?.forEach((thresoldData: any) => {
        thresoldData['isThresold'] = true;
      });
      
      const productData = [...expiryProduct, ...tresoldProduct];
      productData?.forEach((data: any) => {
        data['checked'] = false;

        if(data?.isThresold) {
          data['requestedQuantity'] = data?.threshold_quantity;
          data['remainDays'] = data?.threshold_quantity;
        } else {
          data['requestedQuantity'] = data?.sent_quantity;
          const dateSent = new Date(data?.expiry);
          const currentDate = new Date();
          data['remainDays'] = Math.floor((Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) - Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) ) /(1000 * 60 * 60 * 24));
        }
        
        if(data?.batch_details?.length > 0) {
          data?.batch_details?.forEach((batchDetails: any) => {
            batchDetails['checked'] = false;
          });
        }
      });
      this.dataSourceSelDet = new MatTableDataSource(productData);
      this.dataSourceSelDet.paginator = this.paginator;
      this.dataSourceSelDet.sort = this.sort;
    });
  }

  onSubmit() {
    const thresholdProducts: any[] = [];
    const expiryProducts: any[] = [];
    this.dataSourceSelDet?.data?.forEach((product: any) => {
      const dupProduct: any = { ...product };
      if(dupProduct?.checked) {
        let _currData = {
          idproduct_batch: dupProduct?.idproduct_batch,
          batch: dupProduct?.batch_name,
          mrp: (dupProduct?.mrp || 0),
        };
        const findIndex = dupProduct?.batch_details?.findIndex((batch: any) => batch?.checked);
        if(findIndex != -1) {
          _currData['idproduct_batch'] = dupProduct?.batch_details[findIndex]?.idproduct_batch;
          _currData['batch'] = dupProduct?.batch_details[findIndex]?.name;
          _currData['mrp'] = dupProduct?.batch_details[findIndex]?.mrp;
        }
        
        if(dupProduct?.isThresold) {
          const productObj = {
            idproduct_master: dupProduct?.idproduct_master,
            idproduct_batch: _currData['idproduct_batch'],
            batch: _currData['batch'],
            mrp: _currData['mrp'],
            threshold_quantity: dupProduct?.requestedQuantity
          };
          thresholdProducts?.push(productObj);
        } else {
          const productObj = {
            idproduct_master: dupProduct?.idproduct_master,
            idproduct_batch: _currData['idproduct_batch'],
            batch: _currData['batch'],
            mrp: _currData['mrp'],
            sent_quantity: dupProduct?.requestedQuantity
          };
          expiryProducts?.push(productObj);
        }
      }
    });

    const finalObj: any = {
      id_warehouse: this.currWarehouse?.idwarehouse,
      id_store: this.receivedData?.idstore_warehouse,
      threshold_products: thresholdProducts,
      expiry_in_10days_products: expiryProducts
    };

    const dialogRef = this.dialog.open(ConfirmOrderComponent, {
      data: { message: `Are you sure to Trasfer?`, title: this.reqType }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.apiServ.post(AppSetting.ENDPOINTS.autoTransferSave, finalObj).subscribe(data => {
          if (data) {
            this.alertService.openSnackBar("Details Updated.");
            this.router.navigate(['/warehouse/automatic-transfer-list']);
          } else {
            this.alertService.openSnackBar("ERROR: Unable to update.");
          }
        });
      }
    });
  }
}
