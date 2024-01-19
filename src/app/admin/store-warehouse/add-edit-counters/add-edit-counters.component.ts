import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Counter } from 'src/app/shared/_model/counter';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { CounterService } from 'src/app/shared/_service/counter.service';
import { StoreWareService } from 'src/app/shared/_service/store-ware.service';
import { EditStoreWareComponent } from '../edit-store-ware/edit-store-ware.component';

@Component({
  selector: 'app-add-edit-counters',
  templateUrl: './add-edit-counters.component.html',
  styleUrls: ['./add-edit-counters.component.scss']
})
export class AddEditCountersComponent implements OnInit {

  row: Counter;
  loading: boolean = false;
  sw: any;
  lForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    status: new FormControl('')
  });

  constructor(public dialogRef: MatDialogRef<EditStoreWareComponent>,
    private alertService: AlertService,
    private counterServ: CounterService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
    
    this.row = data.data;
    this.sw = data.parent;
    if (this.row.idstore_warehouse) {
      this.lForm.controls["name"].setValue(this.row.name);
      this.lForm.controls["status"].setValue(this.row.status);
    }
  }

  ngOnInit(): void { }

  onSubmit() {
    // stop here if form is invalid
    if (this.lForm.invalid) {
      return;
    }

    this.loading = true;
    let req = {
      "name": this.lForm.get('name')!.value,
      "status": this.lForm.get('status')!.value,
      "idstore_warehouse": this.sw.idstore_warehouse
    }
    if (this.row.idcounter > 0) {
      req['idcounter'] = this.row.idcounter;
      this.counterServ.update(req)
        .subscribe(
          data => {
            this.cancel(false);
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
          });
    }
    else {
      this.counterServ.create(req)
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
