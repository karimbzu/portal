import { Component, OnInit } from '@angular/core';
import {TicketService} from '../../services/ticket.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {
  ticketInfo;
  ticketList = [];
  constructor(private myTicket: TicketService) {
    this.myTicket.currentTicketInfo.subscribe(val => {
      this.ticketInfo = val;

      // Perform some processing
      val.forEach(item => {
        if (item.ticketId !== 0) {
          this.ticketList.push ( '#' + item.ticketId);
        }
      });
    });
  }


  ngOnInit() {
  }

}
