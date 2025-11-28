import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { DashboardStats } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable()
export class DashboardService {
  constructor(private readonly api: ApiService) {}

  loadStats(): Observable<DashboardStats> {
    if (!environment.enableAuth) {
      return of({
        activeToday: 5,
        nextOpenings: [
          { airport_iata: 'VCE', valid_from: new Date().toISOString() }
        ],
        nextClosings: [
          { airport_iata: 'BIO', valid_to: new Date().toISOString() }
        ],
        recentChanges: [
          { airport_iata: 'VIE', action: 'UPDATE', change_ts: new Date().toISOString(), changed_by: 'demo@local' }
        ]
      });
    }
    return this.api.get<DashboardStats>('/dashboard');
  }
}
