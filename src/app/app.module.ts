import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './landing-page/header/header.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { HeroComponent } from './landing-page/hero/hero.component';
import { FooterComponent } from './landing-page/footer/footer.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, LandingPageComponent, HeroComponent, FooterComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
