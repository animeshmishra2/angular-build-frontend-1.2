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
  selector: 'app-add-attribute-name',
  templateUrl: './add-attribute-name.component.html',
  styleUrls: ['./add-attribute-name.component.scss']
})
export class AddAttributeNameComponent implements OnInit {

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

  constructor(public dialogRef: MatDialogRef<AddAttributeNameComponent>,
    private alertService: AlertService,
    private storeWareServ: StoreWareService,
    private apiServ: ApiHttpService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.row = data.data;
    this.lForm = this.fb.group({
      // other form controls...
      name: new FormControl('', [
            Validators.required
          ]),
      status: new FormControl('', [
        Validators.required
      ]),
    });
    if (this.row?.idattribute) {
      this.lForm.controls["name"].setValue(this.row.name);
      this.lForm.controls["status"].setValue(this.row.status);
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
   
    if (this.row.idattribute) {
      let payload = {
        'name': this.lForm.get('name')!.value,
        'status' :  this.lForm.get('status')!.value,
        'created_by' : 1,
        'updated_by' : 1
      }
      this.storeWareServ.updateAttribute(this.row?.idattribute,payload).subscribe((data: any) => {
        this.cancel(false);
        this.alertService.openSnackBar("Sucessfully Updated Attribute Name");
      },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        });
    } else {
      let payload = {
        'name': this.lForm.get('name')!.value,
        'status' :  this.lForm.get('status')!.value,
        'created_by' : 1,
        'updated_by' : 1
      }
      this.storeWareServ.createAttribute(payload).subscribe((data: any) => {
        this.cancel(false);
        this.alertService.openSnackBar("Sucessfully Created Attribute Name");
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
