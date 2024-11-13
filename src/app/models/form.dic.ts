import { IAjaxSendConfig } from './formcontrol';
import { environment } from 'src/environments/environment'

export const formTypeMap:any = {
  'org.joget.apps.form.lib.HiddenField': 'hidden',
  'org.joget.apps.form.lib.Radio': 'radio',
  'org.joget.apps.form.lib.TextField': 'text',
  'org.joget.apps.form.lib.DatePicker': 'datePicker',
  'org.joget.apps.form.lib.SelectBox': 'select',
  'org.joget.apps.form.lib.CustomHTML': 'html',
  'org.joget.apps.form.lib.TextArea': 'textarea',
  'org.joget.apps.form.lib.FileUpload': 'fileupload',
  'org.joget.apps.form.lib.CheckBox': 'checkbox',
  'org.joget.apps.form.lib.PasswordField': 'password',
  'org.joget.plugin.enterprise.PopupSelectBox': 'popupselectbox',
  'org.joget.plugin.enterprise.Signature': 'signature',
  'org.joget.plugin.enterprise.RichTextEditorField': 'richtext',
  'org.joget.plugin.enterprise.SpreadSheetGrid': 'spreadsheet',
}

export const formActivityMap:any = {
  'registerLicenseGroundwater': 'register-license-groundwater',
  'requestRenewalLicense': 'request-renewal-license',
  'requestTransferLicense': 'request-transfer-license',
  'registerNaturaldisaster': 'register-naturaldisaster'
}

export enum FormType {
  HIDDEN = 'hidden',
  RADIO = 'radio',
  TEXT = 'text',
  DATEPICKER = 'datePicker',
  SELECTBOX = 'select',
  HTML = 'html',
  TEXTAREA = 'textarea',
  FILEUPLOAD = 'fileupload',
  CHECKBOX = 'checkbox',
  POPUPSELECT = 'popupselectbox',
  SIGNATURE = 'signature',
  RICHTEXT = 'richtext',
  SPREADSHEET = 'spreadsheet'
}
const nb1ApiHeaders = {
  api_id: 'API-d35ca6d3-29d0-48f2-98e1-e3e61f5b2ae3',
  api_key: 'd5a1c2e138704e148daa0b6a274ce1a9'
};
const listConfigHeaders = {
  api_id: 'API-9b4e83be-7921-4ccb-ae48-3158d0bb5f8d',
  api_key: '39e9c540518944caaa30bc5606f7f4fc'
};
const licenseConfigHeaders = {
  api_id: 'API-ddc7e589-eb98-4e05-b785-907f2ebdbe11',
  api_key: '5a3eda44c59c4d02935fc59fbfb680cc'
};
const GWDrillerConfigHeaders = {
  api_id: 'API-a9985864-7243-4fdd-b296-60ecceb60e4c',
  api_key: '88167a704c1a408084f5aaeecd76546a'
};
const nbt21ApiHeaders = {
  api_id: 'API-58b75ee8-4009-4b03-b196-8eb0f67fe281',
  api_key: '468d3f45989c4fa9b67d1b1675f07c6d'
};
const nbt12ApiHeaders = {
  api_id: 'API-2ad9caca-5116-404c-92ee-799325fe49f5',
  api_key: '87e4aa3d36ae4f30bf06b4cf94082fff'
};
const notLoggedIn = {
  api_id: 'API-f52f8f2e-7f98-46ba-a6fc-6d659ec4bc78',
  api_key: 'e164f4cf28854592bfd3572f41aab3ee'
};
export const flowConfigMap: IAjaxSendConfig[] = [
  // flow
  {
    id: 'nb1',
    url: environment.jogetUrl + '/api/process/nb1',
    headers: {
      api_id: 'API-d35ca6d3-29d0-48f2-98e1-e3e61f5b2ae3',
      api_key: '1a36d80eb98e46e19d265f521af6f778'
    }
  },
  {
    id: 'cancel',
    url: environment.jogetUrl + '/api/process/requestCancel',
    headers: nbt12ApiHeaders
  },
  // mod
  {
    id: 'listByUser_nb1',
    url: environment.jogetUrl + '/api/assignment/listByUser/',
    headers: nb1ApiHeaders
  },
  {
    id: 'listByUser_GWDriller',
    url: environment.jogetUrl + '/api/assignment/listByUser/',
    headers: GWDrillerConfigHeaders
  },
  {
    id: 'save_nb1',
    url: environment.jogetUrl + '/api/form/registerLicenseGroundwater/addWithFiles',
    headers: nb1ApiHeaders
  },
  {
    id: 'update_nb1',
    url: environment.jogetUrl + '/api/form/registerLicenseGroundwater/updateWithFiles',
    headers: nb1ApiHeaders
  },
  {
    id: 'updatetrail_nb1',
    url: environment.jogetUrl + '/api/form/answerForNB1Mobile/updateWithFiles',
    headers: nb1ApiHeaders
  },
  {
    id: 'list_replyMoreInfo_nb1',
    url: environment.jogetUrl + '/api/list/list_replyMoreInfoForFinance',
    headers: nb1ApiHeaders
  },
  {
    id: 'list_replyMoreInfoDriller_nb1',
    url: environment.jogetUrl + '/api/list/list_replyMoreInfoForDrillerMobile',
    headers: GWDrillerConfigHeaders
  },
  {
    id: 'store_replyMoreInfo_nb1',
    url: environment.jogetUrl + '/api/form/questionAndAnswer/updateWithFiles',
    headers: nb1ApiHeaders
  },
  {
    id: 'setworkflow_nb1',
    url: environment.jogetUrl + '/api/process/nb1/setActivityVariables/',
    headers: nb1ApiHeaders
  },
  {
    id: 'complete_nb1',
    url: environment.jogetUrl + '/api/process/nb1/completeActivity/',
    headers: nb1ApiHeaders
  },
  {
    id: 'complete_assignment_nb1',
    url: environment.jogetUrl + '/api/assignment/complete/',
    headers: nb1ApiHeaders
  },
  {
    id: 'setworkflow_cancel',
    url: environment.jogetUrl + '/api/process/requestCancel/setActivityVariables/',
    headers: nbt12ApiHeaders
  },
  {
    id: 'complete_cancel',
    url: environment.jogetUrl + '/api/process/requestCancel/completeActivity/',
    headers: nbt12ApiHeaders
  },
  {
    id: 'get_cancel',
    url: environment.jogetUrl + '/api/form/registrationFormCancelForMobile',
    headers: nbt12ApiHeaders
  },
  {
    id: 'complete_assignment_cancel',
    url: environment.jogetUrl + '/api/assignment/complete/',
    headers: nbt12ApiHeaders
  },

  // store
  {
    id: 'store_nb1',
    url: environment.jogetUrl + '/api/form/registerLicenseGWForMobile/addWithFiles',
    headers: nb1ApiHeaders
  },
  {
    id: 'store_nbt12',
    url: environment.jogetUrl + '/api/form/reportNBT12ForMobile/addWithFiles',
    headers: nbt12ApiHeaders
  },
]
export const apiConfigMap = [
  {
    id: 'authenticationUsers',
    url: environment.jogetUrl + '/api/process/authenticationUsers/startProcessByUser/',
    headers: {
      api_id: 'API-84852ed0-3cbc-4587-8bec-3dcfd4c2c568',
      api_key: '1ee4791389ff41d8b383f81fe269245c'
    }
  },
  {
    id: 'getAuthenticationUsers',
    url: environment.jogetUrl + '/api/assignment/listByUser/',
    headers: {
      api_id: 'API-84852ed0-3cbc-4587-8bec-3dcfd4c2c568',
      api_key: '1ee4791389ff41d8b383f81fe269245c'
    }
  },
  {
    id: 'completeAuthenticationUsers',
    url: environment.jogetUrl + '/api/assignment/completeByUser/',
    headers: {
      api_id: 'API-84852ed0-3cbc-4587-8bec-3dcfd4c2c568',
      api_key: '1ee4791389ff41d8b383f81fe269245c'
    }
  },
  {
    id: 'masterdata',
    url: environment.jogetUrl + '/api/list/list_',
    headers: {
      api_id: 'API-40a9b5dc-8d2a-4bcb-97cc-ee76ae433741',
      api_key: 'ff4d9d46efa04112a53d8c25304aa460'
    }
  },
  {
    id: 'user',
    url: environment.jogetUrl + '/api/user',
    headers: {
      api_id: 'API-84852ed0-3cbc-4587-8bec-3dcfd4c2c568',
      api_key: 'c8bf3a05df7a422e8f5ff7a031021709'
    }
  },
  {
    id: 'licensee',
    url: environment.jogetUrl + '/api/list/list_licenseeUserForMobile',
    headers: {
      api_id: 'API-84852ed0-3cbc-4587-8bec-3dcfd4c2c568',
      api_key: '2f6a29777fa74b57bead047ebc20c6e7'
    }
  },
  {
    id: 'mtGWDrillerMobileDriller',
    url: environment.jogetUrl + '/api/list/list_mtGWDrillerMobileDriller',
    headers: {
      api_id: 'API-84852ed0-3cbc-4587-8bec-3dcfd4c2c568',
      api_key: '2f6a29777fa74b57bead047ebc20c6e7'
    }
  },
  {
    id: 'licenseeRegister',
    url: environment.jogetUrl + '/api/user',
    headers: {
      api_id: 'API-f52f8f2e-7f98-46ba-a6fc-6d659ec4bc78',
      api_key: 'e164f4cf28854592bfd3572f41aab3ee'
    }
  },
  {
    id: 'licenseeRegister',
    url: environment.jogetUrl + '/api/user',
    headers: notLoggedIn
  },
  {
    id: 'formBillToForMobile',
    url: environment.jogetUrl + '/api/form/formBillToForMobile',
    headers: notLoggedIn
  },
  {
    id: 'checkUser',
    url: environment.jogetUrl + '/api/user',
    headers: notLoggedIn
  },
  {
    id: 'sso',
    url: environment.jogetUrl + '/api/sso',
    headers: notLoggedIn
  },
  {
    id: 'checkLicenseeUserID',
    url: environment.jogetUrl + '/api/list/list_licenseeCheckForMobile',
    headers: notLoggedIn
  },
  {
    id: 'updateUserPassword',
    url: environment.jogetUrl + '/api/user',
    headers: notLoggedIn
  },
  {
    id: 'assignUserToOrganization',
    url: environment.jogetUrl + '/api/organization/assignUser',
    headers: {
      api_id: 'API-84852ed0-3cbc-4587-8bec-3dcfd4c2c568',
      api_key: 'ed20f86835a14ee785f4b39116d9d7e0'
    }
  },
  {
    id: 'assignUserToGroup',
    url: environment.jogetUrl + '/api/group/assignUser',
    headers: GWDrillerConfigHeaders
  },
  {
    id: 'licenseeUser',
    url: environment.jogetUrl + '/api/form/licenseeUser/addWithFiles',
    headers: {
      api_id: 'API-84852ed0-3cbc-4587-8bec-3dcfd4c2c568',
      api_key: '2f6a29777fa74b57bead047ebc20c6e7'
    }
  },
  {
    id: 'answerForNB1Mobile',
    url: environment.jogetUrl + '/api/form/answerForNB1Mobile/updateWithFiles',
    headers: nb1ApiHeaders
  }
];

export const apiListConfigMap = [
  {
    id: 'list_licenseeCheckForMobile',
    url: environment.jogetUrl + '/api/list/list_licenseeCheckForMobile',
    headers: {
      api_id: 'API-f52f8f2e-7f98-46ba-a6fc-6d659ec4bc78',
      api_key: 'e164f4cf28854592bfd3572f41aab3ee'
    }
  },
  {
    id: 'list_formBillTo',
    url: environment.jogetUrl + '/api/list/',
    headers: listConfigHeaders
  },{
    id: 'list_mtGWDrillerForForm',
    url: environment.jogetUrl + '/api/list/',
    headers: listConfigHeaders
  },{
    id: 'list_mtGWDrillerForFormLMobile',
    url: environment.jogetUrl + '/api/list/list_mtGWDrillerMobile',
    headers: {
      api_id: 'API-40a9b5dc-8d2a-4bcb-97cc-ee76ae433741',
      api_key: 'ff4d9d46efa04112a53d8c25304aa460'
    }
  },{
    id: 'list_reportNBt11',
    url: environment.jogetUrl + '/api/list/list_reportNBt11LicenseeForMobile',
    headers: {
      api_id: 'API-5b365bc0-369b-4bcd-bc4c-528bec4ef8f3',
      api_key: 'cb26bc9ccba94a95bb55d01ea99abdce'
    }
  },{
    id: 'reportNBT11',
    url: environment.jogetUrl + '/api/form/reportNBT11ForMobile/',
    headers: {
      api_id: 'API-5b365bc0-369b-4bcd-bc4c-528bec4ef8f3',
      api_key: 'cb26bc9ccba94a95bb55d01ea99abdce'
    }
  },{
    id: 'list_drillLicense',
    url: environment.jogetUrl + '/api/list/list_drillLicenseMobile',
    headers: licenseConfigHeaders
  },
  {
    id: 'list_usageLicenseForNBT21',
    url: environment.jogetUrl + '/api/list/list_usageLicenseForNBT21',
    headers: licenseConfigHeaders
  },
  
]

export const apiDrillerConfigMap = [
  {
    id: 'registerGWDriller',
    url: environment.jogetUrl + '/api/form/registerGWDriller/addWithFiles',
    headers: {
      api_id: 'API-84852ed0-3cbc-4587-8bec-3dcfd4c2c568',
      api_key: '2f6a29777fa74b57bead047ebc20c6e7'
    }
  },{
    id: 'updateGWDriller',
    url: environment.jogetUrl + '/api/form/registerGWDriller/updateWithFiles',
    headers: {
      api_id: 'API-84852ed0-3cbc-4587-8bec-3dcfd4c2c568',
      api_key: '2f6a29777fa74b57bead047ebc20c6e7'
    }
  },{
    id: 'editGWDriller',
    url: environment.jogetUrl + '/api/form/editGWDrillerId/updateWithFiles',
    headers: {
      api_id: 'API-f52f8f2e-7f98-46ba-a6fc-6d659ec4bc78',
      api_key: 'e164f4cf28854592bfd3572f41aab3ee'
    }
  },{
    id: 'update_mtGWDriller',
    url: environment.jogetUrl + '/api/form/mtGWDriller/updateWithFiles',
    headers: {
      api_id: 'API-84852ed0-3cbc-4587-8bec-3dcfd4c2c568',
      api_key: '2f6a29777fa74b57bead047ebc20c6e7'
    }
  },{
    id: 'list_mtGWDrillerForForm',
    url: environment.jogetUrl + '/api/list/',
    headers: listConfigHeaders
  },{
    id: 'list_mtGWDrillerForFormLMobile',
    url: environment.jogetUrl + '/api/list/list_mtGWDrillerMobile',
    headers: {
      api_id: 'API-40a9b5dc-8d2a-4bcb-97cc-ee76ae433741',
      api_key: 'ff4d9d46efa04112a53d8c25304aa460'
    }
  },{
    id: 'list_mtGWDrillerCheck',
    url: environment.jogetUrl + '/api/list/list_mtGWDrillerCheckMobile',
    headers: {
      api_id: 'API-f52f8f2e-7f98-46ba-a6fc-6d659ec4bc78',
      api_key: 'e164f4cf28854592bfd3572f41aab3ee'
    }
  },{
    id: 'list_registerGWDrillerCheck',
    url: environment.jogetUrl + '/api/list/list_registerGWDrillerCheckMobile',
    headers: {
      api_id: 'API-f52f8f2e-7f98-46ba-a6fc-6d659ec4bc78',
      api_key: 'e164f4cf28854592bfd3572f41aab3ee'
    }
  },{
    id: 'list_registerGWDriller',
    url: environment.jogetUrl + '/api/list/list_registerGWDrillerMobile',
    headers: {
      api_id: 'API-84852ed0-3cbc-4587-8bec-3dcfd4c2c568',
      api_key: '2f6a29777fa74b57bead047ebc20c6e7'
    }
  },{
    id: 'reportNBT345StatusForMobile',
    url: environment.jogetUrl + '/api/form/reportNBT345StatusForMobile/updateWithFiles',
    headers: GWDrillerConfigHeaders
  },{
    id: 'reportNBT345ForMobile',
    url: environment.jogetUrl + '/api/form/reportNBT345ForMobile/addWithFiles',
    headers: GWDrillerConfigHeaders
  },{
    id: 'list_GWDrillerAssignmentByUsername',
    url: environment.jogetUrl + '/api/list/list_GWDrillerAssignmentByUsername',
    headers: GWDrillerConfigHeaders
  },{
    id: 'list_drillLicensebyRequestNoDriller',
    url: environment.jogetUrl + '/api/list/list_drillLicensebyRequestNoDrillerMobile',
    headers: GWDrillerConfigHeaders
  },{
    id: 'list_reportNBT3SubDriller',
    url: environment.jogetUrl + '/api/list/list_reportNBT3SubDrillerMobile',
    headers: GWDrillerConfigHeaders
  },{
    id: 'reportNBT3Sub',
    url: environment.jogetUrl + '/api/form/reportNBT3Sub/addWithFiles',
    headers: GWDrillerConfigHeaders
  },{
    id: 'update_reportNBT3Sub',
    url: environment.jogetUrl + '/api/form/reportNBT3Sub/updateWithFiles',
    headers: GWDrillerConfigHeaders
  },{
    id: 'delete_reportNBT3Sub',
    url: environment.jogetUrl + '/api/form/reportNBT3Sub',
    headers: GWDrillerConfigHeaders
  },{
    id: 'list_reportNBT4PipeDriller',
    url: environment.jogetUrl + '/api/list/list_reportNBT4PipeDrillerMobile',
    headers: GWDrillerConfigHeaders
  },{
    id: 'reportNBT4Pipe',
    url: environment.jogetUrl + '/api/form/reportNBT4Pipe/addWithFiles',
    headers: GWDrillerConfigHeaders
  },{
    id: 'update_reportNBT4Pipe',
    url: environment.jogetUrl + '/api/form/reportNBT4Pipe/updateWithFiles',
    headers: GWDrillerConfigHeaders
  },{
    id: 'delete_reportNBT4Pipe',
    url: environment.jogetUrl + '/api/form/reportNBT4Pipe',
    headers: GWDrillerConfigHeaders
  },{
    id: 'list_reportNBT4FilterDriller',
    url: environment.jogetUrl + '/api/list/list_reportNBT4FilterDrillerMobile',
    headers: GWDrillerConfigHeaders
  },{
    id: 'reportNBT4Filter',
    url: environment.jogetUrl + '/api/form/reportNBT4Filter/addWithFiles',
    headers: GWDrillerConfigHeaders
  },{
    id: 'update_reportNBT4Filter',
    url: environment.jogetUrl + '/api/form/reportNBT4Filter/updateWithFiles',
    headers: GWDrillerConfigHeaders
  },{
    id: 'delete_reportNBT4Filter',
    url: environment.jogetUrl + '/api/form/reportNBT4Filter',
    headers: GWDrillerConfigHeaders
  },{
    id: 'list_reportNBT4PumpDriller',
    url: environment.jogetUrl + '/api/list/list_reportNBT4PumpDrillerMobile',
    headers: GWDrillerConfigHeaders
  },{
    id: 'reportNBT4Pump',
    url: environment.jogetUrl + '/api/form/reportNBT4Pump/addWithFiles',
    headers: GWDrillerConfigHeaders
  },{
    id: 'update_reportNBT4Pump',
    url: environment.jogetUrl + '/api/form/reportNBT4Pump/updateWithFiles',
    headers: GWDrillerConfigHeaders
  },{
    id: 'delete_reportNBT4Pump',
    url: environment.jogetUrl + '/api/form/reportNBT4Pump',
    headers: GWDrillerConfigHeaders
  },{
    id: 'list_reportNBT4RecoveryDriller',
    url: environment.jogetUrl + '/api/list/list_reportNBT4RecoveryDrillerMobile',
    headers: GWDrillerConfigHeaders
  },{
    id: 'reportNBT4Recovery',
    url: environment.jogetUrl + '/api/form/reportNBT4Recovery/addWithFiles',
    headers: GWDrillerConfigHeaders
  },{
    id: 'update_reportNBT4Recovery',
    url: environment.jogetUrl + '/api/form/reportNBT4Recovery/updateWithFiles',
    headers: GWDrillerConfigHeaders
  },{
    id: 'delete_reportNBT4Recovery',
    url: environment.jogetUrl + '/api/form/reportNBT4Recovery',
    headers: GWDrillerConfigHeaders
  },{
    id: 'list_reportNBT5PipeDriller',
    url: environment.jogetUrl + '/api/list/list_reportNBT5PipeDrillerMobile',
    headers: GWDrillerConfigHeaders
  },{
    id: 'reportNBT5Pipe',
    url: environment.jogetUrl + '/api/form/reportNBT5Pipe/addWithFiles',
    headers: GWDrillerConfigHeaders
  },{
    id: 'update_reportNBT5Pipe',
    url: environment.jogetUrl + '/api/form/reportNBT5Pipe/updateWithFiles',
    headers: GWDrillerConfigHeaders
  },{
    id: 'delete_reportNBT5Pipe',
    url: environment.jogetUrl + '/api/form/reportNBT5Pipe',
    headers: GWDrillerConfigHeaders
  },{
    id: 'list_reportNBT5GougeDriller',
    url: environment.jogetUrl + '/api/list/list_reportNBT5GougeDrillerMobile',
    headers: GWDrillerConfigHeaders
  },{
    id: 'reportNBT5Gouge',
    url: environment.jogetUrl + '/api/form/reportNBT5Gouge/addWithFiles',
    headers: GWDrillerConfigHeaders
  },{
    id: 'update_reportNBT5Gouge',
    url: environment.jogetUrl + '/api/form/reportNBT5Gouge/updateWithFiles',
    headers: GWDrillerConfigHeaders
  },{
    id: 'delete_reportNBT5Gouge',
    url: environment.jogetUrl + '/api/form/reportNBT5Gouge',
    headers: GWDrillerConfigHeaders
  },{
    id: 'list_reportNBT5FilterDriller',
    url: environment.jogetUrl + '/api/list/list_reportNBT5FilterDrillerMobile',
    headers: GWDrillerConfigHeaders
  },{
    id: 'reportNBT5Filter',
    url: environment.jogetUrl + '/api/form/reportNBT5Filter/addWithFiles',
    headers: GWDrillerConfigHeaders
  },{
    id: 'update_reportNBT5Filter',
    url: environment.jogetUrl + '/api/form/reportNBT5Filter/updateWithFiles',
    headers: GWDrillerConfigHeaders
  },{
    id: 'delete_reportNBT5Filter',
    url: environment.jogetUrl + '/api/form/reportNBT5Filter',
    headers: GWDrillerConfigHeaders
  },{
    id: 'list_reportNBT5HoleDriller',
    url: environment.jogetUrl + '/api/list/list_reportNBT5HoleDrillerMobile',
    headers: GWDrillerConfigHeaders
  },{
    id: 'reportNBT5Hole',
    url: environment.jogetUrl + '/api/form/reportNBT5Hole/addWithFiles',
    headers: GWDrillerConfigHeaders
  },{
    id: 'update_reportNBT5Hole',
    url: environment.jogetUrl + '/api/form/reportNBT5Hole/updateWithFiles',
    headers: GWDrillerConfigHeaders
  },{
    id: 'delete_reportNBT5Hole',
    url: environment.jogetUrl + '/api/form/reportNBT5Hole',
    headers: GWDrillerConfigHeaders
  },{
    id: 'list_reportNBT5LayerDriller',
    url: environment.jogetUrl + '/api/list/list_reportNBT5LayerDrillerMobile',
    headers: GWDrillerConfigHeaders
  },{
    id: 'reportNBT5Layer',
    url: environment.jogetUrl + '/api/form/reportNBT5Layer/addWithFiles',
    headers: GWDrillerConfigHeaders
  },{
    id: 'update_reportNBT5Layer',
    url: environment.jogetUrl + '/api/form/reportNBT5Layer/updateWithFiles',
    headers: GWDrillerConfigHeaders
  },{
    id: 'delete_reportNBT5Layer',
    url: environment.jogetUrl + '/api/form/reportNBT5Layer',
    headers: GWDrillerConfigHeaders
  },{
    id: 'list_reportNBT5SideSealDriller',
    url: environment.jogetUrl + '/api/list/list_reportNBT5SideSealDrillerMobile',
    headers: GWDrillerConfigHeaders
  },{
    id: 'reportNBT5SideSeal',
    url: environment.jogetUrl + '/api/form/reportNBT5SideSeal/addWithFiles',
    headers: GWDrillerConfigHeaders
  },{
    id: 'update_reportNBT5SideSeal',
    url: environment.jogetUrl + '/api/form/reportNBT5SideSeal/updateWithFiles',
    headers: GWDrillerConfigHeaders
  },{
    id: 'delete_reportNBT5SideSeal',
    url: environment.jogetUrl + '/api/form/reportNBT5SideSeal',
    headers: GWDrillerConfigHeaders
  },{
    id: 'list_usageLicenseDriller',
    url: environment.jogetUrl + '/api/list/list_usageLicenseDrillerMobile',
    headers: GWDrillerConfigHeaders
  },
  
  
]

export const keyToMap:any = {
  billAt: 'ที่อยู่',
  taxID: 'เลขผู้เสียภาษี',
  certificateExpireDate: 'วันสิ้นอายุหนังสือรับรอง',
  certificateStartDate: 'วันเริ่มหนังสือรับรอง',
  gwDrillerID:'เลขที่หนังสือรับรอง',
}

export function getApiListConfigByKey(key: string) {
  return apiListConfigMap.find(m => m.id === key) || null;
}
export function getApiConfigByKey(key: string) {
  return apiConfigMap.find(m => m.id === key) || null;
}
export function getFlowConfigByKey(key: string): IAjaxSendConfig | null {
  return flowConfigMap.find(m => m.id === key) || null;
}
export function getApiGEDrillerConfigByKey(key: string): IAjaxSendConfig | null {
  return apiDrillerConfigMap.find(m => m.id === key) || null;
}