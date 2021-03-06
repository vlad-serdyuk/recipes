import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';

import * as AuthActions from './auth.actions';
import { environment } from '../../../environments/environment';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: string;
}

const handleAuthentication = ({ localId, email, idToken, expiresIn }) => {
  const expirationDate = new Date(new Date().getTime() + Number(expiresIn) * 1000);
  const user = new User(localId, email, idToken, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    userId: localId,
    email,
    token: idToken,
    expirationDate,
    redirect: true,
  });
};

@Injectable()
export class AuthEffects {
  url: environment.apiUrl;

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    ) {}

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      const { payload: { email, password } } = authData;

      return this.http.post<AuthResponseData>(
        this.url,
        {
          email,
          password,
          returnSecureToken: true,
        })
        .pipe(
          tap(response => this.authService.setLogoutTimer(Number(response.expiresIn) * 1000)),
          map(response => handleAuthentication(response)),
          catchError(error => of(new AuthActions.AuthenticateFailed(error))),
        )
    }),
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['/'])
      }
    }),
  );

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      const { email, password } = signupAction.payload;

      return this.http.post<AuthResponseData>(
        this.url,
        {
          email,
          password,
          returnSecureToken: true,
        })
        .pipe(
          tap(response => this.authService.setLogoutTimer(Number(response.expiresIn) * 1000)),
          map(response => handleAuthentication(response)),
          catchError(error => of(new AuthActions.AuthenticateFailed(error))),
        )
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        id: string,
        email: string,
        _token: string,
        _tokenExpirationDate: string,
      } = JSON.parse(localStorage.get('userData'));

      if (!userData) {
        return { type: 'Stub action' };
      }

      const {id, email, _token, _tokenExpirationDate} = userData;
      const expirationDate = new Date(_tokenExpirationDate);
      const loadedUser = new User(id, email, _token, expirationDate);

      if (loadedUser.token) {
        this.authService.setLogoutTimer(Number(_tokenExpirationDate) * 1000);
        return new AuthActions.AuthenticateSuccess({
          userId: id,
          email,
          token: _token,
          expirationDate,
          redirect: false,
        });
      }

      return { type: 'Stub action' };
    }),
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData')
      this.router.navigate(['/auth']);
    }),
  );
}
