import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';

@Component({
  selector: 'app-manage-varient',
  templateUrl: './manage-varient.component.html',
  styleUrls: ['./manage-varient.component.scss']
})

export class ManageVarientComponent implements OnInit {

  row: any;
  loading: boolean = false;
  items: FormArray;
  orderForm: any;
  activeVarient = 0;
  allvariantList: any[] = []

  constructor(public dialogRef: MatDialogRef<ManageVarientComponent>,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private apiServ: ApiHttpService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.row = data.data;
    console.log('this.row: ', this.row);
    this.orderForm = new FormGroup({
      items: new FormArray([])
    });
  }

  ngOnInit(): void {
    if (this.row?.idproduct_master) {
      this.getProductList();
      // this.addVarient();
    }
  }

  getProductList() {
    console.log("yess");
    // console.log("yess", data);
    this.apiServ.get(AppSetting.ENDPOINTS.getProductVariant).subscribe(data => {
      this.allvariantList = data?.data?.filter((edata: any) => edata?.idproduct_master == this.row?.idproduct_master);
      if (this.allvariantList.length > 0) {
        for (let index = 0; index < this.allvariantList.length; index++) {
          const element = this.allvariantList[index];
          this.addVarient(element, true);
        }
        console.log("yessggg");
      } else {
        this.addVarient();
      }
    });    
  }

  makeActive(event, index) {
    if (event?.checked) {
      this.activeVarient = index;
    }
  }

  addVarient(data: any = {}, isUpdate: boolean = false) {
    console.log("trigger");
    
    if (this.orderForm?.valid) {
      this.items = this.orderForm.get('items') as FormArray;
      this.items.push(this.createItem(data, isUpdate));
    }
  }

  createItem(data: any = {}, isUpdate: boolean = false): FormGroup {
    return this.formBuilder.group({
      name: [isUpdate ? data?.name : '', Validators.required],
      description: [isUpdate ? data?.description : '', Validators.required],
      barcode: [isUpdate ? data?.barcode : '', Validators.required],
      hsn: [isUpdate ? data?.hsn : '', Validators.required],
      isSame: [''],
      attributeValue1: [isUpdate ? data?.attributeValue1 : '', Validators.required],
      attributeValue2: [isUpdate ? data?.attributeValue2 : '', Validators.required],
      id: isUpdate ? data?.idproduct_variant : null,
      status: isUpdate ? data?.status : '',
    });
  }

  onChecked(event: any, row: any, index: number) {
    if (event?.checked) {
      row?.controls['attributeValue1']?.setValue(this.orderForm?.value?.items[0]['attributeValue1']);
      row?.controls['attributeValue2']?.setValue(this.orderForm?.value?.items[0]['attributeValue2']);
    }
  }

  manageVariant(index: any) {
    // stop here if form is invalid
    console.log("this.orderForm", this.orderForm)
    if (this.orderForm.invalid) {
      return;
    }

    this.loading = true;
    const productName: any = [];

    this.orderForm.value.items?.forEach((ele: any) => {
      productName?.push({
        name: ele?.name,
        description: ele?.description,
        barcode: ele?.barcode,
        hsn: ele?.hsn,
      });
    });


    let req = {
      idproduct_variant: this.row.idproduct_master,
      idproduct_master: this.row.idproduct_master,
      name: this.orderForm.value.items[index]?.name,
      description: this.orderForm.value.items[index]?.description,
      barcode: this.orderForm.value.items[index]?.barcode,
      hsn: this.orderForm.value.items[index]?.hsn,
      status: this.orderForm.value.items[index]?.status, 
    }

    console.log('req: ', req);

    this.apiServ.post(AppSetting.ENDPOINTS.manageVariant, req).subscribe(data => {
      if (data.statusCode == 0) {
        this.alertService.openSnackBar("Product Updated.");
        this.cancel(false);
      } else {
        this.alertService.openSnackBar(data.message);
      }
      this.loading = false;
    }, (error) => {
      this.alertService.openSnackBar(error);
      this.loading = false;
    });
  }

  cancel(manual = true): void {
    this.dialogRef.close({ 'manual': manual });
  }
}
