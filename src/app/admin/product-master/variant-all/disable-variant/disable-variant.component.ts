import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';

@Component({
  selector: 'app-disable-variant',
  templateUrl: './disable-variant.component.html',
  styleUrls: ['./disable-variant.component.scss']
})
export class DisableVariantComponent implements OnInit {

 
  row: any;
  loading: boolean = false;
  orderForm: FormGroup;
  activeVarient = 0;
  allvariantList: any[] = []
  attributeList: any;
  attributeName: any;

  constructor(public dialogRef: MatDialogRef<DisableVariantComponent>,
    private alertService: AlertService,
    private fb: FormBuilder,
    private apiServ: ApiHttpService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.row = data;
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

  disableAttribute(index, row){
    const rowDataAtIndex = row.data?.attributes[index];
    this.alertService.confirmDialog("Are you sure to Disable attribute").subscribe((res) => {
      if (res == true) {
        let req = {
          idattribute_value : Number(rowDataAtIndex?.idattribute_value),
          status : rowDataAtIndex?.status ? rowDataAtIndex?.status : 0
        }
        let url = AppSetting.ENDPOINTS.disableVariant + rowDataAtIndex?.idattribute;
        this.apiServ.patch(url, req).subscribe((data: any) => {
          this.alertService.openSnackBar("successfully disabled Attribute.");
        },
          (error) => {
            this.alertService.error(error);
            this.loading = false;
          });
      } else {
        return
      }
     
    });
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

  cancel(manual = true): void {
    this.dialogRef.close({ 'manual': manual });
  }
}
