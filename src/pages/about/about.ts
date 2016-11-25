// 3d party imports
import { Component } from '@angular/core';
import { PopoverController, ViewController, Events, NavController } from 'ionic-angular';

@Component({
  selector: 'page-popover',
  template: ``
})
export class PopoverPage {

  constructor(public viewCtrl: ViewController) {
  }

  openUp(url) {
    window.open(url, '_system');
    this.viewCtrl.dismiss();
  }

}

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public popoverCtrl: PopoverController,
              private navCtrl: NavController,
              private events: Events) {
  }

  ionViewDidEnter() {
    this.events.publish("navController:current", this.navCtrl);
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({ev: event});
  }

}
