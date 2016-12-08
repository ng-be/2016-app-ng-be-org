// 3d party imports
import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import moment from 'moment';
import { Observable, ReplaySubject } from 'rxjs';
import { Storage } from '@ionic/storage';

// app imports
import { Room, Speaker, Session, SessionGroup, Favorite, Rating } from '../entities';
import { AuthService } from './';

@Injectable()
export class ConferenceDataService {

  rpSpeakers$ = new ReplaySubject<Array<Speaker>>();
  rpSessionGroups$ = new ReplaySubject<Array<SessionGroup>>();
  rpTags$ = new ReplaySubject<Array<String>>();
  rpFavorites$ = new ReplaySubject<Array<Favorite>>();
  rpRatings$ = new ReplaySubject<Array<Rating>>();

  private currentUser;

  // basic entities
  private rooms$: Observable<Array<Room>> = this.loadEntity('rooms');
  private speakers$: Observable<Array<Speaker>> = this.loadEntity('speakers');
  private sessions$: Observable<Array<Session>> = this.loadEntity('sessions').map((sessions: Array<any>) => {
    return sessions.map((session: any) => {
      // map dates
      let startDate = moment(session.startDate, 'DD-MM-YYYY, h:mm');
      let endDate = moment(session.endDate, 'DD-MM-YYYY, h:mm');
      return Object.assign({}, session, {startDate: startDate, endDate: endDate});
    });
  });

  // combined entities
  private sessionsWithRoomAndSpeakers$ = Observable.combineLatest(
    this.sessions$, this.rooms$, this.speakers$,
    (sessions: Array<Session>, rooms: Array<Room>, speakers: Array<Speaker>) => {

      sessions.forEach((session: Session) => {

        let sessionRooms = rooms.filter((room: Room) => {
          return session.roomId === Number(room.$key);
        });
        if (sessionRooms.length) {
          session.room = sessionRooms[0];
        }

        session.speakers = speakers.filter((speaker: Speaker) => {
          return session.speakerIds && session.speakerIds.indexOf(Number(speaker.$key)) > -1;
        });

      });

      return sessions;
    }
  );

  private speakersWithSessions$ = Observable.combineLatest(this.speakers$, this.sessionsWithRoomAndSpeakers$,
    (speakers: Array<Speaker>, sessions: Array<Session>) => {

      speakers.forEach((speaker: Speaker) => {
        this.prefetch(speaker.avatar);

        speaker.sessions = sessions.filter((session: Session) => {
          return session.speakerIds && session.speakerIds.indexOf(Number(speaker.$key)) > -1;
        });

      });

      return speakers;
    }
  );

  private sessionGroups$: Observable<Array<SessionGroup>> = this.sessionsWithRoomAndSpeakers$.map((sessions: Array<Session>) => {

    let sessionsByHours: Array<SessionGroup> = [];
    let startHour = 7;
    let endHour = 20;

    for (var i = startHour; i < endHour; i++) {
      let sessionsIngroup = sessions.filter((session) => {
        return session.startDate.hours() >= i && session.startDate.hours() < (i + 1);
      });
      sessionsByHours.push({
        startHour: i,
        endHour: (i + 1),
        sessions: sessionsIngroup
      });
    }

    return sessionsByHours;

  });


  // for every public stream we had to create a replay subject (otherwise it would only listen to it once)
  constructor(private af: AngularFire,
              private authService: AuthService,
              private storage: Storage) {

    this.speakersWithSessions$.subscribe((speakers: Array<Speaker>) => {
      this.rpSpeakers$.next(speakers);
    });

    this.sessions$.subscribe((sessions: Array<Session>) => {
      this.handleTags(sessions);
    });

    this.sessionGroups$.subscribe((sessionGroups: Array<SessionGroup>) => {
      this.rpSessionGroups$.next(sessionGroups);
    });

    this.authService.rpCurrentUser$.subscribe((currentUser) => {
      this.currentUser = currentUser;
      if (currentUser) {
        this.loadEntity(`favorites/${this.currentUser.uid}`).subscribe((favorites: Array<Favorite>) => {
          this.rpFavorites$.next(favorites);
        });
        this.loadEntity(`ratings/${this.currentUser.uid}`).subscribe((ratings: Array<Rating>) => {
          this.rpRatings$.next(ratings);
        });
      }
    });

    //this.addDemoSessions();

  }

  setFavorite(key: string) {
    return this.af.database.list(`/favorites/${this.currentUser.uid}`).push({sessionId: key});
  }

  removeFavorite(key: string): void {
    this.af.database.list(`/favorites/${this.currentUser.uid}/${key}`).remove();
  }

  updateRating(rating: Rating): void {
    this.removeRating(rating.$key);
    delete rating.$key;
    this.saveRating(rating);
  }

  removeRating(key: string): void {
    this.af.database.list(`/ratings/${this.currentUser.uid}/${key}`).remove();
  }

  saveRating(rating: Rating): void {
    this.af.database.list(`/ratings/${this.currentUser.uid}`).push(rating);
  }

  handleTags(sessions: Array<Session>) {
    let tags = [];
    sessions.forEach((session) => {
      session.tags.forEach((tag) => {
        if (tags.indexOf(tag) === -1) {
          tags.push(tag);
        }
      });
    });
    this.rpTags$.next(tags);
  }

  private get uid(): string {
    return this.af.auth.getAuth().uid;
  }

  private loadEntity(entity: string) {
    return Observable.merge(
      this.loadRemoteEntity(entity),
      this.loadLocalEntity(entity)
    ).filter(Boolean);
  }

  private loadRemoteEntity(entity: string) {
    return this.af.database.list(entity)
      .do(result => {
        this.storage.set(entity, JSON.stringify(result));
      });
  }

  private loadLocalEntity(entity: string) {
    return this.storage.get(entity)
      .then(result => result && JSON.parse(result));
  }

  private prefetch(url: string) {
    const img = new Image()
    img.src = url;
  }

}
