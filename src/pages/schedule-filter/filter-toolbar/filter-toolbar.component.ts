import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'filter-toolbar',
  templateUrl: 'filter-toolbar.component.html'
})
export class FilterToolbarComponent {
  @Output() cancel = new EventEmitter();
  @Output() confirm = new EventEmitter();
}
