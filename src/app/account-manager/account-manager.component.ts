import {Component, OnDestroy, OnInit, ViewChild, HostListener, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {OrderService} from '../../services/order.service';
import {TokenService} from '../../services/token.service';
import { TokenUsageService } from '../../services/tokenusage.service';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {MdbTableDirective, MdbTablePaginationComponent, MDBModalRef, MDBModalService} from 'ng-uikit-pro-standard';
import { IMyOptions } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-account-manager',
  templateUrl: './account-manager.component.html',
  styleUrls: ['./account-manager.component.scss']
})
export class AccountManagerComponent implements OnInit, OnDestroy, AfterViewInit {
  public myDatePickerOptions: IMyOptions = {
    // Your options
    };

  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  @ViewChild(MdbTableDirective, { static: true }) mdbTableT: MdbTableDirective;
  elements: any = [];
  previous: any = [];
  modalData: any = [];
  optServiceData: any = {
    security_vulnerability: false,
    web_app: false,
    android: false,
    continuous_scanning: false
  };
  headElements = ['User Id','Name', 'Token Usage'];
  
  myListTokenUsage;
  handlerSubscribeTokenUsage; 
  tokenAmount: number;
  handlerTokenAmount;
  handlerTopupToken;

  headElementsToken = ['ID', 'Name',  'Usage'];

  constructor(
    private cdRef: ChangeDetectorRef,
    private myOrder: OrderService, 
    private myTokenUsage:TokenUsageService,
    private myTopup: TokenService,
    private myToken: TokenService,
    private http: HttpClient) {
     
  }

  ngOnInit() {  
    this.handlerTokenAmount = this.myToken.currentTokenAmount.subscribe(val => this.tokenAmount = val);    
    this.handlerSubscribeTokenUsage = this.myTokenUsage.currentListUserToken.subscribe(val => this.myListTokenUsage = val);
    this.mdbTable.setDataSource(this.handlerSubscribeTokenUsage);
    this.elements = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
    
    // console.log("tokenusage from comp"+this.handlerSubscribeTokenUsage);       
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(5);
    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.handlerSubscribeTokenUsage.unsubscribe ();
    this.handlerTokenAmount.unsubscribe();
  }

  topupToken(){
    this.myTopup.topupToken(100);
  }


}
