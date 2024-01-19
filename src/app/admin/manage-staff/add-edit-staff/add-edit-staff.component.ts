import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/shared/_model/user';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { UserService } from 'src/app/shared/_service/user.service';


@Component({
  selector: 'app-add-edit-staff',
  templateUrl: './add-edit-staff.component.html',
  styleUrls: ['./add-edit-staff.component.scss']
})
export class AddEditStaffComponent implements OnInit {

  
  row: User;
  loading: boolean = false;

  lForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    address: new FormControl('', [
      Validators.required
    ]),
    email: new FormControl('', [
      Validators.required
    ]),
    contact: new FormControl('', [
      Validators.required
    ]),
    status: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(public dialogRef: MatDialogRef<AddEditStaffComponent>,
    private alertService: AlertService,
    private userServ: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    this.row = data.data;
    console.log(this.row);
    if (this.row.id) {
      this.lForm.controls["name"].setValue(this.row.name);
      this.lForm.controls["email"].setValue(this.row.email);
      this.lForm.controls["contact"].setValue(this.row.contact);
      this.lForm.controls["address"].setValue(this.row.address);
      this.lForm.controls["status"].setValue(this.row.status);
      // this.lForm.controls["id"].setValue(this.row.id);
    }
  }

  ngOnInit(): void {

  }


  onSubmit() {
    // stop here if form is invalid
    if (this.lForm.invalid) {
      return;
    }

    this.loading = true;
    let req = {
      "name": this.lForm.get('name')!.value,
      "contact": this.lForm.get('contact')!.value,
      "address": this.lForm.get('address')!.value,
      "email": this.lForm.get('email')!.value,
      "status": this.lForm.get('status')!.value,
      "password": this.lForm.get('password')!.value,
      "created_by": 1,
      "updated_by": 1
    }
    if(this.row.id > 0)
    {
      req['id'] = this.row.id;
      this.userServ.update(req)
      .subscribe(
        data => {
          this.cancel(false);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
    }
    else{
      this.userServ.store(req)
      .subscribe(
        data => {
          this.cancel(false);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
    }
    
  }

  cancel(manual = true): void {
    this.dialogRef.close({ 'manual': manual });
  }

}
