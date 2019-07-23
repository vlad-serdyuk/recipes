import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private loading = false;
  private userSub: Subscription;
  isAuthenticated = false;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(
      (user) => {
        this.isAuthenticated = !!user;
      }
    );
  }

  onFetchData() {
    this.loading = true;
    this.dataStorageService.fetchRecipes().subscribe(() => {
      this.loading = false;
    });
  }

  onSaveData() {
    this.loading = true;
    this.dataStorageService.storeRecipes().subscribe(() => {
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
