import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  tempSubscribeEvent;

  /**
   * Based on our observation, both constructor and onInit are call each time the component are call.
   * However, there are difference when subscribing to the events in constructor compare to onInit
   * In this case, the NavigationEnd event only visible when subscribe in constructor
   */
  constructor(private router: Router) {
    this.tempSubscribeEvent = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // console.log ('Previous URL', this.router.url);
        sessionStorage.setItem('prevPage', this.router.url);
      }
    });
  }

  ngOnInit() {
  }

  /**
   * Need to unsubscribe to avoid memory leaks
   */
  ngOnDestroy() {
    this.tempSubscribeEvent.unsubscribe();
  }

}
