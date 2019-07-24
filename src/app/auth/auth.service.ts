import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

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
  url: ''; // provide url here
  user = new BehaviorSubject<User>(null);

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

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
  }

  private setUser({ localId, email, idToken, expiresIn }) {
    const expirationDate = new Date(new Date().getTime() + Number(expiresIn) * 1000);
    const user = new User(localId, email, idToken, expirationDate);
    this.user.next(user);
  }
}
