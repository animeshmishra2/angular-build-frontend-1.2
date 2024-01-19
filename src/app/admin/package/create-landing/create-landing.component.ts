import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';

@Component({
  selector: 'app-create-landing',
  templateUrl: './create-landing.component.html',
  styleUrls: ['./create-landing.component.scss']
})
export class CreateLandingComponent implements OnInit {

  pkgType = AppSetting.PKGMASTER;
  
  constructor(public dialogRef: MatDialogRef<CreateLandingComponent>,
    private alertService: AlertService,
    ) {
    
  }

  ngOnInit(): void {

  }

  select(itm = 0): void {
    this.dialogRef.close({ 'package': itm });
  }
}
