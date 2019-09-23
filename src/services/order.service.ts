import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OrderInfo } from '../models/order-info';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';

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
    if (!localStorage.getItem('authToken')) {
      console.error ('getListAccessToken', 'No authToken available for this user');
      return;
    }

    // Fetch the data
    this.http.get(environment.baseUrl + 'ticketing/order_history', {
      headers: new HttpHeaders()
        .set('Authorization', environment.oipToken)
        .set('x-auth-token', localStorage.getItem('authToken')),
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
  getReport(reportId) {
    if (!localStorage.getItem('authToken')) {
      console.error ('getListAccessToken', 'No authToken available for this user');
      return;
    }

    // Fetch the data
    this.http.get(environment.baseUrl + 'ticketing/report/' + reportId, {
      headers: new HttpHeaders()
        .set('Authorization', environment.oipToken)
        .set('x-auth-token', localStorage.getItem('authToken')),
      observe: 'response'
    }).subscribe((response: any) => {
      // console.log (response.body);
      // TODO: review
      return response.body;
    });
  }

}
