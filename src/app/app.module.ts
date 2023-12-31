// import module or plugin
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxPayPalModule } from 'ngx-paypal';
import { NgChartsModule } from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { GALLERY_CONFIG, GalleryConfig, GalleryModule } from 'ng-gallery';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { ImageModule } from 'primeng/image';
import { AppRoutingModule } from './app-routing.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DatePipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { Lightbox, LightboxModule } from 'ngx-lightbox';
import { EditorModule } from '@tinymce/tinymce-angular';
import { register } from 'swiper/element/bundle';
register();

// import component
import { AppComponent } from './app.component';
import { HeaderComponent } from './landing-page/header/header.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { HeroComponent } from './landing-page/hero/hero.component';
import { FooterComponent } from './landing-page/footer/footer.component';
import { AuthPageComponent } from './auth-page/auth-page.component';
import { LoginComponent } from './auth-page/login/login.component';
import { RegisterComponent } from './auth-page/register/register.component';
import { ProductComponent } from './landing-page/product/product.component';
import { HelpComponent } from './landing-page/help/help.component';
import { ProductCardComponent } from './widget/product-card/product-card.component';
import { HomeComponent } from './landing-page/home/home.component';
import { DetailProductComponent } from './landing-page/product/detail-product/detail-product.component';
import { OrderComponent } from './landing-page/order/order.component';
import { MerchantComponent } from './merchant/merchant.component';
import { JoinUsPageComponent } from './merchant/join-us-page/join-us-page.component';
import { RegisterMerchantComponent } from './merchant/register-merchant/register-merchant.component';
import { NavbarMerchantComponent } from './merchant/admin-merchant/layout/navbar-merchant/navbar-merchant.component';
import { SidenavMerchantComponent } from './merchant/admin-merchant/layout/sidenav-merchant/sidenav-merchant.component';
import { FooterMerchantComponent } from './merchant/admin-merchant/layout/footer-merchant/footer-merchant.component';
import { DashboardComponent } from './merchant/admin-merchant/dashboard/dashboard.component';
import { AlertComponent } from './widget/alert/alert.component';
import { ProductListComponent } from './merchant/admin-merchant/product-list/product-list.component';
import { OrderListComponent } from './merchant/admin-merchant/order-list/order-list.component';
import { TransactionListComponent } from './merchant/admin-merchant/transaction-list/transaction-list.component';
import { ReportMerchantComponent } from './merchant/admin-merchant/report-merchant/report-merchant.component';
import { OfficerComponent } from './officer/officer.component';
import { SidenavOfficerComponent } from './officer/admin-officer/layout/sidenav-officer/sidenav-officer.component';
import { NavbarOfficerComponent } from './officer/admin-officer/layout/navbar-officer/navbar-officer.component';
import { FooterOfficerComponent } from './officer/admin-officer/layout/footer-officer/footer-officer.component';
import { DashboardOfficerComponent } from './officer/admin-officer/dashboard-officer/dashboard-officer.component';
import { MerchantReviewComponent } from './officer/admin-officer/merchant-review/merchant-review.component';
import { ReportOfficerComponent } from './officer/admin-officer/report-officer/report-officer.component';
import { ProductAddComponent } from './merchant/admin-merchant/product-add/product-add.component';
import { OrderDetailComponent } from './landing-page/order/order-detail/order-detail.component';
import { OrderCustomerListComponent } from './landing-page/order/order-customer-list/order-customer-list.component';
import { ChangePasswordComponent } from './auth-page/change-password/change-password.component';

// import service
import { PdfService } from './services/pdf.service';
import { ForgotComponent } from './auth-page/forgot/forgot.component';
import { ProductUpdateComponent } from './merchant/admin-merchant/product-update/product-update.component';
import { MerchantReviewDetailComponent } from './officer/admin-officer/merchant-review-detail/merchant-review-detail.component';
import { Error403Component } from './errorPage/error403/error403.component';
import { Error404Component } from './errorPage/error404/error404.component';
import { Error500Component } from './errorPage/error500/error500.component';
import { OrderCardComponent } from './widget/order-card/order-card.component';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { ReviewCardComponent } from './widget/review-card/review-card.component';
import { ProductListCustomerComponent } from './landing-page/product/product-list-customer/product-list-customer.component';
import { LottieLoaderComponent } from './widget/lottie-loader/lottie-loader.component';

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

    ProductComponent,
    HelpComponent,
    ProductCardComponent,
    HomeComponent,
    DetailProductComponent,
    OrderComponent,
    MerchantComponent,
    JoinUsPageComponent,
    RegisterMerchantComponent,
    NavbarMerchantComponent,
    SidenavMerchantComponent,
    FooterMerchantComponent,
    DashboardComponent,
    AlertComponent,
    ProductListComponent,
    OrderListComponent,
    TransactionListComponent,
    ReportMerchantComponent,
    OfficerComponent,
    SidenavOfficerComponent,
    NavbarOfficerComponent,
    FooterOfficerComponent,
    DashboardOfficerComponent,
    MerchantReviewComponent,
    ReportOfficerComponent,
    ProductAddComponent,
    OrderDetailComponent,
    OrderCustomerListComponent,
    ChangePasswordComponent,
    ForgotComponent,
    ProductUpdateComponent,
    MerchantReviewDetailComponent,
    Error403Component,
    Error404Component,
    Error500Component,
    OrderCardComponent,
    ReviewCardComponent,
    ProductListCustomerComponent,
    LottieLoaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ImageModule,
    ScrollingModule,
    DataTablesModule,
    NgChartsModule,
    BrowserAnimationsModule,
    NgxPayPalModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    LightboxModule,
    EditorModule,
    NgxBarcode6Module,
    // GalleryModule,
    // LightboxModule.withConfig({
    //   panelClass: 'custom-lightbox-panel',
    //   keyboardShortcuts: true,
    //   hasBackdrop: true,
    //   backdropClass: 'custom-backdrop-class',
    // }),
  ],
  providers: [
    DatePipe,
    PdfService,
    // {
    //   provide: GALLERY_CONFIG,
    //   useValue: {
    //     autoHeight: true,
    //     imageSize: 'cover',
    //   } as GalleryConfig,
    // },
    // {
    //   provide: LIGHTBOX_CONFIG,
    //   useValue: {
    //     keyboardShortcuts: false,
    //     exitAnimationTime: 1000,
    //   } as LightboxConfig,
    // },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
