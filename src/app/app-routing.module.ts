import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AuthPageComponent } from './auth-page/auth-page.component';
import { LoginComponent } from './auth-page/login/login.component';
import { RegisterComponent } from './auth-page/register/register.component';
import { AppComponent } from './app.component';
import { AboutComponent } from './landing-page/about/about.component';
import { ProductComponent } from './landing-page/product/product.component';
import { HelpComponent } from './landing-page/help/help.component';
import { HomeComponent } from './landing-page/home/home.component';
import { DetailProductComponent } from './product/detail-product/detail-product.component';
import { OrderComponent } from './landing-page/order/order.component';
import { MerchantComponent } from './merchant/merchant.component';
import { DashboardComponent } from './merchant/admin-merchant/dashboard/dashboard.component';
import { ProductListComponent } from './merchant/admin-merchant/product-list/product-list.component';
import { OrderListComponent } from './merchant/admin-merchant/order-list/order-list.component';
import { TransactionListComponent } from './merchant/admin-merchant/transaction-list/transaction-list.component';
import { ReportMerchantComponent } from './merchant/admin-merchant/report-merchant/report-merchant.component';
import { DashboardOfficerComponent } from './officer/admin-officer/dashboard-officer/dashboard-officer.component';
import { OfficerComponent } from './officer/officer.component';
import { MerchantReviewComponent } from './officer/admin-officer/merchant-review/merchant-review.component';
import { ReportOfficerComponent } from './officer/admin-officer/report-officer/report-officer.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'product',
        component: ProductComponent,
      },
      {
        path: 'detailproduct',
        component: DetailProductComponent,
      },
      {
        path: 'order',
        component: OrderComponent,
      },
      {
        path: 'help',
        component: HelpComponent,
      },
    ],
  },
  {
    path: 'merchant',
    component: MerchantComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'product',
        component: ProductListComponent,
      },
      {
        path: 'order',
        component: OrderListComponent,
      },
      {
        path: 'transaction',
        component: TransactionListComponent,
      },
      {
        path: 'report',
        component: ReportMerchantComponent,
      },
    ],
  },
  {
    path: 'officer',
    component: OfficerComponent,
    children: [
      {
        path: '',
        component: DashboardOfficerComponent,
      },
      {
        path: 'review-merchant',
        component: MerchantReviewComponent,
      },
      {
        path: 'report',
        component: ReportOfficerComponent,
      },
    ],
  },
  {
    path: 'auth',
    component: AuthPageComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
