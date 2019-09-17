import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-blocked',
  templateUrl: './blocked.component.html',
  styleUrls: ['./blocked.component.scss']
})
export class BlockedComponent implements OnInit {
  blockedPage;
  prevPage;

  constructor(private router: Router) {
    this.blockedPage = sessionStorage.getItem('blockedPage');
    this.prevPage = sessionStorage.getItem('prevPage');
    console.log (this.router);
  }

  ngOnInit() {
  }

}
