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

  getProductReport(): Observable<any> {
    const requestBody = {
      idcategory: 1,
      idsub_category: 1,
      idsub_sub_category: 1,
      idbrand: 1,
    };
    return this.http
      .post(`${AppSetting.API_ENDPOINT}/api/product-report`, requestBody)
      .pipe(
        map((response) => response),
        catchError((error) => {
          console.error('Error fetching Product Report:', error);
          throw error; // Rethrow the error
        })
      );
  }

  getInventoryReport(id: number): Observable<any> {
    const requestBody = {
      idstore_warehouse: id,
    };
    return this.http
      .post(`${AppSetting.API_ENDPOINT}/api/inventory-report`, requestBody)
      .pipe(
        map((response) => response),
        catchError((error) => {
          console.error('Error fetching inventory Report:', error);
          throw error; // Rethrow the error
        })
      );
  }

  getInventoryReportByDate(id: number,dateRange: Date[]): Observable<any> {
    const requestBody = {
      idstore_warehouse: id,
    };
    return this.http
      .post(`${AppSetting.API_ENDPOINT}/api/inventory-report?fromDate=${dateRange[0]}&toDate=${dateRange[1]}`, requestBody)
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
}
