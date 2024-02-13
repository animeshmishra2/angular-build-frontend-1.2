import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-home',
  templateUrl: './product-home.component.html',
  styleUrls: ['./product-home.component.scss']
})
export class ProductHomeComponent implements OnInit {
  bl1: string;
  bl2: string;
  constructor() { }

  ngOnInit(): void {
  }

}
