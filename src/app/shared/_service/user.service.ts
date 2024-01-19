import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppSetting } from '../_conf/app-setting';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getAllStaff() {
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/staff')
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  update(req) {
    return this.http.patch<any>(AppSetting.API_ENDPOINT + '/api/staff/' + req.id, req)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  store(req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/staff', req)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }
  updateAccess(req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/update-access', req)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }
  getActiveCounters() {
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/active-counters')
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }
  getCustomer(contact) {
    return this.http.get<any>(AppSetting.API_ENDPOINT + '/api/get-customer/' + contact)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }
  saveCustomer(detail) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/save-customer',  detail)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }

  updateCustomer(detail) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/change-membershipp',  detail)
      .pipe(map(data => {
        return data.data;
      }),
        catchError(err => {
          return throwError(err);
        }));
  }
}
