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
  template: `    
    <ion-header>
      <ion-navbar>
        <button menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>Speakers</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content class="outer-content speaker-list">
      <ion-card *ngFor="let speaker of speakers$|async" class="speaker">
        <ion-card-header>
          <ion-item>
            <ion-avatar item-left>
              <img [src]="speaker.img">
            </ion-avatar>
            {{speaker.firstName}} {{speaker.lastName}}
          </ion-item>
        </ion-card-header>
        <ion-card-content class="outer-content">
          <ion-list>
            <button ion-item *ngFor="let session of speaker.sessions" (click)="goToSessionDetail(session)">
              <h3>{{session.title}}</h3>
            </button>
            <button ion-item (click)="goToSpeakerDetail(speaker)">
              <h3>About {{speaker.firstName}} {{speaker.lastName}}</h3>
            </button>
          </ion-list>
        </ion-card-content>
        <ion-item>
          <button (click)="goToSpeakerTwitter(speaker)" clear item-left>
            <ion-icon name="logo-twitter"></ion-icon>
            Tweet
          </button>
          <button (click)="openSpeakerShare(speaker)" clear item-right>
            <ion-icon name="share"></ion-icon>
            Share
          </button>
        </ion-item>
      </ion-card>
    </ion-content>
`
})
export class SpeakerListPage {
  speakers$ = this.infoService.rpSpeakers$;

  constructor(public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, private infoService: InfoService) {
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
