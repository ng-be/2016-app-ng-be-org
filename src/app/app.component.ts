// 3d party imports
import { Component, ViewChild } from '@angular/core';
import {
  MenuController,
  Nav,
  Platform,
  IonicApp,
  App,
  AlertController,
  ToastController,
  Events
} from 'ionic-angular';
import { Splashscreen, StatusBar } from 'ionic-native';

// app imports
import { LoginPage, TabsPage, SignupPage } from '../pages';
import { AuthService } from '../services';

export interface PageObj {
  title: string;
  component: any;
  icon: string;
  index?: number;
}

@Component({
  templateUrl: 'app.template.html'
})
export class ConferenceApp {

  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageObj[] = [
    {title: 'Schedule', component: TabsPage, icon: 'calendar'},
    {title: 'Speakers', component: TabsPage, index: 1, icon: 'contacts'},
    {title: 'Map', component: TabsPage, index: 2, icon: 'map'},
    {title: 'About', component: TabsPage, index: 3, icon: 'information-circle'},
  ];
  rootPage: any = TabsPage;
  currentUser: any;
  isWeb: boolean;

  private innerNavCtrl: any;

  constructor(private authService: AuthService,
              private menu: MenuController,
              private platform: Platform,
              private ionicApp: IonicApp,
              private app: App,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private events: Events) {

    this.isWeb = this.platform.is('mobileweb');
    this.initApplication();
    this.setupBackButtonBehavior();

  }

  initApplication() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });

    // decide which menu items should be hidden by current login status stored in local storage
    this.authService.rpCurrentUser$.subscribe((currentUser) => {
      this.currentUser = currentUser;
      if (currentUser) {
        let toast = this.toastCtrl.create({
          message: 'Welcome ' + currentUser.displayName + '! You can now start favoriting & rating sessions!',
          showCloseButton: true,
          closeButtonText: 'close',
          duration: 5000
        });
        toast.present();
        this.enableMenu(currentUser);
      }
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
        //this.userData.logout();
      }, 1000);
    }
  }

  enableMenu(loggedIn) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  openLogin() {
    this.nav.push(LoginPage);
  }

  openSignup() {
    this.nav.push(SignupPage);
  }

  signOut() {

    let alert = this.alertCtrl.create({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            return;
          }
        },
        {
          text: 'Yes, logout',
          handler: () => {
            this.authService.signOut();
            let toast = this.toastCtrl.create({
              message: 'You have been logged out',
              showCloseButton: true,
              closeButtonText: 'close',
              duration: 3000
            });
            toast.present();
            this.menu.close('loggedInMenu');
            this.enableMenu(false);
          }
        }
      ]
    });

    // now present the alert on top of all other content
    alert.present();

  }

  private setupBackButtonBehavior() {

    // If on web version (browser)
    if (window.location.protocol !== "file:") {

      // Listen to browser pages
      this.events.subscribe("navController:current", (navCtrlData) => {
        this.innerNavCtrl = navCtrlData[0];
      });

      // Register browser back button action(s)
      window.onpopstate = (evt) => {

        // Close menu if open
        if (this.menu.isOpen()) {
          this.menu.close();
          return;
        }

        // Close any active modals or overlays
        let activePortal = this.ionicApp._loadingPortal.getActive() ||
          this.ionicApp._modalPortal.getActive() ||
          //this.ionicApp._toastPortal.getActive() ||
          this.ionicApp._overlayPortal.getActive();

        if (activePortal) {
          activePortal.dismiss();
          return;
        }

        // Navigate back on main active nav if there's a page loaded
        if (this.app.getActiveNav().canGoBack()) {
          this.app.getActiveNav().pop();
        }

        // Navigate back on subloaded nav if notified
        if (this.innerNavCtrl && this.innerNavCtrl.canGoBack()) {
          this.innerNavCtrl.pop();
        }

      };

      // Fake browser history on each view enter
      this.app.viewDidEnter.subscribe((app) => {
        history.pushState(null, null, "");
      });

    }

  }


}
