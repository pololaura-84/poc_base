import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  template: `<span class="badge info">{{ text }}</span>`
})
export class StatusBadgeComponent {
  @Input() text = '';
}
