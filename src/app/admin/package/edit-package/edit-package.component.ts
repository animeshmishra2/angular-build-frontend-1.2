import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import * as moment from 'moment';
@Component({
  selector: 'app-edit-package',
  templateUrl: './edit-package.component.html',
  styleUrls: ['./edit-package.component.scss']
})
export class EditPackageComponent implements OnInit {

  pkgData;


  loading: boolean = false;

  trigSearch: string;
  tagSearch: string;
  warehouse: any = "";
  finOrders: any = [];
  finOrdersId: any = [];
  addTagAmt: number;
  applicableOn;
  frequency;
  allTriggerProdsId: any = [];
  allTaggedProdsId: any = [];
  allTriggerProds: any = [];
  allTaggedProds: any = [];
  firstQuantity: number;
  firstAmount: number;
  secondAmount: number;
  trigProducts: any = [];
  tagProducts: any = [];
  packageMasterId: number;
  storeId: number;
  qtyPkgProd;
  pkgMasterList: any = AppSetting.PKGMASTER;
  amountPkgAmt;

  filteredProd: any;
  isLoading = false;
  errorMsg!: string;
  minLengthTerm = 3;
  selectedProd: any = "";

  pkgMaster;
  packageName;
  filteredOptions: any;
  status;
  valid_from;
  valid_till;
  isGeneral = `${0}`;

  constructor(
    public dialogRef: MatDialogRef<EditPackageComponent>,
    private alertService: AlertService,
    private apiService: ApiHttpService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.pkgData = data.data;
    console.log(this.pkgData);
    if (this.pkgData.idstore_warehouse) {
      this.packageMasterId = this.pkgData.idpackage_master;
      this.packageName = this.pkgData.name;
      this.applicableOn = this.pkgData.applicable_on;
      this.frequency = `${this.pkgData.frequency}`;
      this.allTriggerProds = this.pkgData.trigger_prod;
      this.allTaggedProds = this.pkgData.tagged_prod;
      this.amountPkgAmt = this.pkgData.base_trigger_amount;
      this.addTagAmt = this.pkgData.additional_tag_amount;
      this.status = `${this.pkgData.status}`;
      if (this.pkgData.idpackage_master == AppSetting.PKGMASTER.Quantity) {
        this.selectedProd = this.pkgData.trigger_prod[0].idproduct_master;
        this.firstQuantity = this.pkgData.trigger_prod[0].quantity;
        this.secondAmount = this.pkgData.additional_tag_amount;
        this.firstAmount = this.pkgData.base_trigger_amount;
      }
      this.valid_from = moment(this.pkgData.valid_from).format('DD-MM-YYYY') ;
      this.valid_till = moment(this.pkgData.valid_till).format('DD-MM-YYYY');
      this.isGeneral = this.pkgData.isGeneral;
    }
  }

  ngOnInit(): void {
  }

  updatePackage() {
    this.loading = true;
    let req = {
      'idpackage' : this.pkgData.idpackage,
      'name': this.packageName,
      'status': +this.status
    }

    this.apiService.put(AppSetting.ENDPOINTS.updatePackage + '/' + this.pkgData.idpackage, req)
      .subscribe(
        data => {
          console.log(data);
          this.alertService.openSnackBar("Package Updated.");
          this.loading = false;
          this.dialogRef.close({ 'updated': true });
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });

  }
  


}
