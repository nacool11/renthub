import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CreateListing } from './create-listing';

describe('CreateListing', () => {
  let fixture: ComponentFixture<CreateListing>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CreateListing],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateListing);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should be invalid when empty', () => {
    expect(fixture.componentInstance.form.valid).toBe(false);
  });

  it('should reject a description over 1400 characters', () => {
    const ctrl = fixture.componentInstance.form.controls.description;
    ctrl.setValue('a'.repeat(1401));
    expect(ctrl.hasError('maxlength')).toBe(true);
  });
});
