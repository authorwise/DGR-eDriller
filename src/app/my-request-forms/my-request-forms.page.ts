import { IPagingParam } from './../models/formcontrol';
import { FlowServiceService } from './../share/flow-service.service';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { LoadingController } from '@ionic/angular';
import { MastercacheService } from '../share/mastercache.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: "app-my-request-forms",
  templateUrl: "./my-request-forms.page.html",
  styleUrls: ["./my-request-forms.page.scss"],
})
export class MyRequestFormsPage implements OnInit, OnDestroy {
  public isLoading = false;
  public mainMenu = "ดำเนินการ";
  _myRequestForms:any[] = [];
  cacheDatas:any[] = [];
  sendParam: IPagingParam = {
    startOffset: 0,
    pageSize: 10,
  }
  iconList = '../../assets/icon/document.svg';
  currentPage = 1;
  totalList: number = 0;
  curentUser = '';
  constructor(
    private flowservice: FlowServiceService,
    private mastercacheService: MastercacheService,
    private loadingCtrl: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.currentPage = 1;
    this.getUserName();
    this.reFetchList();
  }

  async getUserName() {
    this.curentUser = await this.mastercacheService.getUserNameInfo() as any;
  }

  ionViewWillEnter() {
    this.isLoading = true;
  }

  ionViewDidEnter() {
    this.isLoading = false;
  }
  loadData(event: any) {
    console.log('compare : ', this._myRequestForms.length, this.totalList);
    if (this._myRequestForms.length < this.totalList) {
      this.fetchList(event);
      return;
    }
    event.target.complete();
  }
  doRefresh(event: any = null) {
    this.reFetchList(event);
  }
  reFetchList(event: any = null) {
    this.sendParam.startOffset = 0;
    this.currentPage = 1;

    this.fetchList(event);
  }

  fetchList(event: any = null) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'กำลังดึงข้อมูล ใบคำขอ...' }).then(loadingEl => {
        loadingEl.present();

        this.flowservice.getAssignmentByUsername('GWDriller', this.sendParam, (res: any) => {
          if (!res.error) {
            this.totalList = res.total;

            this._myRequestForms = [...res.data];
            this.cacheDatas = [...this._myRequestForms];
            // this.virtualScroll.checkEnd();
            // var filteredAry = this.cacheDatas.filter(e => e.performer === 'nb1_requester')
            // console.log('new filteredAry', filteredAry)
            // this.cacheDatas = [...filteredAry]
            let appendTopic: string;
            this.cacheDatas.forEach((v, k) => {
              switch(v.processID.split("_").pop()){
                case 'nb1':
                  this.cacheDatas[k].requestName = 'คำขอรับใบอนุญาตเจาะน้ำบาดาลหรือใช้น้ำบาดาล';
                  // this.cacheDatas[k].processDefID = 'nb1';
                break;
                case 'nb2':
                  this.cacheDatas[k].requestName = 'คำขอต่ออายุใบอนุญาต';
                  // this.cacheDatas[k].processDefID = 'nb2';
                break;
                case 'rsu':
                  this.cacheDatas[k].requestName = 'คำร้องขอแจ้งการเลิกกิจการ';
                  // this.cacheDatas[k].processDefID = 'rsu';
                break;
                default :
                  this.cacheDatas[k].requestName = v.activityName;
                break;
              }
            })
            if (event) {
              event.target.complete();
            }
            console.log('cacheDatas', this.cacheDatas)
          } else {
            this._myRequestForms = [];
            this.cacheDatas = [];
          }
          this.closeLoading(loadingEl);
        });
      }).catch(err => {
        console.log(err);
        this.isLoading = false;
      });
  }

  onSelectedList(item: any){
    console.log('onSelectedList', item)
    let activityDefId = item.activityDefId;
    let recordID = item.id;
    let processID = item.processID;
    let processDefID = item.processDefID;
    let licenseID = item.licenseID;
    
    switch(processDefID){
      case 'nb1':
        switch(activityDefId){
          case 'drillAndReportWells1':
            let requestNo = item.requestNo;
            this.router.navigate(['/tabs/dgr/my-request-forms/report-nbt345/'+ processDefID + '/' + processID +'/'+ recordID], { queryParams: { requestNo: requestNo, returnUrl: this.router.url.split('?')[0] }});
          break;
          case 'requestMoreInfoForvalidatorOutside2':
            this.router.navigate(['/tabs/dgr/my-request-forms/answer/'+ processDefID + '/' + processID +'/'+ recordID], { queryParams: { returnUrl: this.router.url.split('?')[0] }});
          break;
    
          default:
            Swal.fire({ title: 'ข้อผิดพลาด...',html:'ไม่สามารถเข้าถึงรายการนี้ได้', icon: 'error', heightAuto:false })
          break;
        }
      break;
      case 'rsu':
        switch(activityDefId){
          case 'createNBT12':
            this.router.navigate(['/tabs/dgr/my-request-forms/report-nbt12/'+ processDefID + '/' + processID +'/'+ recordID], { queryParams: { licenseID: licenseID, returnUrl: this.router.url.split('?')[0] }});
          break;
          default:
            Swal.fire({ title: 'ข้อผิดพลาด...',html:'ไม่สามารถเข้าถึงรายการนี้ได้', icon: 'error', heightAuto:false })
          break;
        }
      break;
      default:
        Swal.fire({ title: 'ข้อผิดพลาด...',html:'ไม่สามารถเข้าถึงรายการนี้ได้', icon: 'error', heightAuto:false })
      break;
    }
  }

  changePage(paged: number) {
    this.currentPage = paged;
    this.sendParam.startOffset = (this.currentPage - 1) * this.sendParam.pageSize;
    this.fetchList();
  }
  closeLoading(loadingEl: any) {
    loadingEl.dismiss();
    this.isLoading = false;
  }

  getDataFormat(dateStr: string, hastime = false) {
    const dateDate = new Date(dateStr);
    let res = '';
    res += dateDate.getDate() + '/';
    res += (dateDate.getMonth() + 1) + '/';
    res += dateDate.getFullYear() + 543;

    if (hastime) {
      res += ' ' + dateDate.getHours() + ':' + dateDate.getMinutes();
    }
    if(isNaN(dateDate.getDate())){
      let dateST = dateStr.split(" ");
      let datePre = dateST[0].split("-");
      const dateDateN = new Date(datePre[1] + "/" + datePre[2] + "/" + datePre[0] + " " + dateST[1]);
      res = '';
      res += dateDateN.getDate() + '/';
      res += (dateDateN.getMonth() + 1) + '/';
      res += dateDateN.getFullYear() + 543;
      if(hastime){
        res += ' ' + dateDateN.getHours() + ':' + dateDateN.getMinutes();
      }
    }
    return res;
  }

  ngOnDestroy() { }
  
}
