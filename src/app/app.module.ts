import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
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
  ],
  imports: [BrowserModule, 
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
