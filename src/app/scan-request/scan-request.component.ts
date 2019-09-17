import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {interval} from 'rxjs';

@Component({
  selector: 'app-scan-request',
  templateUrl: './scan-request.component.html',
  styleUrls: ['./scan-request.component.scss']
})
export class ScanRequestComponent implements OnInit, OnDestroy {
  myRequestForm = new FormGroup({
    scanType: new FormControl('mobile_app'),
    type: new FormControl('repo'),
    programLanguage: new FormControl('javascript'),
    buildCommand: new FormControl({value: '', disabled: true})
  });

  flagScanTypeNext = false;
  flagShowUpload = true;
  flagShowRepo = false;
  flagShowWeb = false;
  pCount = 40;
  progressCount = this.pCount + '%';
  numbers = interval(1000);
  numberInterval = this.numbers.subscribe(val => {
    this.pCount = (val % 21) * 5;
    this.progressCount = this.pCount + '%';
  });

  constructor() {
/*    this.numberInterval = this.numbers.subscribe(val => {
      this.pCount = val % 100;
      this.progressCount = this.pCount + '%';
    });
 */
  }

  ngOnInit() {

  }

  ngOnDestroy(): void {
    this.numberInterval.unsubscribe();
  }


  updateScanType(val) {
    this.myRequestForm.patchValue({
      scanType: val
    });

    this.flagShowRepo = false;
    this.flagShowUpload = false;
    this.flagShowWeb = false;
    switch (val) {
      case 'source_code':
        this.flagShowRepo = true;
        this.flagShowUpload = true;
        break;

      case 'mobile_app':
        this.flagShowUpload = true;
        break;

      case 'web_app':
        this.flagShowWeb = true;
        break;
    }
  }

  clickScanType() {
    this.flagScanTypeNext = true;
    setTimeout(() => {
      this.flagScanTypeNext = false;
    }, 3000);
  }

}
