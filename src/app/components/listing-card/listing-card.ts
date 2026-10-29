import { Component, input, output } from '@angular/core';
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
}
