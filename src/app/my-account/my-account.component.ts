import { Component, OnInit } from '@angular/core';
import {OrderService} from '../../services/order.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as FileSaver from 'file-saver';
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';
import { environment } from '../../environments/environment';



@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {
  myListOrder;
  constructor(private myOrder: OrderService,
    private sanitizer: DomSanitizer,
    private http: HttpClient) { }

  ngOnInit() {
    this.myOrder.currentListOrder.subscribe(val => this.processListOrder(val));
  }
  processListOrder(val) {
    console.log (val);
    this.myListOrder = val;
  }

  removeSpace(s: any) {
    return s.replace(' ', '');
  }

  downloadFile(s:any, reportId:any){

    if (!localStorage.getItem('authToken')) {
      console.error ('getListAccessToken', 'No authToken available for this user');
      return;
    }

  // Fetch the data
  this.http.get(environment.baseUrl + 'ticketing/report/' + reportId, {
    headers: new HttpHeaders()
      .set('Authorization',environment.oipToken)
      .set('x-auth-token',  localStorage.getItem('authToken')),
    observe: 'response',
    responseType:'blob'
   }).subscribe(data => {
    const blob = new Blob([data.body], { type: 'application/zip' });
    FileSaver.saveAs(blob, s);

    /*
      var blob = new Blob([respData.body],   { type: 'application/zip' });
      var url = window.URL.createObjectURL(blob);
      var pwa = window.open(url);
      if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
          alert('Please disable your Pop-up blocker and try again.');
      }
 */
}, error => {
   console.log(error);
  });  
}

optService(s : any){
  
    let js : any;
    js = JSON.parse(s);
      
    return js;
}

myModal(s : any){
  return "myModal"+s;

}


}