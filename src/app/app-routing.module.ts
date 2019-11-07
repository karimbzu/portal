import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyCartComponent } from './my-cart/my-cart.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { ScanRequestComponent } from './scan-request/scan-request.component';
import { TicketComponent } from './ticket/ticket.component';
import { DisabledManualURLGuard } from '../services/can-activate-route.guard';
import { BlockedComponent } from './blocked/blocked.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../services/auth.guard';
import {ErrorComponent} from './error/error.component';
import {WidgetComponent} from './widget/widget.component';


const routes: Routes = [
  {path: '', redirectTo: 'landing', pathMatch: 'full'},
  {path: 'landing', component: LandingComponent},
  {path: 'login', component: LoginComponent},
  {path: 'my-cart', component: MyCartComponent, canActivate: [AuthGuard, DisabledManualURLGuard]},
  {path: 'my-account', component: MyAccountComponent, canActivate: [AuthGuard]},
  {path: 'scan-request', component: ScanRequestComponent, canActivate: [AuthGuard]},
  {path: 'ticket', component: TicketComponent, canActivate: [AuthGuard]},
  {path: 'scan-request', component: ScanRequestComponent, canActivate: [AuthGuard]},
  {path: 'blocked', component: BlockedComponent, canActivate: [AuthGuard]},
  {path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard, DisabledManualURLGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'widget', component: WidgetComponent, canActivate: [AuthGuard]},
  {path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard]},
  {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
