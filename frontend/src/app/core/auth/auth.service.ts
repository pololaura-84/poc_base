import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthService {
  constructor(private readonly msal: MsalService) {}

  get isAuthEnabled(): boolean {
    return environment.enableAuth;
  }

  login(): void {
    if (!this.isAuthEnabled) {
      return;
    }
    this.msal.loginRedirect();
  }

  logout(): void {
    if (!this.isAuthEnabled) {
      return;
    }
    this.msal.logout();
  }

  get activeAccount(): AccountInfo | null {
    if (!this.isAuthEnabled) {
      return { homeAccountId: 'local', localAccountId: 'local', environment: 'local', tenantId: 'local', username: 'demo@local' };
    }
    const account = this.msal.instance.getActiveAccount();
    return account ?? null;
  }
}
