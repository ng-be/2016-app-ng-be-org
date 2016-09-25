// 3d party imports
import {Injectable} from '@angular/core';
import {AngularFire, FirebaseAuthState} from 'angularfire2/angularfire2';
import {Observable, Subject} from 'rxjs/Rx';

// app imports
import {Credentials} from '../entities/credentials.entity';
import {Account} from '../entities/account.entity';

@Injectable()
export class AuthService {

  auth$: Observable<FirebaseAuthState> = this._af.auth.asObservable();
  isAuthenticated$ = this.auth$.map(auth => auth === null ? false : true).startWith(false);

  constructor(private _af: AngularFire) {
  }

  authenticate(credentials: Credentials): Observable<Boolean> {
    let subject = new Subject<boolean>();
    this._af.auth.login({email: credentials.login, password: credentials.password}).then(
      () => {
        subject.next(true);
      },
      (resp: any) => {
        subject.error(resp);
      }
    );
    return subject;
  }

  register(account: Account): Observable<Boolean> {
    let subject = new Subject<boolean>();
    this._af.auth.createUser(Object.assign({}, account, {email: account.login})).then(
      (resp: any) => {
        let {login} = account;
        this._af.database.object(`/users/${resp.uid}`).set({login});
        this._af.auth.login({email: account.login, password: account.password})
          .then(() => {
            subject.next(true);
          })
          .catch(() => {
            subject.error(resp);
          });
      },
      (resp: any) => {
        subject.error(resp);
      }
    );
    return subject;
  }

  logout(): void {
    this._af.auth.logout();
  }

}
