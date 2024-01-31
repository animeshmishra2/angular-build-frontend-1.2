import { Injectable } from '@angular/core';
import { AppSetting } from '../../_conf/app-setting';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReportApiService {
  constructor(private http: HttpClient) {}

  getProductReport(params?,body?): Observable<any> {
    let string =""
    if(params){
      string = this.paramGenrator(params)
    }
    const requestBody = {
      // idcategory: 1,
      // idsub_category: 1,
      // idsub_sub_category: 1,
      // idbrand: 1,
    };
    return this.http
      .get(`${AppSetting.API_ENDPOINT}/api/product-report?${string}`)
      .pipe(
        map((response) => response),
        catchError((error) => {
          console.error('Error fetching Product Report:', error);
          throw error; // Rethrow the error
        })
      );
  }

  getInventoryReport(params): Observable<any> {
  let string =""
  if(params){
    string = this.paramGenrator(params)
  }
    return this.http
      .get(`${AppSetting.API_ENDPOINT}/api/inventory-report?${string}`)
      .pipe(
        map((response) => response),
        catchError((error) => {
          console.error('Error fetching inventory Report:', error);
          throw error; // Rethrow the error
        })
      );
  }

  getInventoryReportByDate(params:any): Observable<any> {
    let string =""
    if(params){
      string = this.paramGenrator(params)
    }
    return this.http
      .get(`${AppSetting.API_ENDPOINT}/api/inventory-report?${string}`)
      .pipe(
        map((response) => response),
        catchError((error) => {
          console.error('Error fetching inventory Report:', error);
          throw error; // Rethrow the error
        })
      );
  }

  getWarehouseList(): Observable<any> {
    return this.http
      .get(`${AppSetting.API_ENDPOINT}/api/get-warehouse-list`)
      .pipe(
        map((response) => response),
        catchError((error) => {
          console.error('Error fetching Warehouse Report:', error);
          throw error; // Rethrow the error
        })
      );
  }
  getStoreList(): Observable<any> {
    return this.http
      .get(`${AppSetting.API_ENDPOINT}/api/get-store-list`)
      .pipe(
        map((response) => response),
        catchError((error) => {
          console.error('Error fetching Warehouse Report:', error);
          throw error; // Rethrow the error
        })
      );
  }

  getOrderReportData(): Observable<any> {
    return this.http
      .get(`${AppSetting.API_ENDPOINT}/api/order-report`)
      .pipe(
        map((response) => response),
        catchError((error) => {
          console.error('Error fetching Warehouse Report:', error);
          throw error; // Rethrow the error
        })
      );
  }

  private paramGenrator(param){
    
    const params:any = [];

    for (const key in param) {
      if(key && param[key]){

        params.push(`${encodeURIComponent(key)}=${encodeURIComponent(param[key])}`);
      }
    }
  
    return params.join('&');
  }

  getExpiryReport(params:any):Observable<any>{
    // let string =""
    // if(params){
    //   string = this.paramGenrator(params)
    // }
    return this.http
    .post(`${AppSetting.API_ENDPOINT}/api/expried-and-expiring-report`,params)
    .pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Error fetching expried and expiring Report:', error);
        throw error; // Rethrow the error
      })
    );
  }
  getPurchaseOrderReport(params:any):Observable<any>{
    let string =""
    if(params){
      string = this.paramGenrator(params)
    }
    return this.http
    .get(`${AppSetting.API_ENDPOINT}/api/purchase-order-report?${string}`)
    .pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Error fetching Purchase Report:', error);
        throw error; // Rethrow the error
      })
    );
  }
  getSalesReport(params:any):Observable<any>{
    let string =""
    if(params){
      string = this.paramGenrator(params)
    }
    return this.http
    .get(`${AppSetting.API_ENDPOINT}/api/sales-report?${string}`)
    .pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Error fetching Sales Report:', error);
        throw error; // Rethrow the error
      })
    );
  }
  getCOGSReport(params:any):Observable<any>{
    let string =""
    if(params){
      string = this.paramGenrator(params)
    }
    return this.http
    .get(`${AppSetting.API_ENDPOINT}/api/cogs-report?${string}`)
    .pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Error fetching Sales Report:', error);
        throw error; // Rethrow the error
      })
    );
  }
  getPerformanceReport():Observable<any>{
    return this.http
    .get(`${AppSetting.API_ENDPOINT}/api/performance-report`)
    .pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Error fetching Sales Report:', error);
        throw error; // Rethrow the error
      })
    );
  }
  getStockReplacementReport(params:any):Observable<any>{
    let string =""
    if(params){
      string = this.paramGenrator(params)
    }
    return this.http
    .get(`${AppSetting.API_ENDPOINT}/api/stock-levels-report?${string}`)
    .pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Error fetching Sales Report:', error);
        throw error; // Rethrow the error
      })
    );
  }
}
