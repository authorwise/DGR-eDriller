import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { getApiConfigByKey, getApiGEDrillerConfigByKey } from '../models/form.dic';
import { AxiosRequestConfig } from 'axios';
import axios from 'axios-observable';
@Injectable({
  providedIn: 'root'
})
export class MastercacheService {
  private _masterRow:any = {};
  constructor(private storage: Storage) { }

  async getMasterData(key: string, prekey: string | null = null) {
    const row = this._masterRow[key];
    if (row) {
      return this._masterRow[key];
    } else {
      try {
        return await this.getMasterDataFromStorage(prekey ? prekey : key);
      } catch (error) {
        console.log(error);
        return null;
      }
    }
  }
  async getUserInfoByKeys(key: string): Promise<any> {
    const userData = await this.storage.get('authToken');

    const uname = await JSON.parse(userData)[key];
    return uname;
  }

  async getUserNameInfo(): Promise<string | null> {
    try {
      const userData = await this.storage.get('authToken');
      const uname = JSON.parse(userData).username;
      return uname;
    } catch (error) {
      return null;
    }
  }

  async setMasterData(key: string, obj: any) {
    try {
      await this.storage.set(key, JSON.stringify(obj));
    } catch (error) {
      throw error?.toString();
    }
  }

  async getMasterDataFromStorage(key: string) {
    try {
      const storageJson = await this.storage.get(key);
      this._masterRow[key] = JSON.parse(storageJson);
      return JSON.parse(storageJson);
    } catch (error) {
      throw error?.toString();
    }
  }
  /**
   * Ajax Preload
   */
  createHeader(apiconfig:any) {
    const headers:any = {};
    headers['Content-Type'] = 'application/json; charset=utf-8';
    for (const key in apiconfig.headers) {
      headers[key] = apiconfig.headers[key];
    }

    return headers;
  }
  async preLoadCurrentUser(preFetch: any, cb: CallableFunction) {
    const currentUser = await this.storage.get('user:me');

    if (currentUser) {
      cb(JSON.parse(currentUser));
      return;
    }
    const userInfoApi = getApiConfigByKey('user');
    let headers = this.createHeader(userInfoApi);
    const username = await this.getUserNameInfo();
    const mysult = await this.getUserInfoByKeys('sult');
    headers['Authorization'] = 'Basic ' + mysult;
    const config: AxiosRequestConfig = { headers }

    axios.get(
      userInfoApi?.url + '/' + username, config).subscribe(async resData => {
        if (resData.status === 200 || resData.status === 201) {
          cb(resData);
          await this.storage.set('user:me', JSON.stringify({ data: resData.data }));
          return;
        } else {
          cb({ error: true });
          return;
        }
      })
  }

  async preLoadLicenseeUser(
    success_cb: CallableFunction,
    error_cb: CallableFunction = () => { return; }
  ) {
    const userLicensee = await this.storage.get('user:me:desc');

    if (userLicensee) {
      success_cb(JSON.parse(userLicensee));
      return;
    }

    const userInfoApi = getApiConfigByKey('licensee');
    let headers = this.createHeader(userInfoApi);
    const mysult = await this.getUserInfoByKeys('sult');
    headers['Authorization'] = 'Basic ' + mysult;
    const config: AxiosRequestConfig = { headers }

    axios.get(userInfoApi?.url!, config)
      .subscribe(async (resData) => {
        if (resData.status === 200 || resData.status === 201) {
          success_cb(resData.data);
          await this.storage.set('user:me:desc', JSON.stringify(resData.data));
          return;
        } else {
          success_cb({ error: true });
          error_cb({ error: true });
          return;
        }
      })

  }

  async preLoadGWDriller(
    success_cb: CallableFunction,
    error_cb: CallableFunction = () => { return; }
  ) {
    const userLicensee = await this.storage.get('user:me:desc');
    if (userLicensee) {
      success_cb(JSON.parse(userLicensee));
      return;
    }

    const userInfoApi = getApiConfigByKey('mtGWDrillerMobileDriller');
    let headers = this.createHeader(userInfoApi);
    const mysult = await this.getUserInfoByKeys('sult');
    headers['Authorization'] = 'Basic ' + mysult;
    const config: AxiosRequestConfig = { headers }
    axios.get(userInfoApi?.url!, config)
      .subscribe(async (resData) => {
        if (resData.status === 200 || resData.status === 201) {
          success_cb(resData.data);
          await this.storage.set('user:me:desc', JSON.stringify(resData.data));
          return;
        } else {
          success_cb({ error: true });
          error_cb({ error: true });
          return;
        }
      })

  }

  async preLoadRegisterGWDriller(
    success_cb: CallableFunction,
    error_cb: CallableFunction = () => { return; }
  ) {
    const userLicensee = await this.storage.get('registerGWDriller');
    if (userLicensee) {
      success_cb(JSON.parse(userLicensee));
      return;
    }

    const userInfoApi = getApiGEDrillerConfigByKey('list_registerGWDriller');
    let headers = this.createHeader(userInfoApi);
    const mysult = await this.getUserInfoByKeys('sult');
    headers['Authorization'] = 'Basic ' + mysult;
    const config: AxiosRequestConfig = { headers }
    axios.get(config?.url!, config)
      .subscribe(
        async (resData) => {
          console.log('resData ', resData)
          if (
            (resData.status === 200 || resData.status === 201)
          ) {
            success_cb(resData.data);
            await this.storage.set('registerGWDriller', JSON.stringify(resData.data));
            return;


          } else {
            // success_cb({ error: true });
            // error_cb({ error: true });
            // return;
          }
        },
        (error) => {
          // success_cb({ error: true });
          // error_cb({ error: true });
          // return;
        }
      )
  }
}

