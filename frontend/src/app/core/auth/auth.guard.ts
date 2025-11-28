import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService, private readonly router: Router) {}

  canActivate(): boolean {
    if (!environment.enableAuth) {
      return true;
    }
    if (this.auth.activeAccount) {
      return true;
    }
    this.auth.login();
    this.router.navigate(['/dashboard']);
    return false;
  }
}
