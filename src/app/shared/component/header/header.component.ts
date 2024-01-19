import { Component, OnInit, Input } from '@angular/core';
import { timer } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../_service/authentication.service';
import { Role } from '../../_model/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  loggedIn: boolean = false;
  name: string;
  type: string;

  @Input('hidemenu') hidemenu: any;
  timeLeft: number = 300;
  interval;
  subscribeTimer: any;
  minutes;
  seconds;
  logType = '';
  swName = '';

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.hidemenu == true) {
      this.oberserableTimer();
    }
    if (this.authenticationService.currentUserValue.name) {
      this.name = this.authenticationService.currentUserValue.name;
      this.type = this.authenticationService.currentUserValue.type;
      this.loggedIn = true;
      this.swName = this.authenticationService.currentUserValue.sw_name;
    }
    if (this.authenticationService.currentUserValue.type == Role.storeStaff &&
      this.authenticationService.currentUserValue.is_store == 1) {
      this.logType = "POS Pannel"
    }
    if (this.authenticationService.currentUserValue.type == Role.storeStaff &&
      this.authenticationService.currentUserValue.is_store == 0) {
        this.logType = "Warehouse Pannel"
    }
    if (this.authenticationService.currentUserValue.type == Role.admin) {
      this.logType = "Admin Pannel"
    }
  }

  logout() {
    this.authenticationService.logout();
    this.loggedIn = false;
    this.router.navigate(['']);
  }

  oberserableTimer() {
    const source = timer(1000, 1000);
    const abc = source.subscribe(val => {
      this.subscribeTimer = this.timeLeft - val;
      this.minutes = Math.floor(this.subscribeTimer / 60);
      this.seconds = this.subscribeTimer - this.minutes * 60;
    });
  }
  goToDash()
  {
    if (this.authenticationService.currentUserValue.type == Role.storeStaff &&
      this.authenticationService.currentUserValue.is_store == 1) {
      this.router.navigate(['pos']);
    }
    if (this.authenticationService.currentUserValue.type == Role.storeStaff &&
      this.authenticationService.currentUserValue.is_store == 0) {
      this.router.navigate(['warehouse']);
    }
    if (this.authenticationService.currentUserValue.type == Role.admin) {
      this.router.navigate(['ggb-admin']);
    }
  }
}
