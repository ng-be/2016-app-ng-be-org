import {Component, OnDestroy} from "@angular/core";
import {NavController} from "ionic-angular";
import {SignupPage} from "../signup/signup";
import {TabsPage} from "../tabs/tabs";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
import {Toast} from "ionic-native";

@Component({
  template: `    
    <ion-header>
      <ion-navbar>
        <button menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>Login</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <div class="logo">
          <img src="img/appicon.svg">
        </div>
        <form #loginForm="ngForm" novalidate>
          <ion-item>
            <ion-label floating primary>Username</ion-label>
            <ion-input [(ngModel)]="login.username" name="username" type="text" #username="ngModel" spellcheck="false"
                       autocapitalize="off" required>
            </ion-input>
          </ion-item>
          <p [hidden]="username.valid || submitted == false" danger padding-left>
            Username is required
          </p>
          <ion-item>
            <ion-label floating primary>Password</ion-label>
            <ion-input [(ngModel)]="login.password" name="password" type="password" #password="ngModel" required>
            </ion-input>
          </ion-item>
          <p [hidden]="password.valid || submitted == false" danger padding-left>
            Password is required
          </p>
          <ion-row responsive-sm>
            <ion-col>
              <button (click)="onLogin(loginForm)" type="submit" primary block>Login</button>
            </ion-col>
            <ion-col>
              <button (click)="onSignup()" light block>Signup</button>
            </ion-col>
          </ion-row>
        </form>
      </ion-list>
    </ion-content>
`
})
export class LoginPage implements OnDestroy {
  login: {username?: string, password?: string} = {};
  submitted = false;
  private subscriptions: Array<Subscription> = [];

  constructor(public navCtrl: NavController, private authService: AuthService) {
  }

  onLogin(form) {
    this.submitted = true;

    if (form.valid) {
      this.subscriptions.push(this.authService.authenticate({
        login: this.login.username,
        password: this.login.password
      }).subscribe(() => {
        this.navCtrl.push(TabsPage);
      }, () => {
        Toast.show("Failed to log in", '5000', 'center');
      }));
    }
  }

  onSignup() {
    this.navCtrl.push(SignupPage);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
