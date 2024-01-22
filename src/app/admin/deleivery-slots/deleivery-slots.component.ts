import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreWare } from 'src/app/shared/_model/store-ware';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { BannerOfferService } from 'src/app/shared/_service/banners-offers.service';
import { AddEditSlotsComponent } from './add-edit-slots/add-edit-slots.component';

@Component({
  selector: 'app-deleivery-slots',
  templateUrl: './deleivery-slots.component.html',
  styleUrls: ['./deleivery-slots.component.scss']
})
export class DeleiverySlotsComponent implements OnInit {

 
displayedColumns: string[] = ['date', 'availableslot', 'maxoreder', 'slot_time_start' , 'slot_time_end', 'action'];
dataSource: MatTableDataSource<StoreWare>;
storeWareData: [StoreWare];
loading: boolean = false;
@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;
isStore: boolean;

constructor(private bannerofferServ: BannerOfferService, private alertServ: AlertService, private router: Router,
  public dialog: MatDialog, private route: ActivatedRoute) {
}

ngOnInit(): void {
  this.getDeleiverySlots();
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

getDeleiverySlots() {
  this.loading = true;
  this.bannerofferServ.getDeleiverySlots().subscribe(data => {
    this.storeWareData = data;
    this.dataSource = new MatTableDataSource(this.storeWareData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loading = false;
  }, error => {
    this.alertServ.error(error);
    this.loading = false;
  });
}

deleteItem(row) {
  this.bannerofferServ.deleteSlots(row?.iddelivery_slots).subscribe((data: any) => {
    // this.cancel(false);
    this.getDeleiverySlots();
  }, (error) => {
    this.alertServ.error(error);
    this.loading = false;
  });
}

editItem(row) {
  row['is_store'] = this.isStore;
  const dialogRef = this.dialog.open(AddEditSlotsComponent, {
    width: '80%',
    data: { data: row }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result && result.manual == false) {
      this.getDeleiverySlots();
      // this.alertServ.openSnackBar("Sucessfully Updated " + ((this.isStore) ? 'Store' : 'Warehouse'), "OK");
    }
  });
}
}
