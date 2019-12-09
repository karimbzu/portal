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
  name = 'myName';
  email = 'myEmail';
  orgName = 'myOrgName';
  acctManagerList : any;

  cartCount: number;
  myListOrder;
  tokenAmount: number;
  handlerCartValue;
  handlerListOrder;
  handlerTokenAmount;
  handlerAddToken;

  constructor(private myCart: CartService,
              private myToken: TokenService,                       
              private myOrder: OrderService) {}

  ngOnInit() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      this.name = userInfo.name;
      this.email = userInfo.email;
      this.orgName = userInfo.orgName;
      this.acctManagerList = ['ros@tmrnd.com.my','liza@tmrnd.com.my'];
    }
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
   
    this.myToken.postRequestToken(this.name,this.email,this.orgName,this.acctManagerList);
    console.log('User Request for token');    

  }

}
