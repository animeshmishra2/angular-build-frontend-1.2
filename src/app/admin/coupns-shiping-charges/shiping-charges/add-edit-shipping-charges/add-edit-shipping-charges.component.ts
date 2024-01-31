import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
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
  storeList: any[] = [];
  lForm: FormGroup;
  // lForm = new FormGroup({
  //   title: new FormControl('', [
  //     Validators.required
  //   ]),
  //   shipingcharge: new FormControl('', [
  //     Validators.required
  //   ]),
  //   orderamount: new FormControl('', [
  //     Validators.required
  //   ]),
  //   applicable_on: new FormControl('', [
  //     Validators.required
  //   ]),
  //   idstore_warehouse :new FormControl([''], [
  //     Validators.required
  //   ]),
  // });

  constructor(public dialogRef: MatDialogRef<AddEditShippingChargesComponent>,
    private alertService: AlertService,
    private storeWareServ: StoreWareService,
    private apiServ: ApiHttpService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.row = data.data;
    this.lForm = this.fb.group({
      // other form controls...
      idstore_warehouse: this.row?.id ? new FormControl('', [Validators.required]) : new FormControl([''], [Validators.required]),
      title: new FormControl('', [
            Validators.required
          ]),
      shipingcharge: new FormControl('', [
        Validators.required
      ]),
      orderamount: new FormControl('', [
        Validators.required
      ]),
      applicable_on: new FormControl('', [
        Validators.required
      ]),
    });
    if (this.row?.id) {
      this.lForm.controls["title"].setValue(this.row.title);
      this.lForm.controls["shipingcharge"].setValue(this.row.shipping_charge);
      this.lForm.controls["orderamount"].setValue(this.row.order_amount);
      this.lForm.controls["applicable_on"].setValue(this.row.applicable_on);
      this.lForm.controls["idstore_warehouse"].setValue(this.row.idstore_warehouse);
    }
  }

  ngOnInit(): void {
    this.getStoreList();
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
   
    if (this.row.id) {
      let payload = {
        'idstore_warehouse': this.lForm.get('idstore_warehouse')!.value,
        'shipping_charge' :  this.lForm.get('shipingcharge')!.value,
        'order_amount' :  this.lForm.get('orderamount')!.value,
        'applicable_on' :  this.lForm.get('applicable_on')!.value,
        'title' :  this.lForm.get('title')!.value,
        'created_by' : 1
      }
      this.storeWareServ.updateShipingcharge(this.row?.id,payload).subscribe((data: any) => {
        this.cancel(false);
        this.alertService.openSnackBar("Sucessfully Updated Shiping Charge");
      },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        });
    } else {
      let resultArray: any[] = [];
      const idstoreWarehouseValue = this.lForm.get('idstore_warehouse')!.value;
      idstoreWarehouseValue.forEach((element: any) => {
        const finalObj: any = {
            idstore_warehouse: element,
            'shipping_charge' :  this.lForm.get('shipingcharge')!.value,
            'order_amount' :  this.lForm.get('orderamount')!.value,
            'applicable_on' :  this.lForm.get('applicable_on')!.value,
            'title' :  this.lForm.get('title')!.value,
            'created_by' : 1 
        };
        resultArray?.push(finalObj)
      });
      this.storeWareServ.createShipingCharge(resultArray).subscribe((data: any) => {
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
