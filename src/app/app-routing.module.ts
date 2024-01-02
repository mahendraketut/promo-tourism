import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AuthPageComponent } from './auth-page/auth-page.component';
import { LoginComponent } from './auth-page/login/login.component';
import { RegisterComponent } from './auth-page/register/register.component';
import { AppComponent } from './app.component';
import { ProductComponent } from './landing-page/product/product.component';
import { HelpComponent } from './landing-page/help/help.component';
import { HomeComponent } from './landing-page/home/home.component';
import { DetailProductComponent } from './landing-page/product/detail-product/detail-product.component';
import { OrderComponent } from './landing-page/order/order.component';
import { MerchantComponent } from './merchant/merchant.component';
import { DashboardComponent } from './merchant/admin-merchant/dashboard/dashboard.component';
import { ReportOfficerComponent } from './officer/admin-officer/report-officer/report-officer.component';
import { ProductListComponent } from './merchant/admin-merchant/product-list/product-list.component';
import { OrderListComponent } from './merchant/admin-merchant/order-list/order-list.component';
import { TransactionListComponent } from './merchant/admin-merchant/transaction-list/transaction-list.component';
import { ReportMerchantComponent } from './merchant/admin-merchant/report-merchant/report-merchant.component';
import { OfficerComponent } from './officer/officer.component';
import { DashboardOfficerComponent } from './officer/admin-officer/dashboard-officer/dashboard-officer.component';
import { MerchantReviewComponent } from './officer/admin-officer/merchant-review/merchant-review.component';
import { ProductAddComponent } from './merchant/admin-merchant/product-add/product-add.component';
import { RegisterMerchantComponent } from './merchant/register-merchant/register-merchant.component';
import { OrderDetailComponent } from './landing-page/order/order-detail/order-detail.component';
import { OrderCustomerListComponent } from './landing-page/order/order-customer-list/order-customer-list.component';
import { ChangePasswordComponent } from './auth-page/change-password/change-password.component';
import { ForgotComponent } from './auth-page/forgot/forgot.component';
import { ProductUpdateComponent } from './merchant/admin-merchant/product-update/product-update.component';
import { MerchantReviewDetailComponent } from './officer/admin-officer/merchant-review-detail/merchant-review-detail.component';
import { AuthService } from './services/auth.service';
import { Error403Component } from './errorPage/error403/error403.component';
import { Error404Component } from './errorPage/error404/error404.component';
import { RoleGuardService } from './services/role-guard.service';
import { Error500Component } from './errorPage/error500/error500.component';
import { ProductListCustomerComponent } from './landing-page/product/product-list-customer/product-list-customer.component';

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
        path: 'product',
        component: ProductComponent,
        children: [
          {
            path: '',
            component: ProductListCustomerComponent,
          },
          {
            path: ':id',
            component: DetailProductComponent,
          },
        ],
      },
      // TODO delete it if success
      // {
      //   path: ':id',
      //   component: DetailProductComponent,
      // },
      {
        path: 'order',
        component: OrderComponent,
        children: [
          {
            path: '',
            component: OrderCustomerListComponent,
          },
          {
            path: ':id',
            component: OrderDetailComponent,
          },
        ],
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
    canActivate: [RoleGuardService],
    data: { expectedRole: 'merchant' },
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'register',
        component: RegisterMerchantComponent,
      },
      {
        path: 'product',
        component: ProductListComponent,
      },
      {
        path: 'product_update/:productId',
        component: ProductUpdateComponent,
      },
      {
        path: 'add-product',
        component: ProductAddComponent,
      },
      {
        path: 'order',
        component: OrderListComponent,
        children: [
          {
            path: 'detail/:id',
            component: DetailProductComponent,
          },
        ],
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
    canActivate: [RoleGuardService],
    data: { expectedRole: 'officer' },
    children: [
      {
        path: '',
        component: DashboardOfficerComponent,
      },
      {
        path: 'account-management',
        component: MerchantReviewComponent,
      },
      {
        path: 'detail-merchant/:id',
        component: MerchantReviewDetailComponent,
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
        canActivate: [AuthService],
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'change_password',
        component: ChangePasswordComponent,
      },
      {
        path: 'forgot',
        component: ForgotComponent,
      },
    ],
  },
  {
    path: 'register-merchant',
    component: RegisterMerchantComponent,
  },

  // Handle all other routes
  { path: 'error/403', component: Error403Component },
  // handle all other undefined routes
  { path: 'error/404', component: Error404Component },
  { path: '**', redirectTo: '/error/404' },
  //handle server error
  { path: 'error/500', component: Error500Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
