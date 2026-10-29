import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ListingCard } from './listing-card';
import { SEED_LISTINGS } from '../../data/seed';

describe('ListingCard', () => {
  let fixture: ComponentFixture<ListingCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ListingCard);
    fixture.componentRef.setInput('listing', SEED_LISTINGS[0]);
    fixture.detectChanges();
  });

  it('should create and show the title', () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Sunny 2BHK in Downtown');
  });

  it('should emit the id when the heart is clicked', () => {
    let emitted = '';
    fixture.componentInstance.favouriteToggled.subscribe((id: string) => (emitted = id));
    fixture.nativeElement.querySelector('.heart').click();
    expect(emitted).toBe('l1');
  });
});
