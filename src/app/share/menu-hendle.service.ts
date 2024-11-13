import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuHendleService {


  private certificateExpire : EventEmitter<boolean> = new EventEmitter()

  constructor() { }

  getCertificateExpire(){
    return this.certificateExpire;
  }

  setCertificateExpire(value:any){
    this.certificateExpire.emit(value);
  }
}
