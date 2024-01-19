import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators,AbstractControl  } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { StoreWare } from 'src/app/shared/_model/store-ware';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { CreditDialogComponent } from '../credit-dialog/credit-dialog.component';
// Custom validator function for GST number format
function gstValidator(control: AbstractControl): { [key: string]: any } | null {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
  if (control.value && !gstRegex.test(control.value)) {
    return { invalidGST: true };
  }
  return null;
}
@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.scss']
})
export class EditVendorComponent implements OnInit {

  row: any;
  loading: boolean = false;
  cities: any[];
  statesList: any[];
  lForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    address: new FormControl('', [
      Validators.required
    ]),
    gst: new FormControl('', [
      Validators.required, gstValidator
    ]),
    email: new FormControl('', [
      
    ]),
    contact: new FormControl('', [
      Validators.required
    ]),
    state: new FormControl('', [
      Validators.required
    ]),
    city: new FormControl('', [
      Validators.required
    ]),
    bank_name: new FormControl('', [
     
    ]),
    benificiary_name: new FormControl('', [
     
    ]),
    acc_no: new FormControl('', [
     
    ]),
    ifsc: new FormControl('', [
     
    ]),
    payment_type: new FormControl('', [
    
    ]) ,
    payment_details: new FormControl('', [
      Validators.required
    ])
  });
  credit: any;

  constructor(public dialogRef: MatDialogRef<EditVendorComponent>,
    private alertService: AlertService,
    private apiServ: ApiHttpService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.row = data.data;
    if (this.row.idstore_warehouse) {
      this.lForm.controls["name"].setValue(this.row.name);
      this.lForm.controls["contact"].setValue(this.row.phone);
      this.lForm.controls["address"].setValue(this.row.address);
      this.lForm.controls["email"].setValue(this.row.email);
      this.lForm.controls["gst"].setValue(this.row.gst);
      this.lForm.controls["state"].setValue(Number(this.row.state));
      this.lForm.controls["city"].setValue(Number(this.row.city));
      this.lForm.controls["payment_details"].setValue(this.row.payment_details);
      this.lForm.controls["payment_type"].setValue(this.row.payment_type);

      this.lForm.controls["bank_name"].setValue(this.row.bank_name);
      this.lForm.controls["benificiary_name"].setValue(this.row.benificiary_name);
      this.lForm.controls["acc_no"].setValue(this.row.acc_no);
      this.lForm.controls["ifsc"].setValue(this.row.ifsc);
      if (this.lForm.controls.state.value) {
        this.city(this.lForm.controls.state.value); // Call method to fetch cities based on selected state
      } else {
        this.cities = []; // Reset cities list if state is not selected
      }
    }
  }

  ngOnInit(): void {
    this.state();
    this.lForm.get('state')?.valueChanges.subscribe((selectedStateId) => {
      if (selectedStateId) {
        this.city(selectedStateId); // Call method to fetch cities based on selected state
      } else {
        this.cities = []; // Reset cities list if state is not selected
      }
      
    });
  }

  city(id){
    // const id = this.lForm.get(this.row.state);
     this.apiServ.get(AppSetting.ENDPOINTS.getcities + "/" + id)
       .subscribe(
            data => this.cities =data
         );
  }

  state() {
    this.apiServ.get(AppSetting.ENDPOINTS.getState)
      .subscribe(
        data => {
          this.statesList = data;
        },
        error => {
          console.error('Error fetching states:', error);
        }
      );
  }
  onStateChange() {
    const id = this.lForm.get(this.row.state);
   
  }

  onPaymentTypeSelected(): void {
    const paymentType = this.lForm.get('payment_type')?.value;
  
    if (paymentType === 'Credit') {
      this.openCreditDialog(); // Open dialog when payment type is 'Credit'
    }
  }
  openCreditDialog(): void {
    const dialogRef = this.dialog.open(CreditDialogComponent, {
      width: '15%',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // Handle dialog close if needed
      this.credit = result;
    });
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.lForm.invalid) {
      return;
    }

    this.loading = true;
    let req = {
      "name": this.lForm.get('name')!.value,
      "contact": this.lForm.get('contact')!.value,
      "address": this.lForm.get('address')!.value,
      "email": this.lForm.get('email')!.value,
      "gst": this.lForm.get('gst')!.value,
      "state": this.lForm.get('state')!.value,
      "city": this.lForm.get('city')!.value,
      "bank_name": this.lForm.controls.bank_name.value,
      "benificiary_name": this.lForm.controls.benificiary_name.value,
      "acc_no": this.lForm.controls.acc_no.value,
      "ifsc": this.lForm.controls.ifsc.value,
      "payment_details": this.lForm.controls.payment_details.value,
      "payment_type": this.lForm.get('payment_type')!.value,
      "credit_day" : this.credit ? this.credit : '',
      "status": 1
    }
    if (this.row.idvendor > 0) {
      req['idvendor'] = this.row.idvendor;
      this.apiServ.patch(AppSetting.ENDPOINTS.vendor + "/" + this.row.idvendor , req)
        .subscribe(
          data => {
            this.alertService.openSnackBar("Vendor Updated.");
            this.cancel(false);
          },
          error => {
            this.alertService.openSnackBar(error);
            this.loading = false;
          });
    }
    else {
      this.apiServ.post(AppSetting.ENDPOINTS.vendor, req)
        .subscribe(
          data => {
            this.alertService.openSnackBar("Vendor Added.");
            this.cancel(false);
          },
          error => {
            this.alertService.openSnackBar(error);
            this.loading = false;
          });
    }

  }

  cancel(manual = true): void {
    this.dialogRef.close({ 'manual': manual });
  }

}
