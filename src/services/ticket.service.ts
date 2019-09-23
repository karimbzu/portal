import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CartService } from './cart.service';
import { environment } from '../environments/environment';
import { map, reduce } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  listCart;

  private totalItem = new BehaviorSubject(0);
  private totalPrice = new BehaviorSubject( 0);
  currentTotalItem = this.totalItem.asObservable();
  currentTotalPrice = this.totalPrice.asObservable();

  private ticketInfo = new BehaviorSubject([]);
  currentTicketInfo = this.ticketInfo.asObservable();

  constructor(public http: HttpClient,
              private myCart: CartService) {
    this.myCart.currentListCart.subscribe(val => {
      this.listCart = val;

      // Any changes to the cart, need to be reflected
      // to the listTicket
      // Remarks: We use the reduce function to aggregate all the price
      const tempList = map(val, 'cartId');
      const tempPrice = map(val, 'price');
      this.totalItem.next(tempList.length);
      this.totalPrice.next(reduce(tempPrice, (sum, n) => sum + n, 0));
    });
  }

  /**
   * Get the list of account managers
   */
  getAcctManagerList() {
    return new Promise ((resolve, reject) => {
      if (!localStorage.getItem('authToken')) {
        console.error ('getListAccessToken', 'No authToken available for this user');
        reject(new Error('No authToken available for this user'));
      }

      // Fetch the data
      this.http.get(environment.baseUrl + 'auth/acct_manager', {
        headers: new HttpHeaders()
          .set('Authorization', environment.oipToken)
          .set('x-auth-token', localStorage.getItem('authToken')),
        observe: 'response'
      }).subscribe((response: any) => {
        resolve (response.body);
      });
    });
  }

  /**
   * Place order
   */
  placeOrder(myProject, myDescription) {
    return new Promise ((resolve, reject) => {
      if (!localStorage.getItem('authToken')) {
        console.error ('getListAccessToken', 'No authToken available for this user');
        reject(new Error('No authToken available for this user'));
      }

      // Remarks:
      // We need to convert the list of cardId as string before submit to API
      // We utilize the map function to form an array of cartId
      const formData = {
        cartList: JSON.stringify(map(this.listCart, 'cartId')),
        project: myProject,
        description: myDescription
      };

      // Submit the request
      this.http.post(environment.baseUrl + 'ticketing/ticket', formData, {
        headers: new HttpHeaders()
          .set('Authorization', environment.oipToken)
          .set('x-auth-token', localStorage.getItem('authToken')),
        observe: 'response'
      }).subscribe((response: any) => {
        // Regardless of the result, we need to update the cartList
        this.myCart.getListCart();

        // Update the next
        this.ticketInfo.next (response.body.info);

        // Response back
        resolve (response.body);
      });
    });
  }

}
