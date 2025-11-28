export interface BasePeriod {
  base_id: number;
  airport_iata: string;
  valid_from: string;
  valid_to: string | null;
  seasonality: 'PERMANENT' | 'SUMMER' | 'WINTER' | 'CUSTOM';
  season_pattern?: string | null;
  notes?: string | null;
}

export interface BaseFilter {
  airport?: string;
  country?: string;
  status?: 'activo' | 'futuro' | 'cerrado';
  seasonality?: BasePeriod['seasonality'];
}

export interface DashboardStats {
  activeToday: number;
  nextOpenings: Array<{ airport_iata: string; valid_from: string }>; 
  nextClosings: Array<{ airport_iata: string; valid_to: string }>; 
  recentChanges: Array<{ airport_iata: string; action: string; change_ts: string; changed_by: string }>;
}

export interface AuditEntry {
  audit_id: number;
  base_id: number;
  airport_iata: string;
  action: string;
  change_ts: string;
  changed_by: string;
}
