import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Subject } from 'rxjs';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-report-merchant',
  templateUrl: './report-merchant.component.html',
  styleUrls: ['./report-merchant.component.css'],
})
export class ReportMerchantComponent implements OnInit {
  title = 'Analytics Chart';
  merchantData: any;
  dtOptions: any = {};
  analyticsData: any;
  detailRevenueRanking: any;
  detailSalesRanking: any;
  totalProductsSold: any[] = [];
  totalSales: any[] = [];
  monthSelected: any;
  year: number = new Date().getFullYear();

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  // @ViewChild(DataTableDirective, { static: false })
  // datatableElement: DataTableDirective;

  // dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private authService: AuthService,
    private analyticsService: AnalyticsService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 12,
      processing: true,
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, 'All'],
      ],
      responsive: true,
      // dom: 'Blfrtip',
      buttons: ['copy', 'print', 'excel', 'pdf'],
    };
    this.fetchAnalytic();
  }

  fetchAnalytic() {
    this.merchantData = this.tokenService.getUserId();
    console.log('merchant data', this.merchantData);
    this.analyticsService
      .getMerchantAnalytics(this.merchantData, this.year)
      .subscribe({
        next: (res) => {
          this.analyticsData = res.data;
          console.log('analytics data', this.analyticsData);
          this.getProductSoldData();
          this.getTotalSales();
          this.updateChart();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  fetchRevenueAndSalesRanking(index: number) {
    this.monthSelected = this.getMonth(index + 1);
    let data = this.analyticsData[index];
    //get the revenue ranking inside data and save it into detailRevenueRanking
    this.detailRevenueRanking = data.revenueRanking;
    console.log('detail revenue rank', this.detailRevenueRanking);
    //get the sales ranking inside data and save it into detailSalesRanking
    this.detailSalesRanking = data.salesRanking;
    console.log('detail sales rank', this.detailSalesRanking);
  }

  getMonth(month: number): string {
    let mmm = '';
    switch (month) {
      case 1:
        mmm = 'January';
        break;
      case 2:
        mmm = 'February';
        break;
      case 3:
        mmm = 'March';
        break;
      case 4:
        mmm = 'April';
        break;
      case 5:
        mmm = 'May';
        break;
      case 6:
        mmm = 'June';
        break;
      case 7:
        mmm = 'July';
        break;
      case 8:
        mmm = 'August';
        break;
      case 9:
        mmm = 'September';
        break;
      case 10:
        mmm = 'October';
        break;
      case 11:
        mmm = 'November';
        break;
      case 12:
        mmm = 'December';
        break;
      default:
        break;
    }
    return mmm;
  }

  getProductSoldData() {
    // Logic to update totalProductsSold
    this.totalProductsSold = this.analyticsData.map(
      (data) => data.totalProductsSold
    );
    console.log('total products sold', this.totalProductsSold);
  }

  getTotalSales() {
    this.totalSales = this.analyticsData.map((data) => data.totalSales);
    console.log('total sales', this.totalSales);
  }

  public barChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    datasets: [
      {
        data: this.totalSales,
        label: 'Selling data in Month',
        fill: true,
        tension: 0.5,
        borderColor: 'gray',
        backgroundColor: 'rgb(213,231,253)',
      },
    ],
  };
  public barChartOptions: ChartOptions<'line'> = {
    responsive: true,
  };
  public barChartLegend = true;

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    datasets: [
      {
        data: this.totalProductsSold,
        label: 'Total Sales in Month',
        fill: true,
        tension: 0.5,
        borderColor: 'gray',
        backgroundColor: 'rgb(213,231,253)',
      },
    ],
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
  };
  public lineChartLegend = true;

  updateChart() {
    this.barChartData = {
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      datasets: [
        {
          data: this.totalSales,
          label: 'Selling data in Month',
          fill: true,
          tension: 0.5,
          borderColor: 'gray',
          backgroundColor: 'rgb(213,231,253)',
        },
      ],
    };

    this.lineChartData = {
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      datasets: [
        {
          data: this.totalProductsSold,
          label: 'Total Sales in Month',
          fill: true,
          tension: 0.5,
          borderColor: 'gray',
          backgroundColor: 'rgb(213,231,253)',
        },
      ],
    };
    this.chart?.update();
  }
}
