import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then((m) => m.Login) },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: 'listing/:id',
    loadComponent: () =>
      import('./pages/listing-details/listing-details').then((m) => m.ListingDetails),
  },
  {
    path: 'create',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/create-listing/create-listing').then((m) => m.CreateListing),
  },
  {
    path: 'edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/create-listing/create-listing').then((m) => m.CreateListing),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/profile').then((m) => m.Profile),
  },
  { path: '**', redirectTo: '' },
];
