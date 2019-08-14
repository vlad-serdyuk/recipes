import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { AppState } from '../store/app.reducer';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  url = 'put your url here';

  constructor(
    private http: HttpClient,
    private recipesService: RecipeService,
    private store: Store<AppState>,
    ) {}

  fetchRecipes() {
    return this.http.get<Array<Recipe>>(this.url)
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap(recipes => {
          this.store.dispatch(new RecipeActions.SetRecipes(recipes));
        })
      );
  }

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();
    return this.http.put(this.url, recipes);
  }
}
