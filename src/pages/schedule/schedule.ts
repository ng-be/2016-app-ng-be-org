// 3d party imports
import { Component, OnDestroy } from '@angular/core';
import {
  AlertController,
  App,
  ItemSliding,
  ModalController,
  NavController,
  LoadingController,
  Loading,
  ToastController,
  ViewController
} from 'ionic-angular';
import { Subscription } from 'rxjs';

// app imports
import { ConferenceDataService, AuthService } from '../../services';
import { ScheduleFilterPage, SessionDetailPage, LoginPage } from '../';
import { SessionGroup, Session, Favorite, Rating } from '../../entities';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html'
})
export class SchedulePage implements OnDestroy {

  queryText = '';
  segment = 'all';
  numberOfShownSessions = 0;
  shownTags = [];
  loader: Loading;
  isAuthenticated = false;
  loading = true;

  sessionGroups: Array<SessionGroup>;

  private favorites: Array<Favorite> = [];
  private ratings: Array<Rating> = [];
  private subscriptions = Array<Subscription>();

  constructor(private alertCtrl: AlertController,
              private app: App,
              private modalCtrl: ModalController,
              private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private viewCtrl: ViewController,
              private conferenceData: ConferenceDataService,
              private toastCtrl: ToastController,
              private authService: AuthService) {

    this.setupSubscriptions();
    this.presentLoader();

  }

  ionViewDidEnter() {
    this.app.setTitle('Schedule - NG-BE 2016');
    if (this.sessionGroups) {
      this.updateSchedule();
    }
  }

  toggleFavorite(slidingItem: ItemSliding, session) {

    if (session.favorite) {

      let alert = this.alertCtrl.create({
        title: 'Defavorite',
        message: 'Would you like to remove this session from your favorites?',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              slidingItem.close();
              return;
            }
          },
          {
            text: 'Defavorite',
            handler: () => {
              this.toggleFavoriteToast(session, slidingItem);
            }
          }
        ]
      });

      // now present the alert on top of all other content
      alert.present();

    } else {
      this.toggleFavoriteToast(session, slidingItem);
    }

  }

  openLogin() {
    this.navCtrl.push(LoginPage);
  }

  presentFilter() {

    let modal = this.modalCtrl.create(ScheduleFilterPage, {
      shownTags: this.shownTags
    });
    modal.present();

    modal.onDidDismiss((data: any[]) => {
      if (data) {
        this.shownTags = data;
        this.updateSchedule();
      }
    });

  }

  resetFilters(event?: any) {
    if (event) {
      event.preventDefault();
    }
    this.shownTags = [];
    this.updateSchedule();
  }

  goToSessionDetail(session) {
    // go to the session detail page
    // and pass in the session data
    this.navCtrl.push(SessionDetailPage, {
      session: session
    });
  }

  updateSchedule() {

    this.numberOfShownSessions = 0;
    this.sessionGroups.forEach((sessionGroup: SessionGroup) => {

      let hiddenSessions = 0;

      sessionGroup.sessions.forEach((session: Session) => {

        delete session.favorite;
        this.favorites.forEach((favorite) => {
          if (favorite.sessionId === session.$key) {
            session.favorite = favorite;
          }
        });

        delete session.rating;
        this.ratings.forEach((rating) => {
          if (rating.sessionId === session.$key) {
            session.rating = rating;
          }
        });

        let matchedTags = 0;
        session.tags.forEach((tag) => {
          if (this.shownTags.indexOf(tag) > -1) {
            matchedTags++;
          }
        });

        let matchedText = false;
        if (session.title.toLowerCase().indexOf(this.queryText.toLowerCase()) > -1) {
          matchedText = true;
        }

        if (
          ( matchedTags > 0 || this.shownTags.length === 0 ) &&
          ( matchedText || this.queryText.length === 0)
        ) {

          if (this.segment === 'favorites' && !session.favorite) {
            session.hidden = true;
            hiddenSessions++;
          }
          else {
            session.hidden = false;
            this.numberOfShownSessions++;
          }

        } else {
          session.hidden = true;
          hiddenSessions++;
        }

      });

      sessionGroup.hidden = sessionGroup.sessions.length === hiddenSessions;

    });

    this.closeLoader();
    this.loading = false;

  }

  toggleFavoriteToast(session, slidingItem: ItemSliding) {

    if (this.isAuthenticated) {
      if (!session.favorite) {
        this.conferenceData.setFavorite(session.$key);
        this.viewCtrl.dismiss();
      } else {
        this.conferenceData.removeFavorite(session.favorite.$key);
        delete session.favorite;
      }

      let toast = this.toastCtrl.create({
        message: session.favorite ? 'Session has been favorited' : 'Session has been defavorited',
        showCloseButton: true,
        closeButtonText: 'close',
        duration: 3000
      });
      toast.present();
      slidingItem.close();

    } else {
      let alert = this.alertCtrl.create({
        title: 'Not logged in',
        message: 'You need to be logged in to favorite the session.',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
            }
          },
          {
            text: 'Go to login',
            handler: () => {
              this.navCtrl.push(LoginPage);
              alert.dismiss();
            }
          }
        ]
      });

      // now present the alert on top of all other content
      alert.present();
      slidingItem.close();
    }

  }

  private presentLoader() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present();
  }

  private closeLoader() {
    if (this.loader) {
      this.loader.dismissAll();
    }
  }

  private setupSubscriptions() {
    this.subscriptions.push(
      this.conferenceData.rpSessionGroups$.subscribe((data) => {

        this.sessionGroups = data;
        this.updateSchedule();
        this.closeLoader();

      })
    );
    this.subscriptions.push(
      this.conferenceData.rpFavorites$.subscribe((data) => {

        this.favorites = data;
        if (this.sessionGroups) {
          this.updateSchedule();
        }

      })
    );
    this.subscriptions.push(
      this.conferenceData.rpRatings$.subscribe((data) => {

        this.ratings = data;
        if (this.sessionGroups) {
          this.updateSchedule();
        }

      })
    );
    this.subscriptions.push(
      this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
        this.favorites = [];
        this.ratings = [];
        if (this.sessionGroups) {
          this.updateSchedule();
          this.closeLoader();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
