// 3d party imports
import { Component } from '@angular/core';
import { PopoverController, ViewController, NavController, App } from 'ionic-angular';

@Component({
  selector: 'page-popover',
  template: `<ion-list style="margin-bottom:0;">
    <button ion-item (click)="openUp('https://ng-be.org')">NG-BE 2016 website</button>
    <button ion-item (click)="openUp('https://github.com/ng-be')">Github repositories</button>
  </ion-list>`

})
export class PopoverPage {

  constructor(public viewCtrl: ViewController) {
  }

  openUp(url) {
    window.open(url, '_system');
    this.viewCtrl.dismiss();
  }

  close() {
    this.viewCtrl.dismiss();
  }

}

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public popoverCtrl: PopoverController,
              private app: App) {
  }

  ionViewDidEnter() {
    this.app.setTitle('About - NG-BE 2016');
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: event
    });
  }

}
