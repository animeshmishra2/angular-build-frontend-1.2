import { Component, OnInit, ViewChild, Input, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AppSetting } from 'src/app/shared/_conf/app-setting';
import { AlertService } from 'src/app/shared/_service/alert.service';
import { ApiHttpService } from 'src/app/shared/_service/api-http.service';
import { SelectionModel } from '@angular/cdk/collections';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';



interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit  {
  // displayedColumns: string[] = ['id', 'name', 'email', 'contact'];
  @Input() DisplayedColumns: string[] = [];
  @Input() ApiEndPoint: string = '';
  @Input() ReportName: string = '';
  @Input() tableData: any[]
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  updatedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;
  // tableData: any[];
  loading: boolean = false;
  initialSelection = [];
  allowMultiSelect = true;
  selection?: any;
  exportColumns!: ExportColumn[];
  from_date: string;
  to_date: string;
  dateRange?: Date[];
  todayDate: Date = new Date();
  selectedColumns: ExportColumn[];
  cols!: ExportColumn[];
  selectedRecords?: any[];

  excelData: any
  renderer: any;

  constructor(
    private apiService: ApiHttpService,
    private alertServ: AlertService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.getData();

    // this.updatedColumns = ['select'].concat(this.DisplayedColumns);
    this.selection = new SelectionModel<any>(
      this.allowMultiSelect,
      this.initialSelection
    );
    this.exportColumns = this.DisplayedColumns.map((col) => ({
      title: col,
      dataKey: col,
    }));
    this.cols = this.exportColumns;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getData() {
    this.loading = true;
    let url=`${AppSetting.ENDPOINTS[this.ApiEndPoint]}?fromDate=2023-11-1&toDate=2023-11-30`
    this.apiService.get(url).subscribe(
      (data) => {
        this.tableData = data;
        console.log(this.tableData);
      },
      (error) => {
        this.alertServ.error(error);
        this.loading = false;
      }
    );
  }

  // editItem(row) {
  //   const dialogRef = this.dialog.open(AddEditComponent, {
  //     width: '80%',
  //     data: { data: row },
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result && result.manual == false) {
  //       this.getData();
  //       this.alertServ.openSnackBar('Sucessfully Updated User', 'OK');
  //     }
  //   });
  // }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  toggleAllRows() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }



    // Get the URL of the downloaded file
    // const excelFileUrl = window.URL.createObjectURL(blob);
    // this.excelFileUrl = excelFileUrl;
  // }

  exportPdf() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default('p', 'px', 'a4');
        (doc as any).autoTable(
          this.exportColumns,
          this.selectedRecords == undefined
            ? this.tableData
            : this.selectedRecords
        );
        doc.save(`${this.ReportName.split(' ')[0].toLowerCase()}_report`);
      });
    });
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.tableData);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, `${this.ReportName.split(' ')[0].toLowerCase()}_report`);
    });
  }

  tableFilter() {
    this.loading = true;
    let req = {
      valid_from: this.from_date
        ? moment(this.from_date).format('YYYY-MM-DD')
        : moment().subtract(30, 'days').format('YYYY-MM-DD'),
      valid_till: this.to_date
        ? moment(this.to_date).format('YYYY-MM-DD')
        : moment().add(1, 'days').format('YYYY-MM-DD'),
    };
    this.apiService.post(AppSetting.ENDPOINTS.counterOrders, req).subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource(data.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.from_date = req.valid_from;
        this.to_date = req.valid_till;
      },
      (error) => {
        this.alertService.openSnackBar(error);
        this.loading = false;
      }
    );
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
}
