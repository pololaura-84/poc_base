import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { BasePeriod, BaseFilter } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable()
export class BaseService {
  constructor(private readonly api: ApiService) {}

  listBases(filters?: BaseFilter): Observable<BasePeriod[]> {
    if (!environment.enableAuth) {
      return of([
        { base_id: 1, airport_iata: 'VCE', valid_from: new Date().toISOString(), valid_to: null, seasonality: 'PERMANENT', notes: 'Base principal' },
        { base_id: 2, airport_iata: 'BIO', valid_from: new Date().toISOString(), valid_to: null, seasonality: 'SUMMER', season_pattern: 'S24', notes: 'Temporal' }
      ]);
    }
    return this.api.get<BasePeriod[]>('/bases', filters as any);
  }

  createBase(period: Partial<BasePeriod>): Observable<BasePeriod> {
    if (!environment.enableAuth) {
      const mock: BasePeriod = {
        base_id: Math.floor(Math.random() * 1000),
        airport_iata: period.airport_iata ?? 'N/A',
        valid_from: period.valid_from ?? new Date().toISOString(),
        valid_to: period.valid_to ?? null,
        seasonality: (period.seasonality as BasePeriod['seasonality']) ?? 'PERMANENT',
        season_pattern: period.season_pattern ?? undefined,
        notes: period.notes ?? undefined
      };
      return of(mock);
    }
    return this.api.post<BasePeriod>('/bases', period);
  }

  updateBase(id: number, period: Partial<BasePeriod>): Observable<BasePeriod> {
    if (!environment.enableAuth) {
      return of({ ...period, base_id: id } as BasePeriod);
    }
    return this.api.put<BasePeriod>(`/bases/${id}`, period);
  }

  deleteBase(id: number): Observable<void> {
    if (!environment.enableAuth) {
      return of(void 0);
    }
    return this.api.delete<void>(`/bases/${id}`);
  }
}
