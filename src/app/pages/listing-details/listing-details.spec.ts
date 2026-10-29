import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ListingDetails } from './listing-details';

describe('ListingDetails', () => {
  let fixture: ComponentFixture<ListingDetails>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ListingDetails],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ListingDetails);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show "Listing not found" for an unknown id', () => {
    expect(fixture.nativeElement.textContent).toContain('Listing not found');
  });
});
