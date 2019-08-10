import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { exhaustMap, take, map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { AppState } from '../store/app.reducer';


@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => authState.user),
      exhaustMap(user => {

        if (!user) {
          return next.handle(req);
        }

        const modifiedReq = req.clone({ params: new HttpParams().set('auth', user.token) });
        return next.handle(modifiedReq);
      })
    );

  }
}
