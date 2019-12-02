import { Component, OnInit, OnDestroy, Input} from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit, OnDestroy {

  @Input() widget: boolean;
  @Input() OH: boolean;


  cartCount: number;
  myListOrder;
  tokenAmount: number;
  handlerCartValue;
  handlerListOrder;
  handlerTokenAmount;

  constructor(private myCart: CartService,
              private myToken: TokenService,
              private myOrder: OrderService) {}

  ngOnInit() {
    this.handlerCartValue = this.myCart.currentCartValue.subscribe(val => this.cartCount = val);
    this.handlerListOrder = this.myOrder.currentListOrder.subscribe(val => this.myListOrder = val);
    this.handlerTokenAmount = this.myToken.currentTokenAmount.subscribe(val => this.tokenAmount = val);
  }

  ngOnDestroy() {
    this.handlerCartValue.unsubscribe();
    this.handlerListOrder.unsubscribe();
    this.handlerTokenAmount.unsubscribe();
  }

  handleAddToken() {
    console.log('User Request for token');
  }

}
