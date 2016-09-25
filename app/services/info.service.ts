// 3d party imports
import { Injectable } from "@angular/core";
import { AngularFire } from "angularfire2";
import * as moment from "moment";
import { Observable, ReplaySubject, Subject } from "rxjs";

// app imports
import { Speaker } from "../entities/speaker.entity";
import { Session } from "../entities/session.entity";
import { Room } from "../entities/room.entity";
import { SessionGroup } from "../entities/sessionGroup.entity";

import { AuthService } from "./auth.service";

@Injectable()
export class InfoService {
  // for every public stream we had to create a replay subject (otherwise it would only listen to it once)
  constructor(private af: AngularFire, private authService: AuthService) {
    this.speakersWithSessions$.subscribe((speakers: Array<Speaker>) => {
      this.rpSpeakers$.next(speakers);
    });
    this.sessionGroups$.subscribe((sessionGroups: Array<SessionGroup>) => {
      this.rpSessionGroups$.next(sessionGroups);
    });
    this.rooms$.subscribe((rooms: Array<Room>) => {
      this.rpRooms$.next(rooms);
    })
  }

  public rpSpeakers$ = new ReplaySubject<Array<Speaker>>();
  public rpRooms$ = new ReplaySubject<Array<Room>>();
  public rpSessionGroups$ = new ReplaySubject<Array<SessionGroup>>();

  private rooms$: Observable<Array<Room>> = this.af.database.list(`rooms`);
  private isAuthenticated$ = this.authService.isAuthenticated$;
  private sessions$: Observable<Array<Session>> = this.af.database.list(`sessions`).map((sessions: Array<any>) => {
    return sessions.map((session: any) => {
      // map dates
      let startDate = moment(session.startDate, "DD-MM-YYYY, h:mm");
      let endDate = moment(session.endDate, "DD-MM-YYYY, h:mm");
      return Object.assign(session, {startDate, endDate});
    });
  });
  private favoriteSessionsIds$: Observable<{$key: string, sessionId: string}> = <any> this.isAuthenticated$
    .flatMap((authenticated: boolean) => {
      return authenticated ? this.af.database.list(`users/${this.uid}/favoriteSessions`) : [];
    })
    .startWith([]);
  private speakers$: Observable<Array<Speaker>> = this.af.database.list(`speakers`);
  private sessionsWithFavoriteFlag$ = Observable.combineLatest(this.sessions$, this.favoriteSessionsIds$,
    (sessions: Array<Session>, favoriteSessionsIds: Array<{$key: string, sessionId: string}>) => {
      return sessions.map((session: Session) => {
        let matchingSessionKeys = favoriteSessionsIds.filter((item: {$key: string, sessionId: string}) => item.sessionId === session.$key);
        return matchingSessionKeys.length == 0 ? Object.assign(session, {favorite: null}) : Object.assign(session, {favorite: matchingSessionKeys[0].$key});
      })
    });

  private speakersWithSessions$ = Observable.combineLatest(this.speakers$, this.sessions$,
    (speakers: Array<Speaker>, sessions: Array<Session>) => {
      speakers.forEach((speaker: Speaker) => {
        speaker.sessions = sessions.filter((session: Session) => session.speakerId === Number(speaker.$key));
      });
      return speakers;
    });
  private sessionGroups$: Observable<Array<SessionGroup>> = this.sessionsWithFavoriteFlag$.map((sessions: Array<Session>) => {
    let sessionsByHours: Array<SessionGroup> = [];
    let startHour = 9;
    let endHour = 18;
    for (var i = startHour; i < endHour; i++) {
      let sessionsIngroup = sessions.filter(session => session.startDate.hours() >= i && session.endDate.hours() <= (i + 1));
      sessionsByHours.push({startHour: i, endHour: (i + 1), sessions: sessionsIngroup});
    }
    return sessionsByHours;
  });

  setFavorite(session: Session): void {
    this.af.database.list(`/users/${this.uid}/favoriteSessions`).push({sessionId: session.$key});
  }

  removeFavorite(key: string): void {
    this.af.database.list(`/users/${this.uid}/favoriteSessions/${key}`).remove();
  }

  private get uid(): string {
    return this.af.auth.getAuth().uid;
  }

  public addDemoSessions() {
    this.af.database.list('/sessions').push({
      description: "lorem ipsum",
      endDate: "09-12-2016 09:30",
      roomId: 0,
      speakerId: 0,
      startDate: "09-12-2016 09:00",
      title: "this is a test"
    });
    this.af.database.list('/sessions').push({
      description: "lorem ipsum",
      endDate: "09-12-2016 10:00",
      roomId: 0,
      speakerId: 0,
      startDate: "09-12-2016 10:30",
      title: "this is a test"
    });
    this.af.database.list('/sessions').push({
      description: "lorem ipsum",
      endDate: "09-12-2016 09:30",
      roomId: 1,
      speakerId: 1,
      startDate: "09-12-2016 09:00",
      title: "this is a test"
    });
    this.af.database.list('/sessions').push({
      description: "lorem ipsum",
      endDate: "09-12-2016 09:30",
      roomId: 2,
      speakerId: 2,
      startDate: "09-12-2016 09:00",
      title: "this is a test"
    });
    this.af.database.list('/sessions').push({
      description: "lorem ipsum",
      endDate: "09-12-2016 11:30",
      roomId: 3,
      speakerId: 3,
      startDate: "09-12-2016 12:00",
      title: "this is a test"
    });
  }
}
