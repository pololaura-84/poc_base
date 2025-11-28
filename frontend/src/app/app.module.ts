import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MsalBroadcastService, MsalGuard, MsalModule, MsalService } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { BaseListComponent } from './features/bases/base-list.component';
import { BaseDetailComponent } from './features/bases/base-detail.component';
import { BaseFilterComponent } from './features/bases/base-filter.component';
import { AuditComponent } from './features/audit/audit.component';
import { AuthGuard } from './core/auth/auth.guard';
import { AuthService } from './core/auth/auth.service';
import { authFactory } from './core/auth/msal.config';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ApiService } from './core/services/api.service';
import { DashboardService } from './core/services/dashboard.service';
import { BaseService } from './core/services/base.service';
import { AuditService } from './core/services/audit.service';
import { StatusBadgeComponent } from './shared/components/status-badge.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    BaseListComponent,
    BaseDetailComponent,
    BaseFilterComponent,
    AuditComponent,
    StatusBadgeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MsalModule.forRoot(new PublicClientApplication(authFactory()), {
      interactionType: InteractionType.Redirect
    }, {
      interactionType: InteractionType.Popup
    })
  ],
  providers: [
    AuthGuard,
    AuthService,
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    ApiService,
    DashboardService,
    BaseService,
    AuditService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
