// 3d party imports
import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import moment from 'moment';
import { Observable, ReplaySubject } from 'rxjs';

// app imports
import { Room, Speaker, Session, SessionGroup } from '../entities';
import { AuthService } from './';

@Injectable()
export class ConferenceDataService {

  rpSpeakers$ = new ReplaySubject<Array<Speaker>>();
  rpSessions$ = new ReplaySubject<Array<Session>>();
  rpSessionGroups$ = new ReplaySubject<Array<SessionGroup>>();
  rpTags$ = new ReplaySubject<Array<String>>();

  //private isAuthenticated$ = this.authService.isAuthenticated$;

  // basic entities
  private rooms$: Observable<Array<Room>> = this.af.database.list(`rooms`);
  private speakers$: Observable<Array<Speaker>> = this.af.database.list(`speakers`);
  private sessions$: Observable<Array<Session>> = this.af.database.list(`sessions`).map((sessions: Array<any>) => {
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

        let sessionSpeakers = [];
        if (session.speakers) {
          sessionSpeakers = speakers.filter((speaker: Speaker) => {
            return session.speakerIds.indexOf(Number(speaker.$key)) > -1;
          });
        }
        session.speakers = sessionSpeakers;

      });
      return sessions;
    }
  );

  private speakersWithSessions$ = Observable.combineLatest(this.speakers$, this.sessions$,
    (speakers: Array<Speaker>, sessions: Array<Session>, rooms: Array<Room>) => {
      speakers.forEach((speaker: Speaker) => {

        let speakerSessions = [];
        if (speaker.sessions) {
          speakerSessions = sessions.filter((session: Session) => {
            return session.speakerIds.indexOf(Number(speaker.$key)) > -1;
          });
        }
        speaker.sessions = speakerSessions

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
              private authService: AuthService) {

    this.speakersWithSessions$.subscribe((speakers: Array<Speaker>) => {
      this.rpSpeakers$.next(speakers);
    });

    this.sessions$.subscribe((sessions: Array<Session>) => {
      console.log(sessions);
      this.handleTags(sessions);
      this.rpSessions$.next(sessions);
    });

    this.sessionGroups$.subscribe((sessionGroups: Array<SessionGroup>) => {
      this.rpSessionGroups$.next(sessionGroups);
    });

    //this.addDemoSessions();
  }

  setFavorite(session: Session): void {
    this.af.database.list(`/users/${this.uid}/favoriteSessions`).push({sessionId: session.$key});
  }

  removeFavorite(key: string): void {
    this.af.database.list(`/users/${this.uid}/favoriteSessions/${key}`).remove();
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

  addDemoSessions() {

    // breakfast
    this.af.database.list('/sessions').push({
      description: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. Ut dignissim egestas consectetur. Morbi tincidunt ligula nunc, quis bibendum leo sagittis a. Integer ultrices elit orci, ac.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. </p>',
      startDate: '09-12-2016 07:30',
      endDate: '09-12-2016 08:25',
      roomId: 0,
      tags: ['food'],
      title: 'Continental Angular breakfast'
    });

    // opening
    this.af.database.list('/sessions').push({
      description: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. Ut dignissim egestas consectetur. Morbi tincidunt ligula nunc, quis bibendum leo sagittis a. Integer ultrices elit orci, ac.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. </p>',
      startDate: '09-12-2016 08:30',
      endDate: '09-12-2016 08:50',
      roomId: 1,
      speakerIds: [0, 1],
      tags: ['angular'],
      title: 'Keynote about Angular 2'
    });

    // before noon
    this.af.database.list('/sessions').push({
      description: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. Ut dignissim egestas consectetur. Morbi tincidunt ligula nunc, quis bibendum leo sagittis a. Integer ultrices elit orci, ac.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. </p>',
      startDate: '09-12-2016 09:00',
      endDate: '09-12-2016 09:25',
      roomId: 0,
      speakerIds: [1],
      tags: ['angular'],
      title: 'Talking about Angular 2 #1'
    });
    this.af.database.list('/sessions').push({
      description: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. Ut dignissim egestas consectetur. Morbi tincidunt ligula nunc, quis bibendum leo sagittis a. Integer ultrices elit orci, ac.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. </p>',
      startDate: '09-12-2016 09:30',
      endDate: '09-12-2016 09:55',
      roomId: 0,
      speakerIds: [2],
      tags: ['angular', 'testing'],
      title: 'Talking about Angular 2 #2'
    });
    this.af.database.list('/sessions').push({
      description: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. Ut dignissim egestas consectetur. Morbi tincidunt ligula nunc, quis bibendum leo sagittis a. Integer ultrices elit orci, ac.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. </p>',
      startDate: '09-12-2016 10:00',
      endDate: '09-12-2016 10:25',
      roomId: 0,
      speakerIds: [3],
      tags: ['angular', 'tooling'],
      title: 'Talking about Angular 2 #3'
    });
    this.af.database.list('/sessions').push({
      description: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. Ut dignissim egestas consectetur. Morbi tincidunt ligula nunc, quis bibendum leo sagittis a. Integer ultrices elit orci, ac.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. </p>',
      startDate: '09-12-2016 10:30',
      endDate: '09-12-2016 10:55',
      roomId: 0,
      speakerIds: [4],
      tags: ['react', 'security'],
      title: 'Talking about Angular 2 #4'
    });
    this.af.database.list('/sessions').push({
      description: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. Ut dignissim egestas consectetur. Morbi tincidunt ligula nunc, quis bibendum leo sagittis a. Integer ultrices elit orci, ac.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. </p>',
      startDate: '09-12-2016 11:00',
      endDate: '09-12-2016 11:25',
      roomId: 0,
      speakerIds: [5],
      tags: ['react', 'design'],
      title: 'Talking about Angular 2 #5'
    });
    this.af.database.list('/sessions').push({
      description: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. Ut dignissim egestas consectetur. Morbi tincidunt ligula nunc, quis bibendum leo sagittis a. Integer ultrices elit orci, ac.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. </p>',
      startDate: '09-12-2016 11:30',
      endDate: '09-12-2016 11:55',
      roomId: 0,
      speakerIds: [6],
      tags: ['angular', 'tooling'],
      title: 'Talking about Angular 2 #6'
    });

    // lunch
    this.af.database.list('/sessions').push({
      description: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. Ut dignissim egestas consectetur. Morbi tincidunt ligula nunc, quis bibendum leo sagittis a. Integer ultrices elit orci, ac.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. </p>',
      startDate: '09-12-2016 12:30',
      endDate: '09-12-2016 13:55',
      roomId: 1,
      tags: ['food'],
      title: 'Lunch with healthy food!'
    });

    // afternoon
    this.af.database.list('/sessions').push({
      description: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. Ut dignissim egestas consectetur. Morbi tincidunt ligula nunc, quis bibendum leo sagittis a. Integer ultrices elit orci, ac.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. </p>',
      startDate: '09-12-2016 14:00',
      endDate: '09-12-2016 14:25',
      roomId: 0,
      speakerIds: [6],
      tags: ['nativescript', 'mobile'],
      title: 'Talking about Angular 2 #7'
    });
    this.af.database.list('/sessions').push({
      description: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. Ut dignissim egestas consectetur. Morbi tincidunt ligula nunc, quis bibendum leo sagittis a. Integer ultrices elit orci, ac.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. </p>',
      startDate: '09-12-2016 14:30',
      endDate: '09-12-2016 14:55',
      roomId: 0,
      speakerIds: [7],
      tags: ['angular', 'mobile'],
      title: 'Talking about Angular 2 #8'
    });
    this.af.database.list('/sessions').push({
      description: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. Ut dignissim egestas consectetur. Morbi tincidunt ligula nunc, quis bibendum leo sagittis a. Integer ultrices elit orci, ac.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. </p>',
      startDate: '09-12-2016 15:00',
      endDate: '09-12-2016 15:25',
      roomId: 0,
      speakerIds: [8],
      tags: ['ionic', 'angular'],
      title: 'Talking about Angular 2 #9'
    });
    this.af.database.list('/sessions').push({
      description: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. Ut dignissim egestas consectetur. Morbi tincidunt ligula nunc, quis bibendum leo sagittis a. Integer ultrices elit orci, ac.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. </p>',
      startDate: '09-12-2016 15:30',
      endDate: '09-12-2016 15:55',
      roomId: 0,
      speakerIds: [4, 5],
      tags: ['testing', 'mobile'],
      title: 'Talking about Angular 2 #10'
    });
    this.af.database.list('/sessions').push({
      description: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. Ut dignissim egestas consectetur. Morbi tincidunt ligula nunc, quis bibendum leo sagittis a. Integer ultrices elit orci, ac.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. </p>',
      startDate: '09-12-2016 16:00',
      endDate: '09-12-2016 16:25',
      roomId: 0,
      speakerIds: [0, 7],
      tags: ['mobile'],
      title: 'Talking about Angular 2 #11'
    });
    this.af.database.list('/sessions').push({
      description: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. Ut dignissim egestas consectetur. Morbi tincidunt ligula nunc, quis bibendum leo sagittis a. Integer ultrices elit orci, ac.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras finibus bibendum faucibus. Aliquam a pharetra nibh. Donec quis molestie sem. Etiam in metus non dolor congue tristique. </p>',
      startDate: '09-12-2016 16:30',
      endDate: '09-12-2016 16:55',
      roomId: 0,
      speakerIds: [5, 7],
      tags: ['nativescript', 'angular'],
      title: 'Talking about Angular 2 #12'
    });
  }

  private get uid(): string {
    return this.af.auth.getAuth().uid;
  }

}
