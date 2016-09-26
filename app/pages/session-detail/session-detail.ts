// 3d party imports
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

// app imports
import { InfoService } from '../../services/info.service';
import { Session } from '../../entities/session.entity';

@Component({
  templateUrl: 'build/pages/session-details/session-details.html'
})
export class SessionDetailPage {

  session: Session;
  speaker$ = this.infoService.rpSpeakers$.map(speakers => speakers.filter(speaker => Number(speaker.$key) === this.session.speakerId)[0]).cache();
  room$ = this.infoService.rpRooms$.map(rooms => rooms.filter(room => Number(room.$key) === this.session.roomId)[0]).cache();

  constructor(public navParams: NavParams,
              private infoService: InfoService) {
    this.session = navParams.data;
  }

}
