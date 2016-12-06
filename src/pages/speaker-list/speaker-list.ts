// 3d party imports
import { Component } from '@angular/core';
import { ActionSheet, NavController, App } from 'ionic-angular';
import { ReplaySubject } from 'rxjs';

// app imports
import { SessionDetailPage, SpeakerDetailPage } from '../';
import { ConferenceDataService } from '../../services';
import { Speaker, Session } from '../../entities';

@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html'
})
export class SpeakerListPage {

  actionSheet: ActionSheet;
  speakers$: ReplaySubject<any> = this.conferenceData.rpSpeakers$;

  constructor(private navCtrl: NavController,
              private conferenceData: ConferenceDataService,
              private app: App) {

  }

  ionViewDidEnter() {
    this.app.setTitle('Speakers - NG-BE 2016');
  }

  goToSessionDetail(session: Session): void {
    this.navCtrl.push(SessionDetailPage, session);
  }

  goToSpeakerDetail(speaker: Speaker): void {
    this.navCtrl.push(SpeakerDetailPage, speaker);
  }

  openUp(url, type) {
    if (type === 'twitter') {
      url = 'https://twitter.com/' + url;
    }
    if (type === 'github') {
      url = 'https://github.com/' + url;
    }
    window.open(url, '_system');
  }

}
