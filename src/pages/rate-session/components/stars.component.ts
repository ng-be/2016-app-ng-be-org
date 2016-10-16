// 3d party imports
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

// app imports
import { AcStar } from './';

@Component({
  selector: 'ac-stars',
  template: `
      <ac-star
        *ngFor="let star of stars"
        [active]="star <= currentRate"
        (rate)="onRate($event)"
        [position]="star"
      >
      </ac-star>
      <span>({{currentRate}}/{{stars.length}})</span>
  `,
})
export class AcStars implements OnInit {
  @Input() starCount: number;
  @Input() rating: number;
  @Output() rate = new EventEmitter();
  currentRate: number;
  stars: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor() {
    const count = this.starCount < 0 ? 10 : this.starCount;
  }

  ngOnInit(){
    if(!this.rating){
      this.currentRate = 1;
    }
  }

  onRate(star) {
    this.rate.emit(star);
    this.currentRate = star;
  }
}
