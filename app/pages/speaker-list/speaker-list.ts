// 3d party imports
import { Component } from "@angular/core";
import { ActionSheetController, NavController } from "ionic-angular";
import { InAppBrowser } from "ionic-native";

// app imports
import { SessionDetailPage } from "../session-detail/session-detail";
import { SpeakerDetailPage } from "../speaker-detail/speaker-detail";
import { InfoService } from "../../services/info.service";
import { Speaker } from "../../entities/speaker.entity";
import { Session } from "../../entities/session.entity";

@Component({
  templateUrl: 'build/pages/speaker-list/speaker-list.html'
})
export class SpeakerListPage {

  speakers$ = this._infoService.rpSpeakers$;

  constructor(public actionSheetCtrl: ActionSheetController,
              public navCtrl: NavController,
              private _infoService: InfoService) {
  }

  goToSessionDetail(session: Session): void {
    this.navCtrl.push(SessionDetailPage, session);
  }

  goToSpeakerDetail(speaker: Speaker): void {
    this.navCtrl.push(SpeakerDetailPage, speaker);
  }

  goToSpeakerTwitter(speaker: Speaker): void {
    new InAppBrowser(`https://twitter.com/${speaker.tweetName.replace("@", "")}`, '_system');
  }

  openSpeakerShare(speaker: Speaker): void {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Share ' + speaker.firstName + " " + speaker.lastName,
      buttons: [
        {
          text: 'Copy Link',
          handler: () => {
            console.log('Copy link clicked on https://twitter.com/' + speaker.tweetName.replace("@", ""));
            if (window['cordova'] && window['cordova'].plugins.clipboard) {
              window['cordova'].plugins.clipboard.copy('https://twitter.com/' + speaker.tweetName.replace("@", ""));
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
          }
        }
      ]
    });

    actionSheet.present();
  }

}
