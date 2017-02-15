// 3d party imports
import { Component, OnDestroy } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

// app imports
import { ConferenceDataService } from '../../services';
import { Tag } from './entities';

@Component({
  selector: 'page-schedule-filter',
  templateUrl: 'schedule-filter.html'
})
export class ScheduleFilterPage implements OnDestroy {

  tags: Tag[] = [];

  private subscriptions: Subscription[] = [];

  constructor(private conferenceData: ConferenceDataService,
              private navParams: NavParams,
              private viewCtrl: ViewController) {

    // passed in array of track names that should be shown (check)
    const shownTags = this.navParams.data.shownTags;

    const subscription = this.conferenceData.rpTags$
      .subscribe((tagNames: string[]) => {
        this.tags = tagNames.map(name => ({
          name,
          isChecked: shownTags.indexOf(name) !== -1
        }));
      });

    // Keep track of the subscriptions
    this.subscriptions.push(subscription);
  }

  onToggle({checked, tag}: {checked: boolean, tag: Tag}) {
    tag.isChecked = checked;
  }

  resetFilters() {
    // reset all of the toggles to be checked
    this.tags.forEach(tag => {
      tag.isChecked = false;
    });
  }

  applyFilters() {
    // Pass back a new array of tags to show
    const shownTags = this.tags.filter(c => c.isChecked).map(c => c.name);
    this.dismiss(shownTags);
  }

  dismiss(data?: any) {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss(data);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
