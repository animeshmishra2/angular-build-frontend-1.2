import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.scss']
})
export class ConfirmOrderComponent implements OnInit {

  message = "";
  title = "";
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { 
    console.log(data);
    this.message = data.message;
    this.title = data.title;
   }

  ngOnInit(): void {
  }

}
