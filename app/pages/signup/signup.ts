// 3d party imports
import { Component, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { Toast } from 'ionic-native';

// app imports
import { TabsPage } from '../tabs/tabs';
import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: 'build/pages/signup/signup.html'
})
export class SignupPage implements OnDestroy {

  signup: {
    email?: string,
    password?: string
  } = {};
  submitted = false;

  private subscriptions: Array<Subscription> = [];

  constructor(public navCtrl: NavController,
              private _authService: AuthService) {
  }

  onSignup(form) {
    this.submitted = true;

    if (form.valid) {
      this.subscriptions.push(this._authService.register({
        login: this.signup.email,
        password: this.signup.password
      }).subscribe(() => {
        this.navCtrl.push(TabsPage);
      }, () => {
        Toast.show('Failed to sign up', '5000', 'center');
      }));
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
