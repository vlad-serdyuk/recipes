import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  url = 'put your url here';

  constructor(
    private http: HttpClient,
    private recipesService: RecipeService,
    private authService: AuthService,
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
          this.recipesService.setRecipes(recipes);
        })
      );
  }

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();
    return this.http.put(this.url, recipes);
  }
}
