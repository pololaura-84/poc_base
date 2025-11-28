import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseFilter } from '../../shared/models';

@Component({
  selector: 'app-base-filter',
  templateUrl: './base-filter.component.html'
})
export class BaseFilterComponent {
  @Output() filterChange = new EventEmitter<BaseFilter>();
  form: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      airport: [''],
      status: [''],
      seasonality: ['']
    });
  }

  applyFilters(): void {
    this.filterChange.emit(this.form.value);
  }
}
