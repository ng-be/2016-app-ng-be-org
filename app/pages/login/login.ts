// 3d party imports
import { Component, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { Toast } from 'ionic-native';

// app imports
import { SignupPage, TabsPage } from '../';
import { AuthService } from '../../services';

@Component({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage implements OnDestroy {

  login: {username?: string, password?: string} = {};
  submitted = false;

  private subscriptions: Array<Subscription> = [];

  constructor(public navCtrl: NavController,
              private authService: AuthService) {
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
        Toast.show('Failed to log in', '5000', 'center');
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
