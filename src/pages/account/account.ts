// 3d party imports
import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';

// app imports
import { LoginPage } from '../';
import { UserData } from '../../providers';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  username: string;

  constructor(public nav: NavController,
              public userData: UserData) {

  }

  ngAfterViewInit() {
    this.getUsername();
  }

  logout() {
    this.userData.logout();
    this.nav.setRoot(LoginPage);
  }

  private getUsername() {
    this.userData.getUsername().then((username) => {
      this.username = username;
    });
  }

}
