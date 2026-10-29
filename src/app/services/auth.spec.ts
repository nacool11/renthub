import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear(); // fresh storage for every test
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start logged out', () => {
    expect(service.isLoggedIn()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  it('should log in the seeded demo user', () => {
    const res = service.login('demo@renthub.com', 'Demo@123');
    expect(res.ok).toBe(true);
    expect(service.isLoggedIn()).toBe(true);
    expect(service.currentUser()?.name).toBe('Demo Renter');
  });

  it('should reject a wrong password', () => {
    const res = service.login('demo@renthub.com', 'wrong');
    expect(res.ok).toBe(false);
    expect(res.error).toBe('Invalid email or password');
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should register a new user and log them in', () => {
    const res = service.register('Test User', 'test@example.com', 'secret1');
    expect(res.ok).toBe(true);
    expect(service.currentUser()?.email).toBe('test@example.com');
  });

  it('should not allow duplicate emails (case-insensitive)', () => {
    const res = service.register('Dup', 'DEMO@renthub.com', 'secret1');
    expect(res.ok).toBe(false);
    expect(res.error).toBe('Email already registered');
  });

  it('should log out', () => {
    service.login('demo@renthub.com', 'Demo@123');
    service.logout();
    expect(service.isLoggedIn()).toBe(false);
  });
});
