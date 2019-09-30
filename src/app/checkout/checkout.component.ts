import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { analyzeAndValidateNgModules } from '@angular/compiler';

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

  // templateUnchecked = false;
  // templateChecked = true;
  // template = true;

  // getCheckboxesValue() {
  //   console.log('ngModel value', this.template);
  // }
 


  constructor() { }

  ngOnInit() {
    this.validatingForm = new FormGroup({
     projectname: new FormControl(null, Validators.required),
     projectdesc: new FormControl(null, Validators.required)
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
    // const projectname = this.validatingForm.get('projectname').value;
    // const projectdesc = this.validatingForm.get('projectdesc').value;
    // console.log("aaaa"+projectname);
    // console.log("bbbb"+projectdesc);
    // if (false) {
    //       this.cek = false;
    //     }
  }

  controlChecked(a:any){
  this.check = a;

  return this.check;

  }



}

