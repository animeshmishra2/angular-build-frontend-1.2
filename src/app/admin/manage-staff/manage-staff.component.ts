import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { User } from 'src/app/shared/_model/user';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { AddEditStaffComponent } from './add-edit-staff/add-edit-staff.component';
import { StaffAccessComponent } from '../store-warehouse/staff-access/staff-access.component';

@Component({
  selector: 'app-manage-staff',
  templateUrl: './manage-staff.component.html',
  styleUrls: ['./manage-staff.component.scss']
})
export class ManageStaffComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'email', 'contact', 'action'];
  dataSource: MatTableDataSource<User>;
  UserData: [User];
  loading: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apiService: ApiHttpService,
    private alertServ: AlertService,
    public dialog: MatDialog, private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.getUsers();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getUsers() {
    this.loading = true;
    this.apiService.get(AppSetting.ENDPOINTS.staff)
      .subscribe(
        data => {
          this.UserData = data;
          this.dataSource = new MatTableDataSource(this.UserData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.loading = false;
        },
        error => {
          this.alertServ.error(error);
          this.loading = false;
        });
  }
  editItem(row) {
    const dialogRef = this.dialog.open(AddEditStaffComponent, {
      width: '80%',
      data: { data: row }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.manual == false) {
        this.getUsers();
        this.alertServ.openSnackBar("Sucessfully Updated User" , "OK");
      }
    });
  }

}
