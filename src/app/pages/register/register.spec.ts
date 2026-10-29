import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Register } from './register';

describe('Register', () => {
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should flag mismatched passwords', () => {
    fixture.componentInstance.form.setValue({
      name: 'Test',
      email: 'a@b.com',
      password: 'secret1',
      confirm: 'different',
    });
    expect(fixture.componentInstance.form.hasError('mismatch')).toBe(true);
  });
});
