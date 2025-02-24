import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import formData from '../../../../json/reportNBT5SideSeal.json';
import { IFormElement, IFormPreFetch, IPagingParam } from 'src/app/models/formcontrol';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MastercacheService } from 'src/app/share/mastercache.service';
import { LoadingController, ModalController } from '@ionic/angular';
import FormData from 'form-data';
import { toFormData } from 'src/app/tools/form';
import { ErrorFormHandle } from 'src/app/share/error-handle';
import { AxiosRequestConfig } from 'axios';
import { getApiGEDrillerConfigByKey } from 'src/app/models/form.dic';
import axios from "axios-observable";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-report-nbt5-sideseal',
  templateUrl: './report-nbt5-sideseal.component.html',
  styleUrls: ['./report-nbt5-sideseal.component.scss'],
})
export class ReportNbt5SidesealComponent implements OnInit, AfterViewInit {
  @Input() recordID: string;
  @Input() dataEdit: any;
  formObjElm: IFormElement;
  validateForm: FormGroup;
  stepValidateForm: FormGroup[] = [];
  preFetch: IFormPreFetch[];
  currentStep = 1;
  formHook = {};
  formId: string;
  private parentID: string;
  public isLoading = false;
  resModal = {
    id: '',
    status: ''
  }
  sendParam: IPagingParam = {
    startOffset: 0,
    pageSize: 10
  }
  totalList = 0;
  /**
   * Hash Value
   * 
   */
  hashVal = {};

  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private masterCacheService: MastercacheService,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    console.log('recordID', this.recordID)
    this.formObjElm = { ...JSON.parse(formData.json) };
    this.stepValidateForm.push(this.fb.group({}));
    this.validateForm = this.fb.group({});
    this.preFetch = [];
    console.log('dataEdit', this.dataEdit);
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit : ", this.validateForm);
    console.log("ngAfterViewInit preFetch : ", this.preFetch);
    if (this.dataEdit) {
      setTimeout(() => {
        this.validateForm.get('id')?.setValue(this.dataEdit.id);
        this.validateForm.get('parentID')?.setValue(this.dataEdit.parentID);
        this.validateForm.get('sideSealFrom')?.setValue(this.dataEdit.sideSealFrom);
        this.validateForm
          .get('sideSealTo')
          ?.setValue(this.dataEdit.sideSealTo);
        this.validateForm
          .get('sideSealType')
          ?.setValue(this.dataEdit.sideSealType);
          this.recordID = this.dataEdit.parentID;
      });
    } 
  }

  submitForm() {
    console.log("Before form :", this.validateForm);
    if (!this.validateForm.valid) {
      return;
    }
    for (const i of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'กำลังตรวจสอบข้อมูล...' })
      .then(async loadingEl => {
        loadingEl.present();

        const formData = this.createFormData();
        const config = getApiGEDrillerConfigByKey(this.dataEdit ? "update_reportNBT5SideSeal" : "reportNBT5SideSeal") as any;
        const userSult = await this.masterCacheService.getUserInfoByKeys("sult");
        if(userSult){
          config.headers["Authorization"] = "Basic " + userSult;
        }
        const axiosConfig: AxiosRequestConfig = {
          headers: config.headers,
        };
        axios.post(config.url, formData, axiosConfig)
        .subscribe(resData => {
          this.closeLoading(loadingEl);
          console.log('reportNBT5SideSeal resData', resData);
          if ((resData.status === 200 || resData.status === 201) && !resData.data.error) {
            if(resData.data.id !== ''){
              Swal.fire({ title: 'บันทึกข้อมูลสำเร็จ', icon: 'success', timer: 2000,heightAuto:false }).then(() => {
                this.resModal.id = resData.data.id;
                this.resModal.status = resData.status.toString();
                this.onConfirm();
              })
            }else {
              ErrorFormHandle.showRetry(
                'เกิดข้อผิดพลาด',
                'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
                () => {
                  this.closeLoading(loadingEl);
                  this.submitForm();
                },
                () => {
                  this.closeLoading(loadingEl);
                }
              )
            }
          } else {
            ErrorFormHandle.showRetry(
              'เกิดข้อผิดพลาด',
              'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
              () => {
                this.closeLoading(loadingEl);
                this.submitForm();
              },
              () => {
                this.closeLoading(loadingEl);
              }
            )
          }
        }, err => {
          ErrorFormHandle.showRetry(
            'เกิดข้อผิดพลาด',
            'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
            () => {
              this.closeLoading(loadingEl);
              this.submitForm();
            },
            () => {
              this.closeLoading(loadingEl);
            }
          )
        })
      }).catch(err => {
        console.log(err);
        this.isLoading = false;
      });

  }

  createFormData(): FormData {
    this.validateForm.get('parentID')?.setValue(this.recordID);

    const formData = toFormData(this.validateForm.value);
    console.log('form : ', this.validateForm);
    console.log('form data : ', formData);
    
    return formData;
  }

  onConfirm() {
    this.modalCtrl.dismiss({ ...this.resModal }, 'confirm')
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  closeLoading(el: any = null) {
    if (el) {
      el.dismiss();
    } else {
      this.loadingCtrl.dismiss();
    }
    this.isLoading = false;
  }

  deleteNBT5SideSeal(): void {
    if (this.dataEdit.id && this.dataEdit.id === '') {
      Swal.fire({
        title: 'ไม่สามารถลบข้อมูล...',
        html: 'ไม่สามารถลบข้อมูลการผนึกข้างบ่อเหนือกรวดกรุได้',
        icon: 'error',
        heightAuto: false,
      });
      return;
    }

    Swal.fire({
      title: 'ลบข้อมูล',
      html: 'ลบข้อมูลการผนึกข้างบ่อเหนือกรวดกรุ',
      icon: 'warning',
      confirmButtonText: 'Delete',
      showCancelButton: true,
      heightAuto: false,
    }).then((data) => {
      console.log(data);
      if (data.isConfirmed == true) {
        this.isLoading = true;
        this.loadingCtrl
          .create({
            keyboardClose: true,
            message:
              'กำลังลบข้อมูลการผนึกข้างบ่อเหนือกรวดกรุ...',
          })
          .then(async (loadingEl: any) => {
            loadingEl.present();
            const config = getApiGEDrillerConfigByKey(
              'delete_reportNBT5Filter'
            ) as any;
            const userSult = await this.masterCacheService.getUserInfoByKeys(
              'sult'
            );
            if (userSult) {
              config.headers['Authorization'] = 'Basic ' + userSult;
            }
            const axiosConfig: AxiosRequestConfig = {
              headers: config.headers,
            };
            axios
              .delete(config.url + '/' + this.dataEdit.id, axiosConfig)
              .subscribe(
                (resData) => {
                  this.closeLoading(loadingEl);
                  let usageSum = 0;
                  if (
                    (resData.status === 200 || resData.status === 201) &&
                    resData.data.size > 0
                  ) {
                    this.onCancel();
                  }
                },
                (error) => {
                  this.closeLoading(loadingEl);
                  Swal.fire({
                    title: 'ข้อผิดพลาด...',
                    html: 'ไม่สามารถลบข้อมูลการผนึกข้างบ่อเหนือกรวดกรุได้',
                    icon: 'error',
                    heightAuto: false,
                  });
                }
              );
          });
      }
    });
  }

}
