import {
  AfterViewChecked,
  Component, ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { interval } from 'rxjs';
import {MDBModalRef, MdbStepperComponent, ToastService} from 'ng-uikit-pro-standard';
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
  @ViewChild('tokenModal', {static: false}) tokenModal: MDBModalRef;

  myRequestForm = new FormGroup({
    scanType: new FormControl('mobile_app'),
    type: new FormControl('repo'),
    repoURL: new FormControl(''),
    tokenId: new FormControl(0),
    uploadId: new FormControl(0),
    programLanguage: new FormControl('javascript'),
    buildCommand: new FormControl({value: '', disabled: true})
  });

  myTokenForm = new FormGroup({
    token: new FormControl('', [Validators.required, Validators.minLength(5)]),
    label: new FormControl('', [Validators.required, Validators.minLength(5)])
  });

  flagLoadingAddToken = false;
  uploadId: number;
  freshFile = true;
  progressUploadCount = 0;
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
              private myToast: ToastService,
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
    this.myRequest.currentProgressUpload.subscribe(val => { this.progressUploadCount = val; });

    this.extrasState = this.router.getCurrentNavigation().extras.state;
  }

  ngOnInit() {
    this.freshFile = true;
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

  updateDeliveryMethod(val) {
    this.myRequestForm.patchValue({
      type: val
    });
  }

  /**
   * Method to add the Personal Access Token
   */
  get label() { return this.myTokenForm.get('label'); }
  get token() { return this.myTokenForm.get('token'); }

  handleAddToken() {
    console.log (this.myTokenForm.value);
    this.flagLoadingAddToken = true;

    this.myRequest.addAccessToken(this.myTokenForm.value.label, this.myTokenForm.value.token)
      .then(res => {
        console.log (res);
        this.myToast.success('Token Added', 'Add Access Token');

        // Refresh the list
        this.myRequest.getListAccessToken();
      })
      .catch(err => {
        console.log (err);
        this.myToast.error('Failed to add token', 'Add Access Token');
      })
      .finally(() => {
        this.flagLoadingAddToken = false;
        this.tokenModal.hide();
      });
  }

  /**
   * Method to handle the user placing the file to the upload window
   */
  onFileAdd(file: File) {
    this.updateDeliveryMethod('file');

    // Lets check if already uploaded a file
    if (!this.freshFile) {
      // Remove the file first, then upload the new file
      this.myRequest.deleteUploadedFile(this.uploadId)
        .then((res) => {
          // @ts-ignore
          this.myToast.info(res.info.originalName , 'Remove Old File');
        })
        .catch((err) => {})
        .finally(() => {
          // Wait for 500ms before triggering to upload the new file
          setTimeout(() => { this.uploadTheFile(file); }, 500);
        });
    } else {
      // Immediately upload the file
      this.uploadTheFile(file);
    }
  }

  /**
   * Method to upload the file to server
   */
  uploadTheFile(file: File) {
    this.file = file;

    const uploadFile = new FormData();
    uploadFile.append('Payload', file);

    // Remarks: Trigger to upload the file
    this.progressUploadCount = 0;
    this.flagUpload = true;
    this.myRequest.uploadFile(uploadFile)
      .then(res => {
        // @ts-ignore
        this.myToast.success(res.info.name, 'Upload File');
        // @ts-ignore
        this.uploadId = res.uploadId;
        this.myRequestForm.patchValue({uploadId: this.uploadId});
      })
      .catch(err => {
        console.error (err);
      })
      .finally(() => {
        this.freshFile = false;
        setTimeout(() => { this.flagUpload = false; }, 1000);
      });
  }

  /**
   * Method to handle when user remove the uploaded file
   */
  onFileRemove() {
    this.myRequest.deleteUploadedFile(this.uploadId)
      .then((res) => {
        // @ts-ignore
        this.myToast.success(res.info.originalName, 'Remove Old File');
        this.myRequestForm.patchValue ({ uploadId: 0});
      })
      .catch(err => {
        this.myToast.error(err, 'Remove Old File');
      })
      .finally(() => {
        this.file = null;
        this.freshFile = true;
      });
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
