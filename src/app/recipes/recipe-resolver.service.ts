import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';

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
    return this.store.select('recipes').pipe(
      take(1),
      map(recipesState => recipesState.recipes),
      switchMap(recipes => {
        if (recipes.length === 0) {
          this.store.dispatch(new RecipesActions.FetchRecipes());
          return this.actions$.pipe(
            ofType(RecipesActions.SET_RECIPES),
            take(1),
          );
        }

        return of(recipes);
      }),
    );


  }
}
