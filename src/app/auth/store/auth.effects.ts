import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { switchMap, catchError, map } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { environment } from '../../../environments/environment';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: string;
}

@Injectable()
export class AuthEffects {
  url: environment.apiUrl;

  constructor(
    private actions$: Actions,
    private http: HttpClient,
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
          map(response => {
            const { localId, email, idToken, expiresIn } = response;
            const expirationDate = new Date(new Date().getTime() + Number(expiresIn) * 1000);
            return of(new AuthActions.Login({ userId: localId, email, token: idToken, expirationDate }));
          }),
          catchError(error => of()),
        )
    }),
  );
}
