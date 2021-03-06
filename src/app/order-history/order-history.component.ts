import {Component, OnDestroy, OnInit, ViewChild, HostListener, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {OrderService} from '../../services/order.service';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {MdbTableDirective, MdbTablePaginationComponent, MDBModalRef, MDBModalService} from 'ng-uikit-pro-standard';
import { OrderInfo } from '../../models/order-info';

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
  modalData: any = [];
  optServiceData: any = {
    security_vulnerability: false,
    web_app: false,
    android: false,
    continuous_scanning: false
  };
  headElements = ['Ticket ID', 'Scan Type', 'Project', 'Status', 'Date', 'Severity', 'Report'];
  modalId: any;


  myListOrder;
  handlerSubscribeOrder;
  constructor(
    private cdRef: ChangeDetectorRef,
    private myOrder: OrderService,
    private http: HttpClient) {
     
  }

  openModal(el: any) {
    this.modalData = el;
  //  console.log("here i am 2"+JSON.stringify(this.modalData));
  }

  ngOnInit() {
    // for (let i = 1; i <= 15; i++) {
    //   this.elements.push({id: i.toString(), first: 'User ' + i, last: 'Name ' + i, handle: 'Handle ' + i});
    // }
    this.handlerSubscribeOrder = this.myOrder.currentListOrder.subscribe(val => this.myListOrder = val);
    this.mdbTable.setDataSource(this.handlerSubscribeOrder);
    this.elements = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
    // console.log('total'+ this.mdbTable.getDataSource.length);
   
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

  downloadFile(fileName, reportId) {
    this.myOrder.getReport(reportId, fileName);
  }

  downloadSelfFile(reportId) {
    this.myOrder.getSelfReport(reportId);
  }

   optService() {
    // return this.modalData.optService;
    /*

      let js: any;
      js = this.modalData.optService;
      // this.modalData
        // js = js;

        // {"security_vulnerability":true,
        // "web_app":false,
        // "android":false,
        // "continuous_scanning":false
        // }


      return  js;
     */
  }

  myModal(s: any) {
    return 'myModal' + s;
  }

  showTicketDialog(id) {
    this.modalData = this.myListOrder[id];
    this.optServiceData = JSON.parse(this.modalData.optService);
    this.openModal(this.modalData);

    // <!--(click)="basicModal.show() ;modalId=el.id; openModal(el)"-->
  }


}
