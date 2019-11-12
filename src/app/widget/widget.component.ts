import { Component, OnInit , Input} from '@angular/core';
import {CartService} from '../../services/cart.service';
import {OrderService} from '../../services/order.service';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {

  @Input() widget: boolean;
  @Input() OH: boolean;


  cartCount: number;
  myListOrder;

  constructor(private myCart: CartService,
              private myOrder: OrderService) { }

  ngOnInit() {
    this.myCart.currentCartValue.subscribe(val => this.cartCount = val);
    this.myOrder.currentListOrder.subscribe(val => this.myListOrder = val);
  }
}
