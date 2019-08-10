import { Action } from '@ngrx/store';

export const LOGIN_START = '[auth] LOGIN_START';
export const LOGIN = '[auth] LOGIN';
export const LOGOUT = '[auth] LOGOUT';

export class Login implements Action {
  readonly type = LOGIN;

  constructor(public payload: { userId: string; email: string; token: string; expirationDate: Date }) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: { email: string, password: string }) {}
}

export type AuthActions =
  | Login
  | Logout;
