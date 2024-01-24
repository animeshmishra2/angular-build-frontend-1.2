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
  selector: 'app-add-edit-coupns',
  templateUrl: './add-edit-coupns.component.html',
  styleUrls: ['./add-edit-coupns.component.scss']
})
export class AddEditCoupnsComponent implements OnInit {

  row: any;
  loading: boolean = false;
  selectedFile: any;
  fileSizeError = false;
  storeList: any[] = [];
  todayDate: Date = new Date();
  lForm = new FormGroup({
    idstore_warehouse: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    discount_percentage: new FormControl('', [Validators.required]),
    uptomax_amount: new FormControl('', [Validators.required]),
    discount: new FormControl('', [Validators.required]),
    minordervalue: new FormControl('', [Validators.required]),
    usable_days: new FormControl('', [Validators.required]),
    active_from: new FormControl('', [Validators.required]),
    active_till: new FormControl('', [Validators.required]),
    isgeneral: new FormControl('', [Validators.required]),
    reuse_limit: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
  });

  constructor(public dialogRef: MatDialogRef<AddEditCoupnsComponent>,
    private alertService: AlertService,
    private storeWareServ: StoreWareService,
    private apiServ: ApiHttpService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.row = data.data;
    if (this.row?.idcoupon) {
      this.lForm.controls["idstore_warehouse"].setValue(this.row.idstore_warehouse);
      this.lForm.controls["name"].setValue(this.row.name);
      this.lForm.controls["discount_percentage"].setValue(this.row.discount_percentage);
      this.lForm.controls["uptomax_amount"].setValue(this.row.uptomax_amount);
      this.lForm.controls["discount"].setValue(this.row.discount);
      this.lForm.controls["minordervalue"].setValue(this.row.minordervalue);
      this.lForm.controls["usable_days"].setValue(this.row.usable_days);
      this.lForm.controls["active_from"].setValue(this.row.active_from);
      this.lForm.controls["active_till"].setValue(this.row.active_till);
      this.lForm.controls["reuse_limit"].setValue(this.row.reuse_limit);
      this.lForm.controls["status"].setValue(this.row.status);
      this.lForm.controls["isgeneral"].setValue(this.row.isgeneral);

      
    }
  }

  ngOnInit(): void {
    this.getStoreList();
  }

  onDateChange() {
    this.lForm.controls["active_till"].setValue('');
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
    if (this.lForm.invalid) {
      return;
    }

    this.loading = true;
    let payload = {
      'idstore_warehouse': this.lForm.get('idstore_warehouse')!.value,
      'name': this.lForm.get('name')!.value,
      'discount_percentage': this.lForm.get('discount_percentage')!.value,
      'uptomax_amount': this.lForm.get('uptomax_amount')!.value,
      'discount': this.lForm.get('discount')!.value,
      'minordervalue': this.lForm.get('minordervalue')!.value,
      'usable_days': this.lForm.get('usable_days')!.value,
      'active_from': this.lForm.get('active_from')!.value,
      'active_till': this.lForm.get('active_till')!.value,
      'isgeneral' : this.lForm.get('isgeneral')!.value,
      'reuse_limit': this.lForm.get('reuse_limit')!.value,
      'status': this.lForm.get('status')!.value,
    }
    if (this.row.idcoupon) {
      this.storeWareServ.updateCoupon(this.row?.idcoupon, payload).subscribe((data: any) => {
        this.cancel(false);
        this.alertService.openSnackBar("Sucessfully Updated Shiping Charge");
      },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        });
    } else {
      this.storeWareServ.createCoupon(payload).subscribe((data: any) => {
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
