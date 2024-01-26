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
  selector: 'app-change-status-online-order',
  templateUrl: './change-status-online-order.component.html',
  styleUrls: ['./change-status-online-order.component.scss']
})
export class ChangeStatusOnlineOrderComponent implements OnInit {

  
  row: any;
  loading: boolean = false;
  selectedFile: any;
  fileSizeError = false;
  lForm = new FormGroup({
    status: new FormControl('', [
      Validators.required
    ]),
    reason: new FormControl('', [
      Validators.required
    ]),
  });

  constructor(public dialogRef: MatDialogRef<ChangeStatusOnlineOrderComponent>,
    private alertService: AlertService,
    private storeWareServ: StoreWareService,
    private apiServ: ApiHttpService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.row = data.data;
    // if (this.row?.id) {
    //   this.lForm.controls["status"].setValue(this.row?.title);
    //   this.lForm.controls["reason"].setValue(this.row?.shipping_charge);
    // }
    console.log("rowdata",this.row);
    
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
      'status' :  this.lForm.get('status')!.value,
      'idcustomer_order' : this.row?.idcustomer_order,
      'reason' :  this.lForm.get('reason')!.value,
      'updated_by' : 1
    }
    if (this.row.id) {
      this.storeWareServ.updateOrderStatus(this.row?.id,payload).subscribe((data: any) => {
        this.cancel(false);
        this.alertService.openSnackBar("Sucessfully Updated Status");
      },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        });
    } 
    // else {
    //   this.storeWareServ.createShipingCharge(payload).subscribe((data: any) => {
    //     this.cancel(false);
    //     this.alertService.openSnackBar("Sucessfully Created Shiping Charge");
    //   },
    //     error => {
    //       this.alertService.error(error);
    //       this.loading = false;
    //     });
    // }
  }

  cancel(manual = true): void {
    this.dialogRef.close({ 'manual': manual });
  }
}
