import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { StoreWare } from 'src/app/shared/_model/store-ware';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { AuthenticationService } from 'src/app/shared/_service/authentication.service';
import { StoreWareService } from 'src/app/shared/_service/store-ware.service';
@Component({
  selector: 'app-add-edit-banner',
  templateUrl: './add-edit-banner.component.html',
  styleUrls: ['./add-edit-banner.component.scss']
})
export class AddEditBannerComponent implements OnInit {

  row: any;
  env = 'https://allwinmedico.in/ggb-api/public/banners/main-banner/';
  loading: boolean = false;
  selectedFile: any[] = [];
  fileSizeError = false;
  lForm = new FormGroup({
    title: new FormControl('', [
      Validators.required
    ]),
    subtitle: new FormControl('', [
      Validators.required
    ]),
    link: new FormControl('', [
      Validators.required
    ]),
    bannertype: new FormControl('', [
      Validators.required
    ]),
    typelist: new FormControl('', [
      Validators.required
    ]),
    position: new FormControl('', [
      Validators.required
    ]),
  });
  bannerTypes: any;
  typelist: any[];
  imageUrl: any;

  constructor(public dialogRef: MatDialogRef<AddEditBannerComponent>,
    private alertService: AlertService,
    private storeWareServ: StoreWareService,
    private apiServ: ApiHttpService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.row = data.data;
    console.log("roww", this.row);

    if (this.row?.id) {
      this.lForm.controls["title"].setValue(this.row.title);
      this.lForm.controls["subtitle"].setValue(this.row.sub_title);
      this.lForm.controls["link"].setValue(this.row.link);
      this.lForm.controls["bannertype"].setValue(this.row?.banner_type);
      this.lForm.controls["typelist"].setValue(this.row?.type_id);
      this.lForm.controls["position"].setValue(this.row?.position);
      this.typeList(this.row?.banner_type);
      this.selectedFile = this.row?.image;
      this.imageUrl = this.row?.image.toString();
    }
  }

  ngOnInit(): void {
    this.getBannerType();
    this.lForm.get('bannertype')?.valueChanges.subscribe((selectedStateId) => {
      if (selectedStateId) {
        this.lForm.controls["link"].setValue(this.row.link);
        this.typeList(selectedStateId); // Call method to fetch cities based on selected state
      } else {
        this.typelist = []; // Reset cities list if state is not selected
      }
    });
    this.lForm.get('typelist')?.valueChanges.subscribe((type) => {
      if (type) {
        

        const fIndex = this.bannerTypes?.findIndex((data: any) => data?.id === this.lForm.get('bannertype')!.value);
        const typeName = fIndex >= 0 ? this.bannerTypes[fIndex]?.name : '';

        const fIndex2 = this.typelist?.findIndex((data: any) => data?.id === this.lForm.get('typelist')!.value);
        const typeName2 = fIndex2 >= 0 ? this.typelist[fIndex2]?.name : '';

        this.lForm.controls["link"].setValue(`${AppSetting.API_ENDPOINT}/${typeName}/${typeName2}/${this.lForm.get('bannertype')!.value}/${this.lForm.get('typelist')!.value}`);

      }
    });
  }


  onSubmit() {
    // stop here if form is invalid
    if (this.lForm.invalid) {
      return;
    }

    const fIndex = this.bannerTypes?.findIndex((data: any) => data?.id === this.lForm.get('bannertype')!.value);
    const typeName = fIndex >= 0 ? this.bannerTypes[fIndex]?.name[0] : '';

    this.loading = true;
    const fd = new FormData();
    fd.append('title', this.lForm.get('title')!.value);
    fd.append('sub_title', this.lForm.get('subtitle')!.value);
    fd.append('link', this.lForm.get('link')!.value);
    fd.append('banner_type', this.lForm.get('bannertype')!.value);
    fd.append('type', typeName.toUpperCase());
    fd.append('type_id', this.lForm.get('typelist')!.value);
    fd.append('position', this.lForm.get('position')!.value);
    // if (this.selectedFile?.length > 0) fd.append('image', JSON.stringify(this.selectedFile));
    for (let index = 0; index < this.selectedFile.length; index++) {
      fd.append('images', this.selectedFile[index]);
    }

    if (this.row.id) {
      fd.append('banner_id', this.row.id);
      this.storeWareServ.updateBanner(fd).subscribe((data: any) => {
        this.cancel(false);
        this.alertService.openSnackBar("Sucessfully Updated Banner");
      },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        });
    } else {
      this.storeWareServ.createBanner(fd).subscribe((data: any) => {
        this.cancel(false);
        this.alertService.openSnackBar("Sucessfully Created Banner");
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
  getBannerType() {
    this.loading = true;
    this.apiServ.newget(AppSetting.ENDPOINTS.getBannertype)
      .subscribe(
        data => {
          this.bannerTypes = data;
          this.loading = false;
        },
        error => {
          this.alertService.openSnackBar(error);
          this.loading = false;
        });

  }

  typeList(id) {
    // const id = this.lForm.get(this.row.state);
    this.apiServ.newget(AppSetting.ENDPOINTS.getType + "/" + id)
      .subscribe(
        data => this.typelist = data
      );
  }

  onFileSelected(event: any, imageFor: string) {
    event?.addedFiles.forEach(element => {
      console.log('element: ', element);
      // if (element?.size < (4 * 1024 * 1024)) {
      this.selectedFile.push(element);
      // }
    });
  }
}
