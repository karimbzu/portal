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

     getTokenBalance() {
        if (!localStorage.getItem('authToken')) {
          console.error ('getUserToken', 'No authToken available for this user');
          return;
        }
    
        // Fetch the data
        this.http.get(environment.baseUrl + 'ticketing/token/balance', {
          headers: new HttpHeaders()
            .set('Authorization', environment.oipToken)
            .set('x-auth-token', localStorage.getItem('authToken')),
          observe: 'response'
        }).subscribe((response: any) => {
          console.log (response.body.info);
          if (response.body.info !== undefined) {
            // Update the number of carts in list
            // this.tokenAmount.next (response.body.info.length);
    
            // Update the list
            this.tokenAmount.next (response.body.info.amount);
          }
        });
      }

      deductToken(charging) {
        if (!localStorage.getItem('authToken')) {
          console.error ('deductToken', 'No authToken available for this user');
          return;
        }
    
        // Fetch the data
        this.http.get(environment.baseUrl + 'ticketing/token/deduct/' + charging, {
          
          headers: new HttpHeaders()
            .set('Authorization', environment.oipToken)
            .set('x-auth-token', localStorage.getItem('authToken')),
          observe: 'response'
        }).subscribe((response: any) => {
          console.log (response.body.info);
          if (response.body.info !== undefined) {
            // Update the number of carts in list
            // this.tokenAmount.next (response.body.info.length);
    
            // Update the list
            this.tokenAmount.next (response.body.info.amount);
          }
        });
      }

}  

