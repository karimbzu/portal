import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRadioModule, MatStepperModule, MatBadgeModule, MatFormFieldModule, MatSelectModule, MatInputModule} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { Page1Component } from './page1/page1.component';
import { Page2Component } from './page2/page2.component';
import { Page3Component } from './page3/page3.component';
import { MyCartComponent } from './my-cart/my-cart.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { HeaderComponent } from './header/header.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { ScanRequestComponent } from './scan-request/scan-request.component';
import { TicketComponent } from './ticket/ticket.component';
import { DisabledManualURLGuard } from '../services/can-activate-route.guard';
import { BlockedComponent } from './blocked/blocked.component';
import { CheckoutComponent } from './checkout/checkout.component';
import {HttpClientModule} from '@angular/common/http';

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
    LoginComponent,
    ScanRequestComponent,
    TicketComponent,
    ScanRequestComponent,
    BlockedComponent,
    CheckoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ],
  providers: [DisabledManualURLGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
