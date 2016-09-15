import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import {InfoService} from "../../services/info.service";
import {Session} from "../../entities/session.entity";

@Component({
  template: `    
    <ion-header>
      <ion-navbar>
        <ion-title>Session</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content padding>
      <h1>{{session.title}}</h1>
      <h4>
        {{(speaker$|async)?.firstName}}
        {{(speaker$|async)?.lastName}}
      </h4>
      <p>
        {{session.startDate}} - {{session.endDate}}
      </p>
      <p>{{(room$|async)?.name}}</p>
      <p>{{session.description}}</p>
    </ion-content>
`
})
export class SessionDetailPage {
  session: Session;
  speaker$ = this.infoService.rpSpeakers$.map(speakers => speakers.filter(speaker => Number(speaker.$key) === this.session.speakerId)[0]).cache();
  room$ = this.infoService.rpRooms$.map(rooms => rooms.filter(room => Number(room.$key) === this.session.roomId)[0]).cache();

  constructor(public navParams: NavParams, private infoService: InfoService) {
    this.session = navParams.data;
  }
}
