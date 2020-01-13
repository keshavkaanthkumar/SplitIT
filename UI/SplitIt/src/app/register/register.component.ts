import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  credentials: TokenPayload = {
    email: '',
    name: '',
    password: ''
  };
  inComplete: boolean;
  existsMessage: string;

  constructor(private auth: AuthenticationService, private router: Router) { }
  userNameExists: boolean = false;
  register() {
    console.log(this.credentials)
    if (this.credentials.email != "" && this.credentials.name != "" && this.credentials.password != "") {
      this.inComplete = false;
      this.auth.register(this.credentials).subscribe((message) => {
        console.log(message)
        if (message === "Username already exits") {
          this.userNameExists = true;
          this.existsMessage = "Username already exits"
        } else {
          this.userNameExists = false;
          this.router.navigateByUrl('/profile');
        }
      }, (err) => {
        console.error(err);
      });

    }
    else {
      this.userNameExists = false
      this.inComplete = true;
    }
  }
}
