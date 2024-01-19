import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppSetting } from '../_conf/app-setting';

@Injectable({
  providedIn: 'root'
})
export class CounterService {

  constructor(private http: HttpClient) { }

  getCounterDetails() {
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/counter')
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  openCounter(re) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/open-counter' , re)
      .pipe(map(data => {
        return data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }
  closeCounter(req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/close-counter',req)
      .pipe(map(data => {
        return data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }
  couponCodes() {
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/get-all-coupons')
      .pipe(map(data => {
        return data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }
  getSWCounters(req) {
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/get-all-counter-bysw/' + req)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  update(req) {
    return this.http.patch<any>(AppSetting.API_ENDPOINT + '/api/counter/' + req['idcounter'], req)
    .pipe(map(data => {
      return data.data;
    }),
      catchError(err => {
        return throwError(err);
      }));
  }

  create(req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/counter', req)
    .pipe(map(data => {
      return data.data;
    }),
      catchError(err => {
        return throwError(err);
      }));
  }
}
