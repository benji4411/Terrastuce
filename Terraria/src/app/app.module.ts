import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './register/register.component';

import { LoginComponent } from './login/login.component';
import { TipsListComponent } from './tips-list/tips-list.component';
import { TipComponent } from './tip/tip.component';
import { NewTipComponent } from './new-tip/new-tip.component';
import { ProfileComponent } from './profile/profile.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotFoundComponent } from './404.component';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MainPageComponent } from './main-page/main-page.component';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { FilterPipe } from './filter.pipe';
import { FilterTagsPipe } from './filter-tags.pipe';
import { FilterAuthorPipe } from './filter-author.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { FilterUsernamePipe } from './filter-username.pipe';
import { FilterIdPipe } from './filter-id.pipe';
import { FilterBannedPipe } from './filter-banned.pipe';
import { AccessDeniedComponent } from './401.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    TipsListComponent,
    TipComponent,
    NewTipComponent,
    ProfileComponent,
    UserManagementComponent,
    MainPageComponent,
    FilterPipe,
    FilterTagsPipe,
    FilterAuthorPipe,
    NotFoundComponent,
    AccessDeniedComponent,
    FilterUsernamePipe,
    FilterIdPipe,
    FilterBannedPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatDialogModule,
    HttpClientModule,
    MatSnackBarModule,
    MatSelectModule,
    MatCardModule,
    RouterModule.forRoot([
      { path: '', component: MainPageComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'tip', component: TipComponent },
      { path: 'profile', component: ProfileComponent },
      {
        path: 'profile/my-tips',
        component: TipsListComponent,
        data: { isTipOwner: true },
      },
      { path: 'admin/pending', component: TipsListComponent },
      {
        path: 'admin/user-management',
        component: UserManagementComponent,
        data: { onlyPending: true },
      },
      { path: 'new-tip', component: NewTipComponent },
      { path: 'access-denied', component: AccessDeniedComponent },
      { path: '**', component: NotFoundComponent },
    ]),
  ],
  providers: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    TipsListComponent,
    TipComponent,
    NewTipComponent,
    ProfileComponent,
    UserManagementComponent,
    MainPageComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
