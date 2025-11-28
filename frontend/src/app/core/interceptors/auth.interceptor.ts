import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly auth: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!environment.enableAuth) {
      return next.handle(req);
    }
    const account = this.auth.activeAccount;
    if (!account) {
      return next.handle(req);
    }
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer PLACEHOLDER_TOKEN`
      }
    });
    return next.handle(cloned);
  }
}
