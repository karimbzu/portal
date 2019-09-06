import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private flagHeader = new BehaviorSubject(false);

  currentFlagHeader = this.flagHeader.asObservable();

  constructor() { }

  showHeader() {
    this.flagHeader.next(true);
  }

  hideHeader() {
    this.flagHeader.next(false);
  }
}
