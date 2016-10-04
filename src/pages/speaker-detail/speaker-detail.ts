// 3d party imports
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// app imports
import { Speaker } from '../../entities';

@Component({
  selector: 'page-speaker-detail',
  templateUrl: 'speaker-detail.html'
})
export class SpeakerDetailPage {

  speaker: Speaker;

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
    this.speaker = this.navParams.data;
  }

}
