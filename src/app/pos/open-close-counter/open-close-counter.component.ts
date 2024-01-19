import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/shared/_service/authentication.service';
import { UserService } from 'src/app/shared/_service/user.service';
import { AlertService } from '../../shared/_service/alert.service';
import { CounterService } from '../../shared/_service/counter.service';

@Component({
  selector: 'app-open-close-counter',
  templateUrl: './open-close-counter.component.html',
  styleUrls: ['./open-close-counter.component.scss']
})
export class OpenCloseCounterComponent implements OnInit {

  loading = false;
  submitted = false;
  isFromOpenCounter = true;
  alreadyOpenCounter;
  mainForm = new FormGroup({
    counter: new FormControl('', [Validators.required]),
    n1: new FormControl(),
    n2: new FormControl(),
    n5: new FormControl(),
    n10: new FormControl(),
    n20: new FormControl(),
    n50: new FormControl(),
    n100: new FormControl(),
    n200: new FormControl(),
    n500: new FormControl(),
    n2000: new FormControl(),

  });
  counters: any = [];
  alreadyOpenCounters: any = [];
  currentUser: any;
  constructor(
    private userServ: UserService,
    private counterServ: CounterService,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private router: Router) {
      this.currentUser = this.authenticationService.currentUserValue;
      console.log(this.currentUser);
      
      if(this.router.url == '/pos/close-counter'){
        this.isFromOpenCounter = false;
        if(this.currentUser.counter_detail[0])
        {
          this.alreadyOpenCounter = this.currentUser.counter_detail[0].idcounter;
        }
        console.log(this.alreadyOpenCounter);
        this.mainForm.patchValue({
          counter:this.alreadyOpenCounter
        });
      }
    
    if (this.currentUser.counter_detail.length > 0 && this.isFromOpenCounter === true) {
      console.log(this.currentUser);
      this.router.navigate(['/pos/dashboard']);
    }

  }

  ngOnInit(): void {
    this.counterServ.getCounterDetails()
      .pipe(first())
      .subscribe(
        data => {
          this.counters = data;
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  onSubmit() {
    
    this.alertService.confirmDialog("Are you sure to " + ((this.isFromOpenCounter) ? "Open" : "Close") + " this Counter?").subscribe((res) => {
      if (res === true) {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.mainForm.invalid) {
          return;
        }

        this.loading = true;
        let req = {
          "idcounter": this.mainForm.get('counter')!.value,
          "idstore_warehouse": this.counters[0]['idstore_warehouse'],
          "cashDet": {
            n1: this.mainForm.get('n1')!.value,
            n2: this.mainForm.get('n2')!.value,
            n5: this.mainForm.get('n5')!.value,
            n10: this.mainForm.get('n10')!.value,
            n20: this.mainForm.get('n20')!.value,
            n50: this.mainForm.get('n50')!.value,
            n100: this.mainForm.get('n100')!.value,
            n200: this.mainForm.get('n200')!.value,
            n500: this.mainForm.get('n500')!.value,
            n2000: this.mainForm.get('n2000')!.value,
          }
        }

        req['total'] = req.cashDet.n1 +
          req.cashDet.n2 * 2 +
          req.cashDet.n5 * 5 +
          req.cashDet.n10 * 10 +
          req.cashDet.n20 * 20 +
          req.cashDet.n50 * 50 +
          req.cashDet.n100 * 100 +
          req.cashDet.n200 * 200 +
          req.cashDet.n500 * 500 +
          req.cashDet.n2000 * 2000;

        
        if(this.isFromOpenCounter){
          this.counterServ.openCounter(req)
          .subscribe(
            data => {
              this.loading = false;
              if (data.statusCode !== 0) {
                this.alertService.openSnackBar(data.err);
              }
              else {
                this.currentUser.counter_detail = [data.data];
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                this.router.navigate(['/pos/dashboard']);
                // this.currentUserSubject.next(user);

              }
            },
            error => {
              this.alertService.error(error);
              this.loading = false;
            });
        }
        else{
          this.counterServ.closeCounter(req)
          .subscribe(
            data => {
              this.loading = false;
              if (data.statusCode !== 0) {
                this.alertService.openSnackBar(data.err);
              }
              else {
                this.currentUser.counter_detail = [];
                console.log(this.currentUser);
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                // this.currentUserSubject.next(user);
                this.router.navigate(['/pos/dashboard']);
              }
            },
            error => {
              this.alertService.error(error);
              this.loading = false;
            });
        }
        
      }
    });
  }
  closeCounter() {
    console.log(this.authenticationService.currentUserValue.counter_detail);
    let req = {
      idcounter: this.authenticationService.currentUserValue.counter_detail[0].idcounter,
      idstore_warehouse: "",
      cashDet: {
        n1: 0,
        n2: 0,
        n5: 0,
        n10: 0,
        n20: 0,
        n50: 0,
        n100: 0,
        n200: 0,
        n500: 0,
        n2000: 0,
      },
    };
    this.counterServ
      .closeCounter(req)
      .pipe()
      .subscribe(
        (data) => {
          this.alertService.success('Counter closed');
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}
