// 3d party imports
import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class ConnectionService {

  connection$ = new ReplaySubject<boolean>();

  private connected: boolean;

  constructor(af: AngularFire) {

    af.database.object('.info/connected').subscribe(value => {
      this.connected = value.$value;
      this.connection$.next(this.connected);
    });

  }

  isConnected() {
    return this.connected;
  }

}
