import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { TokenService } from 'src/services/token.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit, OnDestroy {
  myListOrder: any;
  tokenAmount:number;
  handlerListOrder: any;
  handlermyCart: any;
  handlerTokenAmount: any;
  cartCount: number;

  constructor(
    private myCart: CartService,
    private myToken: TokenService,
    private myOrder: OrderService,
    private http: HttpClient) { }

  ngOnInit() {
    this.handlermyCart = this.myCart.currentCartValue.subscribe(val => this.cartCount = val);
    this.handlerListOrder = this.myOrder.currentListOrder.subscribe(val => this.myListOrder = val);
    this.handlerTokenAmount = this.myToken.currentTokenAmount.subscribe(val => this.tokenAmount = val);;
    this.refreshList();
  }

  ngOnDestroy() {
    this.handlerListOrder.unsubscribe ();
    this.handlermyCart.unsubscribe();
    this.handlerTokenAmount.unsubscribe();
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
