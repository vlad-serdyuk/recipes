import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { AuthComponent } from './auth.component';

@NgModule({
  declarations: [
    AuthComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([ { path: 'auth', component: AuthComponent }]),
  ]
})
export class AuthModule {}
