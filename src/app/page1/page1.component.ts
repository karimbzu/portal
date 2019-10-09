import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MdbStepperComponent} from 'ng-uikit-pro-standard';
import {interval} from 'rxjs';
import {Router} from '@angular/router';
import {RequestService} from '../../services/request.service';

@Component({
  selector: 'app-page1',
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.scss']
})
export class Page1Component implements OnInit, OnDestroy {
  @Input() flagBrowse: boolean;
  @ViewChild('stepper', { static: true }) stepper: MdbStepperComponent;

  myRequestForm = new FormGroup({
    scanType: new FormControl('mobile_app'),
    type: new FormControl('repo'),
    programLanguage: new FormControl('javascript'),
    buildCommand: new FormControl({value: '', disabled: true})
  });

  file: File;
  flagSubmit = false;
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

  tempAccessToken = [];
  optProgLangList = [
    {value: 'javascript', label: 'JavaScript'},
    {value: 'java', label: 'Java'},
    {value: 'php', label: 'PHP'},
    {value: 'python', label: 'Python'}
  ];

  constructor(public router: Router,
              private myRequest: RequestService ) {
    this.myRequest.currentListAuthToken.subscribe(val => {
      if (val.length) {
        function mapLabel2Value(item) {
          const retJson = {
            value : item.tokenId,
            label : item.label
          };
          return retJson;
        }

        this.tempAccessToken = val.map(mapLabel2Value);
      }
    });
  }

  ngOnInit() {
    this.myRequestForm.get('programLanguage').valueChanges.subscribe(val => this.updateProgLang(val));
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

  openDialogAddToken() {
    console.log ('Open the dialog modal');
  }

  updateDeliveryMethod(val) {
    this.myRequestForm.patchValue({
      type: val
    });
  }

  onFileAdd(file: File) {
    this.file = file;

    const uploadFile = new FormData();
    uploadFile.append('Payload', file);
  }

  onFileRemove() {
    this.file = null;
  }

  /**
   * Method to update the Build Command form input when changes of Programming Language dropdown list
   */
  updateProgLang(val) {
    if (val === 'java') {
      this.myRequestForm.get('buildCommand').enable();
    } else {
      this.myRequestForm.get('buildCommand').disable();
    }
  }

  handleStepChange() {
    // Set the submit button flag
    this.flagSubmit = this.stepper.activeStepIndex < 4 ? false : true;
  }

  handleSubmit() {
    // Dummy
    this.router.navigate(['/my-account']);
  }

}
