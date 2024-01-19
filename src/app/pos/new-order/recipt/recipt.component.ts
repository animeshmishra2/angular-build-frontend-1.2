import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/_service/authentication.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';

@Component({
  selector: 'app-recipt',
  templateUrl: './recipt.component.html',
  styleUrls: ['./recipt.component.scss'],
})
export class ReciptComponent implements OnInit, AfterViewInit {
  detail: any;
  user: any;
  date: string = '';
  time: string = '';
  moment = moment;
  totItems = 0;
  totQty = 0;
  totalPrice = 0;
  totalDiscount = 0;
  roundOff = 0;
  totalPriceMRP = 0;
  amt: string;
  orderId;
  dataSource: any = [];
  gst = [];
  sno = 1
  constructor(
    public router: Router,
    private location: Location,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private alertServ: AlertService,
    private apiService: ApiHttpService,) {
  }
  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
    this.apiService.get(AppSetting.ENDPOINTS.getOrderDetailsById + '/' + this.orderId)
      .subscribe(
        data => {
          this.detail = data;
          this.genGst();
          setTimeout(()=>{ this.printRecipt() }, 500)
        },
        error => {
          this.alertServ.openSnackBar(error);
        });
    this.user = this.authenticationService.currentUserValue;
    window.onafterprint = function () {
      window.self.close(); 
    };
  }

  ngAfterViewInit(): void {
  }

  printRecipt() {
    window.print();
  }
  getContact(phone) {
    if (!!phone) {
      let ph = [...phone]
      ph.splice(3, 4, 'X', 'X', 'X', 'X')
    }
  }
  getSP(item) {
    if (+item.part_of_pkg) {
      return +item.pkg_amount;
    }
    else {
      return item["unit_selling_price"];
    }
  }
  genGst() {
    this.gst["p-0"] = { "cgst": 0, "sgst": 0, "totalTax": 0, "taxable": 0 }
    this.gst["p-5"] = { "cgst": 0, "sgst": 0, "totalTax": 0, "taxable": 0 }
    this.gst["p-12"] = { "cgst": 0, "sgst": 0, "totalTax": 0, "taxable": 0 }
    this.gst["p-18"] = { "cgst": 0, "sgst": 0, "totalTax": 0, "taxable": 0 }
    this.gst["tot"] = { "cgst": 0, "sgst": 0, "totalTax": 0, "taxable": 0 }

    this.detail.order_detail.forEach(item => {
      if(item.status == 0){
        return;
      }
      switch ((+item.cgst + +item.sgst)) {
        case 0:
          this.gst["p-0"]["cgst"] += +item.total_cgst;
          this.gst["p-0"]["sgst"] += +item.total_sgst;
          this.gst["p-0"]["totalTax"] += (+item.total_cgst + +item.total_sgst);
          this.gst["p-0"]["taxable"] += +item.total_price - (+item.total_cgst + +item.total_sgst);
          break;

        case 5:
          this.gst["p-5"]["cgst"] += +item.total_cgst;
          this.gst["p-5"]["sgst"] += +item.total_sgst;
          this.gst["p-5"]["totalTax"] += (+item.total_cgst + +item.total_sgst);
          this.gst["p-5"]["taxable"] += +item.total_price - (+item.total_cgst + +item.total_sgst);
          break;

        case 12:
          this.gst["p-12"]["cgst"] += +item.total_cgst;
          this.gst["p-12"]["sgst"] += +item.total_sgst;
          this.gst["p-12"]["totalTax"] += (+item.total_cgst + +item.total_sgst);
          this.gst["p-12"]["taxable"] += +item.total_price - (+item.total_cgst + +item.total_sgst);
          break;

        case 18:
          this.gst["p-18"]["cgst"] += +item.total_cgst;
          this.gst["p-18"]["sgst"] += +item.total_sgst;
          this.gst["p-18"]["totalTax"] += (+item.total_cgst + +item.total_sgst);
          this.gst["p-18"]["taxable"] += +item.total_price - (+item.total_cgst + +item.total_sgst);
          break;

        default:
          break;
      }
      this.gst["tot"]["cgst"] += +item.total_cgst;
      this.gst["tot"]["sgst"] += +item.total_sgst;
      this.gst["tot"]["totalTax"] += (+item.total_cgst + +item.total_sgst);
      this.gst["tot"]["taxable"] += +item.total_price - (+item.total_cgst + +item.total_sgst);
      this.totItems += 1;
      this.totQty += +item.quantity;
      this.totalPriceMRP += +item.unit_mrp * +item.quantity;
      this.totalPrice += +item.total_price;
      this.totalDiscount += !!item.discount ? +item.discount : 0;
    });

    let rf = 0;
    // debugger
    rf = Math.round(this.totalPrice);
    this.roundOff = this.totalPrice - rf;
    this.totalPrice = rf;
    this.amt = this.NumInWords(+this.totalPrice)

  }



  NumInWords(number) {
    const first = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const mad = ['', 'thousand', 'million', 'billion', 'trillion'];
    let word = '';

    for (let i = 0; i < mad.length; i++) {
      let tempNumber = number % (100 * Math.pow(1000, i));
      if (Math.floor(tempNumber / Math.pow(1000, i)) !== 0) {
        if (Math.floor(tempNumber / Math.pow(1000, i)) < 20) {
          word = first[Math.floor(tempNumber / Math.pow(1000, i))] + mad[i] + ' ' + word;
        } else {
          word = tens[Math.floor(tempNumber / (10 * Math.pow(1000, i)))] + ' ' + first[Math.floor(tempNumber / Math.pow(1000, i)) % 10] + mad[i] + ' ' + word;
        }
      }

      tempNumber = number % (Math.pow(1000, i + 1));
      if (Math.floor(tempNumber / (100 * Math.pow(1000, i))) !== 0) word = first[Math.floor(tempNumber / (100 * Math.pow(1000, i)))] + 'hunderd ' + word;
    }
    return word;
  }
  getName(detail) {
    if (detail.idcustomer == 0) {
      return 'CASH'
    } else {
      let nm = detail.name;
      if (nm.length > 10) {
        nm = nm.substring(0, 10) + '..';
      }
      return nm;
    }
  }
}
