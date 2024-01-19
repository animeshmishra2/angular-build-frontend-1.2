import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppSetting } from '../_conf/app-setting';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  getDiscountCoupon() {
    return this.http
      .get<any>(AppSetting.API_ENDPOINT + '/api/get-all-coupons')
      .pipe(
        map((data) => {
          return data;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  holdOrder(order) {
    return this.http
      .post<any>(AppSetting.API_ENDPOINT + '/api/customer-order-temp', order)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  getHoldOrders() {
    return this.http
      .get<any>(AppSetting.API_ENDPOINT + '/api/hold-orders')
      .pipe(
        map((data) => {
          return data;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }
  delHoldOrder(id) {
    return this.http
      .delete<any>(AppSetting.API_ENDPOINT + '/api/customer-order-temp/' + id)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  getHoldOrderDetail(id) {
    return this.http
      .get<any>(AppSetting.API_ENDPOINT + '/api/hold-order-detail/' + id)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  placeOrder(order) {
    return this.http
      .post<any>(AppSetting.API_ENDPOINT + '/api/customer-order', order)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  openCounterOrders() {
    return this.http
      .post<any>(AppSetting.API_ENDPOINT + '/api/open-counter-orders',"")
      .pipe(
        map((data) => {
          return data;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }
  openCounterOrdersFilter(from, to) {
    return this.http
      .post<any>(AppSetting.API_ENDPOINT + '/api/open-counter-orders', {
        from_date: from,
        till_date: to,
      })
      .pipe(
        map((data) => {
          return data;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  getOrderDetails(id: string) {
    return this.http
      .get<any>(AppSetting.API_ENDPOINT + `/api/get-order-details/${id}`)
      .pipe(
        map((data) => {
          return data;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }
}
