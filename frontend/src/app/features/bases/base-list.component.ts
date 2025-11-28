import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../core/services/base.service';
import { BasePeriod, BaseFilter } from '../../shared/models';

@Component({
  selector: 'app-base-list',
  templateUrl: './base-list.component.html'
})
export class BaseListComponent implements OnInit {
  bases: BasePeriod[] = [];
  selected: BasePeriod | null = null;

  constructor(private readonly baseService: BaseService) {}

  ngOnInit(): void {
    this.loadBases();
  }

  loadBases(filters?: BaseFilter): void {
    this.baseService.listBases(filters).subscribe((data) => (this.bases = data));
  }

  onSelect(base: BasePeriod): void {
    this.selected = base;
  }

  onCreateOrUpdate(payload: Partial<BasePeriod>): void {
    if (this.selected) {
      this.baseService.updateBase(this.selected.base_id, payload).subscribe((updated) => {
        this.bases = this.bases.map((b) => (b.base_id === updated.base_id ? { ...b, ...updated } : b));
      });
    } else {
      this.baseService.createBase(payload).subscribe((created) => {
        this.bases = [...this.bases, created];
      });
    }
  }

  onFilterChange(filters: BaseFilter): void {
    this.loadBases(filters);
  }
}
