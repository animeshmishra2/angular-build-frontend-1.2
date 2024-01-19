import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../_service/authentication.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService, private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.access_token) {
            request = request.clone({
                setHeaders: { 
                    Accept: 'application/json',
                    Authorization: `Bearer ${currentUser.access_token}`
                }
            });
        }

        return next.handle(request)
        .pipe(
            catchError((error: HttpErrorResponse) => {
               let errorMsg = '';
               if (error.error instanceof ErrorEvent) {
                  console.log('Client Error');
                  errorMsg = `Error: ${error.error.message}`;
               } else {
                  console.log('Server Error');
                  errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
                  if(error.status === 401){
                    console.log("Redirecting to Login");
                    this.authenticationService.logout();
                    this.router.navigate(['']);
                  }
               }
               console.log(errorMsg);
               return throwError(errorMsg);
            })
      )
    }
}
