import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.scss']
})
export class MyCartComponent implements OnInit {

  elements: any = [
    {id: 1, first: 'My_Code.zip', last: "Security Vulnerability<br/>50MB", handle: '11/10/2019'},
    {id: 2, first: 'Repo URL', last: 'Security Vulnerability', handle: '11/10/2019'},
    {id: 3, first: 'His_Code.zip', last: 'Security Vulnerability', handle: '11/10/2019'},
  ];

  headElements = ['FILE', 'FILE INFO', 'SERVICE SELECTED', 'TOKEN'];


  constructor() { }

  ngOnInit() {
  }

}
