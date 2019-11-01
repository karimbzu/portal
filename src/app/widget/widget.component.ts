import { Component, OnInit , Input} from '@angular/core';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {

  @Input() widget: boolean;
  

  cartCount: number;

  constructor(private myCart: CartService) { }

  ngOnInit() {
    this.myCart.currentCartValue.subscribe(val => this.cartCount = val);
  }
}
