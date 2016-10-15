// 3d party imports
import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

// app imports
import { Session } from '../../entities';

@Component({
  selector: 'page-rate-session',
  templateUrl: 'rate-session.html'
})
export class RateSessionPage {

  session: Session;

  constructor(private params: NavParams,
              private viewCtrl: ViewController) {
    this.session = params.data.session;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
