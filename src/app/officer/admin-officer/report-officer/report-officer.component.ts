import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { environment } from 'src/app/environment';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-report-officer',
  templateUrl: './report-officer.component.html',
  styleUrls: ['./report-officer.component.css'],
})
export class ReportOfficerComponent implements OnInit {
  title = 'Analytics Chart';
  analyticsData: any;
  detailRevenueRanking: any;
  detailSalesRanking: any;
  totalProductsSold: any[] = [];
  totalSales: any[] = [];
  years: any[] = [];
  monthSelected: any;
  year: number = new Date().getFullYear();

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  constructor(
    private authService: AuthService,
    private analyticsService: AnalyticsService,
    private tokenService: TokenService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.fetchAnalytic();
    this.generateYearRange();
  }

  fetchAnalytic() {
    this.analyticsService.getAllAnalytics(this.year).subscribe({
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

  generateYearRange() {
    const currentYear = new Date().getFullYear();
    // Generate an array with the current year and 3 years before
    this.years = Array.from({ length: 4 }, (v, i) => currentYear - 3 + i);
  }

  fetchRevenueAndSalesRanking(index: number) {
    this.monthSelected = this.getMonth(index + 1);
    let data = this.analyticsData[index];
    //get the revenue ranking inside data and save it into detailRevenueRanking
    this.detailRevenueRanking = data.revenueRanking;
    console.log('detail revenue rank', this.detailRevenueRanking);
    // push product data to each index of detail revenue ranking
    this.detailRevenueRanking.forEach((element: any) => {
      //getProduct that match with product id in element
      this.productService.getProduct(element.productId).subscribe({
        next: (res) => {
          element.product = res.data;
          element.coverImagePath =
            environment.productImgUrl + '/' + res.data.coverImagePath;
        },
        error: (err) => {
          console.log(err);
        },
      });
    });
    console.log('detailrevenue', this.detailRevenueRanking);
    //get the sales ranking inside data and save it into detailSalesRanking
    this.detailSalesRanking = data.salesRanking;
    // push product data to each index of detail sales ranking
    this.detailSalesRanking.forEach((element: any) => {
      //getProduct that match with product id in element
      this.productService.getProduct(element.productId).subscribe({
        next: (res) => {
          element.product = res.data;
          //push product coverImagePath relativepath to each index of detail sales ranking
          element.coverImagePath =
            environment.productImgUrl + '/' + res.data.coverImagePath;
        },
        error: (err) => {
          console.log(err);
        },
      });
    });

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
