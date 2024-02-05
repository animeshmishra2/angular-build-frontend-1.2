export class AppSetting {

    //local setting
    // public static API_ENDPOINT = "http://127.0.0.1:8000";
    // public static UI_SUBPATH = "";

    // Server setting
    public static API_ENDPOINT = "https://allwinmedico.in/ggb-api/public";
    public static UI_SUBPATH = "/";
    

    public static ENDPOINTS = {
      "getPackageList": "/api/package",
      "createPackage": "/api/package",
      "updatePackage" : "/api/package",
      "getProdByBarcode" : "/api/findByBarcode",
      "getActivePackage" : "/api/active-package",
      "getOrderDetailsById" : "/api/get-order-detail",
      "counterOrders" : "/api/counter-orders",
      "vendor" : "/api/vendor",
      "brand" : "/api/brand",
      "category" : "/api/category",
      "subCategory" : "/api/sub-category",
      "productMaster" : "/api/product-master",
      "getProductMasterBatch" : "/api/find-product-by-wherehouse",
      "getSubCategoryByCatId" : "/api/get-sub-cats-by-catid",
      "getSSCategoryBySubCatId" : "/api/get-ss-cats-by-scatid",
      "subSubCategory" : "/api/sub-sub-category",
      "getProductMaster" : "/api/find-product-master",
      "staffBySW" : "/api/get-user-bysw",
      "staff" : "/api/staff",
      "staffAccess" : "/api/staff-access",
      "addStaffAccess" : "/api/add-staff-access",
      "storeVendorPurchasesDetail" : "/api/add-vendor-bill",
      "updateVendorPurchasesDetail" : "/api/update-vendor-bill/",
      "getVendorBills" : "/api/get-bills",
      "getVendorBillDetail" : "/api/get-bills-details",
      "allStoreRequestGetDirect" : "/api/get-direct-transfer-request",
      "allStoreRequest" : "/api/all-store-request",
      "allSWExceptMine" : "/api/get-allother-sw",
      "createReqReq" : "/api/create-req-req",
      "reviewReqReq" : "/api/review-req-req",
      "acceptReqReq" : "/api/accept-req-req",
      "getReqRequestDetail" : "/api/get-req-req-detail",
      "cancelOrder" : "/api/cancel-order",
      "getcities" : "/api/cities",
      "getState":"/api/states",
      "getStoreType" : "/api/store-type",
      "updateInventorySP" : "/api/update-inventory-sp",
      // "getState" : "/api/states",
      "getCity" : "/api/cities",
      "storeinventory" : "/api/storeInventory",
      "getBatch": "/api/fetch-batch",
      "getVendorPurchaseBills" : "/api/get-purchase",
      "billWiseTransfer": "/api/bill-wise-transfer",
      "inventoryTresholdProduct": "/api/get_inventory_threshold_products",
      "autoTransferSave": '/api/auto-stock-transfer',
      "getBillrequestList":'/api/get-billwise-transfer-request',
      "getAutotransferDetails":'/api/get-auto-transfer-request-detail',
      "getAutorequestList":'/api/get-auto-transfer-request',
      "getDirecttransferDetails":'/api/get-direct-transfer-request-detail',
      "getbilWisetransferDetails":'/api/get-billwise-transfer-request-detail',
      "getBatchBillwise": "/api/fetch-bill-wise-batch",
      "getCounterDetail": "/api/get-counter-det",
      "getBannertype": "/api/banner-type",
      "getType":"/api/banner-cat",
      "getThresholdProduct":"/api/inventory-threshold-products",
      "getonlineOrders" : "/api/online-order-data",
      "getupdateDiscount" : "/api/discount/update-package",
      "showactive" : "/api/discount/show-active",
    }
    public static PKGMASTER = {
        'Product': 1,
        'Amount': 2,
        'Quantity': 3,
        'Rate Slab': 4
    }

  public static PKG_APPLICABLE_ON = {
    Member: 'M',
    NonMember: 'N',
    AllOpen: 'BOTH',
  };
}
