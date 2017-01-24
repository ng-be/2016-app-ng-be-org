import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { SchedulePage } from './schedule';
import { SessionListComponent } from './session-list/session-list.component';
import { SessionItemComponent } from './session-item/session-item.component';
import { FilterCardComponent } from './filter-card/filter-card.component';
import { TagListComponent } from './tag-list/tag-list.component';

@NgModule({
  imports: [
    IonicModule
  ],
  declarations: [
    SchedulePage,
    SessionListComponent,
    SessionItemComponent,
    FilterCardComponent,
    TagListComponent
  ],
  entryComponents: [
    SchedulePage
  ]
})
export class ScheduleModule { }
