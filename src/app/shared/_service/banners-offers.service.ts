import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppSetting } from '../_conf/app-setting';

@Injectable({
  providedIn: 'root'
})
export class BannerOfferService {
  constructor(private http: HttpClient) { }

  getBanners() {
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/get-banner')
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  deleteBanner(id) {
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/delete-banner/' + id)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  getBannerType() {
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/banner-type')
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  getAllStoresWare() {
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/store-ware')
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  update(req) {
    return this.http.patch<any>(AppSetting.API_ENDPOINT + '/api/store-ware/' + req.idstore_warehouse, req)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  store(req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/store-ware', req)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  getAllStoreOrders(page) {
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/all-store-request')
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  getStoreOrderDetail(id) {
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/store-order-detail/' + id)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  dispatchStoreOrder(req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/store-order-dispatch', req)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  acceptStoreOrder(req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/accept-sw-order', req)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  getDeleiverySlots() {
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/get-slot').pipe(map(data => {
      return data.data;
    }), catchError(err => {
      return throwError(err);
    }));
  }

  deleteSlots(id) {
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/delete-slot/' + id).pipe(map(data => {
      return data.data;
    }), catchError(err => {
      return throwError(err);
    }));
  }
  getThresoldPurchaseOrder() {
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/inventory-threshold/list').pipe(map(data => {
      return data.data;
    }), catchError(err => {
      return throwError(err);
    }));
  }

  deletePurchaseOrder(id) {
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/delete-slot/' + id).pipe(map(data => {
      return data.data;
    }), catchError(err => {
      return throwError(err);
    }));
  }

  getShipingcharges() {
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/get-shipping-charge')
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  deleteShipingCharge(id) {
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/delete-shipping-charge/' + id)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }
  getAllCoupns() {
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/get-all-coupons')
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }
  deleteCoupons(id) {
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/delete-coupon/' + id)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }
}
