import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { CartService } from 'src/app/shared/_service/cart.service';
import { OrderService } from 'src/app/shared/_service/order.service';
import { ProductService } from 'src/app/shared/_service/product.service';

import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hold-order',
  templateUrl: './hold-order.component.html',
  styleUrls: ['./hold-order.component.scss']
})
export class HoldOrderComponent implements OnInit {

  loading: boolean;
  orders: any = [];

  constructor(private prodServ: ProductService,
    private alertService: AlertService, public router: Router,
    public cartServ: CartService, public dialog: MatDialog, private ordServ: OrderService
  ) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.loading = true;
    this.ordServ.getHoldOrders()
      .subscribe(
        data => {
          this.orders = data.data;
          console.log(data);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  discardOrder(id) {
    this.loading = true;
    this.ordServ.delHoldOrder(id)
      .subscribe(
        data => {
          this.alertService.error("Order Discarded.");
          this.getOrders();
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  moveToCart(item) {
    this.router.navigate(['pos/new-order'], { state: { holdOrder: item } });
  }


  getFormattedDate(date) {
    let dt = new Date(date);
    return moment(dt).format('MMMM Do YYYY, h:mm:ss a')
  }


}
