import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userName = 'Guest User';

  constructor(public router: Router) { }

  ngOnInit() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      this.userName = userInfo.name;
    }
  }

  handleButtonClick(val) {
    console.log (val);
    this.router.navigate(['/scan-request'], {
      state: {
        scanType: val
      }
    });
  }
}
