// 3d party imports
import { Injectable } from '@angular/core';
import { AngularFire, FirebaseAuthState } from 'angularfire2/angularfire2';
import { Observable } from 'rxjs/Rx';

// app imports

@Injectable()
export class AuthService {

  auth$: Observable<FirebaseAuthState> = this.af.auth.asObservable();
  isAuthenticated$ = this.auth$.map(auth => auth === null ? false : true).startWith(false);

  constructor(private af: AngularFire) {
  }

  logout(): void {
    this.af.auth.logout();
  }

}
