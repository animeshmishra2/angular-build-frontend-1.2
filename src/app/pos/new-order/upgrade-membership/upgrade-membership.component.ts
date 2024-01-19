import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { UserService } from 'src/app/shared/_service/user.service';

@Component({
  selector: 'app-upgrade-membership',
  templateUrl: './upgrade-membership.component.html',
  styleUrls: ['./upgrade-membership.component.scss']
})
export class UpgradeMembershipComponent implements OnInit {
  submitted = false;
  userDet: any = {};
  loaded: boolean = false;
  membership = MEMBER_SHIP_TYPE;
  customForm = new FormGroup({
    membership: new FormControl('', []),
  });
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<UpgradeMembershipComponent>,
  private userSer: UserService,
  private alertService: AlertService) { }

  ngOnInit(): void {
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
          // this.onDismiss(this.userDet);
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
      "contact": this.data?.contact,
      "idmembership_plan": this.customForm.get('membership')!.value ? this.customForm.get('membership')!.value : 1,
    }
    this.userSer.updateCustomer(req)
      .subscribe(
        data => {
          console.log("gggg",data);
          
          this.submitted = false;
          this.onDismiss(data = true);
          this.alertService.openSnackBar("Membership Upgraded");
        },
        error => {
          this.alertService.error(error);
          this.submitted = false;
        });
  }

}
export let MEMBER_SHIP_TYPE = [
  { id: 1, descriptiom: "Instant Discount" },
  { id: 2, descriptiom: "Wish Basket - Product" },
  { id: 3, descriptiom: "Wish Basket - Land" },
  { id: 4, descriptiom: "Wish Basket - CoPartner" }
]