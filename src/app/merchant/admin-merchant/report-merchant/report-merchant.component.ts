import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-report-merchant',
  templateUrl: './report-merchant.component.html',
  styleUrls: ['./report-merchant.component.css'],
})
export class ReportMerchantComponent {
  title = 'ng2-charts-demo';

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Selling data in Month',
        fill: true,
        tension: 0.5,
        borderColor: 'gray',
        backgroundColor: 'rgb(213,231,253)',
      },
    ],
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false,
  };
  public lineChartLegend = true;
}
