import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { ProductService } from 'src/app/shared/_service/product.service';
import * as moment from 'moment';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

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
  firstAmount: any;
  secondAmount: any;
  trigProducts: any = [];
  tagProducts: any = [];
  packageMasterId: number;
  storeId: number;
  qtyPkgProd;
  pkgMasterList: any = AppSetting.PKGMASTER;
  amountPkgAmt;

  searchProdCtrl = new FormControl();
  filteredProd: any;
  isLoading = false;
  errorMsg!: string;
  minLengthTerm = 3;
  selectedProd: any = "";

  pkgMaster;
  packageName;
  filteredOptions: any;
  valid_from;
  valid_till;
  isGeneral = `${0}`;
  todayDate:Date = new Date();

  constructor(private route: ActivatedRoute,
    private alertService: AlertService,
    private prodServ: ProductService,
    private router: Router, private apiService: ApiHttpService) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.packageMasterId = +params['id'];
      this.storeId = +params['counter'];
      this.masterChanged();
    });
    console.log(this.packageMasterId, this.storeId);

    this.searchProdCtrl.valueChanges
      .pipe(
        filter(res => {
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.errorMsg = "";
          this.filteredProd = [];
          this.isLoading = true;
        }),
        switchMap(value => this.apiService.get(AppSetting.ENDPOINTS.getProdByBarcode + '/' + value + '/' + this.storeId)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((data: any) => {
        console.log(data);
        if (data == undefined) {
          this.filteredProd = [];
        } else {
          this.errorMsg = "";
          this.filteredProd = data;
        }
        console.log(this.filteredProd);
      });


  }

  onSelected() {
    console.log(this.selectedProd);
    //this.selectedProd = this.selectedProd;
  }

  displayWith(value: any) {
    if (!value) {
      return '';
    }
    return value?.barcode + ' - ' + value?.prod_name + ' - (QTY - ' + value?.quantity + ')';
  }

  clearSelection() {
    this.selectedProd = "";
    this.filteredProd = [];
  }

  masterChanged() {
    switch (this.packageMasterId) {
      case 1:

        break;
      case 2:
        this.frequency = '1';
        break;

      default:
        break;
    }
  }

  addProduct(pro, isTriggerer = false) {
    if (isTriggerer) {
      console.log("Updating");

      var index = this.allTriggerProdsId.indexOf(pro['idproduct_master']);
      if (index < 0) {
        this.allTriggerProdsId.push(pro['idproduct_master'])
        this.allTriggerProds.push({ "idproduct_master": pro['idproduct_master'], "quantity": 1, "name": pro['name'] });
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
    this.apiService.get(AppSetting.ENDPOINTS.getProdByBarcode + '/' + barcode + '/' + this.storeId)
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

  createPackage() {
    this.loading = true;
    let req = {};

    switch (this.packageMasterId) {
      case AppSetting.PKGMASTER.Product:
        if (!this.packageName || this.allTriggerProdsId.length == 0 || this.allTaggedProdsId.length == 0 || !this.addTagAmt || !this.frequency || !this.applicableOn) {
          this.alertService.openSnackBar("Validation Failed Please fill all fields!");
          return;
        }
        req = {
          'idpackage_master': this.packageMasterId,
          'idstore_warehouse': this.storeId,
          'applicable_on': this.applicableOn,
          'frequency': +this.frequency,
          'name': this.packageName,
          'base_trigger_amount': 0,
          'additional_tag_amount': this.addTagAmt,
          'triggeringProds': this.allTriggerProds,
          'tagAlongProds': this.allTaggedProds,
          'bypass_make_gen': +this.isGeneral,
          'valid_from': (this.valid_from) ? moment(this.valid_from).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD hh:mm:ss'),
          'valid_till': (this.valid_till) ? moment(this.valid_till).format('YYYY-MM-DD') : moment().add(5, 'years').format('YYYY-MM-DD'),
        }
        break;

      case AppSetting.PKGMASTER.Amount:
        if (!this.packageName || !this.amountPkgAmt || this.allTaggedProdsId.length == 0 || !this.addTagAmt || !this.applicableOn) {
          this.alertService.openSnackBar("Validation Failed Please fill all fields!");
          return;
        }
        req = {
          'idpackage_master': this.packageMasterId,
          'idstore_warehouse': this.storeId,
          'applicable_on': this.applicableOn,
          'frequency': 1,
          'name': this.packageName,
          'base_trigger_amount': this.amountPkgAmt,
          'additional_tag_amount': this.addTagAmt,
          'triggeringProds': [],
          'tagAlongProds': this.allTaggedProds,
          'bypass_make_gen': +this.isGeneral,
          'valid_from': (this.valid_from) ? moment(this.valid_from).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD hh:mm:ss'),
          'valid_till': (this.valid_till) ? moment(this.valid_till).format('YYYY-MM-DD') : moment().add(5, 'years').format('YYYY-MM-DD'),
        }
        break;
      case AppSetting.PKGMASTER.Quantity:
        if (!this.packageName || !this.applicableOn || !this.selectedProd || !this.firstQuantity || (!this.secondAmount && !this.firstAmount)) {
          this.alertService.openSnackBar("Validation Failed Please fill all fields!");
          return;
        }
        req = {
          'idpackage_master': this.packageMasterId,
          'idstore_warehouse': this.storeId,
          'applicable_on': this.applicableOn,
          'frequency': 1,
          'name': this.packageName,
          'base_trigger_amount': (this.firstAmount == undefined || this.firstAmount.trim() == '') ? null : this.firstAmount,
          'additional_tag_amount': (this.secondAmount == undefined || this.secondAmount.trim() == '') ? null : this.secondAmount,
          'triggeringProds': [{ "idproduct_master": this.selectedProd.idproduct_master, "quantity": this.firstQuantity }],
          'tagAlongProds': [],
          'bypass_make_gen': +this.isGeneral,
          'valid_from': (this.valid_from) ? moment(this.valid_from).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD hh:mm:ss'),
          'valid_till': (this.valid_till) ? moment(this.valid_till).format('YYYY-MM-DD') : moment().add(5, 'years').format('YYYY-MM-DD'),
        }
        break;

      default:
        this.alertService.openSnackBar("Mapping Not Implemented.");
        break;
    }

    this.apiService.post(AppSetting.ENDPOINTS.createPackage, req)
      .subscribe(
        data => {
          console.log(data);
          this.alertService.openSnackBar("Package Created.");
          this.router.navigate(['/ggb-admin/view-package'], { state: { data: { 'idstore_warehouse': this.storeId } } });
        },
        error => {
          this.firstAmount = undefined;
          this.secondAmount = undefined;
          this.alertService.error(error);
          this.loading = false;
        });
  }

}
