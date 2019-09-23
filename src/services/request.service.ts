import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { Request, AccessToken, SCAN_TYPE, TYPE} from '../models/request';
import { environment } from '../environments/environment';
import {FileUploader} from 'ng2-file-upload';
import {HttpClient, HttpHeaders} from '@angular/common/http';



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
    price: 0
  });
  currentRequestData = this.requestData.asObservable();

  private tokenValue =   localStorage.getItem('authToken');
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
    if (!localStorage.getItem('authToken')) {
      console.error ('getListAccessToken', 'No authToken available for this user');
      return;
    }

    // Fetch the data
    this.http.get(environment.baseUrl + 'ticketing/access_token', {
      headers: new HttpHeaders()
        .set('Authorization', environment.oipToken)
        .set('x-auth-token', localStorage.getItem('authToken')),
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
      if (!localStorage.getItem('authToken')) {
        console.error ('addAccessToken', 'No authToken available for this user');
        reject(new Error('No authToken available for this user'));
      }

      console.log (token);
      console.log (typeof token);

      const formData = {
        label,
        access_token: token
      };
      this.http.post(environment.baseUrl + 'ticketing/access_token', formData, {
        headers: new HttpHeaders()
          .set('Authorization', environment.oipToken)
          .set('x-auth-token', localStorage.getItem('authToken')),
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
   * Upload file
   */
  uploadFile(file) {

  }

  /**
   * Delete Uploaded file
   */
  deleteUploadedFile(uploadId) {
    if (!localStorage.getItem('authToken')) {
      console.error ('addAccessToken', 'No authToken available for this user');
      return;
    }

    this.http.delete(environment.baseUrl + 'ticketing/upload/' + uploadId, {
      headers: new HttpHeaders()
        .set('Authorization', environment.oipToken)
        .set('x-auth-token', localStorage.getItem('authToken')),
      observe: 'response'
    }).subscribe((response: any) => {
      console.log (response.body);

      // Remarks: Need to handle clearing the parameter
    });
  }
}
