import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from '../../services/cart.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header-new',
  templateUrl: './header-new.component.html',
  styleUrls: ['./header-new.component.scss']
})
export class HeaderNewComponent implements OnInit, OnDestroy {
  handlerSubscribeCart;
  cartCount: number;
  role: any;

  constructor(public router: Router,
              private myCart: CartService) { }

  ngOnInit() {
    this.handlerSubscribeCart = this.myCart.currentCartValue.subscribe(val => this.cartCount = val);
    this.role = JSON.parse(localStorage.getItem('userInfo')).role;
  }

  ngOnDestroy() {
    this.handlerSubscribeCart.unsubscribe ();
  }

  handleLogout() {
    // Clear out the userInfo and authToken
    localStorage.clear();
    sessionStorage.clear();

    // Redirect
    this.router.navigate(['/login']);
  }

}
