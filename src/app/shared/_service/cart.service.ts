import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  activeCartProducts: any = [];
  holdOrders: any[] = []
  constructor() { }
  currItem: any;

  addProduct(product) {
    return new Promise((resolve, reject) => {

      if (this.activeCartProducts["p-" + product.idproduct_master]) {
        this.activeCartProducts["p-" + product.idproduct_master].qty += 1;
      }
      else {
        this.activeCartProducts["p-" + product.idproduct_master]['qty'] = 1;
        this.activeCartProducts["p-" + product.idproduct_master]['detail'] = product;
      }
      // if (!this.activeCartProdId.includes(product.idproduct_master)) {
      //   this.activeCartProdId.push(product.idproduct_master);
      //   product['quantity'] = 1;
      //   this.activeCartProducts.push(product);
      //   console.log(this.activeCartProdId);
      //   console.log(this.activeCartProducts);
      // }
      // else {
      //   this.activeCartProducts.forEach(function (item, index, object) {
      //     if (product.idproduct_master === item.idproduct_master) {
      //       item.quantity += 1; 
      //     }
      //   });
      // }
      resolve(true);
    });
  }

  removeProduct(item) {
    // console.log(item);
    return new Promise((resolve, reject) => {
      // this.activeCartProducts.forEach(function (product, index, object) {
      //   if (product.idproduct_master === item.idproduct_master) {
      //     object.splice(index, 1);
      //   }
      // });
      // var index = this.activeCartProdId.indexOf(item.idproduct_master);
      // this.activeCartProdId.splice(index, 1);
      var index = this.activeCartProducts.indexOf("p-" + item.idproduct_master);
      this.activeCartProducts.splice(index, 1);
      resolve({ activeCartProducts: this.activeCartProducts });
    });
  }

  updateQuantity(item, isIncrement = true, isFinalQty = false, newQty = 0) {
    return new Promise<any[]>((resolve, reject) => {
      if (this.activeCartProducts["p-" + item.idproduct_master]) {
        if (isIncrement) {
          if (item.quantity == 0 || this.activeCartProducts["p-" + item.idproduct_master].qty >= item.quantity) {
            reject("Quantity Exhausted.")
          }
          else {
            if(isFinalQty)
            {
              if (item.quantity == 0 || newQty >= item.quantity) {
                reject("Quantity Exhausted.")
              }
              else{
                this.activeCartProducts["p-" + item.idproduct_master].qty = newQty
              }
            }
            else{
            this.activeCartProducts["p-" + item.idproduct_master].qty += 1;
            }
          }

        }
        else {

          if (this.activeCartProducts["p-" + item.idproduct_master].qty <= 1) {
            if(isFinalQty && newQty > 0){
              this.activeCartProducts["p-" + item.idproduct_master].qty = newQty
            }
            else{
              delete this.activeCartProducts["p-" + item.idproduct_master];
            }
          }
          else {
            if(isFinalQty){
              this.activeCartProducts["p-" + item.idproduct_master].qty = newQty
            }
            else{
              this.activeCartProducts["p-" + item.idproduct_master].qty -= 1;
            }
          }
        }
      }
      else {
        if (item.quantity == 0) {
          reject("Quantity Exhausted.")
        }
        else {
          if(!item.hasOwnProperty('selQty')){
            
            this.activeCartProducts["p-" + item.idproduct_master] = []
          this.activeCartProducts["p-" + item.idproduct_master]['qty'] = 1;
          this.activeCartProducts["p-" + item.idproduct_master]['detail'] = item;
          // this.activeCartProducts["p-" + item.idproduct_master]['detail']['selling_price'] = item?.selected_batch?.selling_price;
          // this.activeCartProducts["p-" + item.idproduct_master]['detail']['mrp'] = item?.selected_batch?.mrp;
          // this.activeCartProducts["p-" + item.idproduct_master]['detail']['cgst'] = item?.selected_batch?.cgst;
          // this.activeCartProducts["p-" + item.idproduct_master]['detail']['igst'] = item?.selected_batch?.igst;
          // this.activeCartProducts["p-" + item.idproduct_master]['detail']['instant_discount'] = item?.discount;
          // this.activeCartProducts["p-" + item.idproduct_master]['detail']['product_discount'] = item?.product;
          // this.activeCartProducts["p-" + item.idproduct_master]['detail']['copartner_discount'] = item?.copartner;
          // this.activeCartProducts["p-" + item.idproduct_master]['detail']['land_discount'] = item?.land;

          }else{
            
            this.activeCartProducts["p-" + item.idproduct_master] = []
          this.activeCartProducts["p-" + item.idproduct_master]['qty'] = item.selQty;
          this.activeCartProducts["p-" + item.idproduct_master]['detail'] = item;
          
          }
        }
      }
      resolve(this.activeCartProducts);
      
    });
  }

  getProducts() {
    return new Promise((resolve, reject) => {
      resolve(this.activeCartProducts);
    });
  }

  empty() {
    return new Promise((resolve, reject) => {
      this.activeCartProducts = [];
      resolve(true);
    });
  }

  setCurrItem(item) {
    return new Promise((resolve, reject) => {
      this.currItem = item;
      resolve(true);
    });
  }

  getCurrItem() {
    return new Promise((resolve, reject) => {
      resolve(this.currItem);
    });
  }

  getHoldOrders()
  {

  }

  addHoldOrder()
  {
    return new Promise((resolve, reject) => {
      this.holdOrders.push({
        activeCartProducts : this.activeCartProducts
      });
      resolve(true);
    });
  }
}
