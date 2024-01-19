import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../shared/_service/authentication.service';
import { AlertService } from '../shared/_service/alert.service';
import { Role } from '../shared/_model/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loading = false;
  emailregex: RegExp =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  submitted = false;
  returnUrl: string;
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(this.emailregex),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    remember: new FormControl(false),
  });

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {
    if (
      this.authenticationService.currentUserValue &&
      this.authenticationService.currentUserValue.name
    ) {
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

  ngOnInit() {
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || 'pos/open-counter';
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    let req = {
      email: this.loginForm.get('email')!.value,
      password: this.loginForm.get('password')!.value,
      remember_me: true,
    };
    this.authenticationService
      .login(req)
      .pipe(first())
      .subscribe(
        (data) => {
          this.loading = false;
          if (data.statusCode == 0) {
            let uDet = data.data;
            console.log(data);
            if (uDet.type == Role.storeStaff && uDet.is_store == 1) {
              this.router.navigate(['pos']);
            }
            if (uDet.type == Role.storeStaff && uDet.is_store == 0) {
              this.router.navigate(['warehouse']);
            }
            if (uDet.type == Role.admin) {
              this.router.navigate(['ggb-admin']);
            }
          }
          else {
            this.alertService.openSnackBar(data.err);
          }
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}
