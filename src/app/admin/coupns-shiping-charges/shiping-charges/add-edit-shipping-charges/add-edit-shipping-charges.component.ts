import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { StoreWare } from 'src/app/shared/_model/store-ware';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { AuthenticationService } from 'src/app/shared/_service/authentication.service';
import { StoreWareService } from 'src/app/shared/_service/store-ware.service';
@Component({
  selector: 'app-add-edit-shipping-charges',
  templateUrl: './add-edit-shipping-charges.component.html',
  styleUrls: ['./add-edit-shipping-charges.component.scss']
})
export class AddEditShippingChargesComponent implements OnInit {

  row: any;
  loading: boolean = false;
  selectedFile: any;
  fileSizeError = false;
  lForm = new FormGroup({
    title: new FormControl('', [
      Validators.required
    ]),
    shipingcharge: new FormControl('', [
      Validators.required
    ]),
    orderamount: new FormControl('', [
      Validators.required
    ]),
  });

  constructor(public dialogRef: MatDialogRef<AddEditShippingChargesComponent>,
    private alertService: AlertService,
    private storeWareServ: StoreWareService,
    private apiServ: ApiHttpService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.row = data.data;
    if (this.row?.id) {
      this.lForm.controls["title"].setValue(this.row.title);
      this.lForm.controls["shipingcharge"].setValue(this.row.shipping_charge);
      this.lForm.controls["orderamount"].setValue(this.row.order_amount);
    }
  }

  ngOnInit(): void {
  }


  onSubmit() {
    // stop here if form is invalid
    if (this.lForm.invalid) {
      return;
    }

    this.loading = true;
    let payload = {
      'shipping_charge' :  this.lForm.get('shipingcharge')!.value,
      'order_amount' :  this.lForm.get('orderamount')!.value,
      'title' :  this.lForm.get('title')!.value,
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
