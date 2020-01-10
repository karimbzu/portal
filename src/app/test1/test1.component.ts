import { Component, OnInit } from '@angular/core';
import {ToastService} from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-test1',
  templateUrl: './test1.component.html',
  styleUrls: ['./test1.component.scss']
})
export class Test1Component implements OnInit {

  constructor(private myToast: ToastService) { }

  ngOnInit() {
  }

  sendMessage1() {
    this.myToast.success('This is Message 1', 'Success');
  }

  sendMessage2() {
    this.myToast.info('This is Message 2', 'Info');
  }

}
