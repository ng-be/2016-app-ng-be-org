// 3d party imports
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

// app imports
import { ConferenceDataService } from '../../services';
import { Session } from '../../entities';

@Component({
  selector: 'page-session-detail',
  templateUrl: 'session-detail.html'
})
export class SessionDetailPage {

  session: Session;

  constructor(private navParams: NavParams,
              private conferenceData: ConferenceDataService) {

    this.session = navParams.data;

  }

}
