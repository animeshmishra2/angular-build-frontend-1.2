import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ProductService } from 'src/app/shared/_service/product.service';
import { StoreWareService } from 'src/app/shared/_service/store-ware.service';

@Component({
  selector: 'app-create-store-wh-order',
  templateUrl: './create-store-wh-order.component.html',
  styleUrls: ['./create-store-wh-order.component.scss']
})
export class CreateStoreWhOrderComponent implements OnInit {

  loading: boolean = false;

  search: string;
  warehouse: any = "";
  finOrders: any = [];
  finOrdersId: any = [];

  allWares: any = [];
  allStores: any = [];

  products: any = [];

  constructor(private storeWareServ: StoreWareService,
    private alertService: AlertService,
    private prodServ: ProductService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.getStoreWares();
  }

  addProduct(pro) {
    var index = this.finOrdersId.indexOf(pro['idproduct_master']);
    if (index < 0) {
      this.finOrdersId.push(pro['idproduct_master'])
      this.finOrders.push({ "idproduct_master": pro['idproduct_master'], "quantity": "", "name": pro['name'] });
    }
  }

  removeProduct(pro) {
    var index = this.finOrdersId.indexOf(pro['idproduct_master']);
    this.finOrdersId.splice(index, 1);
    this.finOrders = this.finOrders.filter(obj => obj.idproduct_master !== pro.idproduct_master);
  }

  getStoreWares() {
    this.loading = true;
    this.storeWareServ.getAllStoresWare()
      .subscribe(
        data => {
          this.loading = false;
          data.forEach(elm => {
            (elm.is_store==1) ? this.allStores.push(elm) : this.allWares.push(elm);
          });
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }


  doSearch(barcode) {
    this.search = barcode;
    if (barcode.length > 3) {
      this.getProducts(barcode);
    }
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

  createOrder()
  {
    this.loading = true;
    const req = {
      idstore_warehouse : this.warehouse,
      order_detail : this.finOrders
    }
    this.prodServ.createStoreOrder(req)
      .subscribe(
        data => {
          console.log(data);
          this.router.navigate(['/ggb-admin/order-to-warehouse']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

}
