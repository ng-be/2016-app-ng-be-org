// 3d party imports
import { Component, OnDestroy } from '@angular/core';
import { AlertController, App, ItemSliding, ModalController, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs';

// app imports
import { ConferenceDataService, UserDataService } from '../../services';
import { ScheduleFilterPage, SessionDetailPage } from '../';
import { SessionGroup, Session } from '../../entities';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html'
})
export class SchedulePage implements OnDestroy {

  queryText = '';
  segment = 'all';
  numberOfShownSessions = 0;
  groups = [];
  shownTags = [];

  sessionGroups: Array<SessionGroup>;

  private subscriptions = Array<Subscription>();

  constructor(private alertCtrl: AlertController,
              private app: App,
              private modalCtrl: ModalController,
              private navCtrl: NavController,
              private conferenceData: ConferenceDataService,
              private user: UserDataService) {

    this.subscriptions.push(
      this.conferenceData.rpSessionGroups$.subscribe((data) => {

        this.sessionGroups = data;
        this.updateSchedule();

      })
    );

  }

  ionViewDidEnter() {
    this.app.setTitle('Schedule');
  }

  updateSchedule() {

    this.numberOfShownSessions = 0;
    this.sessionGroups.forEach((sessionGroup: SessionGroup) => {

      let hiddenSessions = 0;

      sessionGroup.sessions.forEach((session: Session) => {

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
          else{
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

  addFavorite(slidingItem: ItemSliding, sessionData) {

    if (this.user.hasFavorite(sessionData.name)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      this.removeFavorite(slidingItem, sessionData, 'Favorite already added');
    } else {
      // remember this session as a user favorite
      this.user.addFavorite(sessionData.name);

      // create an alert instance
      let alert = this.alertCtrl.create({
        title: 'Favorite Added',
        buttons: [{
          text: 'OK',
          handler: () => {
            // close the sliding item
            slidingItem.close();
          }
        }]
      });
      // now present the alert on top of all other content
      alert.present();
    }

  }

  removeFavorite(slidingItem: ItemSliding, sessionData, title) {
    let alert = this.alertCtrl.create({
      title: title,
      message: 'Would you like to remove this session from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavorite(sessionData.name);
            this.updateSchedule();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
