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
  selector: 'app-edit-store-ware',
  templateUrl: './edit-store-ware.component.html',
  styleUrls: ['./edit-store-ware.component.scss']
})
export class EditStoreWareComponent implements OnInit {

  row: StoreWare;
  loading: boolean = false;
  storeTypes:any;

  lForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    address: new FormControl('', [
      Validators.required
    ]),
    city: new FormControl('', [
      Validators.required
    ]),
    pincode: new FormControl('', [
      Validators.required
    ]),
    contact: new FormControl('', [
      Validators.required
    ]),
    lat: new FormControl('', [
      Validators.required
    ]),
    long: new FormControl('', [
      Validators.required
    ]),
    service_distance: new FormControl('', [
      Validators.required
    ]),
    idstore_type: new FormControl(''),
    is_store: new FormControl(''),
    is_copartner: new FormControl(''),
    status: new FormControl(''),
    idstore_warehouse: new FormControl(''),
  });

  constructor(public dialogRef: MatDialogRef<EditStoreWareComponent>,
    private alertService: AlertService,
    private storeWareServ: StoreWareService,
    private apiServ: ApiHttpService,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    this.row = data.data;
    console.log(this.row);
    if (this.row.idstore_warehouse) {
      this.lForm.controls["name"].setValue(this.row.name);
      this.lForm.controls["contact"].setValue(this.row.contact);
      this.lForm.controls["address"].setValue(this.row.address);
      this.lForm.controls["pincode"].setValue(this.row.pincode);
      this.lForm.controls["city"].setValue(this.row.city);
      this.lForm.controls["idstore_warehouse"].setValue(this.row.idstore_warehouse);
      this.lForm.controls["idstore_type"].setValue(this.row.idstore_type);
      this.lForm.controls["lat"].setValue(this.row.lat);
      this.lForm.controls["long"].setValue(this.row.long);
      this.lForm.controls["service_distance"].setValue(this.row.service_distance);
    }
  }

  ngOnInit(): void {
    if (this.row.is_store) {
      this.getStoreType();
    }
  }


  onSubmit() {
    // stop here if form is invalid
    if (this.lForm.invalid) {
      return;
    }

    if(!this.lForm.get('idstore_type')!.value && this.row.is_store){
      this.alertService.openSnackBar("Please select Store Type");
      return;
    }

    this.loading = true;
    let req = {
      "name": this.lForm.get('name')!.value,
      "contact": this.lForm.get('contact')!.value,
      "address": this.lForm.get('address')!.value,
      "pincode": this.lForm.get('pincode')!.value,
      "city": this.lForm.get('city')!.value,
      "service_distance": this.lForm.get('service_distance')!.value,
      "created_by": 1,
      "updated_by": 1,
      "status": 1,
      "is_copartner": 0,
      "is_store": this.row.is_store,
      "idstore_type": this.lForm.get('idstore_type')!.value,
      "lat": this.lForm.get('lat')!.value,
      "long": this.lForm.get('long')!.value
    }
    console.log(req)
    if(this.row.idstore_warehouse > 0)
    {
      req['idstore_warehouse'] = this.row.idstore_warehouse;
      this.storeWareServ.update(req)
      .subscribe(
        data => {
          this.cancel(false);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
    }
    else{
      this.storeWareServ.store(req)
      .subscribe(
        data => {
          this.cancel(false);
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
  getStoreType() {
    this.loading = true;
    this.apiServ.get(AppSetting.ENDPOINTS.getStoreType)
      .subscribe(
        data => {
          this.storeTypes = data;
          console.log(this.storeTypes);
          this.loading = false;
        },
        error => {
          this.alertService.openSnackBar(error);
          this.loading = false;
        });

  }

}
