import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ListingService } from '../../services/listing';
import { AuthService } from '../../services/auth';
import { ListingCard } from '../../components/listing-card/listing-card';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, ListingCard],
  templateUrl: './profile.html',
})
export class Profile {
  private svc = inject(ListingService);
  auth = inject(AuthService);

  mine = computed(() =>
    this.svc.listings().filter((l) => l.ownerId === this.auth.currentUser()?.id),
  );
  favourites = computed(() =>
    this.svc.listings().filter((l) => this.svc.favouriteIds().includes(l.id)),
  );
  favouriteIds = this.svc.favouriteIds;

  toggleFav(id: string) {
    this.svc.toggleFavourite(id);
  }
  remove(id: string) {
    if (confirm('Delete this listing?')) this.svc.remove(id);
  }
}
