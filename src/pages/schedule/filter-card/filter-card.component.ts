import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'filter-card',
  templateUrl: 'filter-card.component.html'
})
export class FilterCardComponent {
  @Input() tags: string[];
  @Output() reset = new EventEmitter();

  onReset(event) {
    event.preventDefault();
    this.reset.next();
  }
}
