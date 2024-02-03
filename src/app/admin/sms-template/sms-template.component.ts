import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreWare } from 'src/app/shared/_model/store-ware';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { BannerOfferService } from 'src/app/shared/_service/banners-offers.service';
import { AddEditSmsTemplateComponent } from './add-edit-sms-template/add-edit-sms-template.component';
@Component({
  selector: 'app-sms-template',
  templateUrl: './sms-template.component.html',
  styleUrls: ['./sms-template.component.scss']
})
export class SmsTemplateComponent implements OnInit {

  displayedColumns: string[] = ['title','orderamount','shipingcharge','updateby','action'];
  dataSource: MatTableDataSource<StoreWare>;
  storeWareData: [StoreWare];
  loading: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isStore: boolean;

  constructor(private bannerofferServ: BannerOfferService,
    private alertServ: AlertService, private router:Router,
    public dialog: MatDialog, private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.isStore = (this.route.snapshot.paramMap.get('type') === 'store') ? true : false;
    this.getSMSList();
  }

  getSMSList() {
    this.loading = true;
    this.bannerofferServ.getSMSList()
      .subscribe(
        data => {
          this.storeWareData = data;
          this.dataSource = new MatTableDataSource(this.storeWareData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.loading = false;
        },
        error => {
          this.alertServ.error(error);
          this.loading = false;
        });
  }
  deleteItem(row) {
    this.bannerofferServ.deleteSMS(row?.id).subscribe((data: any) => {
      this.getSMSList();
    },
      (error) => {
        this.alertServ.error(error);
        this.loading = false;
      });
  }
  editItem(row) { 
    row['is_store'] = this.isStore;
    const dialogRef = this.dialog.open(AddEditSmsTemplateComponent, {
      width: '80%',
      data: { data: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.manual == false) {
        this.getSMSList();
        // this.alertServ.openSnackBar("Sucessfully Updated " + ((this.isStore) ? 'Store' : 'Warehouse'), "OK");
      }
    });

  }


}
