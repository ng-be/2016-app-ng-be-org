// 3d party imports
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// app imports
import { TabsPage } from '../';
import { AuthService } from '../../services';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  previousLoginMethod: string;

  constructor(private navCtrl: NavController,
              private authService: AuthService,
              private storage: Storage) {
    this.getPreviousLoginMethod();
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

  postSignIn(): void {
    this.navCtrl.push(TabsPage);
  }

  private getPreviousLoginMethod() {
    this.storage.get('previousLoginMethod').then((previousLoginMethod) => {
      this.previousLoginMethod = previousLoginMethod;
    });
  }

}
