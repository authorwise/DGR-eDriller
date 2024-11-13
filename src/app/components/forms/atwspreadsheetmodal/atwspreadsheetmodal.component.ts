import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-atwspreadsheetmodal',
  templateUrl: './atwspreadsheetmodal.component.html',
  styleUrls: ['./atwspreadsheetmodal.component.scss'],
})
export class AtwspreadsheetmodalComponent implements OnInit {
  inputValue: string;
  pageTitle: string;
  frmData = {
    lat: 13.736717, lng: 100.523186
  }

  constructor(private modalCtrl: ModalController, private http: HttpClient) { }

  ngOnInit() {
    this.pageTitle = 'ทดสอบ';
  }

  onConfirm() {
    this.modalCtrl.dismiss({ ...this.frmData }, 'confirm')
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

}
