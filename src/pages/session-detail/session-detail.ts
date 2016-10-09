// 3d party imports
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';

// app imports
import { ConferenceDataService } from '../../services';
import { Session, Room, Speaker } from '../../entities';

@Component({
  selector: 'page-session-detail',
  templateUrl: 'session-detail.html'
})
export class SessionDetailPage {

  session: Session;
  speaker$: Observable<Speaker> = this.conferenceData.rpSpeakers$.map(speakers => speakers.filter(speaker => this.session.speakers.indexOf(Number(speaker.$key)) > -1)[0]).cache();
  room$: Observable<Room> = this.conferenceData.rpRooms$.map(rooms => rooms.filter(room => Number(room.$key) === this.session.roomId)[0]).cache();

  constructor(private navParams: NavParams,
              private conferenceData: ConferenceDataService) {

    this.session = navParams.data;

  }

}
