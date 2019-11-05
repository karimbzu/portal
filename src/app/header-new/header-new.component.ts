import { Component, OnInit } from '@angular/core';
import {CartService} from '../../services/cart.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header-new',
  templateUrl: './header-new.component.html',
  styleUrls: ['./header-new.component.scss']
})
export class HeaderNewComponent implements OnInit {
  cartCount: number;

  constructor(public router: Router,
              private myCart: CartService) { }

  ngOnInit() {
    this.myCart.currentCartValue.subscribe(val => this.cartCount = val);
  }

  handleLogout() {
    // Clear out the userInfo and authToken
    localStorage.clear();

    // Redirect
    this.router.navigate(['/login']);
  }

}
