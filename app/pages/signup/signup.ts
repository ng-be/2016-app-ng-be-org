// 3d party imports
import { Component, OnDestroy } from "@angular/core";
import { NavController } from "ionic-angular";
import { Subscription } from "rxjs";
import { Toast } from "ionic-native";

// app imports
import { TabsPage } from "../tabs/tabs";
import { AuthService } from "../../services/auth.service";

@Component({
  template: `    
    <ion-header>
      <ion-navbar>
        <button menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>Signup</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content class="login-page">
      <ion-list>
        <div class="logo">
          <img src="img/appicon.svg">
        </div>
        <form #signupForm="ngForm" novalidate>
          <ion-item>
            <ion-label floating primary>Emailaddress</ion-label>
            <ion-input [(ngModel)]="signup.email" name="email" type="text" #email="ngModel" required>
            </ion-input>
          </ion-item>
          <p [hidden]="email.valid || submitted == false" danger padding-left>
            email is required
          </p>
          <ion-item>
            <ion-label floating primary>Password</ion-label>
            <ion-input [(ngModel)]="signup.password" name="password" type="password" #password="ngModel" required>
            </ion-input>
          </ion-item>
          <p [hidden]="password.valid || submitted == false" danger padding-left>
            Password is required
          </p>
          <div padding>
            <button (click)="onSignup(signupForm)" type="submit" primary block>Create</button>
          </div>
        </form>
      </ion-list>
    </ion-content>
`
})
export class SignupPage implements OnDestroy {
  signup: {email?: string, password?: string} = {};
  submitted = false;

  private subscriptions: Array<Subscription> = [];

  constructor(public navCtrl: NavController, private authService: AuthService) {
  }

  onSignup(form) {
    this.submitted = true;

    if (form.valid) {
      this.subscriptions.push(this.authService.register({
        login: this.signup.email,
        password: this.signup.password
      }).subscribe(() => {
        this.navCtrl.push(TabsPage);
      }, () => {
        Toast.show("Failed to sign up", '5000', 'center');
      }));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
