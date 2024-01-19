import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from "../_model/user";
import { AppSetting } from '../_conf/app-setting';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;


  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/auth/login', req)
      .pipe(map(user => {
        let dt = user.data;
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(dt));
        this.currentUserSubject.next(dt);
        return user;
      }));
  }

  changePass(req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/auth/change-password', req)
      .pipe(map(data => {
        return data;
      }));
  }

  reset(req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/auth/forgot-password', req)
      .pipe(map(data => {
        return data;
      }));
  }

  signup(req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/auth/signup', req)
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        // localStorage.setItem('currentUser', JSON.stringify(user));
        // this.currentUserSubject.next(user);
        // return user;
        return true;
      }),
      catchError(err => {
          return throwError(err);
      }));
  }

  update(req) {
    return this.http.post<any>(AppSetting.API_ENDPOINT + '/api/auth/update-details', req)
      .pipe(map(user => {
        return true;
      }),
      catchError(err => {
          return throwError(err);
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(new User());
  }
}
