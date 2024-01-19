import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppSetting } from '../_conf/app-setting';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) { }

  getProductsByBarcode(barcode, isExactSearch = false)
  {
    let url = AppSetting.API_ENDPOINT + '/api/findByBarcode/' + barcode;
    if(isExactSearch && barcode != '1'){
      url += '/0/'+1;
    }
    return this.http.get<any>(url)
    .pipe(map(data => {
      return data;
    }),
      catchError(err => {
        return throwError(err);
      }));
  }


  getProductsbatchByBarcode(barcode, isExactSearch = false)
  {
   return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/find-product-by-wherehouse/' + barcode)
    .pipe(map(data => {
      return data;
    }),
      catchError(err => {
        return throwError(err);
      }));
  }
  getUpdateInventoryQty(data)
  {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/update-inventory-qty',data)
    .pipe(map(data => {
      return data;
    }),
      catchError(err => {
        return throwError(err);
      }));
  }
  getProductMaster(barcode,isExactSearch = false)
  {
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/search-prod/' + barcode)
    .pipe(map(data => {
      return data;
    }),
      catchError(err => {
        return throwError(err);
      }));
  }

  createStoreOrder(req)
  {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/create-sw-order', req)
    .pipe(map(data => {
      return data;
    }),
      catchError(err => {
        return throwError(err);
      }));
  }
  getAutoCalculatePrice(params)
  {
    const httpParams: HttpParams = new HttpParams({fromObject: params})
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/calculatemargin', {params: httpParams})
    .pipe(map(data => {
      return data;
    }),
      catchError(err => {
        return throwError(err);
      }));
  }
  getProductdetails(data)
  {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/edit-bill/' + data,{})
    .pipe(map(data => {
      return data;
    }),
      catchError(err => {
        return throwError(err);
      }));
  }
}
