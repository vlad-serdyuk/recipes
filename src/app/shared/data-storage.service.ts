import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RecipeService } from '../recipes/recipe.service';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  url = 'put your url here';

  constructor(
    private http: HttpClient,
    private recipesService: RecipeService,
    ) {}

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();
    return this.http.put(this.url, recipes);
  }
}
