import { Injectable, computed, inject, signal } from '@angular/core';
import { Comment, Inquiry, Listing } from '../models/models';
import { SEED_COMMENTS, SEED_LISTINGS } from '../data/seed';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class ListingService {
  private auth = inject(AuthService);
  private INQUIRIES_KEY = 'renthub_inquiries';

  private LISTINGS_KEY = 'renthub_listings';
  private COMMENTS_KEY = 'renthub_comments';
  private FAVS_KEY = 'renthub_favourites';

  listings = signal<Listing[]>([]);
  private favMap = signal<Record<string, string[]>>({});

  // ids favourited by the currently logged-in user
  favouriteIds = computed(() => this.favMap()[this.auth.currentUser()?.id ?? ''] ?? []);

  constructor() {
    // seed only on first run
    if (localStorage.getItem(this.LISTINGS_KEY) === null) {
      this.write(this.LISTINGS_KEY, SEED_LISTINGS);
    }
    if (localStorage.getItem(this.COMMENTS_KEY) === null) {
      this.write(this.COMMENTS_KEY, SEED_COMMENTS);
    }
    this.listings.set(this.read<Listing[]>(this.LISTINGS_KEY, []));
    this.favMap.set(this.read<Record<string, string[]>>(this.FAVS_KEY, {}));
  }

  // ---------- Listings (CRUD) ----------
  getById(id: string): Listing | undefined {
    return this.listings().find((l) => l.id === id);
  }

  add(data: Omit<Listing, 'id' | 'ownerId' | 'createdAt'>): Listing {
    const listing: Listing = {
      ...data,
      id: crypto.randomUUID(),
      ownerId: this.auth.currentUser()!.id,
      createdAt: new Date().toISOString(),
    };
    this.persistListings([listing, ...this.listings()]);
    return listing;
  }

  update(id: string, changes: Partial<Listing>) {
    this.persistListings(this.listings().map((l) => (l.id === id ? { ...l, ...changes } : l)));
  }

  remove(id: string) {
    this.persistListings(this.listings().filter((l) => l.id !== id));
  }

  // ---------- Favourites ----------
  isFavourite(id: string): boolean {
    return this.favouriteIds().includes(id);
  }

  toggleFavourite(id: string) {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;
    const current = this.favMap()[userId] ?? [];
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    const map = { ...this.favMap(), [userId]: next };
    this.favMap.set(map);
    this.write(this.FAVS_KEY, map);
  }

  // ---------- Comments (used in the details page later) ----------
  getComments(listingId: string): Comment[] {
    return this.read<Comment[]>(this.COMMENTS_KEY, []).filter((c) => c.listingId === listingId);
  }

  addComment(listingId: string, text: string, parentId?: string) {
    const user = this.auth.currentUser()!;
    const all = this.read<Comment[]>(this.COMMENTS_KEY, []);
    all.push({
      id: crypto.randomUUID(),
      listingId,
      text,
      parentId,
      userId: user.id,
      userName: user.name,
      createdAt: new Date().toISOString(),
    });
    this.write(this.COMMENTS_KEY, all);
  }

  // ---------- helpers ----------
  private persistListings(list: Listing[]) {
    this.listings.set(list);
    this.write(this.LISTINGS_KEY, list);
  }
  private read<T>(key: string, fallback: T): T {
    try {
      return JSON.parse(localStorage.getItem(key) ?? '') as T;
    } catch {
      return fallback;
    }
  }
  private write(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  // ----------inquiry----------
  getInquiries(listingId: string): Inquiry[] {
    return this.read<Inquiry[]>(this.INQUIRIES_KEY, []).filter((i) => i.listingId === listingId);
  }

  addInquiry(listingId: string, message: string) {
    const user = this.auth.currentUser()!;
    const all = this.read<Inquiry[]>(this.INQUIRIES_KEY, []);
    all.push({
      id: crypto.randomUUID(),
      listingId,
      message,
      fromUserId: user.id,
      fromName: user.name,
      fromEmail: user.email,
      createdAt: new Date().toISOString(),
    });
    this.write(this.INQUIRIES_KEY, all);
  }
}
