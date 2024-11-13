import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormRequestService {
  public _requestForms = [
    {
      'id': 'nb1Request',
      'name': 'ยื่นคำขอรับใบอนุญาตเจาะน้ำบาดาลหรือใช้น้ำบาดาล',
      'requestLink': ['/', 'tabs', 'dgr', 'homes', 'request-forms', 'register-license-groundwater'],
    },{
      'id': 'requestRenewalLicense',
      'name': 'ยื่นคำขอต่ออายุใบอนุญาต',
      'requestLink': ['/', 'tabs', 'dgr', 'homes', 'request-forms', 'request-renewal-license'],
    },{
      'id': 'requestSubstitute',
      'name': 'ยื่นคำขอรับใบแทนใบอนุญาต',
      'requestLink': ['/', 'tabs', 'dgr', 'homes', 'request-forms', 'request-substitute'],
    },{
      'id': 'requestTransferLicense',
      'name': 'ยื่นคำขอโอนใบอนุญาต',
      'requestLink': ['/', 'tabs', 'dgr', 'homes', 'request-forms', 'request-transfer-license'],
    },{
      'id': 'registrationFormCancel',
      'name': 'ยื่นคำร้องขอแจ้งการเลิกกิจการ',
      'requestLink': ['/', 'tabs', 'dgr', 'homes', 'request-forms', 'registration-form-cancel'],
    },{
      'id': 'formsOther',
      'name': 'ยื่นคำขออื่นๆ',
      'requestLink': ['/', 'tabs', 'dgr', 'homes', 'request-forms', 'forms-other'],
    }
    // },{
    //   'id': 'nb1Clarification',
    //   'name': 'ตอบข้อสงสัยและให้ข้อมูลเพิ่มเติมแก่ฝ่ายการเงิน',
    //   'requestLink': ['/', 'tabs', 'dgr', 'homes', 'request-forms', 'nb1-clarifications'],
    // },{
    //   'id': 'registerLicenseDrain',
    //   'name': 'ยื่นคำขอรับใบอนุญาตระบายน้ำลงบ่อน้ำบาดาล',
    //   'requestLink': ['/', 'tabs', 'dgr', 'homes', 'request-forms', 'register-license-drain'],
  ]

  public _requestFormsOther = [
    {
      'id': 'registrationFormCancel',
      'name': 'ยื่นคำร้องขอแจ้งการเลิกกิจการ',
      'requestLink': ['/', 'tabs', 'dgr', 'homes', 'request-forms', 'registration-form-cancel'],
    },{
      'id': 'editLicenseGroundwater',
      'name': 'ยื่นคำขอแก้ไขใบอนุญาต',
      'requestLink': ['/', 'tabs', 'dgr', 'homes', 'request-forms', 'edit-license-groundwater'],
    },{
      'id': 'requestSuspend',
      'name': 'ยื่นคำขอระงับการใช้น้ำบาดาลชั่วคราว',
      'requestLink': ['/', 'tabs', 'dgr', 'homes', 'request-forms', 'request-suspend'],
    },{
      'id': 'requestUnsuspend',
      'name': 'ยื่นขอใช้บ่อน้ำบาดาลที่ได้ขอระงับการใช้ไว้ชั่วคราว',
      'requestLink': ['/', 'tabs', 'dgr', 'homes', 'request-forms', 'request-unsuspend'],
    },{
      'id': 'registerNaturaldisaster',
      'name': 'ยื่นคำขอขึ้นทะเบียนการใช้น้ำบาดาลเพื่อช่วยเหลือผู้ประสบภัยธรรมชาติ',
      'requestLink': ['/', 'tabs', 'dgr', 'homes', 'request-forms', 'register-naturaldisaster'],
    }
  ]

  public _myRequestForms = [
    {
      'id': 'reportDrillNB1',
      'name': 'แจ้งวันที่เริ่มเจาะน้ำฯ และชื่อช่างเจาะน้ำฯ พร้อมทั้งส่งนบ./11/2',
      'requestLink': ['/', 'tabs', 'dgr', 'my-request-forms', 'report-drill-nb1'],
    },{
        'id': 'requestDrillMoreNB1',
        'name': 'ขออนุญาตเจาะลึกลงไปเกินกว่าที่กำหนดในใบอนุญาต',
        'requestLink': ['/', 'tabs', 'dgr', 'my-request-forms', 'request-drill-more-nb1'],
    },{
        'id': 'reportNBT11T2',
        'name': 'แจ้งรายชื่อและตัวอย่างลายมือชื่อของผู้มีอำนาจรายงานการใช้ฯ',
        'requestLink': ['/', 'tabs', 'dgr', 'my-request-forms', 'report-nbt11-t2'],
    },{
        'id': 'reportNBT11T2AndNBT345NB1',
        'name': 'รายงาน นบ./11/2 และ รายงาน นบ./3 นบ./4 นบ./5',
        'requestLink': ['/', 'tabs', 'dgr', 'my-request-forms', 'report-nbt11-t2-and-nbt345-nb1'],
    },{
        'id': 'selectWaterAnalysis',
        'name': 'ยื่นคำร้อง/ส่งผลการวิเคราะห์ตัวอย่างน้ำ',
        'requestLink': ['/', 'tabs', 'dgr', 'my-request-forms', 'select-water-analysis'],
    },{
        'id': 'answer',
        'name': 'ตอบข้อสงสัย และให้ข้อมูลเพิ่มเติม',
        'requestLink': ['/', 'tabs', 'dgr', 'my-request-forms', 'answer'],
    },{
        'id': 'confirmRejectionNB1',
        'name': 'รับทราบสิทธิอุทธรณ์ และยืนยันการส่งผลการอุทธรณ์',
        'requestLink': ['/', 'tabs', 'dgr', 'my-request-forms', 'confirm-rejection-nb1'],
    },{
        'id': 'acceptAppealNB1',
        'name': 'ยื่นหลักฐานการอุทธรณ์',
        'requestLink': ['/', 'tabs', 'dgr', 'my-request-forms', 'accept-appeal-nb1'],
    },{
        'id': 'registerLicenseGWEdit',
        'name': 'แก้ไขคำขอรับใบอนุญาตเจาะน้ำบาดาลหรือใช้น้ำบาดาล',
        'requestLink': ['/', 'tabs', 'dgr', 'my-request-forms', 'register-license-gw-edit'],
    }
  ]

  public _myBills = [
    {
      'id': 'requestFee',
      'name': 'ชำระค่าธรรมเนียมใบคำขอ',
      'requestLink': ['/', 'tabs', 'dgr', 'homes', 'my-bill', 'request-fee'],
    },{
        'id': 'licenseFee',
        'name': 'ชำระค่าธรรมเนียมใบอนุญาต',
        'requestLink': ['/', 'tabs', 'dgr', 'homes', 'my-bill', 'license-fee'],
    },{
      'id': 'analysisFee',
      'name': 'ชำระค่าวิเคาะห์คุณภาพน้ำ',
      'requestLink': ['/', 'tabs', 'dgr', 'homes', 'my-bill', 'analysis-fee'],
    },{
        'id': 'usageBill',
        'name': 'ชำระค่าใช้น้ำบาดาล',
        'requestLink': ['/', 'tabs', 'dgr', 'homes', 'my-bill', 'usage-bill'],
    
    }
  ]

  constructor() { }
}
