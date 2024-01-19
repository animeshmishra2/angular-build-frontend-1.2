import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';

@Component({
  selector: 'app-edit-brand',
  templateUrl: './edit-brand.component.html',
  styleUrls: ['./edit-brand.component.scss']
})
export class EditBrandComponent implements OnInit {


  row: any;
  loading: boolean = false;

  lForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    status: new FormControl('', [
      Validators.required
    ])
  });

  constructor(public dialogRef: MatDialogRef<EditBrandComponent>,
    private alertService: AlertService,
    private apiServ: ApiHttpService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.row = data.data;
    console.log(this.row);
    if (this.row.idbrand) {
      this.lForm.controls["name"].setValue(this.row.name);
      this.lForm.controls["status"].setValue(`${this.row.status}`);
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
    let req = {
      "name": this.lForm.get('name')!.value,
      "status": this.lForm.get('status')!.value
    }
    if (this.row.idbrand > 0) {
      req['idbrand'] = this.row.idbrand;
      this.apiServ.patch(AppSetting.ENDPOINTS.brand + "/" + this.row.idbrand, req)
        .subscribe(
          data => {
            this.alertService.openSnackBar("Brand Updated.");
            this.cancel(false);
          },
          error => {
            this.alertService.openSnackBar(error);
            this.loading = false;
          });
    }
    else {
      this.apiServ.post(AppSetting.ENDPOINTS.brand, req)
        .subscribe(
          data => {
            this.alertService.openSnackBar("Brand Added.");
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
