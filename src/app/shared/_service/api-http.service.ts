import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppSetting } from '../_conf/app-setting';

@Injectable({
  providedIn: 'root'
})
export class ApiHttpService {

  constructor(private http: HttpClient) { }

  get(url: string) {
    console.log(AppSetting.API_ENDPOINT + url);

    return this.http.get<any>(AppSetting.API_ENDPOINT + url)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  post(url: string, data: any) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + url, data)
      .pipe(map(data => {
        return data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  put(url: string, data: any) {
    return this.http.put<any>(AppSetting.API_ENDPOINT + url, data)
      .pipe(map(data => {
        return data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  patch(url: string, data: any) {
    return this.http.patch<any>(AppSetting.API_ENDPOINT + url, data)
      .pipe(map(data => {
        return data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  delete(url: string) {
    return this.http.delete<any>(AppSetting.API_ENDPOINT + url)
      .pipe(map(data => {
        return data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  getForFilter(url: string) {
    return this.http.get<any>(AppSetting.API_ENDPOINT + url)
      .pipe(map(data => {
        data.data;
      }));
  }

  getWithParams(url: string, params1?: any): Observable<any> {
    console.log("params",params1);
    
    let params = new HttpParams();
    params = params.set('id', JSON.stringify(params1.id));
    params = params.append('storeId', params1.storeId);
    return this.http.get<any>(AppSetting.API_ENDPOINT + url, { params: params })
      .pipe(
        map(data => {
          return data.data;
        }),
        catchError(err => {
          return throwError(err);
        })
      );
  }

}
