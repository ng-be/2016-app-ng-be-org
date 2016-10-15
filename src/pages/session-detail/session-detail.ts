// 3d party imports
import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

// app imports
import { Session, Speaker } from '../../entities';
import { SpeakerDetailPage } from '../';

@Component({
  selector: 'page-session-detail',
  templateUrl: 'session-detail.html'
})
export class SessionDetailPage {

  session: Session;

  constructor(private navParams: NavParams,
              private navCtrl: NavController) {

    this.session = navParams.data.session;

  }

  goToSpeakerDetail(speaker: Speaker): void {
    this.navCtrl.push(SpeakerDetailPage, speaker);
  }

}
