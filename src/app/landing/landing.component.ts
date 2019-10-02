import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { NavbarComponent } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, AfterViewInit {
//  @ViewChild('navbar', { static: true }) navbar: NavbarComponent

  constructor() {
    // Temporary: Redirect to the physical landing
    window.location.href = 'landing.html';
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
//    this.navbar.toggle();
  }

}
