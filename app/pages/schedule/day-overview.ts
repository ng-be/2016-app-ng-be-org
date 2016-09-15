import {Component, Input, EventEmitter, Output} from "@angular/core";
import {SessionGroup} from "../../entities/sessionGroup.entity";
import {Session} from "../../entities/session.entity";
import {ItemSliding} from "ionic-angular";

@Component({
  selector: "day-overview",
  template: `
   
      <ion-list #scheduleList>
        <ion-item-group *ngFor="let group of sessionsByGroups">
          <ion-item-divider sticky>
            {{group.startHour}}
          </ion-item-divider>
          <ion-item-sliding *ngFor="let session of group.sessions" #slidingItem
                            [hidden]="session.hide">
            <button ion-item (click)="goToSessionDetail.emit(session)">
              <h3>
                {{session.title}} 
                <ion-icon class="ion-md-star item-icon" *ngIf="session.favorite"></ion-icon>
              </h3>
              <p>
                {{session.startDate.format('h:m')}} &mdash;
                {{session.endDate.format('h:m')}}:
                {{session.location}} (todo)
              </p>
            </button>
            <ion-item-options>
              <button favorite (click)="onAddFavorite(slidingItem, session)" *ngIf="session.favorite == null">
                Favorite
              </button>
              <button danger (click)="onRemoveFavorite(slidingItem, session)" *ngIf="session.favorite != null">
                Remove
              </button>
            </ion-item-options>
          </ion-item-sliding>
        </ion-item-group>
      </ion-list>
`
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
