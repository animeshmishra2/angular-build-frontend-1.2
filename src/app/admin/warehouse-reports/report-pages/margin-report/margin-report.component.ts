import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReportApiService } from 'src/app/shared/_service/report-apis/report-api.service';

@Component({
  selector: 'app-margin-report',
  templateUrl: './margin-report.component.html',
  styleUrls: ['./margin-report.component.scss'],
})
export class MarginReportComponent implements OnInit {
  tableData!: any[];
  
  constructor(private apiService: ReportApiService,private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.fetchProductReport();
  }

  fetchProductReport(): void {
    this.spinner.show();
    this.apiService.getProductReport().subscribe(
      (response) => {
        this.tableData = response.data
        this.spinner.hide();
      },
      (error) => {
        console.error('Error fetching Product Report:', error);
        this.spinner.hide();
      }
    );
  }
}
