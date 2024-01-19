import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-select-package',
  templateUrl: './select-package.component.html',
  styleUrls: ['./select-package.component.scss']
})
export class SelectPackageComponent implements OnInit {

  pkg: any = [];
  moment = moment;
  constructor(
    public dialogRef: MatDialogRef<SelectPackageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      console.log(data);
      this.pkg = data.data;
    }

  ngOnInit(): void {
  }

  select(itm = 0): void {
    this.dialogRef.close({ 'package': itm });
  }
}
