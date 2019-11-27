import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { Request } from '../models/request';
import { Cart } from '../models/cart';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartCount = new BehaviorSubject(0);
  currentCartValue = this.cartCount.asObservable();

  private listCart: BehaviorSubject< Cart []> = new BehaviorSubject( []);
  currentListCart = this.listCart.asObservable();

  constructor(public http: HttpClient) {
    this.getListCart();
  }

  /**
   * Fetch the user cart list
   */
  getListCart() {
    if (!sessionStorage.getItem('authToken')) {
      console.error ('getListAccessToken', 'No authToken available for this user');
      return;
    }

    // Fetch the data
    this.http.get(environment.baseUrl + 'ticketing/cart', {
      headers: new HttpHeaders()
        .set('Authorization', environment.oipToken)
        .set('x-auth-token', sessionStorage.getItem('authToken')),
      observe: 'response'
    }).subscribe((response: any) => {
      console.log (response.body.info);
      if (response.body.info !== undefined) {
        // Update the number of carts in list
        this.cartCount.next (response.body.info.length);

        // Update the list
        this.listCart.next (response.body.info);
      }
    });
  }

  /**
   * Add a cart
   */
  addCart(requestData: Request) {
    return new Promise((resolve, reject) => {
      if (!sessionStorage.getItem('authToken')) {
        console.error ('addAccessToken', 'No authToken available for this user');
        reject(new Error('No authToken available for this user'));
      }

      const formData = {
        scanType: requestData.scanType,
        type: requestData.type,
        uploadId: requestData.uploadId,
        repoURL: requestData.repoURL,
        tokenId: requestData.tokenId,
        optService: JSON.stringify(requestData.optService),
        price: requestData.price
      };

      this.http.post(environment.baseUrl + 'ticketing/cart', formData, {
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
   * Delete a cart identified by its cartId
   */
  deleteCart(cartId) {
    return new Promise((resolve, reject) => {
      if (!sessionStorage.getItem('authToken')) {
        console.error ('addAccessToken', 'No authToken available for this user');
        reject(new Error('No authToken available for this user'));
      }

      this.http.delete(environment.baseUrl + 'ticketing/cart/' + cartId, {
        headers: new HttpHeaders()
          .set('Authorization', environment.oipToken)
          .set('x-auth-token', sessionStorage.getItem('authToken')),
        observe: 'response'
      }).subscribe((response: any) => {
        // if successfully delete the cart, the list also need to be updated
        this.getListCart();

        // notify the caller
        resolve(response.body);
      });
    });
  }

}
