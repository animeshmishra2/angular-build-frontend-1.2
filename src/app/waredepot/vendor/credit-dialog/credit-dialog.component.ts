import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-credit-dialog',
  templateUrl: './credit-dialog.component.html',
  styleUrls: ['./credit-dialog.component.scss']
})
export class CreditDialogComponent implements OnInit {
  inputData: string = '';
  constructor(private dialogRef: MatDialogRef<CreditDialogComponent>) {}

  ngOnInit(): void {
  }

  onSave(): void {
    // You can pass data back to the parent component here
    this.dialogRef.close(this.inputData);
  }

  onCancel(): void {
    this.dialogRef.close(); // Close the dialog without sending any data
  }

}
