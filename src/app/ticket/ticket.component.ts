import {Component, OnDestroy, OnInit} from '@angular/core';
import {TicketService} from '../../services/ticket.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit, OnDestroy {
  handlerSubscribeTicket;
  ticketInfo;
  ticketList = [];
  constructor(private myTicket: TicketService) {
  }

  ngOnInit() {
    this.handlerSubscribeTicket = this.myTicket.currentTicketInfo.subscribe(val => this.processTicket(val));
  }

  ngOnDestroy() {
    this.handlerSubscribeTicket.unsubscribe ();
  }

  processTicket(val) {
    this.ticketInfo = val;

    // Perform some processing
    this.ticketList = [];
    val.forEach(item => {
      if (item.ticketId !== 0) {
        this.ticketList.push ( '#' + item.ticketId);
      }
    });
  }

}
