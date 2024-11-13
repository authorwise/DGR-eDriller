import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";

import formData from "../../../json/answerForMobile.json";
import { IFormElement, IFormPreFetch, IPagingParam, IFormHookItems, IGWDriller } from 'src/app/models/formcontrol';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IonContent, LoadingController } from '@ionic/angular';
import { toFormData } from 'src/app/tools/form';
import { Router, ActivatedRoute } from '@angular/router';
import { MastercacheService } from 'src/app/share/mastercache.service';
import { FlowServiceService } from 'src/app/share/flow-service.service';
import { ErrorFormHandle } from 'src/app/share/error-handle';
import Swal from 'sweetalert2';
import FormData from 'form-data';

@Component({
  selector: "app-answer",
  templateUrl: "./answer.page.html",
  styleUrls: ["./answer.page.scss"],
})
export class AnswerPage implements OnInit, AfterViewInit {
  isLoading = false;
  formObjElm: IFormElement;
  validateForm: FormGroup;
  stepValidateForm: FormGroup[];
  preFetch: IFormPreFetch[];
  private recordID: string;
  private processDefID: string;
  private processID: string;
  private activityName: string;
  private activityID: string;
  private activityDefID: string;
  private userInfo: IGWDriller;
  totalList: string;
  returnUrl: string;
  currentStep = 1;
  formHook = {};
  refElm = {};
  beforeLabel: any;
  sendParam: IPagingParam = {
    startOffset: 0,
    pageSize: 10
  }
  /**
   * Hash Value
   * 
   */
  hashVal = {};
  @ViewChild(IonContent, { static: false }) content: IonContent;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private masterCacheService: MastercacheService,
    private flowService: FlowServiceService,
  ) {}

  preHooks() {
    this.formHook = {
      'questionerName': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        }
      },
      'question': <IFormHookItems>{
        before: (_this: any) => {
          _this.isReadOnly = true;
        }
      },
    }
    this.beforeLabel = {
      'questionerName': ''
    }
  }

  ngOnInit() {
    this.formObjElm = { ...JSON.parse(formData.json) };
    console.log(this.formObjElm.elements);
    this.formObjElm.elements.forEach((element:any) => {
      // console.log(element.properties.);
    });
    this.stepValidateForm = [];
    for (let i = 0; i < 2; i++) {
      this.stepValidateForm.push(this.fb.group({}));
    }
    this.validateForm = this.fb.group({});
    this.preHooks();
    this.preFetch = [];
    this.masterCacheService.preLoadLicenseeUser((res: any) => {
      // console.log('preLoadLicenseeUser', res.data)
      if (!res.error && res.data[0]) {
        console.log('userInfo', res.data[0])
        this.userInfo = <IGWDriller>res.data[0];
      }
    });
    this.route.queryParams.subscribe((params:any) => {
      console.log('params', params);
      if (params.returnUrl) {
        this.returnUrl = params.returnUrl;
      } else {
        this.returnUrl = '/tabs/dgr/my-request-forms';
      }
    });
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('recordID') || !paramMap.has('processDefID') || !paramMap.has('processID')) {
        this.router.navigate([this.returnUrl], { replaceUrl: true });
        return;
      }
      this.recordID = paramMap.get('recordID') as any;
      this.processDefID = paramMap.get('processDefID') as any;
      this.processID = paramMap.get('processID') as any;

    });
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit : ", this.validateForm);
    console.log("ngAfterViewInit preFetch : ", this.preFetch);
    this.getQuestion(this.recordID, this.processID);

    // this.validateForm.get('staffMake').valueChanges.subscribe(val => {
    //   console.log(val);
    // });
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

    this.storeFormRequest();
  }

  getQuestion(recordID: string, processID: string){
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'กำลังดึงข้อมูล...' })
      .then(loadingEl => {
        loadingEl.present();
        this.sendParam.parentID = recordID;
        this.sendParam.processID = processID;
        this.flowService.getReplyMoreInfoDriller(this.processDefID, this.sendParam, (res: any) => {
          this.closeLoading(loadingEl);
          if (!res.error) {
            this.totalList = res.total;
            console.log('getReplyMoreInfo', res);
            if(res.total === 1){
              // this._myRequestForms = [...res.data];
              this.processID = res.data[0].processID;
              this.activityID = res.data[0].activityID;
              this.activityDefID = res.data[0].activityDefId;
              this.activityName = res.data[0].activityName;
              this.beforeLabel['questionerName'] = this.activityName;
              this.validateForm.get('questionerName')?.setValue(res.data[0].questionerName);
              this.validateForm.get('question')?.setValue(res.data[0].question);
              this.validateForm.get('id')?.setValue(res.data[0].id);
            }else{
              ErrorFormHandle.showRetry(
                'เกิดข้อผิดพลาด',
                'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
                () => {
                  this.closeLoading(loadingEl);
                  this.getQuestion(recordID, processID);
                },
                () => {
                  this.closeLoading(loadingEl);
                  this.router.navigate(['/tabs/dgr/my-request-forms'], { replaceUrl: true });
                }
              )
            }
            

          }
        })
      }).catch(err => {
        this.loadingCtrl.dismiss();
        this.isLoading = false;
      })
  }

  /**
   * 
   * @param res : response after start flow
   * @param data : data in form
   * Description : Step 2 send form data for store
   */
  storeFormRequest() {
    const res = {
      processId: this.processID,
      recordId: this.recordID
    }
    const data = this.createFormData(res.processId, res.recordId);;
    console.log('data', data);
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'บันทึกข้อมูลคำขอ...' }).then(loadingEl => {
        loadingEl.present();

        // Save Request
        this.flowService.storeFormRequest('replyMoreInfo_' + this.processDefID, res, data, (resData: any) => {
          this.closeLoading(loadingEl);
          console.log(resData);
          if (!resData.error) {
            this.updateTrailFormRequest();
          }
        }, () => {
          ErrorFormHandle.showRetry(
            'เกิดข้อผิดพลาด',
            'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
            () => {
              this.closeLoading(loadingEl);
              this.storeFormRequest();
            },
            () => {
              this.closeLoading(loadingEl);
            }
          )
        });

      }).catch(err => {
        console.log(err);
        this.isLoading = false;
      });
  }

  createFormData(processId: string, recordId: string): FormData {
    for (const form of this.preFetch) {
      if (form.hasValue.indexOf('#assignment.processId#') === 0) {
        this.validateForm.get(form.formId)?.setValue(processId);
      }
      if (form.hasValue.indexOf('#currentUser.username#') === 0) {
        this.validateForm.get(form.formId)?.setValue(this.userInfo.gwDrillerUsername);
      }
      if (form.hasValue.indexOf('#currentUser.fullName#') === 0) {
        this.validateForm.get(form.formId)?.setValue(this.userInfo.gwDrillerName);
      }
    }
    for (const i of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    const formData = toFormData(this.validateForm.value);
    console.log('form : ', this.validateForm);
    console.log('form data : ', formData);

    return formData;
  }

  updateTrailFormRequest() {
    const data = {
      id: this.recordID,
      status: 'Answer a question',
      remarks: 'ตอบข้อสงสัย หรือให้ข้อมูลเพิ่มเติม',
      activityID: this.activityID,
      activityDefID: this.activityDefID,
      activityName: this.activityName
    };
    const formData = toFormData(data);
    console.log('data', data);
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'บันทึกข้อมูลคำขอ...' }).then(loadingEl => {
        loadingEl.present();

        // Save Request
        this.flowService.updateTrailFormRequest(this.processDefID, formData, (resData: any) => {
          this.closeLoading(loadingEl);
          if (!resData.error) {
            console.log('resData', resData);
            this.setActivityVariables(this.processID, this.activityID);
          }
        }, () => {
          ErrorFormHandle.showRetry(
            'เกิดข้อผิดพลาด',
            'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
            () => {
              this.closeLoading(loadingEl);
              this.updateTrailFormRequest()
            },
            () => {
              this.closeLoading(loadingEl);
            }
          )
        });

      }).catch(err => {
        console.log(err);
        this.isLoading = false;
      });
  }

  setActivityVariables(processId: string, activityId: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'บันทึกข้อมูลคำขอ...' })
      .then(loadingEl => {
        loadingEl.present();

        const paramObj:any = {
          status: 'Answer a question',
        }

        let myParam = Object.keys(paramObj).reduce(function (a:any, k) { a.push(k + '=' + encodeURIComponent(paramObj[k])); return a }, []).join('&');

        this.flowService.setActivityVariables(
          this.processDefID,
          processId,
          activityId,
          myParam,
          (resData: any) => {

            this.closeLoading(loadingEl);
            if (!resData.error) {
              console.log('setActivityVariables', resData);
              // this.completeProcess(processId, activityId);
              this.completeAssignment(processId, activityId);
            }

          },
          () => {
            ErrorFormHandle.showRetry(
              'เกิดข้อผิดพลาด',
              'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
              () => {
                this.closeLoading(loadingEl);
                this.setActivityVariables(processId, activityId);
              },
              () => {
                this.closeLoading(loadingEl);
              }
            )
          }
        )
      })
  }
  /**
   * Step 4.1
   * @param processId 
   * @param activityId 
   */
  completeProcess(processId: string, activityId: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'บันทึกข้อมูล...' }).then(loadingEl => {
        loadingEl.present();

        // Save Request
        this.flowService.completeProcess(this.processDefID, processId, activityId, (resData: any) => {
          this.closeLoading(loadingEl);
          if (!resData.error) {
            console.log('Complete : ', resData);
            Swal.fire({ title: 'บันทึกข้อมูลตอบคำถามสำเร็จ', icon: 'success', timer: 2000,heightAuto:false }).then(() => {
              this.router.navigate(['/tabs/dgr/my-request-forms'], { replaceUrl: true });
            })
          }
        }, () => {
          ErrorFormHandle.showRetry(
            'เกิดข้อผิดพลาด',
            'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
            () => {
              this.closeLoading(loadingEl);
              this.completeProcess(processId, activityId);
            },
            () => {
              this.closeLoading(loadingEl);
            }
          )
        });

      }).catch(err => {
        console.log(err);
        this.isLoading = false;
      });
  }

  /**
   * Step 4.1
   * @param processId 
   * @param activityId 
   */
  completeAssignment(processId: string, activityId: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'บันทึกข้อมูล...' }).then(loadingEl => {
        loadingEl.present();

        // Save Request
        this.flowService.completeAssignment(this.processDefID, activityId, (resData: any) => {
          this.closeLoading(loadingEl);
          if (!resData.error) {
            console.log('Complete : ', resData);
            Swal.fire({ title: 'บันทึกข้อมูลตอบคำถามสำเร็จ', icon: 'success', timer: 2000,heightAuto:false }).then(() => {
              this.router.navigate(['/tabs/dgr/my-request-forms'], { replaceUrl: true });
            })
          }
        }, () => {
          ErrorFormHandle.showRetry(
            'เกิดข้อผิดพลาด',
            'ต้องการเริ่มใหม่อีกครั้งหรือไม่ ?',
            () => {
              this.closeLoading(loadingEl);
              this.completeAssignment(processId, activityId);
            },
            () => {
              this.closeLoading(loadingEl);
            }
          )
        });

      }).catch(err => {
        console.log(err);
        this.isLoading = false;
      });
  }

  //Step
  prevStep() {
    this.currentStep -= 1;
    this.scrollToTop();
  }
  nextStep() {
    this.currentStep += 1;
    this.scrollToTop();
  }
  scrollToTop() {
    this.content.scrollToTop(1000);
  }
  closeLoading(el: any = null) {
    if (el) {
      el.dismiss();
    } else {
      this.loadingCtrl.dismiss();
    }
    this.isLoading = false;
  }
  
}
