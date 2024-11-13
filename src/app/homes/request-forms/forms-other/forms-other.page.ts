import { Component, OnInit } from '@angular/core';

import { FormRequestService } from '../../../services/form-request.service';

@Component({
  selector: 'app-forms-other',
  templateUrl: './forms-other.page.html',
  styleUrls: ['./forms-other.page.scss'],
})
export class FormsOtherPage implements OnInit {
  public isLoading: boolean;
  public mainMenu = 'คำขออื่นๆ';
  public iconList = '../../../assets/icon/document.svg';
  _requestFormsOhter:any[] = [];

  itemStyle = {
    height: '69px',
    backgroundColor: '#ffffff'
  }

  constructor(public frmReqService: FormRequestService) { }

  ngOnInit() {
    this._requestFormsOhter = this.frmReqService._requestFormsOther;
  }

  ionViewWillEnter() {
    this.isLoading = true;
  }

  ionViewDidEnter() {
    this.isLoading = false;
  }

  ionViewWillLeave() { }

  ngOnDestroy() { }
  
}
