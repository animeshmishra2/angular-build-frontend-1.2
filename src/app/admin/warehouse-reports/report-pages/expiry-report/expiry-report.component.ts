import { Component, OnInit } from '@angular/core';

export type Warehouse = {
  idstore_warehouse: number;
  name: string;
};

export type Store = {
  idstore_warehouse: number;
  name: string;
};

@Component({
  selector: 'app-expiry-report',
  templateUrl: './expiry-report.component.html',
  styleUrls: ['./expiry-report.component.scss'],
})
export class ExpiryReportComponent implements OnInit {
  data: any;
  options: any;
  pieData: any;
  pieOptions: any;
  stores!: Store[];
  warehouses!: Warehouse[];
  selectedStore?: any;
  selectedWarehouse?: Warehouse;
  stateOptions: any[] = [
    { label: 'Brand Wise', value: 'brand' },
    { label: 'Product Line Wise', value: 'productLine' },
    { label: 'Category Wise', value: 'category' },
    { label: 'Sub Category Wise', value: 'subCategory' },
  ];

  value: string = 'brand';

  constructor() {}

  ngOnInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.data = {
      labels: [
        'Cadbury',
        'Dharam Darshan',
        'Dharam Darshan',
        'Gayatri',
        'Gayatri',
        'Gayatri',
        'Sc Johnson',
        'Sc Johnson',
        'Johnson & Johnson',
        'Sc Johnson',
        'Johnson & Johnson',
        'Sc Johnson',
        'Sc Johnson',
        'Sc Johnson',
        'Johnson & Johnson',
        'Sc Johnson',
        'Johnson & Johnson',
        'Tata',
        'P&G',
        'P&G',
        'P&G',
        'P&G',
        'P&G',
        'P&G',
        'Ds Spiceco Pvt Ltd',
        'Ashok Griha Udyog Pvt.Ltd',
        'Ashok Griha Udyog Pvt.Ltd',
        'Ashok Griha Udyog Pvt.Ltd',
        'Ashok Griha Udyog Pvt.Ltd',
        'Ashok Griha Udyog Pvt.Ltd',
        'Ashok Griha Udyog Pvt.Ltd',
        'Ashok Griha Udyog Pvt.Ltd',
        'Ashok Griha Udyog Pvt.Ltd',
        'Ashok Griha Udyog Pvt.Ltd',
        'Ashok Griha Udyog Pvt.Ltd',
        'Ashok Griha Udyog Pvt.Ltd',
        'Ashok Griha Udyog Pvt.Ltd',
        'Ashok Griha Udyog Pvt.Ltd',
        'Ashok Griha Udyog Pvt.Ltd',
        'Ashok',
        'Ashok Griha Udyog Pvt.Ltd',
        'Ashok Griha Udyog Pvt.Ltd',
        'Ashok Griha Udyog Pvt.Ltd',
        'Ashok Griha Udyog Pvt.Ltd',
        'Ashok Griha Udyog Pvt.Ltd',
        'Ashok Griha Udyog Pvt.Ltd',
        'Ashok Griha Udyog Pvt.Ltd',
        'Catch',
        'Catch',
        'Ashok Griha Udyog Pvt.Ltd',
      ],
      datasets: [
        {
          type: 'bar',
          label: 'Expired',
          backgroundColor: '#cd5c5c',
          data: [
            50, 25, 12, 48, 90, 76, 42, 50, 25, 12, 48, 90, 76, 42, 50, 25, 12,
            48, 90, 76, 42, 50, 25, 12, 48, 90, 76, 42, 50, 25, 12, 48, 90, 76,
            42, 50, 25, 12, 48, 90, 76, 42, 50, 25, 12, 48, 90, 76, 42, 50, 25,
            12, 48, 90, 76, 42, 50, 25, 12, 48, 90, 76, 42, 50, 25, 12, 48, 90,
            76, 42, 50, 25, 12, 48, 90, 76, 42, 50, 25, 12, 48, 90, 76, 42, 50,
            25, 12, 48, 90, 76, 42, 50, 25, 12, 48, 90, 76, 42, 50, 25, 12, 48,
            90, 76, 42, 50, 25, 12, 48, 90, 76, 42, 50, 25, 12, 48, 90, 76, 42,
            50, 25, 12, 48, 90, 76, 42,
          ],
        },
        {
          type: 'bar',
          label: 'Expiring in 30 days',
          backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
          data: [
            25, 12, 48, 90, 76, 42, 50, 25, 12, 48, 90, 76, 42, 50, 25, 12, 48,
            90, 76, 42, 50, 25, 12, 48, 90, 76, 42, 50, 25, 12, 48, 90, 76, 42,
            50, 25, 12, 48, 90, 76, 42, 50, 25, 12, 48, 90, 76, 42, 50, 25, 12,
            48, 90, 76, 42, 50, 25, 12, 48, 90, 76, 42, 50, 25, 12, 48, 90, 76,
            42, 50, 25, 12, 48, 90, 76, 42, 50, 25, 12, 48, 90, 76, 42, 50, 25,
            12, 48, 90, 76, 42, 50, 25, 12, 48, 90, 76, 42, 50, 25, 12, 48, 90,
            76, 42, 50, 25, 12, 48, 90, 76, 42, 50, 25, 12, 48, 90, 76, 42, 50,
            25, 12, 48, 90, 76, 42,
          ],
        },
        {
          type: 'bar',
          label: 'Expiring after 30 days',
          backgroundColor: documentStyle.getPropertyValue('--green-500'),
          data: [
            25, 12, 48, 90, 76, 42, 50, 25, 12, 48, 90, 76, 42, 50, 25, 12, 48,
            90, 76, 42, 50, 25, 12, 48, 90, 76, 42, 50, 25, 12, 48, 90, 76, 42,
            50, 25, 12, 48, 90, 76, 42, 50, 25, 12, 48, 90, 76, 42, 50, 25, 12,
            48, 90, 76, 42, 50, 25, 12, 48, 90, 76, 42, 50, 25, 12, 48, 90, 76,
            42, 50, 25, 12, 48, 90, 76, 42, 50, 25, 12, 48, 90, 76, 42, 50, 25,
            12, 48, 90, 76, 42, 50, 25, 12, 48, 90, 76, 42, 50, 25, 12, 48, 90,
            76, 42, 50, 25, 12, 48, 90, 76, 42, 50, 25, 12, 48, 90, 76, 42, 50,
            25, 12, 48, 90, 76, 42,
          ],
        },
      ],
    };
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };

    this.pieData = {
        labels: ['Expired', 'Expiring in 30 days', 'Expiring after 30 days'],
        datasets: [
            {
                data: [325695, 456985, 215654],
                backgroundColor: [documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--blue-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--purple-400'), documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--blue-400')]
            }
        ]
    };

    this.pieOptions = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };
  }

  getSumOfAmount(): number {
    return this.pieData.datasets[0].data.reduce((acc, value) => acc + value, 0);
  }
}
