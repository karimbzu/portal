import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OrderInfo } from '../models/order-info';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../environments/environment';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private listOrder: BehaviorSubject < OrderInfo [] > = new BehaviorSubject( []);
  currentListOrder = this.listOrder.asObservable();

  constructor(public http: HttpClient) {
    this.getListOrder();
  }

  getListOrder() {
    if (!sessionStorage.getItem('authToken')) {
      console.error ('getListAccessToken', 'No authToken available for this user');
      return;
    }

    // Fetch the data
    this.http.get(environment.baseUrl + 'ticketing/order_history', {
      headers: new HttpHeaders()
        .set('Authorization', environment.oipToken)
        .set('x-auth-token', sessionStorage.getItem('authToken')),
      observe: 'response'
    }).subscribe((response: any) => {
      // console.log (response.body.info);
      if (response.body.info !== undefined) {
        // Update the list
        this.listOrder.next (response.body.info);
      }
    });
  }

  /**
   * Method to download report
   */
  getReport(reportId, fileName) {
    if (!sessionStorage.getItem('authToken')) {
      console.error ('getListAccessToken', 'No authToken available for this user');
      return;
    }

    // Fetch the data
    this.http.get(environment.baseUrl + 'ticketing/report/' + reportId, {
      headers: new HttpHeaders()
        .set('Authorization', environment.oipToken)
        .set('x-auth-token', sessionStorage.getItem('authToken')),
      observe: 'response',
      responseType: 'blob'
    }).subscribe((response: any) => {
      const blob = new Blob([response.body]);
      FileSaver.saveAs(blob, fileName);
    }, err => {
      console.error ('Something went wrong when processing downloading the report');
      console.error (err);
    });
  }

  /**
   * Method to download report
   */
  getSelfReport(reportId) {
    if (!sessionStorage.getItem('authToken')) {
      console.error ('getListAccessToken', 'No authToken available for this user');
      return;
    }

    // Fetch the data
    this.http.get(environment.baseUrl + 'ticketing/self/report/' + reportId, {
      headers: new HttpHeaders()
        .set('Authorization', environment.oipToken)
        .set('x-auth-token', sessionStorage.getItem('authToken')),
      observe: 'response',
      responseType: 'blob'
    }).subscribe((response: any) => {
      const blob = new Blob([response.body], { type: 'application/pdf' });
      FileSaver.saveAs(blob, 'report.pdf');
    }, err => {
      console.error ('Something went wrong when processing downloading the report');
      console.error (err);
    });
  }

}
