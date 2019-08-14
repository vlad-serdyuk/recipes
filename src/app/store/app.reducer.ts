import { ActionReducerMap } from '@ngrx/store';

import { shoppingListReducer, ShoppingListState } from '../shopping-list/store/shopping-list.reducer';
import { authReducer, AuthState } from '../auth/store/auth.reducer';
import { recipeReducer, RecipeState } from '../recipes/store/recipe.reducer';

export interface AppState {
  shoppingList: ShoppingListState;
  auth: AuthState;
  recipes: RecipeState;
}

export const appReducer: ActionReducerMap<AppState> = {
  shoppingList: shoppingListReducer,
  auth: authReducer,
  recipes: recipeReducer,
};
