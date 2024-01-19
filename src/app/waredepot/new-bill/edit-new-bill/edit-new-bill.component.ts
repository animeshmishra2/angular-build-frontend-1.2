import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfirmOrderComponent } from 'src/app/pos/new-order/confirm-order/confirm-order.component';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { ProductService } from 'src/app/shared/_service/product.service';
import { MarginDetailsDialogComponent } from '../margin-details-dialog/margin-details-dialog.component';
import { DialogPrintviewComponent } from '../dialog-printview/dialog-printview.component';

@Component({
  selector: 'app-edit-new-bill',
  templateUrl: './edit-new-bill.component.html',
  styleUrls: ['./edit-new-bill.component.scss']
})
export class EditNewBillComponent implements OnInit, OnDestroy {
  row: any;
  displayedColumns: string[] = ['idproduct_master', 'barcode', 'prod_name', 'brand', 'quantity', 'action'];
  displayedColumnsSel: string[] = ['idproduct_master', 'barcode', 'prod_name', 'brand', 'quantity', 'action'];
  displayedColumnsSelDet: string[] = ['barcode', 'quantity', 'freeQuantity','instant', 'product','land', 'copartner','marginPrice', 'unitpp', 'hsn', 'mrp', 'expiry'];
  loading: boolean = false;
  search
  isExactSearch: boolean = true;
  visibleIgst: boolean = false;
  visiblecsGst: boolean = false;
  prodSearchTxt: any = '';
  selectedProds: any = [];
  productDetails: any = [];
  selectedDate: Date = new Date();
  remarksData:any = '';
  dataSource: MatTableDataSource<any>;
  dataSourceSel: MatTableDataSource<any>;
  dataSourceSelDet: MatTableDataSource<any>;
  products: any = []
  instant_price: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('selectedPaginator', { read: MatPaginator }) selectedPaginator: MatPaginator;
  @ViewChild('finalPaginator', { read: MatPaginator }) finalPaginator: MatPaginator;
  vendors: any[] = ['One', 'Two', 'Three']
  filteredVendors: Observable<any[]>;
  selectedProdsIds: any = [];
  todayDate: Date = new Date();
  errorPurchase : boolean = false;
  @ViewChild('printTable') printTable: ElementRef;
  firstFormGroup = new FormGroup({
    vendor: new FormControl('', [
      Validators.required
    ]),
    billno: new FormControl('', [
      Validators.required
    ]),
    total: new FormControl('', [
      Validators.required
    ]),
    paid: new FormControl('', [
      Validators.required
    ]),
    cgst: new FormControl('', [

    ]),
    sgst: new FormControl('', [

    ]),
    billDate: new FormControl('', [
      Validators.required
    ]),
    igst: new FormControl('', [
    ]),
    paymode: new FormControl(''),
    refNo: new FormControl(''),
  });
  secondFormGroup = new FormGroup({
    product: new FormControl('')
  });

  public CLOSE_ON_SELECTED = false;
  public init = new Date();
  public resetModel = new Date(0);
  @ViewChild('picker', { static: true }) _picker: MatDatepicker<Date>;
  wareHouseState: any;
  totalCal: any;
  grandTotal: number = 0;
  totalMargin: number = 0;


  constructor(
    private alertService: AlertService,
    private apiServ: ApiHttpService,
    public dialog: MatDialog,
    private router: Router,
    private prodServ: ProductService,
    private el: ElementRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditNewBillComponent>
  ) {
    // if (this.row) {
    //   this.firstFormGroup.controls["name"].setValue(this.row.name);
    //   this.firstFormGroup.controls["contact"].setValue(this.row.phone);
    //   this.firstFormGroup.controls["address"].setValue(this.row.address);
    //   this.firstFormGroup.controls["email"].setValue(this.row.email);
    //   this.firstFormGroup.controls["gst"].setValue(this.row.gst);
    //   this.firstFormGroup.controls["payment_details"].setValue(this.row.payment_details);
    // }
    this.selectedDate = new Date();
    this.wareHouseState = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!) : [];
  }

  ngOnInit(): void {
    this.getVendors();
    // this.getDetails();
    this.firstFormGroup.controls.cgst.valueChanges.subscribe((value) => {
      if (value) {
        this.firstFormGroup.patchValue({ sgst: value });
      }
    });
  }

  ngOnDestroy() {
    if (this.firstFormGroup?.value?.vendor?.idvendor) {
      const _localStorageList: any = localStorage.getItem('vendorDraftData') ? JSON.parse(localStorage.getItem('vendorDraftData')!) : [];
      const isAvail = _localStorageList?.findIndex((s: any) => s?._id == this.firstFormGroup?.value?.vendor?.idvendor);
      const vendor: any = {
        _id: this.firstFormGroup?.value?.vendor?.idvendor,
        firstFormGroup: this.firstFormGroup?.value,
        secondFormGroup: this.secondFormGroup?.value,
        dataSourceSelDet: this.dataSourceSelDet?.data,
        isExactSearch: this.isExactSearch,
        prodSearchTxt: this.prodSearchTxt,
        selectedProds: this.selectedProds
      }

      if ((isAvail == -1)) {
        _localStorageList?.push(vendor);
      } else {
        _localStorageList[isAvail] = vendor;
      }
      localStorage.setItem('vendorDraftData', JSON.stringify(_localStorageList));
    }
  }

  setEditForm() {
    if (this.productDetails) {
      const fIndex = this.vendors?.findIndex((v: any) => v?.idvendor === this.productDetails[0].idvendor);
      this.firstFormGroup.controls["vendor"].setValue(this.vendors[fIndex]);
      this.firstFormGroup.controls["billno"].setValue(this.productDetails[0]?.bill_number);
      this.firstFormGroup.controls["total"].setValue(this.productDetails[0]?.total);
      this.firstFormGroup.controls["paid"].setValue(this.productDetails[0]?.paid);
      this.firstFormGroup.controls["cgst"].setValue(this.productDetails[0]?.cgst);
      this.firstFormGroup.controls["sgst"].setValue(this.productDetails[0]?.sgst);
      this.firstFormGroup.controls["igst"].setValue(this.productDetails[0]?.igst);
      this.firstFormGroup.controls["billDate"].setValue(this.productDetails[0]?.bill_date);
      this.firstFormGroup.controls["paymode"].setValue(this.productDetails[0]?.pay_mode);
      this.productDetails?.vendor_purchases_detail.forEach(element => {
        element['nquantity'] = element?.quantity;
        this.addProduct(element, true);
      });
      if ( this.firstFormGroup.value["vendor"]?.state && 
          this.firstFormGroup.value["vendor"]?.state != this.wareHouseState?.sw_state) {
        this.visibleIgst = true;
        this.visiblecsGst = false;
      } else {
        this.visibleIgst = false;
        this.visiblecsGst = true;
      }

      this.setGstFields();
      this.autoCalculation();
    }
  }

  setGstFields() {
    if ( this.firstFormGroup.value["vendor"]?.state && this.firstFormGroup.value["vendor"]?.state != this.wareHouseState?.sw_state) {
      this.visibleIgst = true;
      this.visiblecsGst = false;
      this.displayedColumnsSelDet.push('additionalColumn');
      this.displayedColumnsSelDet = this.displayedColumnsSelDet.filter(col => col !== ('cgst'));
      // this.displayedColumnsSelDet = this.displayedColumnsSelDet.filter(col => col !== ('sgst'));
    } else if( this.firstFormGroup.value["vendor"]?.state && this.firstFormGroup.value["vendor"]?.state && this.firstFormGroup.value["vendor"]?.state == this.wareHouseState?.sw_state) {
      this.visibleIgst = false;
      this.visiblecsGst = true;
      this.displayedColumnsSelDet = this.displayedColumnsSelDet.filter(col => col !== 'additionalColumn');
      this.displayedColumnsSelDet.push('cgst');
      // this.displayedColumnsSelDet = this.displayedColumnsSelDet.concat(columnsToAdd);
    } else{
      this.visibleIgst = false;
      this.visiblecsGst = true;
      this.displayedColumnsSelDet = this.displayedColumnsSelDet.filter(col => col !== 'additionalColumn');
      this.displayedColumnsSelDet.push('cgst');
    }
    this.displayedColumnsSelDet = this.displayedColumnsSelDet.filter(col => col !== 'totalAmt');
    // this.displayedColumnsSelDet.push('totalAmt', 'calculateprice');
    this.displayedColumnsSelDet.push('totalAmt');
  }

  setDefaultData() {
    this.selectedProds = [];
    this.selectedProdsIds = [];
    this.setGstFields();
    const _localStorageList: any = localStorage.getItem('vendorDraftData') ? JSON.parse(localStorage.getItem('vendorDraftData')!) : [];
    if (_localStorageList?.length > 0 && this.firstFormGroup?.value?.vendor?.idvendor) {
      const isAvail = _localStorageList?.findIndex((s: any) => s?._id == this.firstFormGroup?.value?.vendor?.idvendor);
      if (isAvail != -1) {
        const defaultData = _localStorageList[isAvail];
        this.firstFormGroup.patchValue(defaultData?.firstFormGroup);
        this.secondFormGroup.patchValue(defaultData?.secondFormGroup);
        this.isExactSearch = defaultData?.isExactSearch;
        this.prodSearchTxt = defaultData?.prodSearchTxt;

        if (this.prodSearchTxt) this.getProducts();
        if (defaultData.selectedProds?.length > 0) {
          defaultData.selectedProds.forEach((p: any) => {
            this.addProduct(p, true);
          });
        }
        // if(this.dataSourceSelDet) {
        //   this.dataSourceSelDet['data'] = defaultData?.dataSourceSelDet;
        // }
        this.autoCalculation();
      } else {
       this.resetAll();
      }
    }
  }

  resetAll() {
    const vendor = this.firstFormGroup?.value?.vendor;
    this.firstFormGroup.controls['vendor']?.setValue(vendor);
    this.firstFormGroup.controls['billno']?.reset();
    this.firstFormGroup.controls['total']?.reset();
    this.firstFormGroup.controls['paid']?.reset();
    this.firstFormGroup.controls['cgst']?.reset();
    this.firstFormGroup.controls['sgst']?.reset();
    this.firstFormGroup.controls['billDate']?.reset();
    this.firstFormGroup.controls['igst']?.reset();
    this.firstFormGroup.controls['paymode']?.reset();
    this.firstFormGroup.controls['refNo']?.reset();
    this.secondFormGroup.reset();
    this.prodSearchTxt = '';
    this.isExactSearch = true;
    this.dataSourceSelDet['data'] = [];
    this.dataSourceSel['data'] = [];
    this.dataSource['data'] = [];
  }

  autoCalculation() {
    this.grandTotal = 0;
    this.totalMargin = 0;
 
    
    this.dataSourceSelDet?.data?.forEach((prod: any) => {
      console.log("nquantity",prod['nquantity']);
      const GST = this.visibleIgst ? (prod['igst'] || 0) : ((prod['cgst'] || 0) + (prod['sgst'] || 0));
      const GSTAmount = (((prod['purchase_price'] || 0) * GST) / 100);
      prod['totalAmount'] = ((prod['nquantity'] || 0) * ((prod['purchase_price'] || 0) + GSTAmount))  || 0;
      prod['margin'] = Number((prod['mrp'] || 0) - ((prod['purchase_price'] || 0) + GSTAmount) ) * (prod['nquantity'] || 0);
      prod['marginnew'] = Number((prod['mrp'] || 0) - ((prod['purchase_price'] || 0) + GSTAmount) );
      prod['marginPercent'] = (prod['marginnew'] / prod['mrp'] * 100 || 0);
      this.grandTotal += Number(prod['totalAmount'].toFixed(2));
      this.totalMargin += Number(prod['margin'] || 0);
    });
  }

  pendingAmonut() {
    return Number((this.firstFormGroup?.value['total'] - this.grandTotal)?.toFixed(2));
  }

  savData() {
    if (this.firstFormGroup.invalid) {
      return;
    }
    let dialogRef = this.dialog.open(ConfirmOrderComponent, {
      data: { message: "Do You want to save this data?", title: "Add Bill" }
    });
    if (this.selectedProds.length == 0) {
      this.alertService.openSnackBar("Add Some Products to Continue");
    }
    else {
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          let isIncomplete = false;
          let allQty = 0;
          let valMsg = 'Missing Details for: ';
          let allProds: any = [];
          this.selectedProds.forEach(prod => {
            if (!prod.mrp || !prod.nquantity || !prod.purchase_price || !prod.selling_price) {
              valMsg += ' -' + prod.barcode;
              isIncomplete = true;

            }
            allQty += +prod.nquantity;
            prod.expiry = prod.expiry.map(el => moment(el).format('YYYY-MM-DD'));
            prod.quantity = prod.nquantity;
            allProds.push(prod);
          });

          if (isIncomplete) {
            this.alertService.openSnackBar(valMsg);
          }
          else {
            let req = {
              'vendor': this.firstFormGroup.controls["vendor"].value,
              'bill_date': this.firstFormGroup.controls["billDate"].value ? this.firstFormGroup.controls["billDate"].value : null,
              'bill_number': this.firstFormGroup.controls["billno"].value,
              'total': this.firstFormGroup.controls["total"].value,
              'paid': this.firstFormGroup.controls["paid"].value,
              'paymode': this.firstFormGroup.controls["paymode"].value,
              'refNo': this.firstFormGroup.controls["refNo"].value,
              'cgst': this.firstFormGroup.controls["cgst"].value,
              'sgst': this.firstFormGroup.controls["sgst"].value,
              'igst':  this.firstFormGroup.controls["igst"].value ? this.firstFormGroup.controls["igst"].value : 0,
              'pending_value': Math.abs(this.pendingAmonut()) || 0,
              "bill_remark" : this.remarksData ? this.remarksData : '',
              'products': allProds,
              'quantity': allQty,
            };
            this.apiServ.post(AppSetting.ENDPOINTS.storeVendorPurchasesDetail, req).subscribe(data => {
              this.loading = false;
              if (data.statusCode == 0) {
                this.selectedProds = [];
                this.selectedProdsIds = [];
                this.alertService.openSnackBar("Details Updated.");
                this.router.navigate(['/warehouse/bills']);
                this.loading = false;
              }
              else {
                this.alertService.openSnackBar("ERROR: Unable to update.");
              }
            },
            error => {
              this.alertService.error(error);
              this.loading = false;
            });
          }
        }
      });
    }
  }

  onSubmit() {
    if (this.firstFormGroup.invalid) {
      return;
    }
    if (this.pendingAmonut() > 0) {
      let remainingData = this.dialog.open(ConfirmOrderComponent, {
        data: { message: this.pendingAmonut() + " Amount is remaining. Still you want to countinue ?", title: "" }
      });
      remainingData.afterClosed().subscribe((result) => {
        if (result) {
          this.commonSubmit();
        }
      })
      return;
    }
    if (this.pendingAmonut() < 0) {
      let remainingData = this.dialog.open(ConfirmOrderComponent, {
        data: { message: Math.abs(this.pendingAmonut()) + " Amount is extra. Please check products?", title: "" }
      });
      remainingData.afterClosed().subscribe((result) => {
        if (result) {
          this.commonSubmit();
        }
      });
      return;
    }
    let dialogRef = this.dialog.open(ConfirmOrderComponent, {
      data: { message: "Do You want to save this data?", title: "Add Bill" }
    });
    if (this.selectedProds.length == 0) {
      this.alertService.openSnackBar("Add Some Products to Continue");
    } else {
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.commonSubmit();
        }
      });
    }
  }

  commonSubmit() {
    let isIncomplete = false;
    let allQty = 0;
    let valMsg = 'Missing Details for: ';
    let allProds: any = [];
    this.selectedProds.forEach(prod => {
      if (!prod.mrp || !prod.nquantity || !prod.selling_price) {
        valMsg += ' -' + prod.barcode;
        isIncomplete = true;
      }
      allQty += +prod.nquantity;
      prod.expiry = prod.expiry.map(el => moment(el).format('YYYY-MM-DD'));
      prod.quantity = (prod.nquantity > 0) ? ( prod.nquantity) : 1 ;
      allProds.push(prod);
    });

    if (isIncomplete) {
      this.alertService.openSnackBar(valMsg);
    } else {
      const req = {
        'vendor': this.firstFormGroup.controls["vendor"].value,
        'bill_number': this.firstFormGroup.controls["billno"].value,
        'total': this.firstFormGroup.controls["total"].value,
        'paid': this.firstFormGroup.controls["paid"].value,
        'paymode': this.firstFormGroup.controls["paymode"].value,
        'refNo': this.firstFormGroup.controls["refNo"].value,
        'cgst': this.firstFormGroup.controls["cgst"].value ? this.firstFormGroup.controls["cgst"].value : 0,
        'sgst': this.firstFormGroup.controls["sgst"].value ? this.firstFormGroup.controls["sgst"].value : 0,
        'igst': this.firstFormGroup.controls["igst"].value ? this.firstFormGroup.controls["igst"].value : 0,
        'bill_date': this.firstFormGroup.controls["billDate"].value,
        'pending_value': Math.abs(this.pendingAmonut()),
        "bill_remark" : this.remarksData,
        'products': allProds,
        'quantity': allQty,
      };

      // if(this.visibleIgst) {
      //   req['igst'] = this.firstFormGroup.controls["igst"].value;
      // } else {
      //   req['cgst'] = this.firstFormGroup.controls["cgst"].value;
      //   req['sgst'] = this.firstFormGroup.controls["sgst"].value;
      // }

      if (this.productDetails && this.productDetails[0]?.idvendor_purchases) {
        this.apiServ.post(AppSetting.ENDPOINTS.updateVendorPurchasesDetail + this.productDetails[0]?.idvendor_purchases, req).subscribe(
          data => {
            this.loading = false;
            if (data.statusCode == 0) {
              this.alertService.openSnackBar("Details Updated.");
              this.router.navigate(['/warehouse/bills']);
            }
            else {
              this.alertService.openSnackBar("ERROR: Unable to update.");
            }
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
          });
      } else {
        this.apiServ.post(AppSetting.ENDPOINTS.storeVendorPurchasesDetail, req)
          .subscribe(
            data => {
              this.loading = false;
              if (data.statusCode === 0) {
                this.selectedProds = [];
                this.selectedProdsIds = [];
                const _localStorageList: any = localStorage.getItem('vendorDraftData') ? JSON.parse(localStorage.getItem('vendorDraftData')!) : [];
                if (_localStorageList?.length > 0) {
                  const isAvail = _localStorageList?.findIndex((s: any) => s?._id == this.firstFormGroup?.value?.vendor?.idvendor);
                  if (isAvail != -1) {
                    this.firstFormGroup.reset();
                    this.secondFormGroup.reset();
                    this.prodSearchTxt = '';
                    this.isExactSearch = true;

                    _localStorageList.splice(isAvail, 1);
                    localStorage.setItem('vendorDraftData', JSON.stringify(_localStorageList));
                  }
                }
                this.alertService.openSnackBar("Details Updated.");
                this.router.navigate(['/warehouse/bills']);
              }
              else {
                this.alertService.openSnackBar("ERROR: Unable to Add.");
              }
            },
            error => {
              this.alertService.error(error);
              this.loading = false;
            });
      }
    }
  }

  getVendors() {
    this.loading = true;
    this.apiServ.get(AppSetting.ENDPOINTS.vendor)
      .subscribe(
        data => {
          this.vendors = data;
          this.filteredVendors = this.firstFormGroup.controls["vendor"].valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
          );
          this.loading = false;
          // this.setEditForm();
          this.getDetails();
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }
  getDetails() {
    this.loading = true;
    this.prodServ.getProductdetails(this.data?.data?.idvendor_purchases)
      .subscribe(
        data => {
          this.productDetails = data?.data;
          this.setEditForm();
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }
  private _filter(value): string[] {
    if (!(typeof value === 'string' || value instanceof String)) {
      return [];
    }
    const filterValue = value.toLowerCase();
    return this.vendors.filter(vendor => {
      return (vendor.gst.toLowerCase() + ' - ' + vendor.name.toLowerCase()).includes(filterValue)
    });
  }

  displayFn(vendor) {
    return vendor ? (vendor.name + ' - ' + vendor.gst) : '';
  }
  isDispBillDet() {
    return (this.firstFormGroup.controls["vendor"].value.idvendor) ? true : false
  }
  getProducts() {
    this.loading = true;
    this.prodServ. getProductsbatchByBarcode(this.prodSearchTxt, this.isExactSearch).subscribe(
      (data) => {
        this.products = data.data;
        this.dataSource = new MatTableDataSource(this.products);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        this.alertService.error(error);
        this.loading = false;
      }
    );
  }

  addProduct(product, isUpdate = false) {
    product['nquantity'] = isUpdate ? product?.nquantity : 1;
    product['expiry'] = [product?.expiry];
    product['free_quantity'] = isUpdate ? product?.free_quantity : 0;
    product['margin'] = Number(product?.selling_price - product?.purchase_price) || 0
    this.selectedProds.push(product);
    this.selectedProdsIds.push(product.idproduct_master);
    this.updateSelTab();
    this.autoCalculation();
  }

  removeProduct(product) {
    this.selectedProds = this.selectedProds.filter(elm => elm.idproduct_master != product.idproduct_master);
    var index = this.selectedProdsIds.indexOf(product.idproduct_master);
    this.selectedProdsIds.splice(index, 1);
    this.updateSelTab()
  }
  isDisable(row) {
    return this.selectedProdsIds.includes(row.idproduct_master);
  }
  updateSelTab() {
    this.dataSourceSel = new MatTableDataSource(this.selectedProds);
    this.dataSourceSel.paginator = this.selectedPaginator;
    this.dataSourceSel.sort = this.sort;
    this.dataSourceSelDet = new MatTableDataSource(this.selectedProds);
    this.dataSourceSelDet.paginator = this.finalPaginator;
    this.dataSourceSelDet.sort = this.sort;
  }

  public dateClass = (date: Date) => {
    // if (this._findDate(date) !== -1) {
    //   return [ 'selected' ];
    // }
    return [];
  }

  public dateChanged(event: MatDatepickerInputEvent<Date>, row): void {
    if (event.value) {
      const date = event.value;
      if (!row.expiry)
        row.expiry = [new Date(0)]

      const index = this._findDate(date, row);
      if (index === -1) {
        row.expiry.push(date);
      } else {
        row.expiry.splice(index, 1)
      }
      this.resetModel = new Date(0);
      if (!this.CLOSE_ON_SELECTED) {
        const closeFn = this._picker.close;
        this._picker.close = () => { };
        this._picker['_popupComponentRef'].instance._calendar.monthView._createWeekCells()
        setTimeout(() => {
          this._picker.close = closeFn;
        });
      }
    }
  }

  public remove(date: Date, row): void {
    const index = this._findDate(date, row);
    row.expiry.splice(index, 1)
  }

  private _findDate(date: Date, row): number {
    return row.expiry.map((m) => +m).indexOf(+date);
  }

  public onDateChange(event: any) {
    const newDate = event.value;
    this.firstFormGroup.patchValue({
      billDate: newDate
    });
    let total = this.firstFormGroup.controls["total"].value
    let cgst = this.firstFormGroup.controls["cgst"].value
    let sgst = this.firstFormGroup.controls["sgst"].value
    this.totalCal = total + cgst + sgst;
  }

  print(): void {
    // let isIncomplete = false;
    let allQty = 0;
    let valMsg = 'Missing Details for: ';
    let allProds: any = [];
    this.selectedProds.forEach(prod => {
      if (!prod.mrp || !prod.nquantity || !prod.selling_price) {
        valMsg += ' -' + prod.barcode;
        // isIncomplete = true;
      }
      allQty += +prod.nquantity;
      prod.expiry = prod.expiry.map(el => moment(el).format('YYYY-MM-DD'));
      allProds.push(prod);
    });
    const req = {
      'vendor': this.firstFormGroup.controls["vendor"].value,
      'bill_number': this.firstFormGroup.controls["billno"].value,
      'total': this.firstFormGroup.controls["total"].value,
      'paid': this.firstFormGroup.controls["paid"].value,
      'paymode': this.firstFormGroup.controls["paymode"].value,
      'refNo': this.firstFormGroup.controls["refNo"].value,
      'cgst': this.firstFormGroup.controls["cgst"].value,
      'sgst': this.firstFormGroup.controls["sgst"].value,
      'igst': this.firstFormGroup.controls["igst"].value,
      'bill_date': this.firstFormGroup.controls["billDate"].value,
      'pending_value': Math.abs(this.pendingAmonut()) + " - " + this.remarksData,
      'products': allProds,
      'quantity': allQty,
    };
    const dialogRef = this.dialog.open(DialogPrintviewComponent, {
      width: '570px', // Set the dialog width as needed
      data: req,
    });
  }

  public calculatePrice(priceData, index: number): void {
    
    if (this.visiblecsGst){
      let payload = {
        product_id: priceData?.idproduct_master,
        mrp: Number(priceData?.mrp.toFixed(2)),
      
        purchase_price: Number((priceData?.purchase_price ? priceData?.purchase_price : 0).toFixed(2)) + ((priceData?.purchase_price *(priceData.cgst + priceData.sgst))/100)      }
      this.prodServ.getAutoCalculatePrice(payload).subscribe({
        next: (response: any)=>{
          if(response?.data) {
            priceData['mrp_margin'] = response?.data?.mrp_margin;
            priceData['selling_price'] = response?.data?.selling_price;
            priceData['product'] = response?.data?.product;
            priceData['copartner'] = response?.data?.copartner;
            priceData['land'] = response?.data?.land;
            // this.openViewPrice(response?.data, index);
            // this.dataSourceSelDet.data[index]['mrp_margin'] = result?.mrp_margin;
            // this.instant_price= response?.instant_price;
            // this.dataSourceSelDet.data[index]['product'] = response?.product;
            // this.dataSourceSelDet.data[index]['copartner'] = response?.copartner;
            // this.dataSourceSelDet.data[index]['land'] = response?.land;
            console.log("this.data",this.dataSourceSelDet);
            
          } else {
            this.alertService.openSnackBar("Unit Price Should be Less then MRP");
          }
        },
        complete: ()=>{
  
        }
      })
    } else {
      let payload = {
        product_id: priceData?.idproduct_master,
        mrp: Number(priceData?.mrp.toFixed(2)),
        purchase_price: Number((priceData?.purchase_price ? priceData?.purchase_price : 0).toFixed(2)) + (priceData.igst)
      }
      this.prodServ.getAutoCalculatePrice(payload).subscribe({
        next: (response: any)=>{
          if(response?.data) {
            let product;
            let copartner;
            let land;
            // if (this.visiblecsGst){
              product = (((response?.data?.product + (priceData.purchase_price * (priceData.cgst + priceData.sgst)) / 100))
              / response?.data?.product * 100)
            // }
           
            priceData['mrp_margin'] = response?.data?.mrp_margin;
            priceData['selling_price'] = response?.data?.selling_price;
            priceData['product'] = response?.data?.product;
            priceData['copartner'] = response?.data?.copartner;
            priceData['land'] = response?.data?.land;
            // this.openViewPrice(response?.data, index);
            // this.dataSourceSelDet.data[index]['mrp_margin'] = result?.mrp_margin;
            // this.instant_price= response?.instant_price;
            // this.dataSourceSelDet.data[index]['product'] = response?.product;
            // this.dataSourceSelDet.data[index]['copartner'] = response?.copartner;
            // this.dataSourceSelDet.data[index]['land'] = response?.land;
            console.log("this.data",this.dataSourceSelDet);
            
          } else {
            this.alertService.openSnackBar("Unit Price Should be Less then MRP");
          }
        },
        complete: ()=>{
  
        }
      })
    }
    console.log("before",this.dataSourceSelDet);
  }

  public openViewPrice(marginValue, index){
    const dialogRef = this.dialog.open(MarginDetailsDialogComponent, {
      width: '400px',
      data: { marginDetails: marginValue } // Pass the response data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dataSourceSelDet.data[index]['mrp_margin'] = result?.mrp_margin;
      this.dataSourceSelDet.data[index]['instant_price'] = result?.instant_price;
      this.dataSourceSelDet.data[index]['product'] = result?.product;
      this.dataSourceSelDet.data[index]['copartner'] = result?.copartner;
      this.dataSourceSelDet.data[index]['land'] = result?.land;
      // Handle actions after the dialog is closed (if needed)
    });
  }
}
