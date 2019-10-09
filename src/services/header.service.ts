import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private flagHeader = new BehaviorSubject(false);
  private modeUpload = new BehaviorSubject(false);
  private modeConfigure = new BehaviorSubject(false);
  private modePayment = new BehaviorSubject(false);

  currentFlagHeader = this.flagHeader.asObservable();

  constructor() { }

  showHeader() {
    this.flagHeader.next(true);
  }

  hideHeader() {
    this.flagHeader.next(false);
  }

  setModePayment() {
    this.modeUpload.next(false);
    this.modeConfigure.next(false);
    this.modePayment.next(true);
  }
}
