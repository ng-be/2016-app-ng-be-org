import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'filter-item',
  templateUrl: 'filter-item.component.html'
})
export class FilterItemComponent {
  @Input() title: string;
  @Input() checked: boolean;
  @Output() toggle = new EventEmitter();
}
