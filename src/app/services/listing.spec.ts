import { TestBed } from '@angular/core/testing';
import { ListingService } from './listing';
import { AuthService } from './auth';

describe('ListingService', () => {
  let service: ListingService;
  let auth: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    auth = TestBed.inject(AuthService);
    service = TestBed.inject(ListingService);
  });

  it('should be created and seed listings on first run', () => {
    expect(service).toBeTruthy();
    expect(service.listings().length).toBe(8);
  });

  it('should find a listing by id', () => {
    expect(service.getById('l1')?.title).toBe('Sunny 2BHK in Downtown');
    expect(service.getById('nope')).toBeUndefined();
  });

  it('should add a listing owned by the logged-in user', () => {
    auth.login('demo@renthub.com', 'Demo@123');
    const base = service.getById('l1')!;
    const { id, ownerId, createdAt, ...data } = base;

    const created = service.add({ ...data, title: 'My new place' });

    expect(service.listings().length).toBe(9);
    expect(created.ownerId).toBe('u1');
    expect(service.getById(created.id)?.title).toBe('My new place');
  });

  it('should update and remove a listing', () => {
    service.update('l1', { rent: 999 });
    expect(service.getById('l1')?.rent).toBe(999);

    service.remove('l1');
    expect(service.getById('l1')).toBeUndefined();
  });

  it('should toggle favourites per user', () => {
    auth.login('demo@renthub.com', 'Demo@123');
    service.toggleFavourite('l2');
    expect(service.isFavourite('l2')).toBe(true);

    service.toggleFavourite('l2');
    expect(service.isFavourite('l2')).toBe(false);
  });

  it('should ignore favourites when logged out', () => {
    service.toggleFavourite('l2');
    expect(service.isFavourite('l2')).toBe(false);
  });

  it('should return seeded comments and add replies', () => {
    expect(service.getComments('l1').length).toBe(2);

    auth.login('demo@renthub.com', 'Demo@123');
    service.addComment('l1', 'Thanks!', 'c2');

    const all = service.getComments('l1');
    expect(all.length).toBe(3);
    expect(all[2].parentId).toBe('c2');
  });

  it('should store inquiries', () => {
    auth.login('demo@renthub.com', 'Demo@123');
    service.addInquiry('l1', 'Is it still available?');
    expect(service.getInquiries('l1').length).toBe(1);
  });
});
