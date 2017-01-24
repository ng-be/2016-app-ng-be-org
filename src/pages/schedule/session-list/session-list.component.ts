import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ItemSliding } from 'ionic-angular';

import { SessionGroup, Session } from '../../../entities';
import { ToggleResult } from '../entities';

@Component({
  selector: 'session-list',
  templateUrl: 'session-list.component.html'
})
export class SessionListComponent {
  @Input() groups: SessionGroup[];
  @Input() options = false;
  @Output() details = new EventEmitter<Session>();
  @Output() toggle = new EventEmitter<ToggleResult>();

  toggleFavorite(slidingItem: ItemSliding, session: Session) {
    this.toggle.next({
      slidingItem,
      session
    });
  }
}
