import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';

import { AppState } from '../store/app.reducer';
import { environment } from '../../environments/environment';
import { User } from './user.model';
import * as AuthActions from './store/auth.actions';

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
    private store: Store<AppState>,
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
      this.store.dispatch(new AuthActions.Login({ userId: id, email, token: _token, expirationDate }));
      const expirationDuration = expirationDate.getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => this.logout(), expirationDuration);
  }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
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
    this.store.dispatch(new AuthActions.Login({ userId: localId, email, token: idToken, expirationDate }));
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
