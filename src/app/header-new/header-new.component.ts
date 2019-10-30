import { Component, OnInit } from '@angular/core';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-header-new',
  templateUrl: './header-new.component.html',
  styleUrls: ['./header-new.component.scss']
})
export class HeaderNewComponent implements OnInit {
  cartCount: number;

  constructor(private myCart: CartService) { }

  ngOnInit() {
    this.myCart.currentCartValue.subscribe(val => this.cartCount = val);
  }

}
