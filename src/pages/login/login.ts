// 3d party imports
import { Component, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { Toast } from 'ionic-native';
import { AngularFire, AuthMethods, AuthProviders } from 'angularfire2';

// app imports
import { TabsPage } from '../';
import { AuthService } from '../../services';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnDestroy {

  private subscriptions: Array<Subscription> = [];

  constructor(private navCtrl: NavController,
              private authService: AuthService,
              private af: AngularFire) {
  }

  loginFacebook(event) {
    this.af.auth.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Redirect,
    }).then((res)=> {
      console.log(res);
      this.navCtrl.push(TabsPage);
    }, (err)=>{
      Toast.show('Failed to log in', '5000', 'center');
    });
  }

  loginTwitter(event) {

  }

  loginGithub(event) {

  }

  loginGoogle(event) {

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
