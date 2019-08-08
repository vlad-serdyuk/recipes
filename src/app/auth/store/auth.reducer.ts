import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User;
}

const initialState: AuthState = {
  user: null,
};

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.LOGIN:
      const { email, token, userId, expirationDate } = action.payload;
      const user = new User(userId, email, token, expirationDate);

      return {
        user,
        ...state,
      };
    case AuthActions.LOGOUT:
      return {
        user: null,
        ...state,
      };
    default:
      return state;
  }
}
