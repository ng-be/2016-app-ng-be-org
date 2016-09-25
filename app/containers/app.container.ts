// 3d party imports
import { Component, ViewChild } from '@angular/core';
import { Nav, MenuController, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

// app imports
import { TabsPage } from '../pages/tabs/tabs';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { SchedulePage } from '../pages/schedule/schedule';
import { AuthService } from '../services/auth.service';
import { InfoService } from '../services/info.service';

interface PageObj {
  title: string;
  component: any;
  icon: string;
  index?: number;
}

@Component({
  providers: [AuthService, InfoService],
  templateUrl: 'build/containers/app.container.html'
})
export class AppContainer {

  @ViewChild(Nav) nav: Nav;
  appPages: PageObj[] = [
    {title: 'Schedule', component: TabsPage, index: 0, icon: 'calendar'},
    {title: 'Speakers', component: TabsPage, index: 1, icon: 'contacts'},
    {title: 'Map', component: TabsPage, index: 2, icon: 'map'},
    {title: 'About', component: TabsPage, index: 3, icon: 'information-circle'},
  ];
  loggedInPages: PageObj[] = [
    {title: 'Account', component: AccountPage, icon: 'person'},
    {title: 'Logout', component: TabsPage, icon: 'log-out'}
  ];
  loggedOutPages: PageObj[] = [
    {title: 'Login', component: LoginPage, icon: 'log-in'},
    {title: 'Signup', component: SignupPage, icon: 'person-add'}
  ];
  rootPage: any = SchedulePage;
  isAuthenticated$ = this._authService.isAuthenticated$;

  constructor(private _authService: AuthService,
              private _infoService: InfoService,
              public menu: MenuController,
              platform: Platform) {
    // Call any initial plugins when ready
    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });

    this._authService.isAuthenticated$.subscribe((hasLoggedIn: boolean) => {
      this.enableMenu(hasLoggedIn);

    });
  }

  openPage(page: PageObj) {
    // the nav component was found using @ViewChild(Nav)
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      this.nav.setRoot(page.component, {tabIndex: page.index});

    } else {
      this.nav.setRoot(page.component);
    }

    if (page.title === 'Logout') {
      // Give the menu time to close before changing to logged out
      setTimeout(() => {
        this._authService.logout();
      }, 1000);
    }
  }

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

}
