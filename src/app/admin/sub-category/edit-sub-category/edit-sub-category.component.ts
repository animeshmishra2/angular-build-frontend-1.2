import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';

@Component({
  selector: 'app-edit-sub-category',
  templateUrl: './edit-sub-category.component.html',
  styleUrls: ['./edit-sub-category.component.scss']
})
export class EditSubCategoryComponent implements OnInit {

  cats:any = [];
  row: any;
  loading: boolean = false;

  lForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    category: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl('', [
      Validators.required
    ]),
    status: new FormControl('', [
      Validators.required
    ])
  });

  constructor(public dialogRef: MatDialogRef<EditSubCategoryComponent>,
    private alertService: AlertService,
    private apiServ: ApiHttpService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.row = data.data;
    console.log(this.row);
    this.getCats();
    if (this.row.idsub_category) {
      this.lForm.controls["name"].setValue(this.row.name);
      this.lForm.controls["description"].setValue(this.row.description);
      // this.lForm.controls["category"].setValue(this.row.idcategory);
      this.lForm.controls["status"].setValue(this.row.status);
    }
  }

  ngOnInit(): void {

  }

  getCats(){
    this.loading = true;
    this.apiServ.get(AppSetting.ENDPOINTS.category)
      .subscribe(
        data => {
          this.cats = data;
          this.loading = false;
          if (this.row.idsub_category) {
            this.lForm.controls["category"].setValue(this.row.idcategory);
          }
        },
        error => {
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
    let req = {
      "name": this.lForm.get('name')!.value,
      "description": this.lForm.get('description')!.value,
      "idcategory": this.lForm.get('category')!.value,
      "status": this.lForm.get('status')!.value
    }
    if (this.row.idsub_category > 0) {
      req['idsub_category'] = this.row.idsub_category;
      this.apiServ.patch(AppSetting.ENDPOINTS.subCategory + "/" + this.row.idsub_category , req)
        .subscribe(
          data => {
            this.alertService.openSnackBar("Sub Category Updated.");
            this.cancel(false);
          },
          error => {
            this.alertService.openSnackBar(error);
            this.loading = false;
          });
    }
    else {
      this.apiServ.post(AppSetting.ENDPOINTS.subCategory, req)
        .subscribe(
          data => {
            this.alertService.openSnackBar("Sub Category Added.");
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
