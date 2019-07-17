import { Component, EventEmitter, Output } from '@angular/core';

import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  @Output() featureSelected = new EventEmitter<string>();
  loading = false;

  constructor(private dataStorageService: DataStorageService) {}

  onSaveData() {
    this.loading = true;
    this.dataStorageService.storeRecipes().subscribe(() => {
      this.loading = false;
    });
  }
}
