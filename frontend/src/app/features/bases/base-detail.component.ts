import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePeriod } from '../../shared/models';

@Component({
  selector: 'app-base-detail',
  templateUrl: './base-detail.component.html'
})
export class BaseDetailComponent implements OnChanges {
  @Input() base: BasePeriod | null = null;
  @Output() save = new EventEmitter<Partial<BasePeriod>>();
  form: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      airport_iata: ['', Validators.required],
      valid_from: ['', Validators.required],
      valid_to: [''],
      seasonality: ['PERMANENT', Validators.required],
      season_pattern: [''],
      notes: ['']
    });
  }

  ngOnChanges(): void {
    if (this.base) {
      this.form.patchValue({
        airport_iata: this.base.airport_iata,
        valid_from: this.base.valid_from,
        valid_to: this.base.valid_to,
        seasonality: this.base.seasonality,
        season_pattern: this.base.season_pattern,
        notes: this.base.notes
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.value);
  }
}
