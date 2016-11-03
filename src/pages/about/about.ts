// 3d party imports
import { Component } from '@angular/core';
import { PopoverController, ViewController } from 'ionic-angular';

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

  constructor(public popoverCtrl: PopoverController) {
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({ev: event});
  }

}
