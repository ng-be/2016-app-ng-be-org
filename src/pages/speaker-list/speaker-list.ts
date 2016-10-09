// 3d party imports
import { Component } from '@angular/core';
import { ActionSheet, ActionSheetController, Config, NavController } from 'ionic-angular';
import { ReplaySubject } from 'rxjs';

// app imports
import { SessionDetailPage, SpeakerDetailPage } from '../';
import { InfoService } from '../../services';
import { Speaker, Session } from '../../entities';

@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html'
})
export class SpeakerListPage {

  actionSheet: ActionSheet;
  speakers$: ReplaySubject<any> = this.infoService.rpSpeakers$;

  constructor(private actionSheetCtrl: ActionSheetController,
              private navCtrl: NavController,
              private config: Config,
              private infoService: InfoService) {

  }

  goToSessionDetail(session: Session): void {
    this.navCtrl.push(SessionDetailPage, session);
  }

  goToSpeakerDetail(speaker: Speaker): void {
    this.navCtrl.push(SpeakerDetailPage, speaker);
  }

  goToSpeakerTwitter(speaker) {
    // TODO FIX
    // let app = new InAppBrowser(`https://twitter.com/${speaker.twitter}`, '_blank');
    // app.on('loadstop').subscribe(
    //   (ev) => {
    //     console.log('InAppBrowser loaded!');
    //   });
  }

  openSpeakerShare(speaker) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Share ' + speaker.name,
      buttons: [
        {
          text: 'Copy Link',
          handler: () => {
            console.log('Copy link clicked on https://twitter.com/' + speaker.twitter);
            if (window['cordova'] && window['cordova'].plugins.clipboard) {
              window['cordova'].plugins.clipboard.copy('https://twitter.com/' + speaker.twitter);
            }
          }
        },
        {
          text: 'Share via ...',
          handler: () => {
            console.log('Share via clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

}
