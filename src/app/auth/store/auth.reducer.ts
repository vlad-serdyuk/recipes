import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  authError: null,
  loading: false,
};

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.AUTHENTICATE_SUCCESS:
      const { email, token, userId, expirationDate } = action.payload;
      const user = new User(userId, email, token, expirationDate);

      return {
        user,
        authError: null,
        loading: false,
        ...state,
      };
    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START:
      return {
        ...state,
        authError: null,
        loading: true,
      };
    case AuthActions.AUTHENTICATE_FAILED:
      return {
        ...state,
        authError: action.payload,
        loading: false,
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
        loading: false,
      };
    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        loading: false,
        authError: null,
      };
    default:
      return state;
  }
}
