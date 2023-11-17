import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ImageModule } from 'primeng/image';
import { AppRoutingModule } from './app-routing.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AppComponent } from './app.component';
import { HeaderComponent } from './landing-page/header/header.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { HeroComponent } from './landing-page/hero/hero.component';
import { FooterComponent } from './landing-page/footer/footer.component';
import { AuthPageComponent } from './auth-page/auth-page.component';
import { LoginComponent } from './auth-page/login/login.component';
import { RegisterComponent } from './auth-page/register/register.component';
import { AboutComponent } from './landing-page/about/about.component';
import { ProductComponent } from './landing-page/product/product.component';
import { HelpComponent } from './landing-page/help/help.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductCardComponent } from './widget/product-card/product-card.component';
import { HomeComponent } from './landing-page/home/home.component';
import { DetailProductComponent } from './product/detail-product/detail-product.component';
import { OrderComponent } from './landing-page/order/order.component';
import { MerchantComponent } from './merchant/merchant.component';
import { JoinUsPageComponent } from './merchant/join-us-page/join-us-page.component';
import { RegisterMerchantComponent } from './merchant/register-merchant/register-merchant.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LandingPageComponent,
    HeroComponent,
    FooterComponent,
    AuthPageComponent,
    LoginComponent,
    RegisterComponent,
    AboutComponent,
    ProductComponent,
    HelpComponent,
    ProductCardComponent,
    HomeComponent,
    DetailProductComponent,
    OrderComponent,
    MerchantComponent,
    JoinUsPageComponent,
    RegisterMerchantComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ImageModule,
    ScrollingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
