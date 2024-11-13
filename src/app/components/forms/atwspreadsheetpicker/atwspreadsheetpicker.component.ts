import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Component, OnInit , Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { AtwspreadsheetmodalComponent } from './../atwspreadsheetmodal/atwspreadsheetmodal.component'

@Component({
  selector: 'app-atwspreadsheetpicker',
  templateUrl: './atwspreadsheetpicker.component.html',
  styleUrls: ['./atwspreadsheetpicker.component.scss'],
})
export class AtwspreadsheetpickerComponent implements OnInit {
  @Input() spreadsheetPickerBind: any;
  @Input() validateForm: FormGroup;

  constructor(private modalCtrl: ModalController, private http: HttpClient) { }

  ngOnInit( ) {
    console.log('AtwspreadsheetpickerComponent', this.spreadsheetPickerBind);
  }

  onPickSpreadSheet(){

    this.modalCtrl.create({
      component: AtwspreadsheetmodalComponent,
      
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        console.log('AtwspreadsheetmodalComponent', modalData)
        // if (!modalData.data) {
        //   return;
        // }
      });
      modalEl.present();
    })
  }

}
