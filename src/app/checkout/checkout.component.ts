import { Component, OnInit, Injectable, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import {TicketService} from '../../services/ticket.service';
import { CartService } from '../../services/cart.service';

import { HeaderService } from '../../services/header.service';
import { Router, Event, NavigationStart, NavigationError, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  validatingForm: FormGroup;
  check:false;
  marked = false;
  count = 0;
  type = 'company';
  totalItem;
  totalPrice;
  cartCount: number;
  totalToken: number;
  btnCheckout = "";
  acctManagerName;
  acctManagerOrgName;


  // templateUnchecked = false;
  // templateChecked = true;
  // template = true;

  // getCheckboxesValue() {
  //   console.log('ngModel value', this.template);
  // }
 


  constructor(
    public router: Router,
    private myHeader: HeaderService,
    private myCart: CartService,
    private myTicket: TicketService) { 

      this.router.events
    .subscribe((event) => {
  
  
    });
    
    this.myTicket.currentTotalItem.subscribe(val => this.totalItem = val);
    this.myTicket.currentTotalPrice.subscribe(val => this.totalPrice = val);

    }


  ngOnInit() {
    this.validatingForm = new FormGroup({
     projectname: new FormControl(null, Validators.required),
     projectdesc: new FormControl(null, Validators.required)
    });

    this.myHeader.setModePayment();
    this.myCart.currentCartValue.subscribe(val => this.cartCount = val);

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

  get projectname() {
    // console.log(this.validatingForm.get('projectname').status)
    // if (this.validatingForm.get('projectname').status === 'VALID') {
    //   this.marked = true;
    // }
  
    return this.validatingForm.get('projectname');
   }

  get projectdesc() {
    // if (this.validatingForm.get('projectdesc').status === 'VALID') {
    //   this.marked = true;
    // }
    
    return this.validatingForm.get('projectdesc');
   }

   Accept(e:any) {
    this.count++;
    if (this.count % 2) {
      this.marked = true;
    } else {
      this.marked = false;
     }
   }   
  //   // const projectname = this.validatingForm.get('projectname').value;
  //   // const projectdesc = this.validatingForm.get('projectdesc').value;
  //   // console.log("aaaa"+projectname);
  //   // console.log("bbbb"+projectdesc);
  //   // if (false) {
  //   //       this.cek = false;
  //   //     }
  // }

  // controlChecked(a:any){
  //    this.check = a;

  //   return this.check;
  // }

  btnPlaceOrder() {
    this.myTicket.placeOrder(this.projectname, this.projectdesc)
      .then(res => {
        // Remarks: Redirect to the ticket page
        this.router.navigate(['ticket']);
      })
      .catch(err => {
        console.error (err);

        // Remarks: Need to show the error in SWAL
      }); 
  }

}

