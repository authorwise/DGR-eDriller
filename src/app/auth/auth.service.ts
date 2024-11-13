import { Injectable } from '@angular/core';

import { BehaviorSubject, from, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

import { UserLoginDto, IUserStoreDto } from './../models/usercontrol';
import { environment } from '../../environments/environment';
import axios from 'axios-observable';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private _user = new BehaviorSubject<IUserStoreDto | null>(null);
  private activeLogoutTimer: any;

  constructor(private storage: Storage) { }
  get userIsAuthenticated() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return !!user.token;
      } else {
        return false;
      }
    }));
  }

  private setUserData(userData: IUserStoreDto, userLogin: UserLoginDto) {
    const expirationTime = new Date(new Date().getTime() + +36000 * 1000);

    userData.tokenExpirationDate = expirationTime;
    this._user.next(userData);
    this.autoLogout(userData.tokenExpirationDate.getTime() - new Date().getTime());
    userData.sult = btoa(userLogin.username + ':' + userLogin.password);
    this.storage.set('authToken', JSON.stringify(userData));
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  autoLogin() {
    return from(this.storage.get('authToken')).pipe(
      map(storeData => {
        if (!storeData) {
          return null;
        }
        const parsedData = JSON.parse(storeData) as IUserStoreDto;
        const expirationTime = new Date(parsedData.tokenExpirationDate!);
        if (expirationTime <= new Date()) {
          return null;
        }
        parsedData.tokenExpirationDate = expirationTime;
        return parsedData;
      }), tap((user:any) => {
        if (user) {
          this._user.next(user);
          return this.autoLogout(user.tokenExpirationDate.getTime() - new Date().getTime());
        } else {
          return null;
        }
      }), map(user => {
        return !!user;
      })
    );
  }
  handleError(error:any) {
    let errorMessage = '';
    if (error.response) {
      errorMessage = 'Error Code :' + error.response.code;
    } else {
      errorMessage = errorMessage;
    }
    return throwError(errorMessage);
  }

  login(userLogin: UserLoginDto) {
    const req = axios.get<IUserStoreDto>(`${environment.jogetUrl}/web/json/directory/user/sso?j_username=${userLogin.username}&j_password=${userLogin.password}`);
    return req.pipe(tap(response => {
      this.setUserData(response.data, userLogin);
    }), catchError(this.handleError))
  }
  async logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    await this.storage.clear();
    await this._user.next(null);
  }


  authSubmit(username: string, password: string) {
    let userLogin = new UserLoginDto();

    userLogin.username = username;
    userLogin.password = password;

    return axios.get<IUserStoreDto>(`${environment.jogetUrl}/web/json/directory/user/sso?j_username=${username}&j_password=${password}`).toPromise();
    // return req.pipe(tap(response => {
    //   this.setUserData(response.data, userLogin);
    // }), catchError(this.handleError))
  }
}
