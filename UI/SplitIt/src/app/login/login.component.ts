import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { AuthService, SocialUser } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials: TokenPayload = {
    email: '',
    password: ''
  };
  registerCredentials: TokenPayload = {
    email: '',
    name: '',
    password: ''
  };
  private user: SocialUser;
  private loggedIn: boolean;
  isGmailAddress: boolean = false;
  loginStatus: any;
  loginFailure: boolean = false;
  constructor(private auth: AuthenticationService, private googleAuth: AuthService, private router: Router) { }
  ngOnInit() {
    this.googleAuth.authState.subscribe((user) => {
      console.log(user)
      if (user != null) {
        this.auth.googleAPIuserData = user;
        this.registerCredentials.email = user.email;
        this.registerCredentials.name = user.name;
        this.registerCredentials.password = user.id;
        this.auth.register(this.registerCredentials).subscribe(() => {
          this.credentials.email = user.email;
          this.credentials.password = user.id;
          this.auth.login(this.credentials).subscribe(() => {
            this.router.navigateByUrl('/profile');
          }, (err) => {
            console.error(err);
          });
        })
      }
      this.user = user;
      this.loggedIn = (user != null);
    });
  }
  login() {
    if (this.credentials.email.includes("@gmail.com")) {
      this.isGmailAddress = true;
    } else {
      this.auth.login(this.credentials).subscribe((res) => {
        console.log(res);
        this.router.navigateByUrl('/profile');
      }, (err) => {
        this.loginFailure = true;
        this.loginStatus = err.error.message;
        console.error(err);
      });
    }
  }
/**
 * Social logins
 */
  signInWithGoogle(): void {
    console.log(GoogleLoginProvider.PROVIDER_ID)
    this.googleAuth.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.googleAuth.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.googleAuth.signOut();
  }
}
