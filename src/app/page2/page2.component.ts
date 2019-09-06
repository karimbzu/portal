import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-page2',
  templateUrl: './page2.component.html',
  styleUrls: ['./page2.component.scss']
})
export class Page2Component implements OnInit {
  myRequestForm = new FormGroup({
    scanType: new FormControl('mobile_app')
  });

  constructor() { }

  ngOnInit() {
  }

  selectScanType() {
    console.log (this.myRequestForm.value.scanType);
  }


}
