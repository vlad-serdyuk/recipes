import { Action } from '@ngrx/store';

export const LOGIN_START = '[auth] LOGIN_START';
export const AUTHENTICATE_SUCCESS = '[auth] AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_FAILED = '[auth] AUTHENTICATE_FAILED';
export const SIGNUP_START = '[auth] SIGNUP_START';
export const CLEAR_ERROR = '[auth] CLEAR_ERROR';
export const AUTO_LOGIN = '[auth] AUTO_LOGIN';
export const LOGOUT = '[auth] LOGOUT';

export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;

  constructor(public payload: { userId: string; email: string; token: string; expirationDate: Date }) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: { email: string, password: string }) {}
}

export class AuthenticateFailed implements Action {
  readonly type = AUTHENTICATE_FAILED;

  constructor(public payload: string) {}
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;

  constructor(public payload: { email: string, password: string }) {}
}

export class ClearError implements Action {
  readonly type = CLEAR_ERROR;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export type AuthActions =
  | AuthenticateSuccess
  | Logout
  | LoginStart
  | AuthenticateFailed
  | SignupStart
  | ClearError
  | AutoLogin;
