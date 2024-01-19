import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '../shared/_model/user';
import { AuthenticationService } from '../shared/_service/authentication.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }

  takeToHome() {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser.type == Role.storeStaff) {
      this.router.navigate(['pos']);
    }
    if (currentUser.type == Role.admin) {
      this.router.navigate(['ggb-admin']);
    }
    else {
      console.log("Unauthorized");
    }
  }

}
