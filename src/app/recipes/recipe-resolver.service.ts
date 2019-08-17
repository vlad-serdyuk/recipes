import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { Recipe } from './recipe.model';
import { AppState } from '../store/app.reducer';
import * as RecipesActions from './store/recipe.actions';

@Injectable({
  providedIn: 'root',
})
export class RecipeResolverService implements Resolve<Array<Recipe>> {
  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<Recipe>> | Promise<Array<Recipe>> | Array<Recipe> {
    this.store.dispatch(new RecipesActions.FetchRecipes());
    return this.actions$.pipe(
      ofType(RecipesActions.SET_RECIPES),
      take(1),
    );
  }
}
