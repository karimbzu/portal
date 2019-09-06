import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {DropdownModule, MDBBootstrapModule} from 'angular-bootstrap-md';
import { Page1Component } from './page1/page1.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { Page2Component } from './page2/page2.component';
import {MatRadioModule, MatStepperModule, MatBadgeModule, MatFormFieldModule, MatSelectModule, MatInputModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import { Page3Component } from './page3/page3.component';
import { MyCartComponent } from './my-cart/my-cart.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { HeaderComponent } from './header/header.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    Page1Component,
    Page2Component,
    Page3Component,
    MyCartComponent,
    MyAccountComponent,
    HeaderComponent,
    LandingComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule,
    BrowserAnimationsModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatStepperModule,
    DropdownModule.forRoot(),
    MatBadgeModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
