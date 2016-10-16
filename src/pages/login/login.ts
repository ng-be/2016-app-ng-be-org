// 3d party imports
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// app imports
import { TabsPage } from '../';
import { AuthService } from '../../services';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(private navCtrl: NavController,
              private authService: AuthService) {
  }

  signInWithFacebook(): void {
    this.authService.signInWithFacebook()
      .then(() => this.postSignIn());
  }

  signInWithGithub(): void {
    this.authService.signInWithGithub()
      .then(() => this.postSignIn());
  }

  signInWithGoogle(): void {
    this.authService.signInWithGoogle()
      .then(() => this.postSignIn());
  }

  signInWithTwitter(): void {
    this.authService.signInWithTwitter()
      .then(() => this.postSignIn());
  }

  private postSignIn(): void {
    this.navCtrl.push(TabsPage);

  }

}
