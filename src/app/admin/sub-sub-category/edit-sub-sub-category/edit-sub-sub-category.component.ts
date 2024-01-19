import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';

@Component({
  selector: 'app-edit-sub-sub-category',
  templateUrl: './edit-sub-sub-category.component.html',
  styleUrls: ['./edit-sub-sub-category.component.scss']
})
export class EditSubSubCategoryComponent implements OnInit {

  cats:any = [];
  scats:any = [];
  row: any;
  loading: boolean = false;

  lForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    category: new FormControl('', [
      Validators.required
    ]),
    subcategory: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl('', [
      Validators.required
    ]),
    status: new FormControl('', [
      Validators.required
    ])
  });

  constructor(public dialogRef: MatDialogRef<EditSubSubCategoryComponent>,
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
      this.lForm.controls["status"].setValue(`${this.row.status}`);
      this.getSubCats(this.row.idcategory);

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
          if (this.row.idsub_sub_category) {
            this.lForm.controls["category"].setValue(this.row.idcategory);
          }
        },
        error => {
          this.alertService.openSnackBar(error);
          this.loading = false;
        });
  }

  catChanges(filterValue)
  {
    if(+filterValue > 0)
    {
      this.getSubCats(+filterValue);
    }
  }

  getSubCats(catid){
    this.scats = [];
    this.loading = true;
    this.apiServ.get(AppSetting.ENDPOINTS.getSubCategoryByCatId +"/"+ catid)
      .subscribe(
        data => {
          this.scats = data;
          this.loading = false;
          if (this.row.idsub_category) {
            this.lForm.controls["subcategory"].setValue(this.row.idsub_category);
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
      "idsub_category": this.lForm.get('subcategory')!.value,
      "status": this.lForm.get('status')!.value
    }
    if (this.row.idsub_sub_category > 0) {
      req['idsub_sub_category'] = this.row.idsub_sub_category;
      this.apiServ.patch(AppSetting.ENDPOINTS.subSubCategory + "/" + this.row.idsub_sub_category , req)
        .subscribe(
          data => {
            this.alertService.openSnackBar("Sub Sub Category Updated.");
            this.cancel(false);
          },
          error => {
            this.alertService.openSnackBar(error);
            this.loading = false;
          });
    }
    else {
      this.apiServ.post(AppSetting.ENDPOINTS.subSubCategory, req)
        .subscribe(
          data => {
            this.alertService.openSnackBar("Sub Sub Category Added.");
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
