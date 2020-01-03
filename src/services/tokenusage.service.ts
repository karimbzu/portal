import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TokenUsageInfo } from '../models/tokenusage-info';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../environments/environment';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class TokenUsageService {
  private listUserToken: BehaviorSubject < TokenUsageInfo [] > = new BehaviorSubject( []);
  currentListUserToken = this.listUserToken.asObservable();

  constructor(public http: HttpClient) {
    this.getUserToken();
    console.log(this.getUserToken());
  }

  getUserToken() {
    if (!sessionStorage.getItem('authToken')) {
      console.error ('getListAccessToken', 'No authToken available for this user');
      return;
    }

    // Fetch the data
    this.http.get(environment.baseUrl + 'ticketing/token_usage', {
      headers: new HttpHeaders()
        .set('Authorization', environment.oipToken)
        .set('x-auth-token', sessionStorage.getItem('authToken')),
      observe: 'response'
    }).subscribe((response: any) => {
      // console.log (response.body.info);
      if (response.body.info !== undefined) {
        // Update the list
        this.listUserToken.next (response.body.info);
        // console.log("from tokenusageservice"+JSON.stringify(response.body.info));
      }
    });
  }


}
