import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Tag } from '../entities';

@Component({
  selector: 'filter-list',
  templateUrl: 'filter-list.component.html'
})
export class FilterListComponent {
  @Input() tags: Tag[] = [];
  @Output() toggle = new EventEmitter<{checked: boolean, tag: Tag}>();

  onToggle(checked: boolean, tag: Tag) {
    this.toggle.emit({checked, tag});
  }
}
