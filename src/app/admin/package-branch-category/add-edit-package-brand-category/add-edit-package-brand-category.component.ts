import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { StoreWare } from 'src/app/shared/_model/store-ware';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { AuthenticationService } from 'src/app/shared/_service/authentication.service';
import { StoreWareService } from 'src/app/shared/_service/store-ware.service';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-edit-package-brand-category',
  templateUrl: './add-edit-package-brand-category.component.html',
  styleUrls: ['./add-edit-package-brand-category.component.scss']
})
export class AddEditPackageBrandCategoryComponent implements OnInit {
  state$: Observable<object>;
  sw: any;
  row: any;
  loading: boolean = false;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['isSelected', 'name', 'barcode', 'discount', 'mrp'];
  selectedFile: any;
  fileSizeError = false;
  storeList: any[] = [];
  typelist: any[] = [];
  bannerTypes: any;
  selection?: any;
  trigSearch: string;
  trigProducts: any = [];
  todayDate: Date = new Date();
  tagProducts: any = [];
  allTaggedProdsId: any = [];
  allTriggerProds: any = [];
  allTriggerProdsId: any = [];
  allTaggedProds: any = [];
  tagSearch: string;
  applicable_on:any;
  for_applicable: any;
  applicable_on_id: any;
  applicable_for: any;
  valid_from;
  valid_till;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  lForm = new FormGroup({
    applicable_on: new FormControl('', [Validators.required]),
    applicable_for: new FormControl('', [Validators.required]),
    applicable_on_id: new FormControl('', [Validators.required]),
    valid_from: new FormControl('', [Validators.required]),
    valid_till: new FormControl('', [Validators.required]),
    for_applicable: new FormControl('', [Validators.required]),
  });
  storeId: any;

  constructor(public dialogRef: MatDialogRef<AddEditPackageBrandCategoryComponent>,
    private alertService: AlertService,
    private storeWareServ: StoreWareService,
    private apiServ: ApiHttpService,
    private router: Router, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.row = data.data;
  }

  ngOnInit(): void {
    this.getBannerType();
    this.getStoreList();
    this.selection = new SelectionModel<any>(true, []);
  }

  onForApplicableChange(event) {
    if (event) {
          this.applicableTypeChanges(event?.id);
        } else {
          this.typelist = [];
        }
  }

  onDateChange() {
    this.lForm.controls["valid_till"].setValue('');
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

  applicableTypeChanges(id: any) { 
    this.apiServ.newget(AppSetting.ENDPOINTS.getType + "/" + id)
      .subscribe(
        data => this.typelist = data
      );

  }
  doSearch(barcode, isTriggerer = false) {
    if (isTriggerer) {
      this.trigSearch = barcode;
    }
    else {
      this.tagSearch = barcode;
    }
    if (barcode.length > 3) {
      this.getProducts(barcode, isTriggerer);
    }
  }

  getProducts(barcode, isTriggerer) {//
    this.loading = true;
    this.apiServ.get(AppSetting.ENDPOINTS.getProdByBarcode + '/' + barcode + '/' + 1)
      .subscribe(
        data => {
          if (isTriggerer) {
            this.trigProducts = data;
            console.log(this.trigProducts);
            
          }
          else {
            this.tagProducts = data;

          }
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  addProduct(pro, isTriggerer = false) {
    if (isTriggerer) {
      var index = this.allTriggerProdsId.indexOf(pro['idproduct_master']);
      if (index < 0) {
        this.allTriggerProdsId.push(pro['idproduct_master'])
        this.allTriggerProds.push({ "idproduct_master": pro['idproduct_master'], "quantity": 1, "name": pro['prod_name'] });
      }
    }
    else {
      var index = this.allTaggedProdsId.indexOf(pro['idproduct_master']);
      if (index < 0) {
        this.allTaggedProdsId.push(pro['idproduct_master'])
        this.allTaggedProds.push({ "idproduct_master": pro['idproduct_master'], "quantity": 1, "name": pro['name'] });
      }
    }

  }

  removeProduct(pro, isTriggerer = false) {
    if (isTriggerer) {
      var index = this.allTriggerProdsId.indexOf(pro['idproduct_master']);
      this.allTriggerProdsId.splice(index, 1);
      this.allTriggerProds = this.allTriggerProds.filter(obj => obj.idproduct_master !== pro.idproduct_master);
    }
    else {
      var index = this.allTaggedProdsId.indexOf(pro['idproduct_master']);
      this.allTaggedProdsId.splice(index, 1);
      this.allTaggedProds = this.allTaggedProds.filter(obj => obj.idproduct_master !== pro.idproduct_master);
    }
  }

  getBannerType() {
    this.loading = true;
    this.apiServ.newget(AppSetting.ENDPOINTS.getBannertype).subscribe(data => {
      this.bannerTypes = data;
      this.loading = false;
    }, error => {
      this.alertService.openSnackBar(error);
      this.loading = false;
    });
  }


  onSubmit() {
    this.loading = true;
    const outputArray = this.allTriggerProds.map(item => ({ idproduct_master: item.idproduct_master }));
    if (!this.applicable_for || !this.applicable_for || !this.applicable_on_id?.id|| !this.valid_from || !this.valid_till) {
      this.alertService.openSnackBar("Validation Failed Please fill all fields!");
      return;
    }

    let payload = {
      'idstore_warehouse':  this.row,
        'applicable_on':this.applicable_on,
        'applicable_for': this.applicable_for,
        'applicable_on_id': this.applicable_on_id?.id,
        'valid_from': (this.valid_from) ? moment(this.valid_from).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD hh:mm:ss'),
        'valid_till': (this.valid_till) ? moment(this.valid_till).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
        'excludeProds': outputArray
    }
    this.storeWareServ.createpackage(payload).subscribe((data: any) => {
      this.cancel(false);
      this.alertService.openSnackBar("Sucessfully Created Shiping Charge");
    },
      (error) => {
        this.alertService.error(error);
        this.loading = false;
      });

    // if (this.row.idcoupon) {
    //   this.storeWareServ.updatepackage(this.row?.idcoupon, payload).subscribe((data: any) => {
    //     this.cancel(false);
    //     this.alertService.openSnackBar("Sucessfully Updated Shiping Charge");
    //   },
    //     (error) => {
    //       this.alertService.error(error);
    //       this.loading = false;
    //     });
    // } else {
    //   this.storeWareServ.createpackage(payload).subscribe((data: any) => {
    //     this.cancel(false);
    //     this.alertService.openSnackBar("Sucessfully Created Shiping Charge");
    //   },
    //     error => {
    //       this.alertService.error(error);
    //       this.loading = false;
    //     });
    // }
  }

  cancel(manual = true): void {
    this.dialogRef.close({ 'manual': manual });
  }

}
