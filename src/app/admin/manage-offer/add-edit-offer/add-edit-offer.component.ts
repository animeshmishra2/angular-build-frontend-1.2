import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StoreWare } from 'src/app/shared/_model/store-ware';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { AuthenticationService } from 'src/app/shared/_service/authentication.service';
import { ProductService } from 'src/app/shared/_service/product.service';
import { StoreWareService } from 'src/app/shared/_service/store-ware.service';
import { EditStoreWareComponent } from '../../store-warehouse/edit-store-ware/edit-store-ware.component';

@Component({
  selector: 'app-add-edit-offer',
  templateUrl: './add-edit-offer.component.html',
  styleUrls: ['./add-edit-offer.component.scss']
})
export class AddEditOfferComponent implements OnInit {

  
  row: StoreWare;
  loading: boolean = false;
  products: any = []

  selProdsID: any = [];

  selProds: any = [];

  lForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    address: new FormControl('', [
      Validators.required
    ]),
    city: new FormControl('', [
      Validators.required
    ]),
    pincode: new FormControl('', [
      Validators.required
    ]),
    contact: new FormControl('', [
      Validators.required
    ]),
    is_store: new FormControl(''),
    is_copartner: new FormControl(''),
    status: new FormControl(''),
    idstore_warehouse: new FormControl(''),
    base: new FormControl(''),
    search: new FormControl(''),
  });

  constructor(public dialogRef: MatDialogRef<EditStoreWareComponent>,
    private alertService: AlertService,private prodServ: ProductService,
    private storeWareServ: StoreWareService,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    this.row = data.data;
    console.log(this.row);
    if (this.row.idstore_warehouse) {
      this.lForm.controls["name"].setValue(this.row.name);
      this.lForm.controls["contact"].setValue(this.row.contact);
      this.lForm.controls["address"].setValue(this.row.address);
      this.lForm.controls["pincode"].setValue(this.row.pincode);
      this.lForm.controls["city"].setValue(this.row.city);
      this.lForm.controls["idstore_warehouse"].setValue(this.row.idstore_warehouse);
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
      "contact": this.lForm.get('contact')!.value,
      "address": this.lForm.get('address')!.value,
      "pincode": this.lForm.get('pincode')!.value,
      "city": this.lForm.get('city')!.value,
      "created_by": 1,
      "updated_by": 1,
      "status": 1,
      "is_copartner": 0,
      "is_store": this.row.is_store
    }
    if(this.row.idstore_warehouse > 0)
    {
      req['idstore_warehouse'] = this.row.idstore_warehouse;
      this.storeWareServ.update(req)
      .subscribe(
        data => {
          this.cancel(false);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
    }
    else{
      this.storeWareServ.store(req)
      .subscribe(
        data => {
          this.cancel(false);
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


  getProducts(barcode) {
    this.loading = true;
    this.prodServ.getProductMaster(barcode)
      .subscribe(
        data => {
          this.products = data.data;
          console.log(this.products);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }


  addProduct(pro) {
    var index = this.selProdsID.indexOf(pro['idproduct_master']);
    if (index < 0) {
      this.selProdsID.push(pro['idproduct_master'])
      this.selProds.push({ "idproduct_master": pro['idproduct_master'], "quantity": "", "name": pro['name'] });
    }
  }

  doSearch(barcode) {
    if (barcode.length > 3) {
      this.getProducts(barcode);
    }
  }

  removeProduct(pro) {
    var index = this.selProdsID.indexOf(pro['idproduct_master']);
    this.selProdsID.splice(index, 1);
    this.selProds = this.selProds.filter(obj => obj.idproduct_master !== pro.idproduct_master);
  }

}
