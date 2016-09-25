// 3d party imports
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

// app imports
import { AboutPage } from '../about/about';
import { MapPage } from '../map/map';
import { SchedulePage } from '../schedule/schedule';
import { SpeakerListPage } from '../speaker-list/speaker-list';

@Component({
  template: `    
    <ion-tabs [selectedIndex]="mySelectedIndex">
      <ion-tab [root]="tab1Root" tabTitle="Schedule" tabIcon="calendar"></ion-tab>
      <ion-tab [root]="tab2Root" tabTitle="Speakers" tabIcon="contacts"></ion-tab>
      <ion-tab [root]="tab3Root" tabTitle="Map" tabIcon="map"></ion-tab>
      <ion-tab [root]="tab4Root" tabTitle="About" tabIcon="information-circle"></ion-tab>
    </ion-tabs>
`
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = SchedulePage;
  tab2Root: any = SpeakerListPage;
  tab3Root: any = MapPage;
  tab4Root: any = AboutPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }
}
