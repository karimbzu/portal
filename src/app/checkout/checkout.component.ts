import {Component, OnInit, Injectable, OnDestroy} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import {OrderService} from '../../services/order.service';

@Injectable()

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  handlerSubscribeTotalItem;
  handlerSubscribeTotalPrice;
  handlerSubscribeCart;

  validatingForm: FormGroup;
  check: false;
  marked = false;
  count = 0;
  type = 'company';
  totalItem;
  totalPrice;
  cartCount: number;
  totalToken: number;
  btnCheckout = '';
  acctManagerName;
  acctManagerOrgName;


  constructor(
    public router: Router,
    private myOrder: OrderService,
    private myCart: CartService,
    private myTicket: TicketService) {
    }


  ngOnInit() {
    this.handlerSubscribeTotalItem = this.myTicket.currentTotalItem.subscribe(val => this.totalItem = val);
    this.handlerSubscribeTotalPrice = this.myTicket.currentTotalPrice.subscribe(val => this.totalPrice = val);

    this.validatingForm = new FormGroup({
     projectname: new FormControl(null, Validators.required),
     projectdesc: new FormControl(null, Validators.required)
    });

    this.handlerSubscribeCart = this.myCart.currentCartValue.subscribe(val => this.cartCount = val);

    // Get the list of Account Managers
    // and assign to the variables
    this.myTicket.getAcctManagerList()
      .then(res => {
        // @ts-ignore
        const myInfo = res.info;
        const myDetails = JSON.parse(localStorage.getItem('userInfo'));

        if (!myInfo.length) {
          console.log ('Account Manager List is EMPTY');
          this.acctManagerName = 'Mohammad Harris bin Mokhtar (DEFAULT)';
          this.acctManagerOrgName = myDetails.orgName;
        } else {
          this.acctManagerName = myInfo[0].name;
          this.acctManagerOrgName = myInfo[0].orgName;
        }
      })
      .catch(err => {
        console.error ('Unable to get the Account Manager list');
        console.error (err);
      });
  }

  ngOnDestroy() {
    this.handlerSubscribeTotalItem.unsubscribe();
    this.handlerSubscribeTotalPrice.unsubscribe();
    this.handlerSubscribeCart.unsubscribe();
  }

  get projectname() {
    return this.validatingForm.get('projectname');
   }

  get projectdesc() {
    return this.validatingForm.get('projectdesc');
   }

   Accept(e: any) {
    if (e.checked === true) {
      this.marked = true;
    } else {
      this.marked = false;
    }
    console.log (e);
  }


  btnPlaceOrder() {

    this.myTicket.placeOrder(this.validatingForm.get('projectname').value, this.validatingForm.get('projectdesc').value)
      .then(res => {
        // Remarks: Redirect to the ticket page
        // console.log ("Redirect to the ticket page");
        this.myOrder.getListOrder();
        this.router.navigate(['ticket']);
      })
      .catch(err => {
        console.error (err);

        // Remarks: Need to show the error in SWAL
        if (err.status === 400) {
          Swal.fire(
            'The backend?',
            'Something is wrong!',
            'question'
          );
        } else {
          Swal.fire(
            'Unknown error',
            'Something is wrong!',
            'question'
          );
        }


      });
  }

}

