import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';

@Component({
  selector: 'app-add-new-variant',
  templateUrl: './add-new-variant.component.html',
  styleUrls: ['./add-new-variant.component.scss']
})
export class AddNewVariantComponent implements OnInit {

 
  row: any;
  loading: boolean = false;
  orderForm: FormGroup;
  activeVarient = 0;
  allvariantList: any[] = []
  attributeList: any;
  attributeName: any;

  constructor(public dialogRef: MatDialogRef<AddNewVariantComponent>,
    private alertService: AlertService,
    private fb: FormBuilder,
    private apiServ: ApiHttpService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.row = data;
    console.log('this.rosdsdw: ', this.row);
    this.orderForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      barcode: ['', Validators.required],
      hsn: ['', Validators.required],
      attributeValues: this.fb.array([
        this.createAttributeItem()
      ]),
      status: '',
    });
  }

  ngOnInit(): void {
    this.getAttribbuteValue();
    this.getAttribbuteName();
    this.orderForm.get('attributeName')?.valueChanges.subscribe((selectedStateId) => {
      if (selectedStateId) {
        this.getAttribbuteByid(selectedStateId);
      } else {
        this.attributeName = [];
      }
      
    });
    if(this.row?.data?.idproduct_variant){
      this.orderForm.controls["name"].setValue(this.row.data.name);
      this.orderForm.controls["description"].setValue(this.row.data.description);
      this.orderForm.controls["barcode"].setValue(this.row.data.barcode);
      this.orderForm.controls["hsn"].setValue(this.row.data.hsn);
      this.orderForm.controls["status"].setValue(this.row.data.status);
      // this.orderForm.controls["attributeValues"].setValue(this.row.idstore_warehouse);

      const attributeValuesArray = this.orderForm.get('attributeValues') as FormArray;
      attributeValuesArray.clear();
      this.row?.data?.attributes.forEach((attribute: any) => {
        attributeValuesArray.push(this.fb.group({
          attributeName: attribute.idattribute,
          attributeValue: Number(attribute.idattribute_value)
        }));
      });
    }
  }

  createAttributeItem(): FormGroup {
    return this.fb.group({
      attributeName: ['', Validators.required],
      attributeValue: ['', Validators.required]
    });
  }

  get attributeValues() {
    return this.orderForm.get('attributeValues') as FormArray;
  }

  addAttribute() {
    this.attributeValues.push(this.createAttributeItem());
  }

  getAttribbuteValue() {
    this.loading = true;
    this.apiServ.get(AppSetting.ENDPOINTS.getAttributeValue).subscribe(data => {
      this.attributeList = data.data;
      this.loading = false;
    }, error => {
      this.alertService.openSnackBar(error);
      this.loading = false;
    });
  }

  getAttribbuteName() {
    this.loading = true;
    this.apiServ.get(AppSetting.ENDPOINTS.getAttributeName).subscribe(data => {
      this.attributeName = data.data;
      this.loading = false;
    }, error => {
      this.alertService.openSnackBar(error);
      this.loading = false;
    });
  }

  getAttribbuteByid(id) {
    this.loading = true;
    this.apiServ.get(AppSetting.ENDPOINTS.getAttributebyId + id).subscribe(data => {
      this.attributeList = data;
      this.loading = false;
    }, error => {
      this.alertService.openSnackBar(error);
      this.loading = false;
    });
  }


  makeActive(event, index) {
    if (event?.checked) {
      this.activeVarient = index;
    }
  }

  manageVariant() {
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
    
    if (this.row?.data?.idproduct_variant){
      let valueAttribute : any[] = [];
    const attributeValues = this.orderForm.get('attributeValues')?.value;
    console.log("value",attributeValues);
    
    attributeValues.forEach((item: any) => {
      valueAttribute.push(item?.attributeValue)
        console.log("this.orderForm.get('attributeValues')?.value",valueAttribute);
    });
      let req = {
        idproduct_variant: this.row.data.idproduct_variant,
        idproduct_master: this.row.data.idproduct_master,
        name: this.orderForm.value?.name,
        description: this.orderForm.value?.description,
        barcode: this.orderForm.value?.barcode,
        hsn: this.orderForm.value?.hsn,
        status: this.orderForm.value?.status,
        idattribute_value: valueAttribute,
      }
      this.apiServ.post(AppSetting.ENDPOINTS.saveMultipleProductsVariant, req).subscribe(data => {
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
    } else {
      let valueAttribute : any[] = [];
    const attributeValues = this.orderForm.get('attributeValues')?.value;
    console.log("value",attributeValues);
    attributeValues.forEach((item: any) => {
        item?.attributeValue.forEach((attribute)=>{
          valueAttribute.push(attribute)
        })
        console.log("value",valueAttribute);
    });
      let req = {
        idproduct_variant: this.row.data.idproduct_master,
        idproduct_master: this.row.data.idproduct_master,
        name: this.orderForm.value?.name,
        description: this.orderForm.value?.description,
        barcode: this.orderForm.value?.barcode,
        hsn: this.orderForm.value?.hsn,
        status: this.orderForm.value?.status,
        idattribute_value: valueAttribute,
      }
      this.apiServ.post(AppSetting.ENDPOINTS.saveProductsVariant, req).subscribe(data => {
        if (data.statusCode == 0) {
          this.alertService.openSnackBar("Variant Added.");
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
    
  }

  cancel(manual = true): void {
    this.dialogRef.close({ 'manual': manual });
  }
}
