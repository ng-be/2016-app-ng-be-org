// 3d party imports
import { Component } from '@angular/core';
import { NavParams, NavController, ModalController } from 'ionic-angular';

// app imports
import { Session, Speaker } from '../../entities';
import { SpeakerDetailPage, RateSessionPage } from '../';

@Component({
  selector: 'page-session-detail',
  templateUrl: 'session-detail.html'
})
export class SessionDetailPage {

  session: Session;

  constructor(private navParams: NavParams,
              private navCtrl: NavController,
              private modalCtrl: ModalController) {

    this.session = navParams.data.session;

  }

  toggleFavorite(){

  }

  goToSpeakerDetail(speaker: Speaker): void {
    this.navCtrl.push(SpeakerDetailPage, speaker);
  }

  openRatingModal() {
    let modal = this.modalCtrl.create(RateSessionPage, {
      session: this.session
    });
    modal.present();
  }


}
