import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Home } from './home';

describe('Home', () => {
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show seeded listings (first page of 6)', () => {
    expect(fixture.componentInstance.paged().length).toBe(6);
  });

  it('should filter by location', () => {
    fixture.componentInstance.location.set('Austin');
    expect(fixture.componentInstance.filtered().length).toBe(1);
  });
});
