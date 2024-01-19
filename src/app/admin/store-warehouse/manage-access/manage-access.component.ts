import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { User } from 'src/app/shared/_model/user';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { StaffAccessComponent } from '../staff-access/staff-access.component';

@Component({
  selector: 'app-manage-access',
  templateUrl: './manage-access.component.html',
  styleUrls: ['./manage-access.component.scss']
})
export class ManageAccessComponent implements OnInit {

 
  displayedColumns: string[] = ['id', 'name', 'email', 'contact', 'action'];
  dataSource: MatTableDataSource<User>;
  UserData: [User];
  loading: boolean = false;
  sw;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apiService: ApiHttpService,
    private alertServ: AlertService,private router: Router,
    public dialog: MatDialog, private route: ActivatedRoute) {
      if (this.router.getCurrentNavigation()!.extras.state) {
        this.sw = this.router.getCurrentNavigation()!.extras.state!.data;
        console.log(this.sw);
      }
      else {
        this.router.navigate(['/ggb-admin'])
      }
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
    this.apiService.get(AppSetting.ENDPOINTS.staffBySW + `/${this.sw.idstore_warehouse}`)
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

  addUser()
  {
    const dialogRef = this.dialog.open(StaffAccessComponent, {
      width: '80%',
      data: { data: this.sw }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.manual == false) {
        this.getUsers();
        this.alertServ.openSnackBar("Sucessfully Updated User Access" , "OK");
      }
    });
  }
  remove(item){
    this.loading = true;
    this.apiService.delete(AppSetting.ENDPOINTS.staffAccess + `/${item.idstaff_access}`)
      .subscribe(
        data => {
          this.loading = false;
          this.getUsers();
          this.alertServ.openSnackBar("Access Removed.");
        },
        error => {
          this.alertServ.openSnackBar(error);
          this.loading = false;
        });
  }
}
