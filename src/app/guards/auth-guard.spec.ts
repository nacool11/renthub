import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { authGuard } from './auth-guard';
import { AuthService } from '../services/auth';

describe('authGuard', () => {
  let auth: AuthService;
  let router: Router;

  const runGuard = () =>
    TestBed.runInInjectionContext(() => authGuard({} as any, { url: '/create' } as any));

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    auth = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should redirect to /login when logged out', () => {
    const result = runGuard();
    expect(result instanceof UrlTree).toBe(true);
    expect(router.serializeUrl(result as UrlTree)).toContain('/login');
  });

  it('should allow access when logged in', () => {
    auth.login('demo@renthub.com', 'Demo@123');
    expect(runGuard()).toBe(true);
  });
});
