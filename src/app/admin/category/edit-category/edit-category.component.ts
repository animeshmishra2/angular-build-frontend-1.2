import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {

 
  row: any;
  loading: boolean = false;

  lForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl('', [
      Validators.required
    ]),
    status: new FormControl('', [
      Validators.required
    ]),
    ret_type: new FormControl(null, []),
    ret_duration: new FormControl(null, []),
    has_return_rule: new FormControl('N', [])
  });

  constructor(public dialogRef: MatDialogRef<EditCategoryComponent>,
    private alertService: AlertService,
    private apiServ: ApiHttpService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.row = data.data;
    console.log(this.row);
    if (this.row.idcategory) {
      this.lForm.controls["name"].setValue(this.row.name);
      this.lForm.controls["description"].setValue(this.row.description);
      this.lForm.controls["status"].setValue(this.row.status);
      this.lForm.controls["has_return_rule"].setValue(this.row.has_return_rule);
      this.lForm.controls["ret_type"].setValue(this.row.return_type);
      this.lForm.controls["ret_duration"].setValue(this.row.return_duration);
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
      "description": this.lForm.get('description')!.value,
      "has_return_rule": this.lForm.get('has_return_rule')!.value,
      "return_type": this.lForm.get('ret_type')!.value,
      "return_duration": this.lForm.get('ret_duration')!.value,
      "status": this.lForm.get('status')!.value
    }
    if (this.row.idcategory > 0) {
      req['idcategory'] = this.row.idcategory;
      this.apiServ.patch(AppSetting.ENDPOINTS.category + "/" + this.row.idcategory , req)
        .subscribe(
          data => {
            this.alertService.openSnackBar("Category Updated.");
            this.cancel(false);
          },
          error => {
            this.alertService.openSnackBar(error);
            this.loading = false;
          });
    }
    else {
      this.apiServ.post(AppSetting.ENDPOINTS.category, req)
        .subscribe(
          data => {
            this.alertService.openSnackBar("Category Added.");
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
