// 3d party imports
import { Component } from '@angular/core';
import { NavParams, NavController, ModalController, ToastController, AlertController } from 'ionic-angular';

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
              private modalCtrl: ModalController,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController) {

    this.session = navParams.data.session;

  }

  toggleFavorite() {

    if (this.session.favorite) {

      let alert = this.alertCtrl.create({
        title: 'Defavorite',
        message: 'Would you like to remove this session from your favorites?',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              return;
            }
          },
          {
            text: 'Defavorite',
            handler: () => {
              this.toggleFavoriteToast();
            }
          }
        ]
      });

      // now present the alert on top of all other content
      alert.present();

    } else {
      this.toggleFavoriteToast();
    }

  }

  toggleFavoriteToast() {
    this.session.favorite = !this.session.favorite;
    let toast = this.toastCtrl.create({
      message: this.session.favorite ? 'Session has been favorited' : 'Session has been defavorited',
      showCloseButton: true,
      closeButtonText: 'close',
      duration: 3000
    });
    toast.present();
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
