import { environment } from './../../environments/environment';
import {
  IFlowConfigHeaders,
  IFormSaveResponse,
  IPagingParam,
  IFormLicenseID,
} from './../models/formcontrol';
import { Injectable } from '@angular/core';
import { AxiosRequestConfig } from 'axios';
import axios from 'axios-observable';
import { getFlowConfigByKey } from '../models/form.dic';
import { IAjaxSendConfig, IAjaxStartFlowResponse } from '../models/formcontrol';
import { MastercacheService } from '../share/mastercache.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import FormData from 'form-data';

@Injectable({
  providedIn: 'root',
})
export class FlowServiceService {
  constructor(
    private masterCacheService: MastercacheService,
    private _http: HttpClient
  ) {}

  private createHeader(apiconfig: IAjaxSendConfig) {
    const headers: any = {};
    headers['Content-Type'] = 'application/json; charset=utf-8';
    for (const key in apiconfig.headers) {
      headers[key] = apiconfig.headers[key as keyof {}];
    }

    return headers;
  }

  private async configHeader(
    flowName: string,
    isForm = false
  ): Promise<IFlowConfigHeaders> {
    const flowConfig = getFlowConfigByKey(flowName) as any;

    let headers = this.createHeader(flowConfig);
    const mysult = await this.masterCacheService.getUserInfoByKeys('sult');
    // if (isForm) {
    //   headers["Accept"] = "*/*";
    //   headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
    // }
    headers['Authorization'] = 'Basic ' + mysult;
    // headers['Access-Control-Allow-Origin'] = '*';
    // headers['Referrer-Policy'] = 'origin';
    // headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, PUT';
    // headers['Access-Control-Allow-Headers'] = 'Authorization, Origin, Content-Type, X-CSRF-Token';
    const config: AxiosRequestConfig = { headers };

    return { flowConfig, config };
  }
  /**
   *
   * @param flowName : process flow name ex. nb1
   * @param endpoint : endpoint start process ex. startProcess
   * @param success_cb : callback -> response error or response IAjaxStartFlowResponse
   * Description : start flow
   */
  async startFlow(
    flowName: string,
    endpoint: string = 'startProcess',
    success_cb: CallableFunction,
    error_cb: CallableFunction = () => {}
  ): Promise<void> {
    const { flowConfig, config } = await this.configHeader(flowName);

    axios.post(flowConfig.url + '/' + endpoint, null, config).subscribe(
      (resData) => {
        if (resData.status === 200 || resData.status === 201) {
          success_cb(resData.data);
        } else {
          success_cb({ error: true });
          error_cb({ error: true });
        }
        return;
      },
      (error) => {
        success_cb({ error });
        error_cb({ error });
      }
    );
  }
  async mapHeaderHttp() {
    const mysult = await this.masterCacheService.getUserInfoByKeys('sult');
    let header = new HttpHeaders({
      Accept: 'multipart/form-data',
      Authorization: 'Basic ' + mysult,
      'Referrer-Policy': 'no-referrer, strict-origin-when-cross-origin',
    });
    return header;
  }
  async storeFormRequest(
    flowName: string,
    res: IAjaxStartFlowResponse,
    data: FormData,
    success_cb: CallableFunction,
    error_cb: CallableFunction = () => {}
  ) {
    const { flowConfig, config } = await this.configHeader(
      'store_' + flowName,
      true
    );
    axios.post<IFormSaveResponse>(flowConfig.url, data, config).subscribe(
      (resData) => {
        if (resData.status === 200 || resData.status === 201) {
          success_cb(resData.data);
        } else {
          success_cb({ error: true });
          error_cb({ error: true });
        }
        return;
      },
      (error) => {
        success_cb({ error: error });
        error_cb({ error: error });
      }
    );
  }

  async getFormByRecordID(
    flowName: string,
    res: IAjaxStartFlowResponse,
    success_cb: CallableFunction,
    error_cb: CallableFunction = () => {}
  ) {
    const { flowConfig, config } = await this.configHeader(
      'get_' + flowName,
      true
    );
    axios
      .get<IFormLicenseID>(flowConfig.url + '/' + res.recordId, config)
      .subscribe(
        (resData) => {
          if (resData.status === 200 || resData.status === 201) {
            success_cb(resData.data);
          } else {
            success_cb({ error: true });
            error_cb({ error: true });
          }
          return;
        },
        (error) => {
          success_cb({ error: error });
          error_cb({ error: error });
        }
      );
  }

  async updateFormRequest(
    flowName: string,
    res: IAjaxStartFlowResponse,
    data: FormData,
    success_cb: CallableFunction,
    error_cb: CallableFunction = () => {}
  ) {
    const { flowConfig, config } = await this.configHeader(
      'update_' + flowName,
      true
    );
    axios.post<IFormSaveResponse>(flowConfig.url, data, config).subscribe(
      (resData) => {
        if (resData.status === 200 || resData.status === 201) {
          success_cb(resData.data);
        } else {
          success_cb({ error: true });
          error_cb({ error: true });
        }
        return;
      },
      (error) => {
        success_cb({ error: error });
        error_cb({ error: error });
      }
    );
  }

  async updateTrailFormRequest(
    flowName: string,
    data: FormData,
    success_cb: CallableFunction,
    error_cb: CallableFunction = () => {}
  ) {
    const { flowConfig, config } = await this.configHeader(
      'updatetrail_' + flowName,
      true
    );
    axios.post<IFormSaveResponse>(flowConfig.url, data, config).subscribe(
      (resData) => {
        if (resData.status === 200 || resData.status === 201) {
          success_cb(resData.data);
        } else {
          success_cb({ error: true });
          error_cb({ error: true });
        }
        return;
      },
      (error) => {
        success_cb({ error: error });
        error_cb({ error: error });
      }
    );
  }

  async listProcessByUser(
    flowName: string,
    processId: string,
    success_cb: CallableFunction,
    error_cb: CallableFunction = () => {}
  ) {
    const { flowConfig, config } = await this.configHeader(
      'listByUser_' + flowName
    );
    const username = await this.masterCacheService.getUserNameInfo();

    axios
      .get(
        flowConfig.url + username + '?processInstanceId=' + processId,
        config
      )
      .subscribe(
        (resData) => {
          if (
            (resData.status === 200 || resData.status === 201) &&
            resData.data[0]
          ) {
            success_cb(resData.data[0]);
          } else {
            success_cb({ error: true });
            error_cb({ error: true });
          }
          return;
        },
        (error) => {
          success_cb({ error });
          error_cb({ error });
        }
      );
  }
  async setActivityVariables(
    flowName: string,
    processId: string,
    activityId: string,

    param: string,

    success_cb: CallableFunction,
    error_cb: CallableFunction = () => {}
  ) {
    const { flowConfig, config } = await this.configHeader(
      'setworkflow_' + flowName
    );

    axios
      .post(
        flowConfig.url + processId + '/' + activityId + '?' + param,
        null,
        config
      )
      .subscribe(
        (resData) => {
          if (resData.status === 200 || resData.status === 201) {
            success_cb(resData.data);
          } else {
            success_cb({ error: true });
            error_cb({ error: true });
          }
          return;
        },
        (error) => {
          success_cb({ error });
          error_cb({ error });
          return;
        }
      );
  }

  async completeProcess(
    flowName: string,
    processId: string,
    activityId: string,
    success_cb: CallableFunction,
    error_cb: CallableFunction = () => {}
  ) {
    const { flowConfig, config } = await this.configHeader(
      'complete_' + flowName
    );

    axios
      .post(flowConfig.url + processId + '/' + activityId, null, config)
      .subscribe(
        (resData) => {
          if (resData.status === 200 || resData.status === 201) {
            success_cb(resData.data);
          } else {
            success_cb({ error: true });
            error_cb({ error: true });
          }
          return;
        },
        (error) => {
          success_cb({ error });
          error_cb({ error });
        }
      );
  }

  async completeAssignment(
    flowName: string,
    activityId: string,
    success_cb: CallableFunction,
    error_cb: CallableFunction = () => {}
  ) {
    const { flowConfig, config } = await this.configHeader(
      'complete_assignment_' + flowName
    );

    axios.post(flowConfig.url + activityId, null, config).subscribe(
      (resData) => {
        if (resData.status === 200 || resData.status === 201) {
          success_cb(resData.data);
        } else {
          success_cb({ error: true });
          error_cb({ error: true });
        }
        return;
      },
      (error) => {
        success_cb({ error });
        error_cb({ error });
      }
    );
  }

  async getAssignmentByUsername(
    flowName: string,
    param: IPagingParam,
    success_cb: CallableFunction,
    error_cb: CallableFunction = () => {}
  ) {
    const { config } = await this.configHeader('listByUser_' + flowName);
    const username = await this.masterCacheService.getUserNameInfo();
    const urlCall = '/api/list/list_' + flowName + 'AssignmentByUsername';

    let myParam = param
      ? '?' +
        Object.keys(param)
          .reduce(function (a: any, k: any) {
            a.push(
              k + '=' + encodeURIComponent(param[k as keyof IPagingParam] as keyof IPagingParam)
            );
            return a;
          }, [])
          .join('&')
      : '';

    axios.get(environment.jogetUrl + urlCall + myParam, config).subscribe(
      (resData) => {
        if (resData.status === 200 || resData.status === 201) {
          success_cb(resData.data);
        } else {
          success_cb({ error: true });
          error_cb({ error: true });
        }
        return;
      },
      (error) => {
        success_cb({ error });
        error_cb({ error });
      }
    );
  }

  async getReplyMoreInfo(
    flowName: string,
    param: IPagingParam,
    success_cb: CallableFunction,
    error_cb: CallableFunction = () => {}
  ) {
    const { flowConfig, config } = await this.configHeader(
      'list_replyMoreInfo_' + flowName
    );
    const urlCall = flowConfig.url;
    let myParam = param
      ? '?' +
        Object.keys(param)
          .reduce(function (a:any, k) {
            a.push(k + '=' + encodeURIComponent(param[k as keyof IPagingParam] as keyof IPagingParam));
            return a;
          }, [])
          .join('&')
      : '';

    axios.get(urlCall + myParam, config).subscribe(
      (resData) => {
        if (resData.status === 200 || resData.status === 201) {
          success_cb(resData.data);
        } else {
          success_cb({ error: true });
          error_cb({ error: true });
        }
        return;
      },
      (error) => {
        success_cb({ error });
        error_cb({ error });
      }
    );
  }
  async getReplyMoreInfoDriller(
    flowName: string,
    param: IPagingParam,
    success_cb: CallableFunction,
    error_cb: CallableFunction = () => {}
  ) {
    const { flowConfig, config } = await this.configHeader(
      'list_replyMoreInfoDriller_' + flowName
    );
    const urlCall = flowConfig.url;
    let myParam = param
      ? '?' +
        Object.keys(param)
          .reduce(function (a:any, k) {
            a.push(k + '=' + encodeURIComponent(param[k as keyof IPagingParam] as keyof IPagingParam));
            return a;
          }, [])
          .join('&')
      : '';

    axios.get(urlCall + myParam, config).subscribe(
      (resData) => {
        if (resData.status === 200 || resData.status === 201) {
          success_cb(resData.data);
        } else {
          success_cb({ error: true });
          error_cb({ error: true });
        }
        return;
      },
      (error) => {
        success_cb({ error });
        error_cb({ error });
      }
    );
  }
}
