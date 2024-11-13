import { ValidatorFn } from "@angular/forms";
import { AxiosRequestConfig } from "axios";

export interface IFormCtrlLoop {
  id: string;
  controlInstance: string;
  label: string;
  placeholder?: string;
  /**
   * Type : text, number, select, ...
   */
  type?: string;
  errorTip?: string;
  validators?: ValidatorFn | ValidatorFn[];
}
/**
 * {
 * className: string,
 * elements?: IFormProperty[] | {},
 * properties?: IFormElement | any | {} | []
 * }
 */
export interface IFormElement {
  className: string;
  elements?: IFormProperty[] | any | {} | [];
  properties?: IFormElement | any | {} | [];
}
export interface IFormProperty {
  comment: string;
  id: string;
  join?: string;
  label: string;
  loadBinder?: IFormElement | any | {} | [];
  permission?: IFormElement | any | {} | [];
  permissionReadonly?: string;
  readonly?: string;
  readonlyLabel?: string;
  regex?: string;
  reverse?: string;
  storeBinder?: IFormElement | any | {} | [];
  visibilityControl?: string;
  visibilityValue?: string;
}

export interface IFormPickerControl {
  text?: string;
  value?: any;
  disabled?: boolean;
  duration?: number;
  transform?: string;
  selected?: boolean;
}
export interface IFormPickerColumn {
  name: string;
  align?: string;
  selectedIndex?: number;
  prevSelected?: number;
  prefix?: string;
  suffix?: string;
  options: IFormPickerControl[];
  cssClass?: string | string[];
  columnWidth?: string;
  prefixWidth?: string;
  suffixWidth?: string;
  optionsWidth?: string;
  refresh?: () => void;
}
export interface IFormCheckboxOption {
  controlField?: string;
  id: string;
  label?: string;
  options?: any;
  optionsBinder: IFormElement;
  permission_rules: any;
  readonly?: string;
  readonlyLabel?: string;
  validator: IFormElement;
  value?: string;
  workflowVariable: string;
}
export interface IFormCheckboxOptionProps {
  grouping?: string;
  label?: string;
  value?: any;
}
export interface IFormPreFetch {
  formId: string;
  hasValue: string;
}
export interface IFormOptionsBinderProps {
  addEmptyOption?: string;
  autoHandleFiles?: string;
  autoHandleWorkflowVariable: ["true", "false"] | boolean;
  cacheIdlePause?: string | number;
  cacheInterval?: string | number;
  emptyLabel?: string;
  extraCondition?: string;
  formDefId: string;
  groupingColumn?: string;
  idColumn: string;
  labelColumn: string;
  useAjax?: string | boolean;
}

export interface IFormHookItems {
  before?: any;
  after?: any;
  remaps?: any;
  subscribe?: IFormSubscribe[];
}

export interface IFormSubscribe {
  formId: string;
  cb: (...any:any) => void;
}

export interface IFormVisible {
  key: string;
  val: string | number;
  reverse?: string;
  join?: string;
}

export interface IAjaxSendConfig {
  id: string;
  url: string;
  headers: {
    api_id?: string;
    api_key?: string;
  };
}

export interface IAjaxStartFlowResponse {
  recordId: string;
  processId: string;
  activities?: string[] | any[];
  error?: boolean | string;
}

export interface IFlowConfigHeaders {
  flowConfig: IAjaxSendConfig;
  headers?: any;
  config?: AxiosRequestConfig;
}

export interface IFlowProcessByUser {
  activityId: string;
  dateCreated: string;
  serviceLevelMonitor: string;
  processId: string;
  processName: string;
  due?: string;
  activityName: string;
  description?: string;
  id: string;
  label: string;
  processVersion: string;
  error?: string | boolean | any;
}

export interface IFormSaveResponse {
  id: string;
}
export interface IMapLatLng {
  lat: number;
  lng: number;
}
export interface IPagingParam {
  startOffset: number;
  pageSize: number;
  id?: string;
  processID?: string;
  activityID?: string;
  parentID?: string;
  performer?: string;
  requestNo?: string;
}

export interface IUserRegister {
  id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email?: string;
  active: boolean | number;
  timeZone: number | string;
  locale: string;
}

export interface IGWDriller {
  id?: string;
  gwDrillerID?: string;
  gwDrillerName?: string;
  gwDrillerUsername?: string;
  gwDrillerPhone?: string;
  gwDrillerRemarks?: string;
  gwDrillerAddressFull?: string;
  certificateStartDate?: string;
  certificateExpireDate?: string;
}

export interface IUserInfoForm {
  addressNo?: string;
  amphoe: string;
  amphoeID: string  | undefined;
  birthDate: string;
  companyName?: string;
  contact?: string;
  email?: string;
  fax?: string;
  firstname: string;
  fullname?: string;
  lastname: string;
  gwDrillerID?: string;
  gwDrillerUserID?: string;
  gwDrillerUsername?: string;
  gwDrillerPassword?: string;
  gwConfirmPassword?: string;
  gwPassword?: string;
  localID?: string;
  moo?: string;
  nameTitleID?: string;
  nationality?: string;
  phoneNumber?: string;
  postalCode: string;
  province: string;
  provinceID: string | undefined;
  remark?: string;
  soi?: string;
  status?: string;
  street?: string;
  tambon: string;
  tambonID: string;
}

export interface IUserInfo {
  nameTitleID: string;
  firstname: string;
  lastname: string;
  companyName: string;
  postalCode: string;
  remark?: string;
  moo?: string;
  soi?: string;
  provinceID: string;
  licenseeUserID: string;
  street?: string;
  contact?: string;
  id?: string;
  email?: string;
  tambonID: string;
  licenseeAddress?: string;
  birthDate: string;
  localID: string;
  licenseeID: string;
  requestPlace?: string;
  amphoeID: string;
  licenseeStatus: string;
  phoneNumber?: string;
  addressNo?: string;
  licenseeUsername: string;
  age?: string;
}

export interface IFormUpdateTrails {
  id?: string;
  processID?: string;
  activityID: string;
  activityDefId: string;
  activityName: string;
  status: string;
  remarks: string;
}

export interface IFormLicenseID {
  licenseID?: string;
}