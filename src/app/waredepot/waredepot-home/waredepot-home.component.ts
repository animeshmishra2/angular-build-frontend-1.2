import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/_service/authentication.service';

@Component({
  selector: 'app-waredepot-home',
  templateUrl: './waredepot-home.component.html',
  styleUrls: ['./waredepot-home.component.scss']
})
export class WaredepotHomeComponent implements OnInit {

 
  name: string;
  type: string;
  bl1: string;
  bl2: string;
  bl3: string;
  bl4: string;
  bl5: string;
  bl6: string;
  bl7: string;
  bl8: string;
  bl9: string;
  bl10: string;
  bl11: string;
  bl12: string;

   constructor(private authenticationService: AuthenticationService, public router: Router) {
    console.log(this.authenticationService.currentUserValue);
    
    if (this.authenticationService.currentUserValue && this.authenticationService.currentUserValue.name) {

      this.name = this.authenticationService.currentUserValue.name;
      this.type = this.authenticationService.currentUserValue.type;
    }
    else {
      this.router.navigate(['login']);
    }
  }


  ngOnInit(): void {
  }


}
