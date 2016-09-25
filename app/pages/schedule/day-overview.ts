// 3d party imports
import { Component, Input, EventEmitter, Output } from "@angular/core";
import { ItemSliding } from "ionic-angular";

// app imports
import { SessionGroup } from "../../entities/sessionGroup.entity";
import { Session } from "../../entities/session.entity";

@Component({
  selector: "day-overview",
  templateUrl: 'build/pages/schedule/day-overview.html'
})
export class DayOverview {
  @Input() sessionsByGroups: Array<SessionGroup>;
  @Output() addFavorite = new EventEmitter<Session>();
  @Output() removeFavorite = new EventEmitter<Session>();
  @Output() goToSessionDetail = new EventEmitter<Session>();

  onRemoveFavorite(slidingItem: ItemSliding, session: Session): void {
    slidingItem.close();
    this.removeFavorite.emit(session);
  }

  onAddFavorite(slidingItem: ItemSliding, session: Session): void {
    slidingItem.close();
    this.addFavorite.emit(session);
  }
}
