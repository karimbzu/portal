import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, NavigationStart, Router, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisabledManualURLGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

      // console.log (route);
      if (route.fragment === undefined) {
        return true;
      } else {
        // force to redirect to the index page, we can also opt to error page if needed
        // return this.router.parseUrl('/blocked');
        sessionStorage.setItem('blockedPage', route.url.toString());
        return this.router.navigateByUrl('/blocked');
        // return false;
      }

    /*
    Based on our observation, it seems that when user directly key in the url
    fragment = null --> manually enter
    fragment = undefined --> routerLink
     */
  }

}
