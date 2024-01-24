import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { StoreWareService } from 'src/app/shared/_service/store-ware.service';

@Component({
  selector: 'app-add-edit-thresold-purchase-order',
  templateUrl: './add-edit-thresold-purchase-order.component.html',
  styleUrls: ['./add-edit-thresold-purchase-order.component.scss']
})
export class AddEditThresoldPurchaseOrderComponent implements OnInit {
  row: any;
  loading: boolean = false;
  selectedFile: any;
  fileSizeError = false;
  slotForm = new FormGroup({
    idstore_warehouse: new FormControl('', [
      Validators.required
    ]),
    tproduct: new FormControl('', [
      Validators.required
    ]),
    thresholdq: new FormControl('', [
      Validators.required
    ]),
    sentquantity: new FormControl('', [
      Validators.required
    ]),
  });
  storeList: any;
  threshldproductlist: any;

  constructor(public dialogRef: MatDialogRef<AddEditThresoldPurchaseOrderComponent>,
    private alertService: AlertService,
    private storeWareServ: StoreWareService,
    private apiServ: ApiHttpService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.row = data.data;
    if (this.row?.id) {
      // this.lForm.controls["title"].setValue(this.row.title);
      // this.lForm.controls["shipingcharge"].setValue(this.row.shipping_charge);
      // this.lForm.controls["orderamount"].setValue(this.row.order_amount);
    }
  }

  ngOnInit(): void {
    this.getStoreList();
    this.slotForm.get('idstore_warehouse')?.valueChanges.subscribe((selectedStateId) => {
      if (selectedStateId) {
        this.getThresholdProduct(selectedStateId); // Call method to fetch cities based on selected state
      } else {
        this.threshldproductlist = []; // Reset cities list if state is not selected
      }
    });
  }
  getThresholdProduct(id){
    this.apiServ.getParamsData(AppSetting.ENDPOINTS.getThresholdProduct, id)
    .subscribe(
      data => this.threshldproductlist = data.products.expiry_in_10days_products
    );
  }

  getStoreList() {
    this.loading = true;
    this.storeWareServ.getAllStoresWare().subscribe(data => {
      this.storeList = data;
      this.loading = false;
    }, error => {
      this.alertService.openSnackBar(error);
      this.loading = false;
    });
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.slotForm.invalid) {
      return;
    }

    this.loading = true;
    let payload = {
      'shipping_charge' :  this.slotForm.get('shipingcharge')!.value,
      'order_amount' :  this.slotForm.get('orderamount')!.value,
      'title' :  this.slotForm.get('title')!.value,
      'created_by' : 1
    }
    if (this.row.id) {
      this.storeWareServ.updateShipingcharge(this.row?.id,payload).subscribe((data: any) => {
        this.cancel(false);
        this.alertService.openSnackBar("Sucessfully Updated Shiping Charge");
      },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        });
    } else {
      this.storeWareServ.createShipingCharge(payload).subscribe((data: any) => {
        this.cancel(false);
        this.alertService.openSnackBar("Sucessfully Created Shiping Charge");
      },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
    }
  }

  cancel(manual = true): void {
    this.dialogRef.close({ 'manual': manual });
  }
}
