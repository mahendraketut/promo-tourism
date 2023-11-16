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
