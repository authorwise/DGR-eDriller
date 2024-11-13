import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormRequestService } from '../../services/form-request.service';
@Component({
  selector: 'app-request-forms',
  templateUrl: './request-forms.page.html',
  styleUrls: ['./request-forms.page.scss'],
})
export class RequestFormsPage implements OnInit, OnDestroy {
  public isLoading: boolean;
  public mainMenu = 'บริการประชาชน';
  public iconList = '../../../assets/icon/document.svg';
  _requestForms:any[] = [];

  itemStyle = {
    height: '69px',
    backgroundColor: '#ffffff'
  }

  constructor(public frmReqService: FormRequestService) { }

  ngOnInit() {
    this._requestForms = this.frmReqService._requestForms;
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
