// 3d party imports
import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';

// app imports
import { Speaker } from '../../entities';
import { SessionDetailPage } from '../';

@Component({
  selector: 'page-speaker-detail',
  templateUrl: 'speaker-detail.html'
})
export class SpeakerDetailPage {

  speaker: Speaker;

  constructor(private navParams: NavParams,
              private navCtrl: NavController,
              private app: App) {
    this.speaker = this.navParams.data;
  }

  ionViewDidEnter() {
    this.app.setTitle(this.speaker.firstname + ' ' + this.speaker.name + ' - Speakers - NG-BE 2016');
  }

  goToSessionDetail(session) {
    // go to the session detail page
    // and pass in the session data
    this.navCtrl.push(SessionDetailPage, {
      session: session
    });
  }

}
