import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgbCarousel, NgbPagination, NgbSlide } from '@ng-bootstrap/ng-bootstrap';
import { CurrencyPipe } from '@angular/common';
import { ListingService } from '../../services/listing';
import { AuthService } from '../../services/auth';
import { ListingCard } from '../../components/listing-card/listing-card';
import { AMENITIES } from '../../data/seed';

type SortKey = 'newest' | 'priceAsc' | 'priceDesc';

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    RouterLink,
    CurrencyPipe,
    NgbCarousel,
    NgbSlide,
    NgbPagination,
    ListingCard,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private listingService = inject(ListingService);
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly amenityOptions = AMENITIES;
  readonly pageSize = 6;

  // filter state
  location = signal('');
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  sort = signal<SortKey>('newest');
  selectedAmenities = signal<string[]>([]);
  page = signal(1);
  showAmenities = signal(false);

  featured = computed(() => this.listingService.listings().filter((l) => l.featured));
  favouriteIds = this.listingService.favouriteIds;

  filtered = computed(() => {
    const loc = this.location().trim().toLowerCase();
    const min = this.minPrice();
    const max = this.maxPrice();
    const wanted = this.selectedAmenities();

    const result = this.listingService
      .listings()
      .filter(
        (l) =>
          (!loc || l.address.toLowerCase().includes(loc) || l.title.toLowerCase().includes(loc)) &&
          (min === null || l.rent >= min) &&
          (max === null || l.rent <= max) &&
          wanted.every((a) => l.amenities.includes(a)),
      );

    switch (this.sort()) {
      case 'priceAsc':
        return result.sort((a, b) => a.rent - b.rent);
      case 'priceDesc':
        return result.sort((a, b) => b.rent - a.rent);
      default:
        return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
  });

  paged = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  // update a filter and jump back to page 1
  update<T>(sig: { set(v: T): void }, value: T) {
    sig.set(value);
    this.page.set(1);
  }

  toggleAmenity(a: string) {
    const cur = this.selectedAmenities();
    this.update(this.selectedAmenities, cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]);
  }

  clearFilters() {
    this.location.set('');
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.selectedAmenities.set([]);
    this.sort.set('newest');
    this.page.set(1);
  }

  toggleFav(id: string) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/' } });
      return;
    }
    this.listingService.toggleFavourite(id);
  }
  readonly icons: Record<string, string> = {
    'Gym/Fitness Center': 'bi-heart-pulse',
    'Swimming Pool': 'bi-water',
    'Car Park': 'bi-car-front',
    'Visitors Parking': 'bi-p-square',
    'Power Backup': 'bi-lightning-charge',
    'Garbage Disposal': 'bi-trash3',
    'Private Lawn': 'bi-flower1',
    'Water Heater': 'bi-droplet-half',
    'Plant Security System': 'bi-shield-check',
    'Laundry Service': 'bi-basket',
    Elevator: 'bi-building-up',
    'Club House': 'bi-cup-hot',
  };

  scrollToListings() {
    document.getElementById('all-listings')?.scrollIntoView({ behavior: 'smooth' });
  }
}
