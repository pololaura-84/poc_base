import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { AuditEntry } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuditService {
  constructor(private readonly api: ApiService) {}

  listAudit(): Observable<AuditEntry[]> {
    if (!environment.enableAuth) {
      return of([
        { audit_id: 1, base_id: 1, airport_iata: 'VCE', action: 'CREATE', change_ts: new Date().toISOString(), changed_by: 'demo@local' }
      ]);
    }
    return this.api.get<AuditEntry[]>('/audit');
  }
}
