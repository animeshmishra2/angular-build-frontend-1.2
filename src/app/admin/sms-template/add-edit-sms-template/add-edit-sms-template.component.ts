import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { StoreWare } from 'src/app/shared/_model/store-ware';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { AuthenticationService } from 'src/app/shared/_service/authentication.service';
import { StoreWareService } from 'src/app/shared/_service/store-ware.service';
@Component({
  selector: 'app-add-edit-sms-template',
  templateUrl: './add-edit-sms-template.component.html',
  styleUrls: ['./add-edit-sms-template.component.scss']
})
export class AddEditSmsTemplateComponent implements OnInit {

  row: any;
  loading: boolean = false;
  trigername:any;
  body: any;
  subject: any;
  constructor(public dialogRef: MatDialogRef<AddEditSmsTemplateComponent>,
    private alertService: AlertService,
    private storeWareServ: StoreWareService,
    private apiServ: ApiHttpService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.row = data.data;
    if (this.row?.id) {
     
    }
  }

  ngOnInit(): void {
  }

  triggerName(event){
    this.trigername =event
  }

  triggerBody(event){
    this.body = event;
  }

  triggersubject(event){
    this.subject = event;
  }

  onSubmit() {
    if (this.row.id) {
      let payload = {
        "name": this.trigername,
        "body": this.body,
        "subject": this.subject,
        "created_by": 1

      }
      this.storeWareServ.updateSMS(this.row?.id,payload).subscribe((data: any) => {
        this.cancel(false);
        this.alertService.openSnackBar("Sucessfully Updated email");
      },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        });
    } else {
      let payload = {
        "name": this.trigername,
        "body": this.body,
        "subject": this.subject,
        "created_by": 1

      }
      this.storeWareServ.createSMS(payload).subscribe((data: any) => {
        this.cancel(false);
        this.alertService.openSnackBar("Sucessfully Created Email");
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
