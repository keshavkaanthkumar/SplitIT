import { Component } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { AuthService } from 'angularx-social-login';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Splitwise';
  constructor(public auth: AuthenticationService, private googleAuth: AuthService){

  }
 
}
