import {Component, OnDestroy, OnInit, ViewChild, HostListener, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {OrderService} from '../../services/order.service';
import * as FileSaver from 'file-saver';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import {MdbTableDirective, MdbTablePaginationComponent} from 'ng-uikit-pro-standard';


@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  elements: any = [];
  previous: any = [];
  headElements = ['Order ID', 'Scan Type', 'Project', 'Status','Date', 'Report'];

  myListOrder;
  handlerSubscribeOrder;
  constructor(
    private cdRef: ChangeDetectorRef,
    private myOrder: OrderService,
    private http: HttpClient) { }

  ngOnInit() {
    for (let i = 1; i <= 15; i++) {
      this.elements.push({id: i.toString(), first: 'User ' + i, last: 'Name ' + i, handle: 'Handle ' + i});
    }

    this.mdbTable.setDataSource(this.elements);
    this.elements = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();

    this.handlerSubscribeOrder = this.myOrder.currentListOrder.subscribe(val => this.myListOrder = val);
    this.refreshList();
 
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(5);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.handlerSubscribeOrder.unsubscribe ();
  }

  /**
   * Continously refresh the list every 60 seconds
   */
  refreshList() {
    setTimeout(() => {
      this.myOrder.getListOrder();
      this.refreshList();
    }, 60000);
  }

  downloadFile(s: any, reportId: any) {
    if (!localStorage.getItem('authToken')) {
      console.error ('getListAccessToken', 'No authToken available for this user');
      return;
    }

  // Fetch the data
    this.http.get(environment.baseUrl + 'ticketing/report/' + reportId, {
    headers: new HttpHeaders()
      .set('Authorization', environment.oipToken)
      .set('x-auth-token',  localStorage.getItem('authToken')),
    observe: 'response',
    responseType: 'blob'
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

  downloadSelfFile(reportId: any) {
    if (!localStorage.getItem('authToken')) {
      console.error ('getListAccessToken', 'No authToken available for this user');
      return;
    }

    // Fetch the data
    this.http.get(environment.uploadUrl + 'ticketing/self/report/' + reportId, {
      headers: new HttpHeaders()
        .set('Authorization', environment.oipToken)
        .set('x-auth-token',  localStorage.getItem('authToken')),
      observe: 'response',
      responseType: 'blob'
    }).subscribe(data => {
      const blob = new Blob([data.body], { type: 'application/pdf' });
      FileSaver.saveAs(blob, 'report.pdf');
    }, error => {
      console.log(error);
    });
  }

  optService(s: any) {
      let js: any;
      js = JSON.parse(s);

      return js;
  }

  myModal(s: any) {
    return 'myModal' + s;
  }


}
