import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { IMapLatLng } from '../../../models/formcontrol';

import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-atwmapmodal',
  templateUrl: './atwmapmodal.component.html',
  styleUrls: ['./atwmapmodal.component.scss'],
})
export class AtwmapmodalComponent implements OnInit, AfterViewInit {
  @ViewChild('map') mapElementRef: ElementRef;
  @Input() search: string;
  @Input() latLng: IMapLatLng;
  inputValue: string
  map: any;
  marker: any;
  centerLoc = {
    lat: 13.736717, lng: 100.523186
  }
  constructor(private modalCtrl: ModalController, private renderer: Renderer2, private http: HttpClient) { }

  initMap(googleMaps: any, mapEl: any, location: any) {
    console.log('googleMaps', googleMaps, mapEl, location);
    if (location && location[0]) {
      this.centerLoc = location[0].geometry && location[0].geometry.location ? { ...location[0].geometry.location } : this.centerLoc
    }
    this.map = new googleMaps.Map(mapEl, {
      center: {
        ...this.centerLoc
      },
      zoom: 16
    });
    this.marker = new googleMaps.Marker({
      position: {
        ...this.centerLoc
      },
      draggable: true,

      title: 'ย้ายไปจุดที่ต้องการ',
      map: this.map
    });
    googleMaps.event.addListener(this.marker, 'dragend', (e: any) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      this.centerLoc = {
        lat,
        lng
      };
      this.reloadMap();
    })
    googleMaps.event.addListenerOnce(this.map, 'idle', () => {
      this.renderer.addClass(mapEl, 'visible');
    });

    this.map.addListener('click', (event: any) => {
      this.centerLoc = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      this.reloadMap();
    });
  }

  reloadMap() {
    this.getGoogleMaps().then(googleMaps => {
      this.marker.setPosition(new googleMaps.LatLng(this.centerLoc.lat, this.centerLoc.lng));
      this.map.panTo(new googleMaps.LatLng(this.centerLoc.lat, this.centerLoc.lng));
    }, error => {
      console.log(error);
    })
  }

  ngAfterViewInit(): void {
    this.getGoogleMaps().then(googleMaps => {
      const mapEl = this.mapElementRef.nativeElement;
      if (this.latLng) {
        this.getAddressByLatLng(this.latLng.lat, this.latLng.lng, (res:any) => {
          this.inputValue = res && res.length > 0 ? res[0].formatted_address : '';
          const modRes = res && res.length > 0 ? {
            ...res[0], geometry: {
              location: {
                lat: this.latLng.lat,
                lng: this.latLng.lng
              }
            }
          } : null
          this.initMap(googleMaps, mapEl, [{ ...modRes }]);
        })
      } else {
        this.getLatLngByAddress(this.inputValue, (res: any) => {
          this.initMap(googleMaps, mapEl, res && res.length > 0 ? res : null);
        });
      }
    }).catch(err => {
      console.log(err);
    })
  }
  submitForm() {
    this.getLatLngByAddress(this.inputValue, (res: any) => {
      if (res) {
        if (res[0]) {
          this.centerLoc = res[0].geometry && res[0].geometry.location ? { ...res[0].geometry.location } : this.centerLoc
        }
        this.reloadMap();
      }
    })
  }
  getAddressByLatLng(lat: number, lng: number, cb: CallableFunction) {
    if (!lat && !lng) {
      cb(null);
      return;
    }
    this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleApi}`).subscribe(res => {
      if (res.status === 'OK') {
        cb(res.results);
      } else {
        cb(null);
      }
    }, () => {
      cb(null);
    });
    return;
  }
  getLatLngByAddress(address: string, cb: CallableFunction) {
    if (address === '') {
      cb(null);
      return;
    }
    this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${environment.googleApi}`).subscribe(res => {
      if (res.status === 'OK') {
        cb(res.results);
      } else {
        cb(null);
      }

    }, () => {
      cb(null);
    });
    return;
  }
  ngOnInit() {
    this.inputValue = this.search;
  }
  onConfirm() {
    this.modalCtrl.dismiss({ ...this.centerLoc }, 'confirm')
  }
  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  private getGoogleMaps(): Promise<any> {
    const win = window as any;

    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=' + environment.googleApi;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google map SDK Error');
        }
      }
    });
  }
}
