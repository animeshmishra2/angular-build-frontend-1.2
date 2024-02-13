import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppSetting } from '../_conf/app-setting';

@Injectable({
  providedIn: 'root'
})
export class StoreWareService {
  constructor(private http: HttpClient) { }

  getStoresWare(req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/get-store-ware', req)
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

  createBanner(req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/create-banner', req)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  updateBanner(req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/update-banner', req)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  createSlots(req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/create-slot', req).pipe(map(data => {
      return data.data;
    }), catchError(err => {
      return throwError(err);
    }));
  }

  updateSlots(req, id) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/update-slot/' + id, req).pipe(map(data => {
      return data.data;
    }), catchError(err => {
      return throwError(err);
    }));
  }

  createShipingCharge(req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/create-shipping-charge', req)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  updateShipingcharge(id, req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/update-shipping-charge/' + 'id', req)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  createCoupon(req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/create-coupon', req)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  updateCoupon(id, req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/update-coupon/' + id, req)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  updateOrderStatus(id, req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/update-order-status', req)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }


  createpackage(req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/discount/create-package', req)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  updatepackage(id, req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/discount/update-package/' + id, req)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  getProductData(payload) {
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/get-all-pro/' + payload?.type + '/' +  payload?.id)
      .pipe(map(data => {
        return data.data;
      }), catchError(err => {
        return throwError(err);
      }));
  }

  getAllPackageList(id) {
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/discount/package-list/' + id)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  getbyIdpackage(id) {
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/discount/edit-package/'+ id)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  createAttribute(req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/attribute', req)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  updateAttribute(id, req) {
    return this.http.put<any>(AppSetting.API_ENDPOINT + '/api/attribute/' + id, req)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  createAttributeValue(req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/attribute-value', req)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  updateAttributeValue(id, req) {
    return this.http.put<any>(AppSetting.API_ENDPOINT + '/api/attribute-value/' + id, req)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }
}
