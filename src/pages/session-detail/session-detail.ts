// 3d party imports
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';

// app imports
import { InfoService } from '../../services';
import { Session, Room, Speaker } from '../../entities';

@Component({
  selector: 'page-session-detail',
  templateUrl: 'session-detail.html'
})
export class SessionDetailPage {

  session: Session;

  speaker$: Observable<Speaker> = this.infoService.rpSpeakers$.map(speakers => speakers.filter(speaker => Number(speaker.$key) === this.session.speakerId)[0]).cache();
  room$: Observable<Room> = this.infoService.rpRooms$.map(rooms => rooms.filter(room => Number(room.$key) === this.session.roomId)[0]).cache();

  constructor(public navParams: NavParams,
              private infoService: InfoService) {
    this.session = navParams.data;
    console.log(this.session);
  }

}
