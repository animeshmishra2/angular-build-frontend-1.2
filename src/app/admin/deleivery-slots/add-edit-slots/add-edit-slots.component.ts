import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { StoreWareService } from 'src/app/shared/_service/store-ware.service';

@Component({
  selector: 'app-add-edit-slots',
  templateUrl: './add-edit-slots.component.html',
  styleUrls: ['./add-edit-slots.component.scss']
})

export class AddEditSlotsComponent implements OnInit {

  row: any;
  loading: boolean = false;
  selectedFile: any;
  fileSizeError = false;
  startDefault:any;
  endDefault: any;
  slotForm = new FormGroup({
    idstore_warehouse: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    slot_time_start: new FormControl('', [Validators.required]),
    slot_time_end: new FormControl('', [Validators.required]),
    max_orders: new FormControl('', [Validators.required]),
    available_slots: new FormControl('', [Validators.required]),
  });
  storeList: any[];
  typelist: any[];
  todayDate: Date = new Date();
  minTime:any;

  constructor(public dialogRef: MatDialogRef<AddEditSlotsComponent>, private alertService: AlertService,
    private storeWareServ: StoreWareService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.row = data.data;
    console.log('this.row: ', this.row);
    if (this.row?.iddelivery_slots) {
      this.slotForm.controls["idstore_warehouse"].setValue(this.row.idstore_warehouse);
      this.slotForm.controls["date"].setValue(this.row.date);
      
      this.slotForm.controls["max_orders"].setValue(this.row?.max_orders);
      this.slotForm.controls["available_slots"].setValue(this.row?.available_slots);
      this.startDefault = this.row.slot_time_start?.split(':')[0] + ':' + this.row.slot_time_start?.split(':')[1];
      this.slotForm.controls["slot_time_start"].setValue(this.startDefault);
      this.endDefault = this.row.slot_time_end?.split(':')[0] + ':' + this.row.slot_time_end?.split(':')[1];
      this.slotForm.controls["slot_time_end"].setValue(this.endDefault);

    }
  }

  ngOnInit(): void {
    this.getStoreList();
  }

  getStoreList() {
    this.loading = true;
    this.storeWareServ.getAllStoresWare().subscribe(data => {
      this.storeList = data;
      this.loading = false;
    }, error => {
      this.alertService.openSnackBar(error);
      this.loading = false;
    });
  }

  onDateChange(event: any) {
    const changedDate = new Date(event?.value);
    if(changedDate?.getDate() == this.todayDate?.getDate() && changedDate?.getMonth() == this.todayDate?.getMonth() && changedDate?.getFullYear() == this.todayDate?.getFullYear()) {
      this.minTime = `${new Date()?.getHours()}:${new Date()?.getMinutes()}`;
    } else {
      this.minTime = null;
    }
    // this.slotForm.controls['slot_time_start'].reset();
    // this.slotForm.controls['slot_time_end'].reset();
  }


  onSubmit() {
    if (this.slotForm.invalid) {
      return;
    }

    this.loading = true;
    const fd = new FormData();
    fd.append('idstore_warehouse', this.slotForm.get('idstore_warehouse')!.value);
    fd.append('date', this.slotForm.get('date')!.value);
    fd.append('slot_time_start', this.slotForm.get('slot_time_start')!.value);
    fd.append('slot_time_end', this.slotForm.get('slot_time_end')!.value);
    fd.append('max_orders', this.slotForm.get('max_orders')!.value);
    fd.append('is_servicable', '-1');
    fd.append('available_slots', this.slotForm.get('available_slots')!.value);

    if (this.row?.iddelivery_slots) {
      fd.append('iddelivery_slots', this.row.iddelivery_slots);
      this.storeWareServ.updateSlots(fd, this.row.iddelivery_slots).subscribe((data: any) => {
        this.cancel(false);
        this.alertService.openSnackBar("Sucessfully Updated Slots");
      }, (error) => {
        this.alertService.error(error);
        this.loading = false;
      });
    } else {
      this.storeWareServ.createSlots(fd).subscribe((data: any) => {
        this.cancel(false);
        this.alertService.openSnackBar("Sucessfully Created Slots");
      }, error => {
        this.alertService.error(error);
        this.loading = false;
      });
    }
  }

  cancel(manual = true): void {
    this.dialogRef.close({ 'manual': manual });
  }
}
