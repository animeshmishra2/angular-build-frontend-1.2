import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';

@Component({
  selector: 'app-edit-product-master',
  templateUrl: './edit-product-master.component.html',
  styleUrls: ['./edit-product-master.component.scss']
})
export class EditProductMasterComponent implements OnInit {

  
  cats:any = [];
  scats:any = [];
  sscats:any = [];
  brands:any = [];
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
    subsubcategory: new FormControl(''),
    brand: new FormControl('', [
      Validators.required
    ]),
    bar: new FormControl('', [
      Validators.required
    ]),
    cgst: new FormControl('', [
      Validators.required
    ]),
    sgst: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl(''),
    status: new FormControl('', [
      Validators.required
    ])
  });

  constructor(public dialogRef: MatDialogRef<EditProductMasterComponent>,
    private alertService: AlertService,
    private apiServ: ApiHttpService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.row = data.data;
    console.log(this.row);
    this.getCats();
    this.getBrand();
    if (this.row.idproduct_master) {
      this.lForm.controls["name"].setValue(this.row.name);
      this.lForm.controls["description"].setValue(this.row.description);
      this.lForm.controls["status"].setValue(`${this.row.status}`);
      this.lForm.controls["cgst"].setValue(this.row.cgst);
      this.lForm.controls["sgst"].setValue(this.row.sgst);
      this.lForm.controls["bar"].setValue(this.row.barcode);
      this.getSubCats(this.row.idcategory);
      if(this.row.idsub_category){
        this.getSubSubCats(this.row.idsub_category);
      }
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
          if (this.row.idcategory) {
            this.lForm.controls["category"].setValue(this.row.idcategory);
          }
        },
        error => {
          this.alertService.openSnackBar(error);
          this.loading = false;
        });
  }

  getBrand(){
    this.loading = true;
    this.apiServ.get(AppSetting.ENDPOINTS.brand)
      .subscribe(
        data => {
          this.brands = data;
          this.loading = false;
          if (this.row.idbrand) {
            this.lForm.controls["brand"].setValue(this.row.idbrand);
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
  scatChanges(filterValue)
  {
    if(+filterValue > 0)
    {
      this.getSubSubCats(+filterValue);
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

  getSubSubCats(scatid){
    this.sscats = [];
    this.loading = true;
    this.apiServ.get(AppSetting.ENDPOINTS.getSSCategoryBySubCatId +"/"+ scatid)
      .subscribe(
        data => {
          this.sscats = data;
          this.loading = false;
          if (this.row.idsub_sub_category) {
            this.lForm.controls["subsubcategory"].setValue(this.row.idsub_sub_category);
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
      "barcode": this.lForm.get('bar')!.value,
      "sgst": this.lForm.get('sgst')!.value,
      "cgst": this.lForm.get('cgst')!.value,
      "description": this.lForm.get('description')!.value,
      "idbrand": this.lForm.get('brand')!.value,
      "idcategory": this.lForm.get('category')!.value,
      "idsub_category": this.lForm.get('subcategory')!.value,
      "idsub_sub_category": this.lForm.get('subsubcategory')!.value,
      "status": this.lForm.get('status')!.value
    }
    if (this.row.idproduct_master > 0) {
      req['idproduct_master'] = this.row.idproduct_master;
      this.apiServ.patch(AppSetting.ENDPOINTS.productMaster + "/" + this.row.idproduct_master , req)
        .subscribe(
          data => {
            if(data.statusCode == 0){
              this.alertService.openSnackBar("Product Updated.");
              this.cancel(false);
            }
            else{
              this.alertService.openSnackBar(data.message);
            }
            this.loading = false;
          },
          error => {
            this.alertService.openSnackBar(error);
            this.loading = false;
          });
    }
    else {
      this.apiServ.post(AppSetting.ENDPOINTS.productMaster, req)
        .subscribe(
          data => {
            if(data.statusCode == 0){
              this.alertService.openSnackBar("Product Added.");
              this.cancel(false);
            }
            else{
              this.alertService.openSnackBar(data.message);
            }
            this.loading = false;
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
