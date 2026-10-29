import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Login } from './login';
import { AuthService } from '../../services/auth';

describe('Login component', () => {
  let fixture: ComponentFixture<Login>;
  let component: Login;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when empty', () => {
    expect(component.form.valid).toBe(false);
  });

  it('should validate email format and password length', () => {
    component.form.setValue({ email: 'not-an-email', password: '123' });
    expect(component.form.controls.email.hasError('email')).toBe(true);
    expect(component.form.controls.password.hasError('minlength')).toBe(true);

    component.form.setValue({ email: 'demo@renthub.com', password: 'Demo@123' });
    expect(component.form.valid).toBe(true);
  });

  it('should show an error for wrong credentials', () => {
    component.form.setValue({ email: 'demo@renthub.com', password: 'wrongpass' });
    component.submit();
    expect(component.error()).toBe('Invalid email or password');
  });

  it('should log the user in with correct credentials', () => {
    const auth = TestBed.inject(AuthService);
    component.form.setValue({ email: 'demo@renthub.com', password: 'Demo@123' });
    component.submit();
    expect(component.error()).toBe('');
    expect(auth.isLoggedIn()).toBe(true);
  });

  it('should not submit an invalid form', () => {
    const auth = TestBed.inject(AuthService);
    component.submit();
    expect(auth.isLoggedIn()).toBe(false);
    expect(component.form.touched).toBe(true);
  });
});
