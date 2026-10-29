import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ListingService } from '../../services/listing';
import { AuthService } from '../../services/auth';
import { Comment, Inquiry } from '../../models/models';

@Component({
  selector: 'app-listing-details',
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './listing-details.html',
  styleUrl: './listing-details.scss',
})
export class ListingDetails {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private svc = inject(ListingService);
  auth = inject(AuthService);

  private id = this.route.snapshot.paramMap.get('id')!;

  listing = computed(() => this.svc.listings().find((l) => l.id === this.id));
  isOwner = computed(
    () => !!this.listing() && this.listing()!.ownerId === this.auth.currentUser()?.id,
  );
  isFav = computed(() => this.svc.favouriteIds().includes(this.id));

  selected = signal(0);

  // comments
  comments = signal<Comment[]>(this.svc.getComments(this.id));
  topLevel = computed(() => this.comments().filter((c) => !c.parentId));
  replyingTo = signal<string | null>(null);
  commentCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(500)],
  });
  replyCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(500)],
  });

  // inquiries
  inquiryOpen = signal(false);
  inquirySent = signal(false);
  inquiryCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(10), Validators.maxLength(500)],
  });
  inquiries = signal<Inquiry[]>(this.svc.getInquiries(this.id));

  repliesOf(commentId: string) {
    return this.comments().filter((c) => c.parentId === commentId);
  }

  postComment() {
    const text = this.commentCtrl.value.trim();
    if (!text || this.commentCtrl.invalid) {
      this.commentCtrl.markAsTouched();
      return;
    }
    this.svc.addComment(this.id, text);
    this.comments.set(this.svc.getComments(this.id));
    this.commentCtrl.reset('');
  }

  startReply(commentId: string) {
    this.replyingTo.set(commentId);
    this.replyCtrl.reset('');
  }

  postReply(parentId: string) {
    const text = this.replyCtrl.value.trim();
    if (!text || this.replyCtrl.invalid) {
      this.replyCtrl.markAsTouched();
      return;
    }
    this.svc.addComment(this.id, text, parentId);
    this.comments.set(this.svc.getComments(this.id));
    this.replyingTo.set(null);
  }

  sendInquiry() {
    const text = this.inquiryCtrl.value.trim();
    if (this.inquiryCtrl.invalid || text.length < 10) {
      this.inquiryCtrl.markAsTouched();
      return;
    }
    this.svc.addInquiry(this.id, text);
    this.inquirySent.set(true);
    this.inquiryOpen.set(false);
    this.inquiryCtrl.reset('');
  }

  toggleFav() {
    if (!this.auth.isLoggedIn()) {
      this.goLogin();
      return;
    }
    this.svc.toggleFavourite(this.id);
  }

  goLogin() {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
  }

  deleteListing() {
    if (confirm('Delete this listing permanently?')) {
      this.svc.remove(this.id);
      this.router.navigate(['/']);
    }
  }
}
