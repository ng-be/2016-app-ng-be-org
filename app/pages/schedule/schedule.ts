// 3d party imports
import { Component } from "@angular/core";
import { App, NavController } from "ionic-angular";
import { Observable, BehaviorSubject } from "rxjs";

// app imports
import { SessionDetailPage } from "../session-detail/session-detail";
import { UserData } from "../../providers/user-data";
import { DayOverview } from "./day-overview";
import { InfoService } from "../../services/info.service";
import { Session } from "../../entities/session.entity";
import { SessionGroup } from "../../entities/sessionGroup.entity";

@Component({
  directives: [DayOverview],
  template: `
    <ion-header>
      <ion-navbar no-border-bottom>
        <button menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-segment [(ngModel)]="segment" (ionChange)="segment$.next($event.value)">
          <ion-segment-button value="all">
            All
          </ion-segment-button>
          <ion-segment-button value="favorites">
            Favorites
          </ion-segment-button>
        </ion-segment>
      </ion-navbar>
      <ion-toolbar no-border-top>
        <ion-searchbar primary (ionInput)="searchTerm$.next($event.srcElement.value)" placeholder="Search">
        </ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <day-overview [sessionsByGroups]="filteredSessionGroupBySegment$|async" (addFavorite)="onAddFavorite($event)" 
      (removeFavorite)="onRemoveFavorite($event)" (goToSessionDetail)="onGoToSessionDetail($event)"></day-overview>
    </ion-content>
`
})
export class SchedulePage {
  segment = "all";
  segment$ = new BehaviorSubject(this.segment);
  searchTerm$ = new BehaviorSubject("");
  sessionGroups$ = this.infoService.rpSessionGroups$;
  filteredSessionGroups$ = Observable.combineLatest(this.searchTerm$, this.sessionGroups$,
    (searchTerm: string, sessionGroups: Array<SessionGroup>) => {
      searchTerm = searchTerm.toLowerCase();
      return sessionGroups.map(sessionGroup => {
        let sessions = sessionGroup.sessions.filter((session: Session) => {
          return session.title.toLowerCase().indexOf(searchTerm) > -1
        });
        return Object.assign({}, sessionGroup, {sessions})
      });
    });
  filteredSessionGroupBySegment$ = Observable.combineLatest(this.segment$, this.filteredSessionGroups$,
    (segment: string, sessionGroups: Array<SessionGroup>) => {
      return segment === "all" ? sessionGroups : sessionGroups.map(sessionGroup => {
        let sessions = sessionGroup.sessions.filter(session => session.favorite != null);
        return Object.assign({}, sessionGroup, {sessions})
      });
    });

  constructor(private infoService: InfoService,
              public app: App,
              public navCtrl: NavController,
              public user: UserData) {
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
