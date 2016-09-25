// 3d party imports
import { Injectable } from "@angular/core";
import { AngularFire } from "angularfire2";
import * as moment from "moment";
import { Observable, ReplaySubject } from "rxjs";

// app imports
import { Speaker } from "../entities/speaker.entity";
import { Session } from "../entities/session.entity";
import { Room } from "../entities/room.entity";
import { SessionGroup } from "../entities/sessionGroup.entity";

import { AuthService } from "./auth.service";

@Injectable()
export class InfoService {

  rpSpeakers$ = new ReplaySubject<Array<Speaker>>();
  rpRooms$ = new ReplaySubject<Array<Room>>();
  rpSessionGroups$ = new ReplaySubject<Array<SessionGroup>>();

  private _rooms$: Observable<Array<Room>> = this._af.database.list(`rooms`);
  private _isAuthenticated$ = this._authService.isAuthenticated$;

  private _sessions$: Observable<Array<Session>> = this._af.database.list(`sessions`).map((sessions: Array<any>) => {
    return sessions.map((session: any) => {
      // map dates
      let startDate = moment(session.startDate, "DD-MM-YYYY, h:mm");
      let endDate = moment(session.endDate, "DD-MM-YYYY, h:mm");
      return Object.assign(session, {startDate, endDate});
    });
  });
  private _favoriteSessionsIds$: Observable<{$key: string, sessionId: string}> = <any> this._isAuthenticated$
    .flatMap((authenticated: boolean) => {
      return authenticated ? this._af.database.list(`users/${this._uid}/favoriteSessions`) : [];
    })
    .startWith([]);
  private _speakers$: Observable<Array<Speaker>> = this._af.database.list(`speakers`);
  private _sessionsWithFavoriteFlag$ = Observable.combineLatest(this._sessions$, this._favoriteSessionsIds$,
    (sessions: Array<Session>, favoriteSessionsIds: Array<{$key: string, sessionId: string}>) => {
      return sessions.map((session: Session) => {
        let matchingSessionKeys = favoriteSessionsIds.filter((item: {$key: string, sessionId: string}) => item.sessionId === session.$key);
        return matchingSessionKeys.length == 0 ? Object.assign(session, {favorite: null}) : Object.assign(session, {favorite: matchingSessionKeys[0].$key});
      })
    });

  private _speakersWithSessions$ = Observable.combineLatest(this._speakers$, this._sessions$,
    (speakers: Array<Speaker>, sessions: Array<Session>) => {
      speakers.forEach((speaker: Speaker) => {
        speaker.sessions = sessions.filter((session: Session) => session.speakerId === Number(speaker.$key));
      });
      return speakers;
    });
  private _sessionGroups$: Observable<Array<SessionGroup>> = this._sessionsWithFavoriteFlag$.map((sessions: Array<Session>) => {
    let sessionsByHours: Array<SessionGroup> = [];
    let startHour = 7;
    let endHour = 20;
    for (var i = startHour; i < endHour; i++) {
      let sessionsIngroup = sessions.filter(session => session.startDate.hours() >= i && session.endDate.hours() <= (i + 1));
      sessionsByHours.push({startHour: i, endHour: (i + 1), sessions: sessionsIngroup});
    }
    return sessionsByHours;
  });

  // for every public stream we had to create a replay subject (otherwise it would only listen to it once)
  constructor(private _af: AngularFire,
              private _authService: AuthService) {
    this._speakersWithSessions$.subscribe((speakers: Array<Speaker>) => {
      this.rpSpeakers$.next(speakers);
    });
    this._sessionGroups$.subscribe((sessionGroups: Array<SessionGroup>) => {
      this.rpSessionGroups$.next(sessionGroups);
    });
    this._rooms$.subscribe((rooms: Array<Room>) => {
      this.rpRooms$.next(rooms);
    })
  }

  setFavorite(session: Session): void {
    this._af.database.list(`/users/${this._uid}/favoriteSessions`).push({sessionId: session.$key});
  }

  removeFavorite(key: string): void {
    this._af.database.list(`/users/${this._uid}/favoriteSessions/${key}`).remove();
  }

  addDemoSessions() {
    this._af.database.list('/sessions').push({
      description: "lorem ipsum",
      endDate: "09-12-2016 09:30",
      roomId: 0,
      speakerId: 0,
      startDate: "09-12-2016 09:00",
      title: "this is a test"
    });
    this._af.database.list('/sessions').push({
      description: "lorem ipsum",
      endDate: "09-12-2016 10:00",
      roomId: 0,
      speakerId: 0,
      startDate: "09-12-2016 10:30",
      title: "this is a test"
    });
    this._af.database.list('/sessions').push({
      description: "lorem ipsum",
      endDate: "09-12-2016 09:30",
      roomId: 1,
      speakerId: 1,
      startDate: "09-12-2016 09:00",
      title: "this is a test"
    });
    this._af.database.list('/sessions').push({
      description: "lorem ipsum",
      endDate: "09-12-2016 09:30",
      roomId: 2,
      speakerId: 2,
      startDate: "09-12-2016 09:00",
      title: "this is a test"
    });
    this._af.database.list('/sessions').push({
      description: "lorem ipsum",
      endDate: "09-12-2016 11:30",
      roomId: 3,
      speakerId: 3,
      startDate: "09-12-2016 12:00",
      title: "this is a test"
    });
  }

  private get _uid(): string {
    return this._af.auth.getAuth().uid;
  }

}
