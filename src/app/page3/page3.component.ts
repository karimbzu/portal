import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {HeaderService} from '../../services/header.service';

@Component({
  selector: 'app-page3',
  templateUrl: './page3.component.html',
  styleUrls: ['./page3.component.scss']
})
export class Page3Component implements OnInit {
  myRequestForm = new FormGroup({
    scanType: new FormControl('mobile_app'),
    type: new FormControl('repo'),
    programLanguage: new FormControl('javascript'),
    buildCommand: new FormControl({value: '', disabled: true}),
    param3: new FormControl(''),
    param4: new FormControl('')
  });

  listProgramLanguage = [
    { name: 'javascript', label: 'JavaScript/TypeScript', compile: false},
    { name: 'java', label: 'Java', compile: true},
    { name: 'php', label: 'PHP', compile: false},
    { name: 'python', label: 'Python', compile: false},
    { name: 'swift', label: 'iOS Swift', compile: true}
  ];

  flagCompile: boolean;

  constructor(private svsHeader: HeaderService) { }

  ngOnInit() {
    this.flagCompile = false;
    this.svsHeader.showHeader();
  }

  updateScanType(val) {
    this.myRequestForm.patchValue({
      scanType: val
    });
  }

  updateType(val) {
    this.myRequestForm.patchValue({
      type: val
    });
  }

  /**
   * method to handle the Programming Language dropdown list selection.
   * do take note that since we are unable to access the data attributes,
   * we need to search the list for the selected item
   */
  updateProgramLanguage(el) {
    const myLanguage = this.listProgramLanguage.find(theLang => theLang.name === el.value);

    if (myLanguage.compile) {
      this.myRequestForm.get('buildCommand').enable();
    } else {
      this.myRequestForm.get('buildCommand').disable();
    }
  }

}
