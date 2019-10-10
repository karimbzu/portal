import {
  AfterContentChecked, AfterViewChecked,
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { interval } from 'rxjs';
import { MdbStepperComponent } from 'ng-uikit-pro-standard';
import { Router } from '@angular/router';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-scan-request',
  templateUrl: './scan-request.component.html',
  styleUrls: ['./scan-request.component.scss']
})
export class ScanRequestComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() flagBrowse: boolean;
  @ViewChild('stepper', { static: true }) stepper: MdbStepperComponent;

  myRequestForm = new FormGroup({
    scanType: new FormControl('mobile_app'),
    type: new FormControl('repo'),
    programLanguage: new FormControl('javascript'),
    buildCommand: new FormControl({value: '', disabled: true})
  });

  extrasState = null;
  file: File;
  flagVerticalStepper = false;
  flagSubmit = false;
  flagShowUpload = true;
  flagShowRepo = false;
  flagShowWeb = false;
  flagUpload = false;
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

  /**
   * Method to handle changes in screen size
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.flagVerticalStepper = window.innerWidth < 1000;
  }

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

    this.extrasState = this.router.getCurrentNavigation().extras.state;
  }

  ngOnInit() {
    this.flagVerticalStepper = window.innerWidth < 1000;
    this.myRequestForm.get('programLanguage').valueChanges.subscribe(val => this.updateProgLang(val));
  }

  /**
   * Remarks: I have tried both AfterViewInit and AfterViewChecked, there still error with changes of template
   * If I tried the AfterContentInit/AfterContentChecked, it is even worse. So, i just stick with AfterView
   */
  ngAfterViewChecked(): void {
    this.moveToStep2();
  }

  ngOnDestroy(): void {
    this.numberInterval.unsubscribe();
  }

  moveToStep2() {
    if (this.extrasState !== undefined) {
      this.updateScanType(this.extrasState.scanType);
    }
  }

  /**
   * Method to update the changes of Scan Type selection. Automatically move to the next step
   */
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

    // Initiate to next step
    this.stepper.setNewActiveStep(1);
  }

  openDialogAddToken() {
    console.log ('Open the dialog modal');
  }

  updateDeliveryMethod(val) {
    this.myRequestForm.patchValue({
      type: val
    });
  }

  /**
   * Method to handle the user placing the file to the upload window
   */
  onFileAdd(file: File) {
    this.updateDeliveryMethod('file');
    this.file = file;

    const uploadFile = new FormData();
    uploadFile.append('Payload', file);

    // Remarks: Trigger to uplaod the file
    this.flagUpload = true;
  }

  /**
   * Method to handle when user remove the uploaded file
   */
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
    this.flagSubmit = this.stepper.activeStepIndex >= 4;
  }

  handleSubmit() {
    // Dummy
    this.router.navigate(['/my-cart']);
  }
}
