import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit, OnDestroy {
  myListOrder;
  handlerSubscribeOrder;
  cartCount: number;
  constructor(
    private myCart: CartService,
    private myOrder: OrderService,
    private http: HttpClient) { }

  ngOnInit() {
    this.myCart.currentCartValue.subscribe(val => this.cartCount = val);
    this.handlerSubscribeOrder = this.myOrder.currentListOrder.subscribe(val => this.myListOrder = val);
    this.refreshList();
  }

  ngOnDestroy() {
    this.handlerSubscribeOrder.unsubscribe ();
  }

  /**
   * Continuously refresh the list every 60 seconds
   */
  refreshList() {
    setTimeout(() => {
      this.myOrder.getListOrder();
      this.refreshList();
    }, 60000);
  }

  optService(s: any) {
      let js: any;
      js = JSON.parse(s);

      return js;
  }

}
