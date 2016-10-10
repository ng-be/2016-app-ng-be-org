// 3d party imports
import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

// app imports
import { ConferenceDataService } from '../../services';

@Component({
  selector: 'page-schedule-filter',
  templateUrl: 'schedule-filter.html'
})
export class ScheduleFilterPage {

  tags: Array<{name: string, isChecked: boolean}> = [];

  constructor(private conferenceData: ConferenceDataService,
              private navParams: NavParams,
              private viewCtrl: ViewController) {

    // passed in array of track names that should be excluded (unchecked)
    let excludedTagNames = this.navParams.data;

    this.conferenceData.rpTags$.subscribe((tagNames: string[]) => {

      console.log(tagNames);

      let newTags = [];
      tagNames.forEach(tagName => {
        newTags.push({
          name: tagName,
          isChecked: (excludedTagNames.indexOf(tagName) === -1)
        });
      });
      this.tags = newTags;

    });

  }

  resetFilters() {
    // reset all of the toggles to be checked
    this.tags.forEach(track => {
      track.isChecked = true;
    });
  }

  applyFilters() {
    // Pass back a new array of track names to exclude
    let excludedTagNames = this.tags.filter(c => !c.isChecked).map(c => c.name);
    this.dismiss(excludedTagNames);
  }

  dismiss(data?: any) {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss(data);
  }
}
