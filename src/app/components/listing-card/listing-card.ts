import { Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Listing } from '../../models/models';

@Component({
  selector: 'app-listing-card',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './listing-card.html',
  styleUrl: './listing-card.scss',
})
export class ListingCard {
  listing = input.required<Listing>();
  isFavourite = input(false);
  favouriteToggled = output<string>();

  // smaller image for the grid (uploaded base64 photos are left untouched)
  thumb = computed(() => {
    const first = this.listing().photos[0];
    return first ? first.replace('w=900', 'w=600') : 'https://placehold.co/600x600?text=No+Photo';
  });
}
