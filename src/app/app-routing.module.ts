import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyCartComponent } from './my-cart/my-cart.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { ScanRequestComponent } from './scan-request/scan-request.component';
import { TicketComponent } from './ticket/ticket.component';
import { DisabledManualURLGuard } from '../services/can-activate-route.guard';
import { BlockedComponent } from './blocked/blocked.component';
import { CheckoutComponent } from './checkout/checkout.component';
import {Page1Component} from './page1/page1.component';
import {DashboardComponent} from './dashboard/dashboard.component';


const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'landing', component: LandingComponent},
  {path: 'login', component: LoginComponent},
  {path: 'my-cart', component: MyCartComponent, canActivate: [DisabledManualURLGuard]},
  {path: 'my-account', component: MyAccountComponent},
  {path: 'scan-request', component: ScanRequestComponent},
  {path: 'ticket', component: TicketComponent},
  {path: 'scan-request', component: ScanRequestComponent},
  {path: 'blocked', component: BlockedComponent},
  {path: 'checkout', component: CheckoutComponent, canActivate: [DisabledManualURLGuard]},
  {path: 'page1', component: Page1Component},
  {path: 'dashboard', component: DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
