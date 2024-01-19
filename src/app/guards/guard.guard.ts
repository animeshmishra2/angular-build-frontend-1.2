import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from '../shared/_model/user';
import { AuthenticationService } from '../shared/_service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class GuardGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser && currentUser.access_token) {
      if (route.data.roles && route.data.roles.indexOf(currentUser.type) === -1) {
        // role not authorised so redirect to home page
        console.log("Unauthorized", currentUser.type);
        this.router.navigate(['login']);
        return false;
      }
      if(currentUser.type != Role.admin && route.data.is_pos != currentUser.is_store){
        console.log("No Access", currentUser.type);
        this.router.navigate(['404']);
        return false;
      }
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
