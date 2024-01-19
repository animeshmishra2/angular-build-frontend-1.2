import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { User } from 'src/app/shared/_model/user';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { StoreWareService } from 'src/app/shared/_service/store-ware.service';
import { UserService } from 'src/app/shared/_service/user.service';

@Component({
  selector: 'app-staff-access',
  templateUrl: './staff-access.component.html',
  styleUrls: ['./staff-access.component.scss']
})
export class StaffAccessComponent implements OnInit {

  row: any;
  loading: boolean = false;

  users: any = []
  filteredVendors: Observable<any[]>;

  lForm = new FormGroup({
    user: new FormControl('')
  });

  constructor(public dialogRef: MatDialogRef<StaffAccessComponent>,
    private apiService: ApiHttpService,
    private alertService: AlertService,
    private userServ: UserService,
    private storeWareServ: StoreWareService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.row = data.data;
    this.getAllStaff();
  }

  ngOnInit(): void {

  }

  onSubmit() {
    if (this.lForm.invalid) {
      return;
    }
    this.loading = true;
    let req = {
      "idstore_warehouse": this.row.idstore_warehouse,
      "idstaff": (this.lForm.get('user')!.value).id,
    }
    this.apiService.post(AppSetting.ENDPOINTS.addStaffAccess, req)
      .subscribe(
        data => {
          if (data.statusCode == 0) { this.cancel(false); }
          else {
            this.alertService.openSnackBar(data.err);
          }
          this.loading = false;
        },
        error => {
          this.alertService.openSnackBar(error);
          this.loading = false;
        });
  }

  cancel(manual = true): void {
    this.dialogRef.close({ 'manual': manual });
  }

  getAllStaff() {
    this.loading = true;
    this.apiService.get(AppSetting.ENDPOINTS.staff)
      .subscribe(
        data => {
          this.loading = false;
          this.users = data;
          console.log(this.users);

          this.filteredVendors = this.lForm.controls["user"].valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
          );
        },
        error => {
          this.alertService.openSnackBar(error);
          this.loading = false;
        });
  }
  private _filter(value): string[] {
    if (!(typeof value === 'string' || value instanceof String)) {
      return [];
    }
    const filterValue = value.toLowerCase();
    return this.users.filter(user => {
      return (user.contact.toLowerCase() + ' - ' + user.name.toLowerCase()).includes(filterValue)
    });
  }

  displayFn(user) {
    console.log(user);
    return user ? (user.name + ' - ' + user.contact) : '';
  }
}
