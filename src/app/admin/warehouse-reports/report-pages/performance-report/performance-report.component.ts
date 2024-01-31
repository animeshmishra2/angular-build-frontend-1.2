import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/shared/_service/exports/excel.service';
import { ReportApiService } from 'src/app/shared/_service/report-apis/report-api.service';

@Component({
  selector: 'app-performance-report',
  templateUrl: './performance-report.component.html',
  styleUrls: ['./performance-report.component.scss']
})
export class PerformanceReportComponent implements OnInit {
  users = [
    {
      name: 'User 1',
      email: 'user1@example.com',
      profileImage: 'assets/icons/best-vendor.jpg',
      backgroundColor: '#ffcccb',
    },
    {
      name: 'User 2',
      email: 'user2@example.com',
      profileImage: 'assets/icons/best-vendor.jpg',
      backgroundColor: '#a5d8e1',
    },
    {
      name: 'User 3',
      email: 'user3@example.com',
      profileImage: 'assets/icons/best-vendor.jpg',
      backgroundColor: '#ffd700',
    },
  ];

  constructor(private apiService: ReportApiService, private spinner: NgxSpinnerService, private excelService: ExcelService) { }
bestVendor:any;
worstVendor:any;
yearGrowth:any;
  ngOnInit(): void {
this.performanceReport()
    
  }
performanceReport(){
  this.spinner.show()
  this.apiService.getPerformanceReport().subscribe(
    (response) => {
      this.spinner.hide();
console.log(response)
this.bestVendor=response?.data?.get_best_seller
this.worstVendor=response?.data?.get_worst_seller
this.yearGrowth=response?.data?.get_year_over_year_growth
    },
    (error) => {
      console.error('Error fetching Product Report:', error);
  })
}
}
