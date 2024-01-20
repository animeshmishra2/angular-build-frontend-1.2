import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { AuthenticationService } from 'src/app/shared/_service/authentication.service';
import { CartService } from 'src/app/shared/_service/cart.service';
import { OrderService } from 'src/app/shared/_service/order.service';
import { ProductService } from 'src/app/shared/_service/product.service';
import { CustomerLoginRegisterComponent } from './customer-login-register/customer-login-register.component';
import { ConfirmOrderComponent } from './confirm-order/confirm-order.component';
import {
  MatPaginator,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { SelectPackageComponent } from './select-package/select-package.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { BatchSelectComponent } from './batch-select/batch-select.component';
import { UpgradeMembershipComponent } from './upgrade-membership/upgrade-membership.component';
import { CashDrawerTransactionComponent } from './cash-drawer-transaction/cash-drawer-transaction.component';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss'],
})
export class NewOrderComponent implements OnInit, OnDestroy {
  @ViewChild('scrollTp') private myScroll: ElementRef;
  currentDate = new Date();
  contact: string;
  coupon: any;
  paymentMode: string = 'Cash';
  loading: boolean;
  search: string;
  products: any = [];
  productToShow: any = [];
  baseSearchData;
  cartItems: any = [];
  cartProducts: any = [];
  cartEmpty: boolean = false;
  currHoldOrder: any;
  currHoldOrderDetail: any = [];
  discountList: any = [];
  customerLogged = false;
  discountAmount: any;
  discountPercentage: any;
  cdiscountamount: number = 0;
  couponDiscountAmount: number = 0;
  offerProds: any[] = [];
  packageAmount: any[] = []
  selectedNonGenPkg: any = 0;
  private mywindow;
  isUseRedeemWallet = false;

  customer = {
    idcustomer: 0,
    name: '',
    email: '',
    wallet_balance: 0,
    idmembership_plan: 0,
    address: "",
    commission: 0,
    instant_discount: 0,
    membership_type: "",
    contact: "",
    status: 0,
    redeemWallet: 0

  };
  images = [
    'dairy-products.png',
    'harvest.png',
    'healthcare.png',
    'cleaning.png',
    'products.png',
    'cosmetics.png',
    'baby-products.png',
    'dairy-products.png',
    'harvest.png',
    'healthcare.png',
    'cleaning.png',
    'products.png',
    'cosmetics.png',
    'baby-products.png',
    'dairy-products.png',
    'harvest.png',
    'healthcare.png',
    'cleaning.png',
    'products.png',
    'cosmetics.png',
    'baby-products.png',
  ];
  total = {
    total: 0,
    cgst: 0,
    sgst: 0,
    discount: 0,
    cdiscount: 0,
    extraDisc: 0,
    coupon: 0,
    grand: 0,
    grandAfterWallet: 0,
    totalQty: 0,
    instant_discount: 0,
    land_discount: 0,
    product_discount: 0,
    copartner_discount: 0
    // withDiscountPriceTotal : 0,
    // // withDiscountCopartnertPriceTotal : 0,
    // withDiscountLandTotal : 0,
    // withDiscountProductTotal : 0,
    // withoutDiscountPriceTotal : 0,
    // withoutDiscountCopartnertPriceTotal : 0,
    // withoutDiscountLandTotal : 0,
    // withoutDiscountProductTotal : 0,
    // totalDiscount : 0,
  };
  member_name: string = '';
  member_email: string = '';
  packages;
  genOpenPkg: any[] = [];
  genMemPkg: any[] = [];
  openPkg: any[] = [];
  memPkg: any[] = [];
  tagProdsCart: any = [];
  activePkgList: any = [];
  dataSource: MatTableDataSource<any>;
  actualDiscountAmount: number = 0;
  actualDiscountPer: number = 0;
  appliedCoupon: string = "";
  customInput: Subject<string> = new Subject();
  isExactSearch = true;
  payRef;
  payRefEnable = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  customDisActive: boolean = false;
  isAppliedDynFxDis: boolean = false;
  cashtTranDetail: never[];

  constructor(
    private prodServ: ProductService,
    private alertService: AlertService,
    public router: Router,
    public cartServ: CartService,
    public dialog: MatDialog,
    private ordServ: OrderService,
    private authSer: AuthenticationService,
    private apiService: ApiHttpService
  ) {
    let nav = this.router.getCurrentNavigation()?.extras;

    this.apiService.get(AppSetting.ENDPOINTS.getActivePackage)
      .subscribe(
        (data) => {
          this.packages = data;
          this.packages.forEach(pkg => {
            if (pkg.bypass_make_gen == 1 &&
              (pkg.applicable_on == AppSetting.PKG_APPLICABLE_ON.AllOpen || pkg.applicable_on == AppSetting.PKG_APPLICABLE_ON.Member)) {
              this.genMemPkg.push(pkg);
            }
            if (pkg.bypass_make_gen == 0 &&
              (pkg.applicable_on == AppSetting.PKG_APPLICABLE_ON.AllOpen || pkg.applicable_on == AppSetting.PKG_APPLICABLE_ON.Member)) {
              this.memPkg.push(pkg);
              
            }
            if (pkg.bypass_make_gen == 1 &&
              (pkg.applicable_on == AppSetting.PKG_APPLICABLE_ON.AllOpen || pkg.applicable_on == AppSetting.PKG_APPLICABLE_ON.NonMember)) {
              this.genOpenPkg.push(pkg);
            }
            if (pkg.bypass_make_gen == 0 &&
              (pkg.applicable_on == AppSetting.PKG_APPLICABLE_ON.AllOpen || pkg.applicable_on == AppSetting.PKG_APPLICABLE_ON.NonMember)) {
              this.openPkg.push(pkg);
            }
          });
        },
        (error) => {
          this.alertService.openSnackBar(error);
        }
      );

    if (nav?.state) {
      this.currHoldOrder = nav?.state.holdOrder;
      this.ordServ
        .getHoldOrderDetail(this.currHoldOrder.idcustomer_order_temp)
        .subscribe(
          (data) => {
            
            this.currHoldOrderDetail = data.data;
            this.currHoldOrderDetail.forEach((prod) => {
              this.updateQuantity(prod);
            });
            this.alertService.openSnackBar('Moved to cart');
          },
          (error) => {
            this.alertService.error(error);
            this.loading = false;
          }
        );
    }

    this.customInput.pipe(debounceTime(350)).subscribe(value => {
      this.search = value;
      if (value.length > 0) {
        this.getProducts(value);
      } else {
        this.getProducts('1');
      }
    });
  }

  ngOnInit(): void {
    // setInterval(() => {
    //   this.currentDate = new Date();
    // }, 1000);
    this.getProducts('1');
    // this.ordServ.getDiscountCoupon().subscribe((data) => {
    //   this.discountList = data.data;
    // });
    //this.cartServ.getProducts().then((data) => {});
  }

  doSearch(barcode) {
    this.customInput.next(barcode);
  }

  getImg() {
    const random = Math.floor(Math.random() * this.images.length);
    return '/assets/icons/' + random;
  }

  getProducts(barcode) {
    this.loading = true;

    this.prodServ.getProductsByBarcode(barcode, this.isExactSearch).subscribe(
      (data) => {
        this.loading = false;

        this.products = data.data;
        if (this.isExactSearch && barcode != '1' && this.products.length == 1) {
          this.updateQuantity(this.products[0], true);
          this.search = '';
        }
        if (this.isExactSearch && barcode != '1' && this.products.length == 0) {
          this.alertService.openSnackBar("No product availbale for "+ barcode);
          this.search = '';
        }
        this.productToShow = this.products.slice(0 * 20, 0 * 20 + 20);
      },
      (error) => {
        this.alertService.error(error);
        this.loading = false;
      }
    );
  }

  public getPaginatorData(event: PageEvent) {
    this.productToShow = this.products.slice(
      event.pageIndex * event.pageSize,
      event.pageIndex * event.pageSize + event.pageSize
    );

    // this.lowValue = event.pageIndex * event.pageSize;
    // this.highValue = this.lowValue + event.pageSize;
    // return event;
  }

  // add(product) {
  //   this.cartServ.addProduct(product).then((data) => {
  //     this.alertService.openSnackBar('Added to cart');
  //   });
  // }

  // removeItem(item) {
  //   this.cartServ.removeProduct(item).then((data) => {
  //     this.cartItems = data;
  //     this.cartProducts = data;
  //     this.alertService.openSnackBar('Product Removed.');
  //   });
  // }

  preUpdateQty(item, evt) {
    
    let qty = (evt.target.valueAsNumber < 0) ? 0 : evt.target.valueAsNumber;
    if (item.qty < qty) {
      this.updateQuantity(item.detail, true, true, qty)
    }
    if (item.qty > qty) {
      this.updateQuantity(item.detail, false, true, qty)
    }
  }
  updateQuantity(product, isIncrement = true, isFinalQty = false, newQty = 0) {
    if (!this.cartProducts?.length){
      this.logOutCustomer();
    }
    
    if(isIncrement && product.quantity < 1){
      this.alertService.openSnackBar("No available quantity");
      return;
    }
    
    if(isIncrement ){
      this.updateQuantityFin(product, isIncrement, isFinalQty, newQty);
    }
    else if(!isIncrement){
      // product.selected_batch = null;
      if (this.cartItems['p-' + product.idproduct_master]?.qty > 1){
        product.selected_batch = null;
        this.updateQuantityFin(product, isIncrement, isFinalQty, newQty)
      } else if(this.cartItems['p-' + product.idproduct_master]?.qty <=1){
        product.selected_batch = null;
        this.updateQuantityFin(product, isIncrement, isFinalQty, newQty)
      } else if(product?.batches.length > 1) {
        const dialogRef = this.dialog.open(BatchSelectComponent, {
          width: '80%',
          data: { data: product.batches }
        });
        dialogRef.afterClosed().subscribe(result => {
          let selPack;
          if (result && result.selected_batch) {
            selPack = result.selected_batch;
          }
          else{
          }
          product.selected_batch = selPack;
          this.updateQuantityFin(product, isIncrement, isFinalQty, newQty)
        });
      } else {
        product.selected_batch = null;
        this.updateQuantityFin(product, isIncrement, isFinalQty, newQty)
      }
      
    } 
    
  }

  updateQuantityFin(product, isIncrement = true, isFinalQty = false, newQty = 0){
    this.cartServ
    .updateQuantity(product, isIncrement, isFinalQty, +newQty.toFixed(2))
    .then((data) => {
      let newProd: any[] = [];
      for (var key in data) {
        if (!data.hasOwnProperty(key)) continue;

        var newDt = data[key].detail;
        newProd.push({
          idproduct_master: newDt.idproduct_master,
          prod_name: newDt.prod_name,
          sgst: newDt.sgst,
          cgst: newDt.sgst,
          selling_price: newDt.selling_price,
          mrp: newDt.mrp,
          discount: newDt.discount,
          qty: data[key].qty,
          detail: data[key].detail,
        });
      }
      this.cartItems = data;
      this.cartProducts = newProd;

      this.reEvaluatePackage()
      setTimeout(() => {
        try {
          this.myScroll.nativeElement.scrollTop = Math.max(0, this.myScroll.nativeElement.scrollHeight - this.myScroll.nativeElement.offsetHeight);
        } catch (err) { }
      }, 50);
    })
    .catch((err) => {
      this.alertService.openSnackBar(err);
    });
  }

  openBatchSelect(product) {
    
  }

  reEvaluatePackage() {
    //this.calculateExtraDiscount();
    // this.calculateTotal();
    this.checkAndApplyPackages();
    this.calculateExtraDiscount();
    this.calculateTotal();
  }

  calculateExtraDiscount() {
    let toGvDiscAmt = 0;
    if (this.discountAmount > 0) {
      toGvDiscAmt = this.discountAmount;
    }
    if (this.discountPercentage > 0) {
      toGvDiscAmt = this.total.total * (+this.discountPercentage / 100);
    }
    else if (this.couponDiscountAmount > 0) {
      toGvDiscAmt = this.total.total * (+this.couponDiscountAmount / 100)
    }
    else if (!!this.selectedNonGenPkg) {
      toGvDiscAmt = 0
    }
    else if (this.isAppliedDynFxDis) {
      let discAmt = 0;
      this.cartProducts.forEach((pro) => {
        if(pro.detail.instant_discount_percent > 0){
          discAmt += ((pro.detail.selling_price - pro.detail.sellingPriceForInstantDisc) * pro.qty);
        }
      });
      toGvDiscAmt = discAmt;
    }
    if (toGvDiscAmt > 0) {
      this.actualDiscountAmount = toGvDiscAmt;
    }
    else {
      this.actualDiscountAmount = 0;
    }
    this.actualDiscountPer = (this.total.grand == 0) ? 0 : this.actualDiscountAmount * (100 / this.total.grand);
  }

  customDiscountToggle(amountChanged) {
    if (amountChanged) {
      this.discountPercentage = null;
    }
    else {
      this.discountAmount = null;
    }
  }

  updateCustomDiscout(isApply) {
    if (isApply) {
      this.selectedNonGenPkg = 0;
      this.coupon = null;
      this.customDisActive = true;
      this.calculateTotal();
      this.reEvaluatePackage();
    }
    else {
      this.discountPercentage = null;
      this.discountAmount = null;
      this.customDisActive = false
      this.calculateTotal();
      this.reEvaluatePackage();
    }
    this.reEvaluatePackage();
  }

  applyCoupon() {
    let discountper = parseFloat(this.coupon['discount_percentage']);
    let discountamount = parseFloat(this.coupon['uptomax_amount']);
    let minordervalue = parseFloat(this.coupon['minordervalue']);

    if (this.total.total < minordervalue) return;
    let cal = (discountper * this.total.total) / 100;
    if (cal > discountamount) this.couponDiscountAmount = discountamount;
    else this.couponDiscountAmount = cal;

    this.calculateTotal();
  }

  alterCoupon(isApply) {
    if (isApply) {
      this.appliedCoupon = this.coupon;
    }
    else {
      this.appliedCoupon = "";
      this.coupon = "";
    }
  }

  calculateTotal() {
    this.total = {
      total: 0,
      cgst: 0,
      sgst: 0,
      discount: 0,
      cdiscount: this.cdiscountamount,
      extraDisc: 0,
      coupon: this.coupon,
      grand: 0,
      grandAfterWallet: 0,
      totalQty: 0,
      instant_discount: 0,
      land_discount: 0,
      product_discount: 0,
      copartner_discount: 0
      // withDiscountPriceTotal : 0,
      // // withDiscountCopartnertPriceTotal : 0,
      // withDiscountLandTotal : 0,
      // withDiscountProductTotal : 0,
      // withoutDiscountPriceTotal : 0,
      // withoutDiscountCopartnertPriceTotal : 0,
      // withoutDiscountLandTotal : 0,
      // withoutDiscountProductTotal : 0,
      // totalDiscount : 0,
    };

    let totalTaxPercent = 0;
    let totalTaxAmount = 0;
    let preTaxAmount = 0;
    // let cgstPer = 0;
    // let sgstPer = 0;
    let sgstAmtItem = 0;
    let cgstAmtItem = 0;
    let targetSPforCalc = 0;
    const membershipPlan = this.customer?.idmembership_plan;
    this.cartProducts.forEach((pro) => {
      // totalTaxPercent = parseFloat(pro.cgst) + parseFloat(pro.sgst);
      totalTaxPercent = pro.sgst;
      targetSPforCalc = pro.selling_price;

      if (pro.totSelling_price && pro.totSelling_price > 0) {
        targetSPforCalc = pro.totSelling_price / pro.qty;
      }

      if (this.actualDiscountPer > 0) {
        if (this.isAppliedDynFxDis) {
          pro.postDiscountPrice = pro.detail.sellingPriceForInstantDisc;
        }
        else{
          // pro.postDiscountPrice = targetSPforCalc - (targetSPforCalc * this.actualDiscountPer / 100);
        }    
        this.total.extraDisc = this.actualDiscountAmount;
      }
      else {
        pro.postDiscountPrice = targetSPforCalc;
        this.total.extraDisc = 0;
      }

      if (totalTaxPercent > 0) {
        preTaxAmount = pro.postDiscountPrice / ((totalTaxPercent + 100) / 100);
        totalTaxAmount = pro.postDiscountPrice - preTaxAmount;
        // cgstPer = (pro.cgst * 100) / totalTaxPercent;
        // sgstPer = (pro.sgst * 100) / totalTaxPercent;
        sgstAmtItem = (preTaxAmount * pro.sgst) / 100;
        cgstAmtItem = (preTaxAmount * pro.cgst) / 100;
      }

      pro.sgstAmt = sgstAmtItem;
      pro.cgstAmt = cgstAmtItem;
      
      pro['instant_discount'] = (pro?.detail?.mrp || 0);
      pro['copartner_discount'] = (pro?.detail?.copartner || 0);
      pro['land_discount'] = (pro?.detail?.land || 0);
      pro['product_discount'] = (pro?.detail?.product || 0);

      pro['withDiscountPrice'] = (pro['instant_discount'] > 0) ? Number((pro?.detail?.mrp - Number((pro?.detail?.selling_price * pro?.detail?.qty))) || 0) : Number(pro?.detail?.selling_price);
      pro['withDiscountCopartnertPrice'] = Number(pro?.detail?.copartner)
      pro['withDiscountLand'] = Number(pro?.detail?.land);
      pro['withDiscountProduct'] = Number(pro?.detail?.product);
      this.total.cgst += sgstAmtItem * pro.qty;
      
      this.total.sgst += sgstAmtItem * pro.qty;
      this.total.total += pro.mrp * pro.qty;
      
      // this.total.discount = this.total.discount + (pro.mrp - pro.selling_price) * pro.qty;
      this.total.discount =(this.customer?.idmembership_plan == 2 ? this.total.discount + (pro.mrp - pro.product_discount) * pro.qty : 
        this.customer?.idmembership_plan == 3 ? this.total.discount + (pro.mrp - pro.land_discount) * pro.qty : 
        this.customer?.idmembership_plan == 4 ? this.total.discount + (pro.mrp - pro.copartner_discount) * pro.qty : 
        this.total.discount + (pro.mrp - pro.selling_price) * pro.qty) || 0
       
        switch (membershipPlan) {
          case 2:
            this.total.product_discount = this.total.discount || 0;
            break;
          case 3:
            this.total.land_discount = this.total.discount || 0;
            break;
          case 4:
            this.total.copartner_discount = this.total.discount || 0;
            break;
          default:
            this.total.instant_discount = this.total.discount || 0;
            break;
        }
      // this.total.grand += pro.postDiscountPrice * pro.qty;
      this.total.grand = (this.customer?.idmembership_plan == 2 ? this.total.total : 
      this.customer?.idmembership_plan == 3 ? this.total.total: 
      this.customer?.idmembership_plan == 4 ? this.total.total: 
      this.total.grand + pro.postDiscountPrice * pro.qty) || 0

      this.total.totalQty += pro.qty;
    });

    let pkgTotAmt = 0;
    let pkgGst = 0;
    this.tagProdsCart.forEach((pkg) => {

      pkgGst = (pkg.products.length > 0) ? (pkg.products[0].cgst + pkg.products[0].sgst) : 0;
      pkgTotAmt = pkg.amount;

      if (pkgGst > 0) {
        preTaxAmount = pkg.amount / ((pkgGst + 100) / 100);
        totalTaxAmount = pkg.amount - preTaxAmount;
        // cgstPer = (pkg.products[0].cgst * 100) / pkgGst;
        // sgstPer = (pkg.products[0].sgst * 100) / pkgGst;
        sgstAmtItem = (preTaxAmount * pkg.products[0].sgst) / 100;
        cgstAmtItem = (preTaxAmount * pkg.products[0].cgst) / 100;
      }
      this.total.cgst += cgstAmtItem;
      this.total.sgst += sgstAmtItem;
      this.total.total += pkgTotAmt;
      this.total.discount += 0;
      this.total.grand += pkgTotAmt;
      this.total.totalQty += 0;
    });
    this.total.discount =
      this.total.discount + (this.cdiscountamount + this.couponDiscountAmount);
    this.total.grand =
      this.total.grand - (this.cdiscountamount + this.couponDiscountAmount + this.total.extraDisc);
    if(this.isUseRedeemWallet && this.customer.redeemWallet > 0){
      if((this.total.grand - this.customer.redeemWallet) < 0){
        this.total.grandAfterWallet = 0;
      }
      else{
        this.total.grandAfterWallet = this.total.grand - this.customer.redeemWallet;
      }
    } 
  }

  applyProductPackage(pkg) {
    let chkTrigProdRes = this.checkTriggerItemPresent(pkg);
    if (chkTrigProdRes.allTriggerItemPresent) {
      this.addTaggedItems(pkg, chkTrigProdRes.tagProdsAvlCart);
    }
  }
  applyAmountPackage(currGTotal, pkg) {
    if (currGTotal >= pkg['base_trigger_amount']) {
      this.addTaggedItems(pkg, []);
    }
  }
  applyQuantityPackage(pro, pkg) {
    if (pro.idproduct_master == pkg.trigger_prod[0].idproduct_master) {
      
      if (pro.qty > pkg.trigger_prod[0].package_item_qty) {
        let totQtyAtBSP = pkg.trigger_prod[0].package_item_qty;
        let totQtyAtATM = pro.qty - pkg.trigger_prod[0].package_item_qty;
        let totalSellingPrice = 0;

        if (!!pkg.base_trigger_amount) {
          totalSellingPrice += totQtyAtBSP * pkg.base_trigger_amount;
        }
        else {
          totalSellingPrice += totQtyAtBSP * pro.selling_price;
        }

        if (!!pkg.additional_tag_amount) {
          totalSellingPrice += totQtyAtATM * pkg.additional_tag_amount;
        }
        else {
          totalSellingPrice += totQtyAtATM * pro.selling_price;
        }
        pro.totSelling_price = totalSellingPrice;
      }
      else {
        if (pro.qty <= pkg.trigger_prod[0].package_item_qty && !!pkg.base_trigger_amount) {
          pro.totSelling_price = pro.qty * pkg.base_trigger_amount;
        }
        else {
          pro.totSelling_price = pro.qty * pro.selling_price;
        }
      }
      pro.description = 'First ' + `${pkg.trigger_prod[0].package_item_qty}` + ' Qty at ' + ((!!pkg.base_trigger_amount) ? pkg.base_trigger_amount : pro.selling_price) + ' then at ' + ((!!pkg.additional_tag_amount) ? pkg.additional_tag_amount : pro.selling_price);
      pro.quantityPkg = pkg['idpackage'];
    }
  }
  applyAllPackages(pro, pkg) {
    let currGTotal = this.total.grand;
    if (pkg['idpackage_master'] == AppSetting.PKGMASTER.Product) {
      this.applyProductPackage(pkg)
    }
    if (pkg['idpackage_master'] == AppSetting.PKGMASTER.Amount) {
      this.applyAmountPackage(currGTotal, pkg)
    }
    if (pkg['idpackage_master'] == AppSetting.PKGMASTER.Quantity) {
      this.applyQuantityPackage(pro, pkg)
    }
  }
  checkAndApplyPackages() {
    this.activePkgList = [];
    this.tagProdsCart = [];
    this.cartProducts.forEach((pro) => {
      if (this.customerLogged && this.customer.idmembership_plan > 1) {
        //user is member
        this.genMemPkg.forEach(pkg => {
          this.calculateTotal();
          this.applyAllPackages(pro, pkg);
        })
      }
      else {
        //apply general
        //apply open discount
        this.genOpenPkg.forEach(pkg => {
          this.calculateTotal();
          this.applyAllPackages(pro, pkg);
        })
      }
      if (!!this.selectedNonGenPkg && this.selectedNonGenPkg.idpackage > 0) {
        this.applyAllPackages(pro, this.selectedNonGenPkg);
      }
    });
  }

  addTaggedItems(pkg, tagProdsAvlCart) {
    if (this.activePkgList.includes(pkg['idpackage_master'])) {
      return
    }
    this.activePkgList.push(pkg['idpackage_master'])
    let tagProds: any = [];
    let totalTagQtyAmt;
    let totalTagQty = tagProdsAvlCart.length > 0 ? Math.min(...tagProdsAvlCart) : 1;
    pkg['tagged_prod'].forEach(taProd => {
      if (pkg['additional_tag_amount'] == 0) {
        totalTagQtyAmt = 0;
      }
      else {
        totalTagQtyAmt = pkg['additional_tag_amount'] * totalTagQty;
      }
      tagProds.push({
        ...taProd,
        quantityToDeliver: taProd.package_item_qty * totalTagQty,
      });//add these tag products into a cart
    });
    this.tagProdsCart.push({
      'amount': totalTagQtyAmt,
      'products': tagProds,
      'pkg': pkg['idpackage_master']
    });

    
  }

  checkTriggerItemPresent(pkg) {
    let allTriggerItemPresent = false;
    let trigProd = [];
    let tagProdsAvlCart: any = [];

    pkg['trigger_prod'].forEach(tProd => {
      trigProd["p-" + tProd.idproduct_master] = tProd.package_item_qty;//all trigger prod
    });
    for (var key in trigProd) { //check if all trig prod present with qty
      if (this.cartItems[key] && this.cartItems[key].qty >= trigProd[key]) {
        if (pkg['frequency'] > 1) {
          tagProdsAvlCart.push(Math.floor(this.cartItems[key].qty / trigProd[key]));
        }
        allTriggerItemPresent = true;
      }
      else {
        allTriggerItemPresent = false;
        break;
      }
    }
    return { allTriggerItemPresent: allTriggerItemPresent, tagProdsAvlCart: tagProdsAvlCart };
  }

  getAvlQty(product) {
    return product.quantity > 0 ? '99+' : product.quantity;
  }

  login() {
    // const dialogData = new CustomerLoginRegisterComponent("Confirm Action", message);
    if (this.contact.length == 10 && !isNaN(+this.contact)) {
      const dialogRef = this.dialog.open(CustomerLoginRegisterComponent, {
        maxWidth: '600px',
        data: { contact: this.contact, type: 'login' },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.customer = result;
          this.customerLogged = true;
          this.calculateTotal();
        }
      });
      return true;
    } else {
      this.alertService.openSnackBar('Invalid contact number.');
      return false;
    }
  }

  holdOrder() {
    this.loading = true;
    let dialogRef = this.dialog.open(ConfirmOrderComponent, {
      data: { message: "Are you sure to Hold this order?", title: "Hold Order" }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let req = {
          counter: this.authSer.currentUserValue.counter_detail[0].idcounter,
          coupon: this.total.coupon ? this.total.coupon : '',
          contact: this.contact ? this.contact : '',
          customer: this.customer,
          order_det: this.cartProducts,
          total: this.total,
          activeNonGenPkg: this.selectedNonGenPkg,
          discountAmt: this.discountAmount,
          discountPer: this.discountPercentage,
          taggedProds: this.tagProdsCart
        };

        this.ordServ.holdOrder(req).subscribe(
          (data) => {
            // 
            this.cartServ.addHoldOrder().then((res) => {
              this.cartServ.empty();
              this.total = {
                total: 0,
                cgst: 0,
                sgst: 0,
                discount: 0,
                cdiscount: 0,
                extraDisc: 0,
                coupon: 0,
                grand: 0,
                grandAfterWallet: 0,
                totalQty: 0,
                instant_discount: 0,
                land_discount: 0,
                product_discount: 0,
                copartner_discount: 0
                // // withDiscountPriceTotal : 0,
                // // // withDiscountCopartnertPriceTotal : 0,
                // // withDiscountLandTotal : 0,
                // // withDiscountProductTotal : 0,
                // // withoutDiscountPriceTotal : 0,
                // // withoutDiscountCopartnertPriceTotal : 0,
                // // withoutDiscountLandTotal : 0,
                // // withoutDiscountProductTotal : 0,
                // totalDiscount : 0,
              };
              this.cartItems = [];
              this.cartProducts = [];
              this.cartEmpty = false;
              this.isUseRedeemWallet = false;
              this.search = '';
              this.alertService.openSnackBar(
                'Order kept on HOLD. Products will not be reserved.'
              );
              this.logOutCustomer();
            });
          },
          (error) => {
            this.alertService.error(error);
            this.loading = false;
          }
        );
      }
    });

  }

  prepareOrder(){
    if(this.paymentMode == 'Cash'){
      this.cashtTranDetail = [];
      let dialogRef = this.dialog.open(CashDrawerTransactionComponent, {
        width: '80%',
        data: { total: this.total }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if(result.ret){
          console.log(result.ret)
          this.cashtTranDetail = result.ret;
          this.placeOrder();
        }
      });
    }
    else{
      this.placeOrder();
    }
  }

  placeOrder() {
    let dialogRef = this.dialog.open(ConfirmOrderComponent, {
      data: { message: "Are you sure to continue payment process?", title: "Place Order" }
    });
    
    dialogRef.afterClosed().subscribe((result) => {
      console.log("result",result);
      
      if (result) {
        this.loading = true;
        let req = {

          counter: this.authSer.currentUserValue.counter_detail[0].idcounter,
          coupon: this.coupon ? this.coupon : '',
          contact: this.contact ? this.contact : '',
          customer: this.customer,
          order_det: this.cartProducts,
          total: this.total,
          activeNonGenPkg: this.selectedNonGenPkg,
          discountAmt: this.discountAmount,
          discountPer: this.discountPercentage,
          taggedProds: this.tagProdsCart,
          isAppliedDynFxDis: this.isAppliedDynFxDis,
          paymentMode: this.paymentMode,
          payRef: this.payRef,
          redeemWallet: this.isUseRedeemWallet,
          cashtTranDetail: this.cashtTranDetail
        };
        // this.loading = true;
        this.alertService.openSnackBar('Placing order please wait for some time');
        this.ordServ.placeOrder(req).subscribe(
          (data) => {
            this.loading = false;
            if (data.message == 'Success') {
              this.cartServ.empty();
              this.total = {
                total: 0,
                cgst: 0,
                sgst: 0,
                discount: 0,
                cdiscount: 0,
                extraDisc: 0,
                coupon: 0,
                grand: 0,
                grandAfterWallet: 0,
                totalQty: 0,
                instant_discount: 0,
                land_discount: 0,
                product_discount: 0,
                copartner_discount: 0
                // withDiscountPriceTotal : 0,
                // // withDiscountCopartnertPriceTotal : 0,
                // withDiscountLandTotal : 0,
                // withDiscountProductTotal : 0,
                // withoutDiscountPriceTotal : 0,
                // withoutDiscountCopartnertPriceTotal : 0,
                // withoutDiscountLandTotal : 0,
                // withoutDiscountProductTotal : 0,
                // totalDiscount : 0,
              };
              this.products = [];
              this.cartItems = [];
              this.cartProducts = [];
              this.cartEmpty = false;
              this.isUseRedeemWallet = false;
              this.search = '';
              this.alertService.openSnackBar('Order Placed.');
              this.discountAmount = null;
              this.getProducts('1');
              this.logOutCustomer();
              this.openReceipt(data.data);
            } else {
              this.alertService.openSnackBar(data.message);
            }
          },
          (error) => {
            this.alertService.error(error);
            this.loading = false;
          }
        );
      }
    });
  }

  openReceipt(req) {
    // const dialogRef = this.dialog.open(ReciptComponent, {
    //   width: '80%',
    //   data: { data: req }
    // });
    // dialogRef.afterClosed().subscribe(result => {

    // });
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`${AppSetting.UI_SUBPATH}/pos/recipt/${req}`])
    );
    window.open(url, '_blank');
  }

  ngOnDestroy() {
    this.cartServ.empty();
  }
  logOutCustomer() {
    this.customer = {
      idcustomer: 0,
      name: '',
      email: '',
      wallet_balance: 0,
      idmembership_plan: 0,
      address: "",
      commission: 0,
      instant_discount: 0,
      membership_type: "",
      contact: "",
      status: 0,
      redeemWallet: 0
    };
    this.customerLogged = false;
    this.selectedNonGenPkg = 0;
    this.customDisActive = false;
    this.contact = "";
    this.payRef = "";
    this.paymentMode = 'Cash';
    this.payRefEnable = false;
  }
  openPackageSelect() {
    let pkg = (this.customerLogged && this.customer.idmembership_plan > 1) ? this.memPkg : this.openPkg;
    const dialogRef = this.dialog.open(SelectPackageComponent, {
      width: '80%',
      data: { data: pkg }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.package) {
        
        this.selectedNonGenPkg = result.package;
        this.discountAmount = null
        this.discountPercentage = null
        this.coupon = null
        this.reEvaluatePackage()
      }
    });
  }
  removeSelNonGenPkg() {
    this.selectedNonGenPkg = 0;
    this.reEvaluatePackage();
  }
  applyNonGenPkg() {
    if (!this.selectedNonGenPkg.idpackage) {
      return false;
    }

    return true;
  }
  modDynamicFixedDiscount(isApply) {
    this.isAppliedDynFxDis = (isApply) ? true : false;
    this.reEvaluatePackage();
  }
  logout() {
    this.logOutCustomer();
    this.reEvaluatePackage();
  }
  openPopReceipt() {
    if (this.mywindow) {
      this.mywindow.close();
    }
    this.mywindow = window.open(this.router['location']._platformLocation.location.origin, "_blank", "resizable=no, toolbar=no, scrollbars=no, menubar=no, status=no, directories=no, location=no, width=1000, height=600, left=0 top=100 ");
  }
  changePayMode() {
    if (this.paymentMode != 'Cash') {
      this.payRefEnable = true;
    }
    else {
      this.payRefEnable = false;
    }
  }
  openMembershipDialog(customer): void {
    const dialogRef = this.dialog.open(UpgradeMembershipComponent, {
      width: '20%',
      data: customer
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.login();
      }
    });
  }
  emptyCart(){
    this.cartServ.empty();
    this.total = {
      total: 0,
      cgst: 0,
      sgst: 0,
      discount: 0,
      cdiscount: 0,
      extraDisc: 0,
      coupon: 0,
      grand: 0,
      grandAfterWallet: 0,
      totalQty: 0,
      instant_discount: 0,
      land_discount: 0,
      product_discount: 0,
      copartner_discount: 0
    };
    this.products = [];
    this.cartItems = [];
    this.cartProducts = [];
    this.cartEmpty = false;
    this.search = '';
    this.isUseRedeemWallet = false;
    this.getProducts('1');
  }

  useRedeemWallet(){
    this.isUseRedeemWallet = true;
    this.alertService.openSnackBar("Redeem wallet active.");
    this.reEvaluatePackage();
  }

  dontUseRedeemWallet(){
    this.isUseRedeemWallet = false;
    this.reEvaluatePackage();
  }
}
