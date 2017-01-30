import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { ScheduleFilterPage } from './schedule-filter';
import { FilterListComponent } from './filter-list/filter-list.component';
import { FilterItemComponent } from './filter-item/filter-item.component';
import { FilterToolbarComponent } from './filter-toolbar/filter-toolbar.component';

@NgModule({
  imports: [
    IonicModule
  ],
  declarations: [
    ScheduleFilterPage,
    FilterListComponent,
    FilterItemComponent,
    FilterToolbarComponent
  ],
  entryComponents: [
    ScheduleFilterPage
  ]
})
export class ScheduleFilterModule { }
