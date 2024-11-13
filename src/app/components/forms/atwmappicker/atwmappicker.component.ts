import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AtwmapmodalComponent } from './../atwmapmodal/atwmapmodal.component';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-atwmappicker',
  templateUrl: './atwmappicker.component.html',
  styleUrls: ['./atwmappicker.component.scss'],
})
export class AtwmappickerComponent implements OnInit {
  @Input() mapPickerBind: any;
  @Input() validateForm: FormGroup;

  constructor(private modalCtrl: ModalController, private http: HttpClient) { }

  ngOnInit() { }

  getLatLngFromInput() {
    let res = {
      lat: null,
      lng: null
    }
    if (this.validateForm.get(this.mapPickerBind.lat)) {
      res.lat = this.validateForm.get(this.mapPickerBind.lat)?.value;
    }

    if (this.validateForm.get(this.mapPickerBind.lng)) {
      res.lng = this.validateForm.get(this.mapPickerBind.lng)?.value;
    }
    if (res.lat && res.lng) {
      res.lat = parseFloat(res.lat) as any;
      res.lng = parseFloat(res.lng) as any;
      return res;
    } else {
      return null;
    }
  }
  onPickLocation() {
    let searchTxt = '';
    if (this.mapPickerBind.findby && this.mapPickerBind.findby.length) {
      for (let i = 0; i < this.mapPickerBind.findby.length; i++) {
        const fid = this.mapPickerBind.findby[i];
        if (this.validateForm.get(fid)) {
          this.validateForm.get(fid)?.markAsDirty();
          this.validateForm.get(fid)?.updateValueAndValidity();
          searchTxt += (i === 0 ? '' : '+') + this.validateForm.get(fid)?.value;
        }
      }
    }


    this.modalCtrl.create({
      component: AtwmapmodalComponent,
      componentProps: {
        search: searchTxt,
        latLng: this.getLatLngFromInput()
      }
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
        if (this.mapPickerBind) {
          this.validateForm.get(this.mapPickerBind.lat)?.setValue(modalData.data.lat);
          this.validateForm.get(this.mapPickerBind.lng)?.setValue(modalData.data.lng);
        }

        this.getAddress(modalData.data.lat, modalData.data.lng).subscribe(address => {
          console.log(address);
          console.log(this.mapPickerBind);
        });
      });
      modalEl.present();
    })
  }

  private getAddress(lat: number, lng: number) {
    return this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleApi}`)
      .pipe(
        map(geoData => {
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            return null;
          }

          return geoData.results[0];
        })
      )
  }
}
