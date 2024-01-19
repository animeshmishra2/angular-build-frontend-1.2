import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { AuthenticationService } from 'src/app/shared/_service/authentication.service';
import { CounterService } from 'src/app/shared/_service/counter.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  name: string;
  type: string;
  closeCou: string;
  couOrd: string;
  holdOrd: string;
  newOrd: string;
  loading = false;
  isCounterOpen = false;

  bl1: string;
  bl2: string;
  bl3: string;
  bl4: string;
  bl5: string;
  bl6: string;
  bl7: string;

  constructor(
    private authenticationService: AuthenticationService,
    public router: Router,
    private counterServ: CounterService,
    private alertService: AlertService
  ) {

    if (
      this.authenticationService.currentUserValue &&
      this.authenticationService.currentUserValue.name
    ) {
      this.name = this.authenticationService.currentUserValue.name;
      this.type = this.authenticationService.currentUserValue.type;

      if (this.authenticationService.currentUserValue.counter_detail && this.authenticationService.currentUserValue.counter_detail.length > 0) {
        this.isCounterOpen = true;
      }
    } else {
      this.router.navigate(['login']);
    }
  }

  ngOnInit(): void { }

  closeCounter() {
    this.router.navigate(['/pos/close-counter']);
  }
}
