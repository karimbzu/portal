import { Component, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { MDBModalRef, MdbStepperComponent, ToastService } from 'ng-uikit-pro-standard';
import { Router } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { ValidateFn } from 'codelyzer/walkerFactory/walkerFn';
import {CartService} from '../../services/cart.service';
import {OptService, Request} from '../../models/request';

/**
 * Custom cross field validation component. It need to return null for valid form checking
 */
// @ts-ignore
const validateStep2: ValidateFn = (control: FormGroup): ValidationErrors | null => {
  const type = control.get('type');
  const repoURL = control.get('repoURL');
  const tokenId = control.get('tokenId');
  const uploadId = control.get('uploadId');

  if (type.value === 'repo') {
    console.log (type.value, repoURL.value, tokenId.value);
    if (repoURL.value.length < 5) {
      repoURL.setErrors({minLength: true});
    } else if (tokenId.value === 0) {
      tokenId.setErrors({min: true});
    }
  } else {
    if (uploadId.value === 0) {
      uploadId.setErrors({min: true});
    }
  }

  return null;
};

@Component({
  selector: 'app-scan-request',
  templateUrl: './scan-request.component.html',
  styleUrls: ['./scan-request.component.scss']
})
export class ScanRequestComponent implements OnInit, OnDestroy {
  @Input() flagBrowse: boolean;
  @ViewChild('stepper', { static: true }) stepper: MdbStepperComponent;
  @ViewChild('tokenModal', {static: false}) tokenModal: MDBModalRef;

  handlerSubscribeProgLangForm;
  handlerSubscribeListAuthToken;
  handlerSubscribeProgressUpload;
  handlerSubscribeOptServForm;


  /**
   * Remarks: We opt to create a form for each step so that
   * it will be easier to manage when dealing with error
   * on respective form
   */
  myScanTypeForm = new FormGroup({
    scanType: new FormControl('source_code')
  });
  myScanItemForm = new FormGroup({
    type: new FormControl('repo'),
    repoURL: new FormControl(''),
    tokenId: new FormControl(0),
    uploadId: new FormControl(0)
//  }, {validators: validateStep2, updateOn: 'blur'});
  });

  myValidateForm = new FormGroup({
    dummy: new FormControl(0, [Validators.min(1)])
  });
  myProgLangForm = new FormGroup({
    programLanguage: new FormControl('javascript'),
    buildCommand: new FormControl({value: '', disabled: true})
  });
  myOptServForm = new FormGroup({
    securityVulnerability: new FormControl({value: true, disabled: true}),
    android: new FormControl(false),
    webApplication: new FormControl(false),
    continuousScan: new FormControl(false)
  });

  myTokenForm = new FormGroup({
    token: new FormControl('', [Validators.required, Validators.minLength(5)]),
    label: new FormControl('', [Validators.required, Validators.minLength(5)])
  });

  scanType;
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
  totalToken = 1;

  flagNeedValidation: boolean;  // indicate if need to perform the Content Validation (Step 3), or not
  flagValidationFetchLoading: boolean;
  flagValidationFetchDone: boolean;
  flagValidationFetchError: boolean;
  flagValidationLanguageLoading: boolean;
  flagValidationLanguageDone: boolean;
  flagValidationLanguageError: boolean;
  flagValidationCleanLoading: boolean;
  flagValidationCleanDone: boolean;
  flagValidationCleanError: boolean;

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
              private myRequest: RequestService,
              private myCart: CartService) {
    this.extrasState = this.router.getCurrentNavigation().extras.state;
  }

  ngOnInit() {
    this.freshFile = true;
    this.flagVerticalStepper = window.innerWidth < 1000;
    this.flagNeedValidation = true;
    this.handlerSubscribeProgLangForm = this.myProgLangForm.get('programLanguage').valueChanges.subscribe(val => this.updateProgLang(val));
    this.handlerSubscribeListAuthToken = this.myRequest.currentListAuthToken.subscribe(val => this.appendAuthToken(val));
    this.handlerSubscribeProgressUpload = this.myRequest.currentProgressUpload.subscribe(val => { this.progressUploadCount = val; });

    this.totalToken = 1;
    this.handlerSubscribeOptServForm = this.myOptServForm.valueChanges.subscribe(val => this.calculateTotalToken(val));

    // Remarks: We use timeout to navigate to the 2nd step if this page came from dashboard.
    // Previously, we use AfterInit or AfterView ... but it comes with a cost.
    setTimeout(() => {
      this.moveToStep2();
    }, 100);
  }

  ngOnDestroy() {
    this.handlerSubscribeProgLangForm.unsubscribe();
    this.handlerSubscribeListAuthToken.unsubscribe();
    this.handlerSubscribeProgressUpload.unsubscribe();
    this.handlerSubscribeOptServForm.unsubscribe();
  }

  /**
   * Method to append the Access Token upon callback of the subscription
   */
  appendAuthToken(val) {
    if (val.length) {
      this.tempAccessToken = val.map(this.mapLabel2Value);
    }
  }

  mapLabel2Value(item) {
    const retJson = {
      value : item.tokenId,
      label : item.label
    };
    return retJson;
  }

  /**
   * Method to calculate the total token used upon callback of subscription
   * of changes to the Optional Services
   */
  calculateTotalToken(val) {
    let tempToken = 1;
    if (val.android) { tempToken++; }
    if (val.webApplication) { tempToken++; }

    this.totalToken = tempToken;
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
    this.myScanTypeForm.patchValue({
      scanType: val
    });

    this.scanType = val;          // To be used in Step 4
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
    this.stepper.next();
  }

  /**
   * Method to handle the changes in Type selection
   */
  updateDeliveryMethod(val) {
    this.myScanItemForm.patchValue({
      type: val
    });

    this.flagNeedValidation = true;

    // Validate
    if (val === 'repo') {
      this.myScanItemForm.setErrors(null);
    } else {
      const uploadId = this.myScanItemForm.get('uploadId');
      if (uploadId.value === 0) {
        this.myScanItemForm.setErrors({uploadFile: true});
      } else {
        this.myScanItemForm.setErrors(null);
      }
    }

    // Enable/Disable the Continuous Scanning
    if (val === 'repo') {
      this.myOptServForm.get('continuousScan').enable();
    } else {
      this.myOptServForm.get('continuousScan').disable();
    }
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
        this.myScanItemForm.patchValue({uploadId: this.uploadId});
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
        this.myScanItemForm.patchValue ({ uploadId: 0});

        // Trigger to perform scanning (Step 3)
        this.flagNeedValidation = true;
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
      this.myProgLangForm.get('buildCommand').enable();
    } else {
      this.myProgLangForm.get('buildCommand').disable();
    }
  }

  handleStepChange() {
    // Set the submit button flag
    this.flagSubmit = this.scanType === 'source_code' ? this.stepper.activeStepIndex >= 4 : this.stepper.activeStepIndex >= 2;

    if (this.stepper.activeStepIndex === 2 && this.flagNeedValidation) { this.handleStep3(); }
  }

  /**
   * Process the Step 3 - Validate Content
   */
  handleStep3() {
    // Get the data from Step 2
    const scanType = this.myScanTypeForm.get('scanType').value;
    const type = this.myScanItemForm.get('type').value;
    const repoURL = this.myScanItemForm.get('repoURL').value;
    const tokenId = this.myScanItemForm.get('tokenId').value;
    const uploadId = this.myScanItemForm.get('uploadId').value;

    // Initialize the flag visual
    this.flagValidationFetchLoading = true;
    this.flagValidationFetchDone = false;
    this.flagValidationFetchError = false;
    this.flagValidationLanguageLoading = false;
    this.flagValidationLanguageDone = false;
    this.flagValidationLanguageError = false;
    this.flagValidationCleanLoading = false;
    this.flagValidationCleanDone = false;
    this.flagValidationCleanError = false;
    this.myValidateForm.get('dummy').setValue(0);

    if (type === 'repo') {
      // URL can't be empty
      if (!repoURL.length) {
        console.error ('RepoURL field is EMPTY');
        this.myToast.error ('RepoURL field is EMPTY', 'Validate Item');
        this.flagValidationFetchLoading = false;
        this.flagValidationFetchError = true;
        return;
      }

      if (!tokenId) {
        console.error ('No Access Token is selected');
        this.myToast.error ('No Access Token is selected', 'Validate Item');
        this.flagValidationFetchLoading = false;
        this.flagValidationFetchError = true;
        return;
      }

      // Send the request to validate repo
      this.myRequest.evaluateCheckRepo(repoURL, tokenId)
        .then(path => {
          this.flagValidationFetchDone = true;
          this.processEvaluateLanguage(path);
        })
        .catch(err => {
          this.flagValidationFetchError = true;
          console.error (err.message);
          this.myToast.error (err.message);
        })
        .finally(() => {
          this.flagValidationFetchLoading = false;
        });
    } else {
      if (!uploadId) {
        console.error ('No file is uploaded');
        this.myToast.error ('No file is uploaded', 'Validate Item');
        this.flagValidationFetchLoading = false;
        this.flagValidationFetchError = true;
        return;
      }

      // Send the request to validate file
      this.myRequest.evaluateCheckFile(uploadId)
        .then(path => {
          console.log ('Path', path);
          this.flagValidationFetchDone = true;
          if (scanType === 'source_code') { this.processEvaluateLanguage(path);
          } else if (scanType === 'mobile_app') { this.processEvaluateBinary(path);
          } else {
            console.log ('Need to handle evaluation for web app');
          }
        })
        .catch(err => {
          this.flagValidationFetchError = true;
          console.error (err);
          this.myToast.error (err.message);
        })
        .finally(() => {
          this.flagValidationFetchLoading = false;
        });
    }
  }

  processEvaluateLanguage(path) {
    this.flagValidationLanguageLoading = true;
    this.myRequest.evaluateCheckLanguage(path)
      .then((res: any) => {
        this.flagValidationLanguageDone = true;

        // TODO: Update the Programming Language (Step 4) accordingly
        console.log ('Programming Language', res.language);
        if (typeof res.language === 'string') {
          this.myProgLangForm.get('programLanguage').setValue(res.language.toLocaleLowerCase());
        } else {
          console.log (typeof res.language);
        }

        this.processEvaluateClean();
      })
      .catch(err => {
        this.flagValidationLanguageError = true;
        console.error (err);
        this.myToast.error (err.message);
      })
      .finally(() => {
        this.flagValidationLanguageLoading = false;
      });
  }

  processEvaluateBinary(path) {
    // Dummy - just skip this part
    this.flagValidationLanguageLoading = false;
    this.flagValidationLanguageDone = true;
    this.processEvaluateClean();
  }

  processEvaluateClean() {
    this.flagValidationCleanLoading = true;
    this.myRequest.evaluateClean()
      .then(res => {
        this.flagValidationCleanDone = true;
        // If all goes well, we can skip the validation
        // until changes in selection
        this.flagNeedValidation = false;

        // Remarks: We set the dummy value to 2, so that
        // this form can be valid
        this.myValidateForm.get('dummy').setValue(2);
      })
      .catch(err => {
        this.flagValidationCleanError = true;
        console.error (err);
        this.myToast.error(err.message);
        this.myValidateForm.setErrors({required: true});
      })
      .finally(() => {
        this.flagValidationCleanLoading = false;
      });
  }

  get android() { return this.myOptServForm.get('android'); }
  get webApplication() { return this.myOptServForm.get('webApplication'); }
  get continuousScan() { return this.myOptServForm.get('continuousScan'); }

  /**
   * Handle the Form Submission
   */
  handleSubmit() {
    console.log (this.myOptServForm.value);

    // Populate the requestData structure
    const optServiceData: OptService = {
      security_vulnerability: this.myOptServForm.get('securityVulnerability').value,
      web_app: this.myOptServForm.get('webApplication').value,
      android: this.myOptServForm.get('android').value,
      continuous_scanning: this.myOptServForm.get('continuousScan').value
    };
    const requestData: Request = {
      scanType: this.myScanTypeForm.get('scanType').value,
      type: this.myScanItemForm.get('type').value,
      repoURL: this.myScanItemForm.get('repoURL').value,
      tokenId: this.myScanItemForm.get('tokenId').value,
      uploadId: this.myScanItemForm.get('uploadId').value,
      optService: optServiceData,
      programLanguage: this.myProgLangForm.get('programLanguage').value,
      buildCommand: this.myProgLangForm.get('buildCommand').value,
      price: this.totalToken
    };

    this.myCart.addCart(requestData)
      .then(res => {
        this.myCart.getListCart();
        console.log (res);
        this.router.navigate(['/my-cart']);
      })
      .catch(err => {
        console.error (err);
        this.myToast.error('Failed to add to Cart');
      });
  }
}
