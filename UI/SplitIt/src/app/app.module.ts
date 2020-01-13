import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { AuthGuardService } from './auth-guard.service';
import { MatListModule, MatSelectModule } from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatIconModule, MatExpansionModule, MatExpansionPanelTitle } from '@angular/material';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';
import { SettleUpComponent } from './settle-up/settle-up.component';
import { SocialLoginModule, AuthServiceConfig, LoginOpt } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { SettlementsListComponent } from './settlements-list/settlements-list.component';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ViewExpenseComponentComponent } from './view-expense-component/view-expense-component.component';
import { NotifierModule } from "angular-notifier";

const googleLoginOptions: LoginOpt = {
  scope: 'profile email'
}; // https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("806936599430-8qmpg6ttordps79j65j5gondvfn50g22.apps.googleusercontent.com", googleLoginOptions)
  }
]);
export function provideConfig() {
  return config;
}
const routes: Routes = [{ path: '', component: HomeComponent },
{ path: 'login', component: LoginComponent },
{ path: 'register', component: RegisterComponent },
{ path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] }]

@NgModule({
  declarations: [
    ViewExpenseComponentComponent,
    AppComponent,
    ProfileComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AddExpenseComponent,
    ExpensesListComponent,
    SettleUpComponent,
    SettlementsListComponent,
    ViewExpenseComponentComponent
  ],
  imports: [
    NotifierModule,
    Ng2SearchPipeModule,
    SocialLoginModule,
    NgxPaginationModule,
    BrowserModule,
    HttpClientModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatListModule,
    FormsModule,
    RouterModule.forRoot(routes),
    MDBBootstrapModule.forRoot(),
    MatDialogModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatExpansionModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    AuthenticationService,
    AuthGuardService,
    ProfileComponent,
    { provide: MAT_DIALOG_DATA, useValue: {} }
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddExpenseComponent, SettleUpComponent, ViewExpenseComponentComponent]
})
export class AppModule { }
