import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { AuthenticationService } from 'src/app/shared/_service/authentication.service';
import { CounterService } from 'src/app/shared/_service/counter.service';
import { UserService } from 'src/app/shared/_service/user.service';

@Component({
  selector: 'app-cash-drawer-transaction',
  templateUrl: './cash-drawer-transaction.component.html',
  styleUrls: ['./cash-drawer-transaction.component.scss']
})
export class CashDrawerTransactionComponent implements OnInit {

  loading = false;
  submitted = false;
  isFromOpenCounter = true;
  alreadyOpenCounter;
  mainForm = new FormGroup({
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

    recn1: new FormControl(),
    recn2: new FormControl(),
    recn5: new FormControl(),
    recn10: new FormControl(),
    recn20: new FormControl(),
    recn50: new FormControl(),
    recn100: new FormControl(),
    recn200: new FormControl(),
    recn500: new FormControl(),
    recn2000: new FormControl(),

  });
  counters: any = [];
  alreadyOpenCounters: any = [];
  currentUser: any;

  totalCashIn = 0;
  totalCashOut = 0;
  counterDet: any;
  totalCashActRet: any;

  constructor(
    private userServ: UserService,
    private counterServ: CounterService,
    private alertService: AlertService,
    private apiService: ApiHttpService,
    private authenticationService: AuthenticationService,
    private router: Router,
    public dialogRef: MatDialogRef<CashDrawerTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.currentUser = this.authenticationService.currentUserValue;
    console.log(this.currentUser);
    console.log(data);

    //get counter details
  }


  ngOnInit(): void {
    this.getCouDet();
  }

  getCouDet() {
    this.apiService.get(AppSetting.ENDPOINTS.getCounterDetail)
      .subscribe(
        data => {
          console.log(data);
          this.counterDet = data;
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  onSubmit() {
    // stop here if form is invalid
    console.log("Now submit");
    
    if (this.mainForm.invalid) {
      return;
    }
    let req = {
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

      recn1: this.mainForm.get('recn1')!.value,
      recn2: this.mainForm.get('recn2')!.value,
      recn5: this.mainForm.get('recn5')!.value,
      recn10: this.mainForm.get('recn10')!.value,
      recn20: this.mainForm.get('recn20')!.value,
      recn50: this.mainForm.get('recn50')!.value,
      recn100: this.mainForm.get('recn100')!.value,
      recn200: this.mainForm.get('recn200')!.value,
      recn500: this.mainForm.get('recn500')!.value,
      recn2000: this.mainForm.get('recn2000')!.value,
    }

    req['total'] = req.n1 +
      req.n2 * 2 +
      req.n5 * 5 +
      req.n10 * 10 +
      req.n20 * 20 +
      req.n50 * 50 +
      req.n100 * 100 +
      req.n200 * 200 +
      req.n500 * 500 +
      req.n2000 * 2000;

    req['totalRecN'] = req.recn1 +
      req.recn2 * 2 +
      req.recn5 * 5 +
      req.recn10 * 10 +
      req.recn20 * 20 +
      req.recn50 * 50 +
      req.recn100 * 100 +
      req.recn200 * 200 +
      req.recn500 * 500 +
      req.recn2000 * 2000;
    this.dialogRef.close({ 'ret': req });
  }

  calculateCash() {
    console.log("calculating");

    this.totalCashIn = this.mainForm.get('n1')!.value +
      this.mainForm.get('n2')!.value * 2 +
      this.mainForm.get('n5')!.value * 5 +
      this.mainForm.get('n10')!.value * 10 +
      this.mainForm.get('n20')!.value * 20 +
      this.mainForm.get('n50')!.value * 50 +
      this.mainForm.get('n100')!.value * 100 +
      this.mainForm.get('n200')!.value * 200 +
      this.mainForm.get('n500')!.value * 500 +
      this.mainForm.get('n2000')!.value * 2000;

    this.totalCashOut = this.totalCashIn - this.data.total.grand;
    this.totalCashActRet = this.totalCashIn - this.data.total.grand;
    console.log(this.totalCashOut);

    if (this.totalCashOut == 0) {

    }
    else if (this.totalCashOut < 0) {

    }
    else if (this.totalCashOut > 0) {
      let remainsAmount = this.totalCashIn - this.data.total.grand;
      let retAr = { 2000: 0, 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 2: 0, 1: 0 };
      let calcCountDet = JSON.parse(JSON.stringify(this.counterDet));
      let denom = -1;
      let noMoney = false;
      while (remainsAmount > 0) {
        denom = this.returnAmount(remainsAmount, calcCountDet);
        if (denom > 0) {
          retAr[denom]++;
          remainsAmount -= denom;
        }
        else {
          console.log("No money");
          noMoney = true;
          break;
        }
      }
      if (noMoney) {
        this.alertService.openSnackBar("Dominations not available");
        this.resetDomOut();
      }
      else {
        this.mainForm.patchValue({
          recn1: retAr[1],
          recn2: retAr[2],
          recn5: retAr[5],
          recn10: retAr[10],
          recn20: retAr[20],
          recn50: retAr[50],
          recn100: retAr[100],
          recn200: retAr[200],
          recn500: retAr[500],
          recn2000: retAr[2000],
        })
      }
      console.log(retAr);
    }
  }

  returnAmount(remainsAmount: number, calcCountDet) {
    let ar = [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1];
    let ky;
    for (var den of ar) {
      if (Math.floor(remainsAmount / den)) {
        ky = "cd_" + den;
        if (calcCountDet[ky] > 0) {
          calcCountDet[ky]--;
          return den;
        }
      }
    }
    return -1;
  }

  resetDomOut() {
    this.mainForm.patchValue({
      recn1: 0,
      recn2: 0,
      recn5: 0,
      recn10: 0,
      recn20: 0,
      recn50: 0,
      recn100: 0,
      recn200: 0,
      recn500: 0,
      recn2000: 0,
    });
    this.totalCashActRet = 0;
  }

  cancel() {
    console.log("plain cancel");
    this.dialogRef.close({ 'ret': false });
  }

  calculateRetCash() {
    this.totalCashActRet = this.mainForm.get('recn1')!.value +
      this.mainForm.get('recn2')!.value * 2 +
      this.mainForm.get('recn5')!.value * 5 +
      this.mainForm.get('recn10')!.value * 10 +
      this.mainForm.get('recn20')!.value * 20 +
      this.mainForm.get('recn50')!.value * 50 +
      this.mainForm.get('recn100')!.value * 100 +
      this.mainForm.get('recn200')!.value * 200 +
      this.mainForm.get('recn500')!.value * 500 +
      this.mainForm.get('recn2000')!.value * 2000;
    console.log(this.totalCashActRet)
  }

}
