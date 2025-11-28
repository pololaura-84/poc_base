import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { BaseListComponent } from './features/bases/base-list.component';
import { AuditComponent } from './features/audit/audit.component';
import { AuthGuard } from './core/auth/auth.guard';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'bases', component: BaseListComponent, canActivate: [AuthGuard] },
  { path: 'auditoria', component: AuditComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
