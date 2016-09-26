// 3d party imports
import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { Observable, BehaviorSubject } from 'rxjs';

// app imports
import { SessionDetailPage } from '../session-detail/session-detail';
import { UserData } from '../../providers/user-data';
import { DayOverview } from './day-overview';
import { InfoService } from '../../services/info.service';
import { Session } from '../../entities/session.entity';
import { SessionGroup } from '../../entities/sessionGroup.entity';

@Component({
  directives: [DayOverview],
  templateUrl: 'build/pages/schedule/schedule.html'
})
export class SchedulePage {

  segment = 'all';
  segment$ = new BehaviorSubject(this.segment);
  searchTerm$ = new BehaviorSubject('');
  sessionGroups$ = this.infoService.rpSessionGroups$;
  filteredSessionGroups$ = Observable.combineLatest(
    this.searchTerm$,
    this.sessionGroups$,
    (searchTerm: string, sessionGroups: Array<SessionGroup>) => {
      searchTerm = searchTerm.toLowerCase();
      return sessionGroups.map(sessionGroup => {
        let sessions = sessionGroup.sessions.filter((session: Session) => {
          return session.title.toLowerCase().indexOf(searchTerm) > -1;
        });
        return Object.assign({}, sessionGroup, {sessions});
      });
    }
  );
  filteredSessionGroupBySegment$ = Observable.combineLatest(
    this.segment$,
    this.filteredSessionGroups$,
    (segment: string, sessionGroups: Array<SessionGroup>) => {
      return segment === 'all' ? sessionGroups : sessionGroups.map(sessionGroup => {
        let sessions = sessionGroup.sessions.filter(session => session.favorite != null);
        return Object.assign({}, sessionGroup, {sessions});
      });
    }
  );

  constructor(public app: App,
              public navCtrl: NavController,
              public user: UserData,
              private infoService: InfoService) {
  }

  ionViewDidEnter() {
    this.app.setTitle('Schedule');
  }

  onAddFavorite(session: Session): void {
    this.infoService.setFavorite(session);
  }

  onRemoveFavorite(session: Session): void {
    this.infoService.removeFavorite(session.favorite);
  }

  onGoToSessionDetail(sessionData) {
    this.navCtrl.push(SessionDetailPage, sessionData);
  }

}
