import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormcontrolService {
  hookList;

  constructor() {
    this.hookList = [];
  }
}
