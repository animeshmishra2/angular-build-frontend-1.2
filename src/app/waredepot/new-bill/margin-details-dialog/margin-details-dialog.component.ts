import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-margin-details-dialog',
  templateUrl: './margin-details-dialog.component.html',
  styleUrls: ['./margin-details-dialog.component.scss']
})
export class MarginDetailsDialogComponent implements OnInit {

  mrp_margin: FormControl;
  instant_price: FormControl;
  product: FormControl;
  copartner: FormControl;
  land: FormControl;

  formGroup: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<MarginDetailsDialogComponent>,) { 
    this.mrp_margin = new FormControl(data?.marginDetails?.mrp_margin, Validators.required);
    this.instant_price = new FormControl(data?.marginDetails?.purchase_price, Validators.required);
    this.product = new FormControl(data?.marginDetails?.product, Validators.required);
    this.copartner = new FormControl(data?.marginDetails?.copartner, Validators.required);
    this.land = new FormControl(data?.marginDetails?.land, Validators.required);
    this.formGroup = new FormGroup({
      mrp_margin: this.mrp_margin,
      instant_price: this.instant_price,
      product: this.product,
      copartner: this.copartner,
      land: this.land
    });
  }

  ngOnInit(): void {
  }

  onDialogClose(): void {
    if (this.formGroup.valid) {
      const dialogResult = {
        mrp_margin: Number(this.mrp_margin.value),
        instant_price: Number(this.instant_price.value),
        product: this.product.value,
        copartner: this.copartner.value,
        land: this.land.value
      };
  
      this.dialogRef.close(dialogResult);
    } else {
      // Handle the case when the form is not valid before closing the dialog
      // You might display an error message or take other actions as needed
    }
  }

}
