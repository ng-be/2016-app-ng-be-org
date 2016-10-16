// 3d party imports
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ac-star',
  template: `<span class="star" [class.active]="active" (click)="handleRate($event)">&#9733;</span>`
})
export class AcStar {
  @Input() active: boolean;
  @Input() position: number;
  @Output() rate = new EventEmitter();

  handleRate() {
    this.rate.emit(this.position);
  }
}
