import { AuthService } from './../auth/auth.service';
import Swal from 'sweetalert2';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  CameraPreview,
  CameraPreviewOptions,
  CameraPreviewPictureOptions,
} from '@capacitor-community/camera-preview';
import { GoogleCloundVisionService } from '../share/google-clound-vision.service';
import { Platform, LoadingController } from '@ionic/angular';
import { UploadImageService } from '../share/upload-image.service';
import { validateThaiCitizenID } from '../tools/cardid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {
  @ViewChild('filePicker') filePicker: ElementRef<HTMLInputElement>;
  imgServices = new UploadImageService();
  imageUri: string | File;
  imageDataBase64: string | File;
  usePicker = false;
  hasImage = false;
  isLoading = false;

  cardId: string = '';

  centerStyle = {
    width: '320px',
    height: '400px',
    minWidth: '320px',
    minHeight: '400px',
    textAlign: 'center',
    display: 'block',
    top: '0',
    left: '0',
    position: 'fixed',
    color: '#458890',
    zIndex: 999
  }
  constructor(
    private platform: Platform,
    private vision: GoogleCloundVisionService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private authService: AuthService
  ) { }


  ngOnInit() {
    this.authService.logout(); 
    if ((this.platform.is("mobile") && !this.platform.is("hybrid")) || this.platform.is("desktop")) {
      this.usePicker = true;
    }
    const _this = this;
    this.platform.ready().then(() => {
      this.resizeCam(_this);
      this.platform.resize.subscribe(() => {
        this.resizeCam(_this)
      });
    })

  }


  setCam() {
    if (!this.platform.is('desktop')) {
      this.onPickImg()
      return;
    }
    const cameraPreviewOpts: CameraPreviewOptions = {
      x: (window.screen.width - 320) / 2,
      y: (window.screen.height - 400) / 2,
      height: 400,
      width: 320,
      position: 'rear',
      // tapPhoto: true,
      // previewDrag: true,
      toBack: true,
      // alpha: 1
    };
    CameraPreview.start(cameraPreviewOpts);

    // .catch(error => {
    //   if (this.usePicker) {
    //     this.filePicker.nativeElement.click();
    //   }
    //   return false;
    // });

  }
  isNumberString(num: string) {
    return num.match(/^-{0,1}\d+$/) ? true : false;
  }
  get isAndroid() {
    return this.platform.is('android');
  }
  async onTakeImages() {
    if (this.platform.is('android')) {
      const pictureOpts: CameraPreviewPictureOptions = {
        height: 320,
        width: 200,
        quality: 50,
      };

      await CameraPreview.capture(pictureOpts).then(
        (imageData: any) => {
          this.imageUri = imageData;
          this.onImagePicked(imageData);
        },
        (err: any) => {
          if (this.usePicker) {
            this.filePicker.nativeElement.click();
          }
        }
      );
    }
  }
  async onPickImg() {
    // this.setCam()
    try {
      const image = await Camera.getPhoto({
        quality: 50,
        allowEditing: false,
        height: 640,
        width: 400,
        correctOrientation: true,
        webUseInput: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      }).then((image: any) => {
        this.onImagePicked(image.dataUrl);
      })
      .catch((error: any) => {
        if (this.usePicker) {
          this.filePicker.nativeElement.click();
        }
        return false;
      });
    } catch (error) {
      console.log('Camera not available, opening file picker.');
      this.filePicker.nativeElement.click(); // ใช้ file picker ถ้า camera ไม่สามารถทำงานได้
    }
  }

  onFileChosen(e: Event) {
    const pickerFile = (e.target as HTMLInputElement).files as any;
    if (!pickerFile[0]) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result?.toString() as any;
      this.onImagePicked(dataUrl);
    }
    fr.readAsDataURL(pickerFile[0])
  }

  readBlobToURL(pickerFile: any) {
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result?.toString() as any;
      this.imageUri = dataUrl;
    }
    fr.readAsDataURL(pickerFile)
  }

  onImagePicked(imageData: string | File) {
    let imageFile = null;
    let tmpImgData = null;
    if (typeof imageData === 'string') {
      tmpImgData = imageData.split(',')[1];
      try {
        imageFile = this.imgServices.base64toBlob(
          tmpImgData,
          'image/jpeg'
        );
      } catch (error) {
        console.log("onImagePicked", error);
        return;
      }
      this.imageDataBase64 = tmpImgData;
    } else {
      imageFile = imageData;
      this.imageDataBase64 = imageData;
    }
    this.readBlobToURL(imageFile);
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'ดึงข้อมูลคำขอ...' }).then(loadingEl => {
        loadingEl.present();

        this.vision.getLabels(this.imageDataBase64).subscribe((result: any) => {
          console.log("result", result);
          if (result.responses && result.responses[0] && result.responses[0].textAnnotations && result.responses[0].textAnnotations.length > 0) {
            this.checkCardID(result.responses[0]);
          } else {
            Swal.fire({
              title: 'ไม่สามารถอ่านรูปได้กรุณาลองใหม่',
              text: '',
              icon: 'warning'
              ,heightAuto:false
            })
          }
          this.closeLoading(loadingEl);
        }, err => {
          console.log("err", err);
          this.closeLoading(loadingEl);
        });


      })

  }

  checkCardID(resArr: any) {
    this.hasImage = false;
    const textRes = resArr.textAnnotations;

    let firstIndex = '';
    let cardId = '';
    for (const key in textRes) {
      if (this.isNumberString(textRes[key].description) && textRes[key].description.length === 1) {
        firstIndex = key;
        cardId += textRes[key].description;
        break;
      }
    }
    if (firstIndex === '' || cardId === '') {
      return false;
    }


    for (let index = parseInt(firstIndex) + 1; index < textRes.length; index++) {
      if (this.isNumberString(textRes[index].description) && cardId.length < 14) {
        cardId += textRes[index].description;
        if (cardId.length === 13) {
          break;
        }
      }
    }
    console.log(firstIndex, cardId);
    if (validateThaiCitizenID(cardId)) {
      Swal.fire({ title: 'ดึงข้อมูลบัตรประจำตัวสำเร็จ', text: 'กดปุม "ตกลง" เพื่อยืนยันการลงทะเบียน', icon: 'success', timer: 2000,heightAuto:false });
      this.hasImage = true;
      this.cardId = cardId;
    } else {
      Swal.fire({ title: 'เกิดข้อผิดพลาด !', text: 'ไม่สามารถดึงข้อมูลบัตรประจำตัวได้ กรุณาลองใหม่อีกครั้ง', icon: 'error', timer: 2000,heightAuto:false });
      this.hasImage = false;
    }
    return;
  }
  closeLoading(loadingEl:any) {
    loadingEl.dismiss();
    this.isLoading = false;
  }
  resizeCam(_this: any) {
    console.log('resize js ');
    _this.centerStyle = {
      ..._this.centerStyle,
      left: ((window.screen.width - 320) / 2) + 'px',
      top: ((window.screen.height - 320) / 2) + 'px',
    }
  }
  goToRegister() {
    this.router.navigateByUrl('/register/form', {
      state: {
        cardId: this.cardId
      }
    });
    return false;
  }
  goToCompanyRegister(LicenseeStatus: string){
    this.router.navigateByUrl('/register/form', {
      state: {
        licenseeStatus: LicenseeStatus
      }
    });
    return false;
  }
  ngOnDestroy(): void {
    this.platform.resize.unsubscribe();
  }
}
