import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AccessToken, Request, SCAN_TYPE, TYPE} from '../models/request';
import {environment} from '../environments/environment';
import {FileUploader} from 'ng2-file-upload';
import {HttpClient, HttpEventType, HttpHeaders, HttpRequest, HttpResponse} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private listAuthToken: BehaviorSubject<AccessToken []> = new BehaviorSubject([]);
  currentListAuthToken = this.listAuthToken.asObservable();

  private requestData: BehaviorSubject<Request> = new BehaviorSubject({
    scanType: SCAN_TYPE.source_code,
    type: TYPE.file,
    uploadId: 0,
    repoURL: '',
    tokenId: 0,
    optService: {
      security_vulnerability: true,
      web_app: false,
      android: false,
      continuous_scanning: false
    },
    programLanguage: '',
    buildCommand: '',
    price: 0
  });
  currentRequestData = this.requestData.asObservable();

  private tokenValue =   sessionStorage.getItem('authToken');
  private uploader: BehaviorSubject<FileUploader> = new BehaviorSubject(new FileUploader({
    url: environment.uploadUrl + 'ticketing/upload',
    disableMultipart : false,
    autoUpload: true,
    method: 'post',
    itemAlias: 'Payload',
    headers: [
      {
        name: 'x-auth-token',
        value:  this.tokenValue
      }]
  }));
  currentUploader = this.uploader.asObservable();

  // Lets attempt to create a variable progressUpload
  private progressUpload: BehaviorSubject<number> = new BehaviorSubject(0);
  currentProgressUpload = this.progressUpload.asObservable();

  constructor(public http: HttpClient) {
    this.getListAccessToken();
  }

  newRequest() {
    console.log ('Clean it up');
    this.requestData.next({
      scanType: SCAN_TYPE.source_code,
      type: TYPE.file,
      uploadId: 0,
      repoURL: '',
      tokenId: 0,
      optService: {
        security_vulnerability: true,
        web_app: false,
        android: false,
        continuous_scanning: false
      },
      programLanguage: '',
      buildCommand: '',
      price: 0
    });
  }

  updateRequest(theValue) {
    this.requestData.next(theValue);
  }

  /**
   * Get list of user's Personal Access Token
   * using GET /ticketing/access_token API
   */
  getListAccessToken() {
    if (!sessionStorage.getItem('authToken')) {
      console.error ('getListAccessToken', 'No authToken available for this user');
      return;
    }

    // Fetch the data
    this.http.get(environment.baseUrl + 'ticketing/access_token', {
      headers: new HttpHeaders()
        .set('Authorization', environment.oipToken)
        .set('x-auth-token', sessionStorage.getItem('authToken')),
      observe: 'response'
    }).subscribe((response: any) => {
      this.listAuthToken.next(response.body.info);
    });
  }

  /**
   * Register new Access Token using POST /ticketing/access_token API
   * now with Promise capability
   *
   * @input: label - short descriptive of the token
   * @input: token - Personal Access Token
   */
  addAccessToken(label, token) {
    return new Promise((resolve, reject) => {
      if (!sessionStorage.getItem('authToken')) {
        console.error ('addAccessToken', 'No authToken available for this user');
        reject(new Error('No authToken available for this user'));
      }

      // console.log (token);
      // console.log (typeof token);

      const formData = {
        label,
        access_token: token
      };
      this.http.post(environment.baseUrl + 'ticketing/access_token', formData, {
        headers: new HttpHeaders()
          .set('Authorization', environment.oipToken)
          .set('x-auth-token', sessionStorage.getItem('authToken')),
        observe: 'response'
      }).subscribe((response: any) => {
        // Since it is successful, we need to refresh the list
        // so who ever subscribe will get the latest list automatically
        this.getListAccessToken();

        // Reply to user
        resolve(response.body);
      });
    });
  }

  /**
   * Upload file, take note that you need to subscribe to the currentProgressUpload
   * to get the latest update on the progress
   */
  uploadFile(file) {
    return new Promise((resolve, reject) => {
      if (!sessionStorage.getItem('authToken')) {
        console.error ('uploadFile', 'No authToken available for this user');
        reject(new Error('No authToken available for this user'));
      }

      const headers = new HttpHeaders({'x-auth-token': this.tokenValue});
      const req = new HttpRequest('POST', environment.uploadUrl + 'ticketing/upload', file, {
        headers,
        reportProgress: true
      });

      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round (100 * event.loaded / event.total );
          this.progressUpload.next (progress);
        } else if (event instanceof HttpResponse) {
          if (event.ok) {
            console.log ('File uploaded');
            resolve(event.body);
          } else {
            // @ts-ignore
            console.error ('uploadFile', event.body.message);
            // @ts-ignore
            reject(new Error(event.body.message));
          }
        }
      });
    });
  }

  /**
   * Delete Uploaded file
   */
  deleteUploadedFile(uploadId) {
    return new Promise((resolve, reject) => {
      if (!sessionStorage.getItem('authToken')) {
        console.error ('deleteUploadedFile', 'No authToken available for this user');
        reject(new Error('No authToken available for this user'));
      }

      this.http.delete(environment.baseUrl + 'ticketing/upload/' + uploadId, {
        headers: new HttpHeaders()
          .set('Authorization', environment.oipToken)
          .set('x-auth-token', sessionStorage.getItem('authToken')),
        observe: 'response'
      }).subscribe((response: any) => {
        resolve(response.body);
      });
    });
  }

  /**
   * Evaluate Repo based item
   * POST: /ticketing/evaluate/check/repo
   */
  evaluateCheckRepo(repoURL, tokenId) {
    return new Promise((resolve, reject) => {
      if (!sessionStorage.getItem('authToken')) {
        console.error ('deleteUploadedFile', 'No authToken available for this user');
        reject(new Error('No authToken available for this user'));
      }

      const formData = {
        repoURL,
        tokenId
      };

      this.http.post(environment.baseUrl + 'ticketing/evaluate/check/repo', formData, {
        headers: new HttpHeaders()
          .set('Authorization', environment.oipToken)
          .set('x-auth-token', sessionStorage.getItem('authToken')),
        observe: 'response'
      }).subscribe((response: any) => resolve(response.body.path), err => reject(new Error(err.error.message)));
    });
  }

  /**
   * Evaluate file based item
   * POST: /ticketing/evaluate/check/file
   */
  evaluateCheckFile(uploadId) {
    return new Promise((resolve, reject) => {
      if (!sessionStorage.getItem('authToken')) {
        console.error ('deleteUploadedFile', 'No authToken available for this user');
        reject(new Error('No authToken available for this user'));
      }

      const formData = {
        uploadId
      };

      this.http.post(environment.baseUrl + 'ticketing/evaluate/check/file', formData, {
        headers: new HttpHeaders()
          .set('Authorization', environment.oipToken)
          .set('x-auth-token', sessionStorage.getItem('authToken')),
        observe: 'response'
      }).subscribe(
        (response: any) => resolve(response.body.path),
        err => reject(new Error(err.error.message))
      );
    });
  }

  /**
   * Evaluate the programming language
   * POST: /ticketing/evaluate/check/language
   */
  evaluateCheckLanguage(path) {
    return new Promise((resolve, reject) => {
      if (!sessionStorage.getItem('authToken')) {
        console.error ('deleteUploadedFile', 'No authToken available for this user');
        reject(new Error('No authToken available for this user'));
      }

      const formData = {
        path
      };

      this.http.post(environment.baseUrl + 'ticketing/evaluate/check/language', formData, {
        headers: new HttpHeaders()
          .set('Authorization', environment.oipToken)
          .set('x-auth-token', sessionStorage.getItem('authToken')),
        observe: 'response'
      }).subscribe((response: any) => resolve(response.body), err => reject(new Error(err.error.message)));
    });
  }

  /**
   * Clean up the evaluation item
   * DELETE: /ticketing/evaluate/clean
   */
  evaluateClean() {
    return new Promise((resolve, reject) => {
      if (!sessionStorage.getItem('authToken')) {
        console.error ('deleteUploadedFile', 'No authToken available for this user');
        reject(new Error('No authToken available for this user'));
      }

      this.http.delete(environment.baseUrl + 'ticketing/evaluate/clean', {
        headers: new HttpHeaders()
          .set('Authorization', environment.oipToken)
          .set('x-auth-token', sessionStorage.getItem('authToken')),
        observe: 'response'
      }).subscribe((response: any) => resolve(response.body), err => reject(new Error(err.error.message)));
    });
  }

}
