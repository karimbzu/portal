import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';


@Injectable({
    providedIn: 'root'
  })

export class TokenService {
    private tokenAmount = new BehaviorSubject(0);
    currentTokenAmount = this.tokenAmount.asObservable();

    constructor(public http: HttpClient) {
      this.getTokenBalance();
    }

  /**
   * Method to get the token balance for user
   */
  getTokenBalance() {
        if (!sessionStorage.getItem('authToken')) {
          console.error ('getUserToken', 'No authToken available for this user');
          return;
        }

        // Fetch the data
        this.http.get(environment.baseUrl + 'ticketing/token/balance', {
          headers: new HttpHeaders()
            .set('Authorization', environment.oipToken)
            .set('x-auth-token', sessionStorage.getItem('authToken')),
          observe: 'response'
        }).subscribe((response: any) => {
          console.log (response.body.info);
          if (response.body.info !== undefined) {
            // Update the list
            this.tokenAmount.next (response.body.info.amount);
          }
        });
      }

  /**
   * Method for Account Manager to topup the token for his organization
   */
  topupToken(topup) {
    if (!sessionStorage.getItem('authToken')) {
        console.error ('topupToken', 'No authToken available for this user');
        return;
    }

    const body = {topup};
    // Fetch the data
    this.http.post(environment.baseUrl + 'ticketing/token/topup', body, {
      headers: new HttpHeaders()
        .set('Authorization', environment.oipToken)
        .set('x-auth-token', sessionStorage.getItem('authToken')),
      observe: 'response'
    }).subscribe((response: any) => {
      // console.log (response.body.info);
      if (response.body !== undefined) {
        // Update the list
         this.tokenAmount.next (response.body.amount);
        //  console.log("after topuppp"+JSON.stringify(response.body.amount));
      }
    });
  }

  // requestToken() {
  //   if (!sessionStorage.getItem('authToken')) {
  //       console.error ('topupToken', 'No authToken available for this user');
  //       return;
  //   }

  //   // Fetch the data
  //   this.http.get(environment.baseUrl + 'ticketing/topup/request/' + topup, {
  //     headers: new HttpHeaders()
  //       .set('Authorization', environment.oipToken)
  //       .set('x-auth-token', sessionStorage.getItem('authToken')),
  //     observe: 'response'
  //   }).subscribe((response: any) => {
  //     console.log (response.body.info);
  //     if (response.body.info !== undefined) {
  //       // Update the list
  //       this.tokenAmount.next (response.body.info.amount);
  //     }
  //   });
  // }

}
