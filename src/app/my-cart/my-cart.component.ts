import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import {CartService} from '../../services/cart.service';
import {Cart} from '../../models/cart';
import {Router} from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.scss']
})
export class MyCartComponent implements OnInit {
  validatingForm: FormGroup;
  mark = false;
  widget: true;

  listCart: Cart[];
  isEmpty: boolean;

  private units = [
    'bytes',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB'
  ];

  elements: any = [
    {id: 1, first: 'My_Code.zip', last: 'Security Vulnerability<br/>50MB', handle: '11/10/2019'},
    {id: 2, first: 'Repo URL', last: 'Security Vulnerability', handle: '11/10/2019'},
    {id: 3, first: 'His_Code.zip', last: 'Security Vulnerability', handle: '11/10/2019'},
  ];

  headElements = ['FILE', 'FILE INFO', 'SERVICE SELECTED', 'TOKEN'];


  constructor(
    public router: Router,
    private myHeader: HeaderService,
    private myCart: CartService) { }

  ngOnInit() {
    this.myCart.currentListCart.subscribe(val => this.listCart = val);
    this.validatingForm = new FormGroup({
      required: new FormControl(null, Validators.required)
    });
  }

  btnDeleteCart(cartId) {
    this.myCart.deleteCart(cartId)
      .then(res => {
        console.log (res);
      })
      .catch(err => {
        console.error (err);
      });
  }

  btnCheckout() {
    this.router.navigate(['checkout']);
  }

  typetoString(s:any){

    if (s === 'repo')
    return 'Repo';
    if (s === 'file')
    return 'File';

  }

  fileSizetransform(bytes: number, precision: number = 2  ) {

    if ( isNaN( parseFloat( String(bytes) )) || ! isFinite( bytes ) ) return '?';

    let unit = 0;

    while ( bytes >= 1024 ) {
      bytes /= 1024;
      unit ++;
    }

    return bytes.toFixed( + precision ) + ' ' + this.units[ unit ];
  }

  get input() {
      return this.validatingForm.get('required');
  }

  get az() {

    return this.validatingForm.get('required').value;
 }

}
