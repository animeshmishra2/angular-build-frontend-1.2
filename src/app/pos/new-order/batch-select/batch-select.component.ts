import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-batch-select',
  templateUrl: './batch-select.component.html',
  styleUrls: ['./batch-select.component.scss']
})
export class BatchSelectComponent implements OnInit {

  prod: any = [];
  moment = moment;
  constructor(
    public dialogRef: MatDialogRef<BatchSelectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.prod = data.data;
      console.log(this.prod);
    }

  ngOnInit(): void {
  }

  select(itm): void {
    console.log('itm: ', itm);
    this.dialogRef.close({ 'selected_batch': itm });
  }
}
