import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { UserService } from 'src/app/shared/_service/user.service';

@Component({
  selector: 'app-customer-login-register',
  templateUrl: './customer-login-register.component.html',
  styleUrls: ['./customer-login-register.component.scss']
})
export class CustomerLoginRegisterComponent implements OnInit, AfterViewInit {

  userDet: any = {};
  emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  submitted = false;
  isPresent: boolean = false;
  loaded: boolean = false;

  membership = MEMBER_SHIP_TYPE;
  customForm = new FormGroup({
    email: new FormControl('', [
      Validators.pattern(this.emailregex)
    ]),
    contact: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
    ]),
    name: new FormControl('', [
      Validators.required
    ]),
    membership: new FormControl('', []),
    address: new FormControl('', []),
    pin: new FormControl('', []),
    landmark: new FormControl('', []),
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CustomerLoginRegisterComponent>,
    private userSer: UserService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  ngAfterViewInit(): void {
    this.getCustomerDetail();
    this.customForm.patchValue({
      contact: this.data.contact
    });
  }

  getCustomerDetail() {
    this.userSer.getCustomer(this.data.contact).subscribe(
      data => {
        this.userDet = data;
        //   this.customForm.patchValue({
        //     contact: this.data.contact,
        //     email: this.data.email,
        //     name: this.data.contact,
        //     membership: this.data.contact,
        //     address: this.data.contact,
        //     pin: this.data.contact,
        //     landmark: this.data.contact
        //  });
        
        if (data && data.idcustomer) {
          this.onDismiss(this.userDet);
        }
        else{
          this.loaded = true
        }
      },
      error => {
        this.loaded = true
        this.alertService.error(error);
      });
  }

  onDismiss(det): void {
    this.dialogRef.close(det);
  }

  onSubmit() {
    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.customForm.invalid) {
      return;
    }
    this.submitted = true;
    let req = {
      "name": this.customForm.get('name')!.value,
      "email": this.customForm.get('email')!.value,
      "contact": this.customForm.get('contact')!.value,
      "membership": this.customForm.get('membership')!.value ? this.customForm.get('membership')!.value : 1,
      "address": this.customForm.get('address')!.value,
      "pin": this.customForm.get('pin')!.value,
      "landmark": this.customForm.get('landmark')!.value
    }
    this.userSer.saveCustomer(req)
      .subscribe(
        data => {
          this.submitted = false;
          this.onDismiss(data);
          this.alertService.openSnackBar("Customer saved.");
        },
        error => {
          this.alertService.error(error);
          this.submitted = false;
        });
  }

}

export let MEMBER_SHIP_TYPE = [
  { id: 2, descriptiom: "Wish Basket - Product" },
  { id: 3, descriptiom: "Wish Basket - Land" },
  { id: 4, descriptiom: "Wish Basket - CoPartner" }
]

