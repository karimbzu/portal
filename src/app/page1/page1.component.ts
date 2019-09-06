import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.scss']
})
export class Page1Component implements OnInit {
  myRequestForm = new FormGroup({
    scanType: new FormControl('web_app'),
    language: new FormControl('nodejs'),
    buildCmd: new FormControl('')
  });

  constructor() { }

  ngOnInit() {
  }

  selectScanType() {
    console.log (this.myRequestForm.value.scanType);
  }

  clickCard(el) {
    console.log (el.target);
  }

  /**
   * Since we are using reactive form, we need to use patchValue
   * to update the selection
   */
  updateSelection(val) {
    this.myRequestForm.patchValue({
      scanType: val
    });

  }
}
