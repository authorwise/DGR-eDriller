import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-atwupload',
  templateUrl: './atwupload.component.html',
  styleUrls: ['./atwupload.component.scss'],
})
export class AtwuploadComponent implements OnInit {
  @Input() formId: string;
  @Input() properties: any;
  @Input() validateForm: FormGroup;
  uploading = false;
  fileList: NzUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  isMulti = 999;

  constructor() {}
  ngOnInit(): void {
    if (this.properties.multiple === 'true') {
      this.isMulti = 7;
    }
  }
  get isError() {
    return this.validateForm.get(this.properties.id);
  }
  // beforeUpload = (file: File): boolean => {

  //   getBase64(file).then((img) => {
  //     const buff = Object.assign(file, {
  //       url: img
  //     }) as any;
  //     this.fileList = this.fileList.concat(buff);
  //     this.validateForm.get(this.formId)?.setValue(this.fileList);
  //   })
  //   return false;
  // };

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

  removeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.filter((fs) => fs !== file);
    this.validateForm.get(this.formId)?.setValue(this.fileList.map(item => (item.originFileObj!)));
    return true;
  };

  handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file.preview;
    this.previewVisible = true;
  };

  handleChange(info: { file: NzUploadFile }): void {
    this.validateForm.get(this.formId)?.setValue(this.fileList.map(item => (item.originFileObj!)));
  }

  getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
}
// function getBase64(file: File): Promise<string | ArrayBuffer | null> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = error => reject(error);
//   });
// }
