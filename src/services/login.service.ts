import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(public http: HttpClient) { }

  /**
   * Method to perform login.
   */
  login(username, password) {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify({ username, password });

      this.http.post(environment.baseUrl + 'auth/login', body, {
        headers: new HttpHeaders()
          .set('Authorization', environment.oipToken)
          .set('Content-Type', 'application/json'),
        observe: 'response'
      }).subscribe((response: any) => {
        // TODO: Make sure to checkout the response.header and response.body
        resolve(response);
        },
        (error) => {
          reject(error);
        });



    });
  }
}
