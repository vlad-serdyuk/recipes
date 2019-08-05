import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from './user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // @ts-ignore
  url: environment.apiUrl;
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    ) {}

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      this.url,
      {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(tap(
        (data) => this.setUser(data),
      ));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      this.url,
      {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(tap(
        (data) => this.setUser(data),
      ));
  }

  autoLogin() {
    const userData: {
      id: string,
      email: string,
      _token: string,
      _tokenExpirationDate: string,
    } = JSON.parse(localStorage.get('userData'));

    if (!userData) {
      return;
    }

    const { id, email, _token, _tokenExpirationDate } = userData;
    const expirationDate = new Date(_tokenExpirationDate);
    const loadedUser = new User(id, email, _token, expirationDate);

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = expirationDate.getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => this.logout(), expirationDuration);
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = null;
  }

  private setUser({ localId, email, idToken, expiresIn }) {
    const expirationDate = new Date(new Date().getTime() + Number(expiresIn) * 1000);
    const user = new User(localId, email, idToken, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
