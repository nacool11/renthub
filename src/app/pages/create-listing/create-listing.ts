import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ListingService } from '../../services/listing';
import { AuthService } from '../../services/auth';
import { Listing } from '../../models/models';
import { AMENITIES } from '../../data/seed';

const MAX_PHOTOS = 5;

@Component({
  selector: 'app-create-listing',
  imports: [ReactiveFormsModule, CurrencyPipe, RouterLink],
  templateUrl: './create-listing.html',
  styleUrl: './create-listing.scss',
})
export class CreateListing {
  private fb = inject(FormBuilder);
  private svc = inject(ListingService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  editId = this.route.snapshot.paramMap.get('id');
  step = signal<'form' | 'preview'>('form');
  photos = signal<string[]>([]);
  photoError = signal('');

  readonly amenityOptions = AMENITIES;
  readonly maxPhotos = MAX_PHOTOS;
  readonly propertyTypes = [
    'Apartment',
    'Independent House',
    'Villa',
    'Studio',
    'Room in shared flat',
    'Building',
  ];

  form = this.fb.nonNullable.group({
    propertyType: ['', Validators.required],
    propertyName: ['', [Validators.required, Validators.maxLength(80)]],
    beds: [1, [Validators.required, Validators.min(0), Validators.max(20)]],
    sharedProperty: [null as boolean | null, Validators.required],
    address: ['', [Validators.required, Validators.minLength(5)]],
    sqft: [
      null as number | null,
      [Validators.required, Validators.min(50), Validators.max(100000)],
    ],
    leaseType: ['' as '' | 'long' | 'short' | 'both', Validators.required],
    rent: [null as number | null, [Validators.required, Validators.min(1)]],
    negotiable: [false],
    priceMode: ['perMonth' as 'perMonth' | 'utilitiesIncluded', Validators.required],
    furnished: [null as boolean | null, Validators.required],
    amenities: [[] as string[]],
    title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(30), Validators.maxLength(1400)]],
    contact: [
      '',
      [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$|^\+?[0-9\s\-]{7,15}$/)],
    ],
  });

  constructor() {
    if (this.editId) {
      const l = this.svc.getById(this.editId);
      if (!l || l.ownerId !== this.auth.currentUser()?.id) {
        this.router.navigate(['/']);
        return;
      }
      this.form.patchValue({
        ...l,
        propertyType: l.propertyType ?? '',
        propertyName: l.propertyName ?? '',
        beds: l.beds ?? 1,
      });
      this.photos.set([...l.photos]);
    } else {
      // pre-fill the contact with the logged-in user's email
      this.form.controls.contact.setValue(this.auth.currentUser()?.email ?? '');
    }
  }

  // ----- helpers -----
  invalid(name: string) {
    const c = this.form.get(name);
    return !!c && c.touched && c.invalid;
  }

  toggleAmenity(a: string) {
    const ctrl = this.form.controls.amenities;
    const v = ctrl.value;
    ctrl.setValue(v.includes(a) ? v.filter((x) => x !== a) : [...v, a]);
  }

  // ----- photos (resized + stored as base64 so localStorage doesn't overflow) -----
  async onFiles(ev: Event) {
    const input = ev.target as HTMLInputElement;
    this.photoError.set('');
    for (const f of Array.from(input.files ?? [])) {
      if (this.photos().length >= MAX_PHOTOS) {
        this.photoError.set(`Maximum ${MAX_PHOTOS} photos allowed.`);
        break;
      }
      if (!f.type.startsWith('image/')) {
        this.photoError.set('Only image files are allowed.');
        continue;
      }
      const data = await this.compress(f);
      this.photos.update((p) => [...p, data]);
    }
    input.value = '';
  }

  removePhoto(i: number) {
    this.photos.update((p) => p.filter((_, idx) => idx !== i));
  }

  private compress(file: File, maxW = 900): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  // ----- steps -----
  goPreview() {
    if (this.photos().length === 0) this.photoError.set('Please add at least one photo.');
    if (this.form.invalid || this.photos().length === 0) {
      this.form.markAllAsTouched();
      return;
    }
    this.step.set('preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  backToEdit() {
    this.step.set('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  submit() {
    const v = this.form.getRawValue();
    const data = {
      propertyType: v.propertyType,
      propertyName: v.propertyName,
      beds: v.beds,
      title: v.title,
      description: v.description,
      address: v.address,
      sharedProperty: v.sharedProperty!,
      sqft: v.sqft!,
      leaseType: v.leaseType as Listing['leaseType'],
      rent: v.rent!,
      negotiable: v.negotiable,
      priceMode: v.priceMode,
      furnished: v.furnished!,
      amenities: v.amenities,
      photos: this.photos(),
      contact: v.contact,
    };
    let id: string;
    if (this.editId) {
      this.svc.update(this.editId, data);
      id = this.editId;
    } else {
      id = this.svc.add(data).id;
    }
    this.router.navigate(['/listing', id]);
  }

  // used by the preview screen
  preview = computed(() => this.form.getRawValue());
}
