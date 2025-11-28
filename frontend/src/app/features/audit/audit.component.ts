import { Component, OnInit } from '@angular/core';
import { AuditService } from '../../core/services/audit.service';
import { AuditEntry } from '../../shared/models';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html'
})
export class AuditComponent implements OnInit {
  entries: AuditEntry[] = [];

  constructor(private readonly auditService: AuditService) {}

  ngOnInit(): void {
    this.auditService.listAudit().subscribe((data) => (this.entries = data));
  }
}
