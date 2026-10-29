import { Register } from './../pages/register/register';
import { Service } from '@angular/core';
import { Injectable, computed, signal } from '@angular/core';
import { User } from '../models/models';
import { SEED_USERS } from '../data/seed';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private USERS_KEY = 'renthub_users';
  private SESSION_KEY = 'renthub_session';

  currentUser = signal<User | null>(this.loadSession());
  isLoggedIn = computed(() => this.currentUser() !== null);

  register(name: string, email: string, password: string): { ok: boolean; error?: string } {
    const users = this.getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'Email already registered' };
    }
    const user: User = { id: crypto.randomUUID(), name, email, password };
    localStorage.setItem(this.USERS_KEY, JSON.stringify([...users, user]));
    this.setSession(user);
    return { ok: true };
  }

  login(email: string, password: string): { ok: boolean; error?: string } {
    const user = this.getUsers().find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!user) return { ok: false, error: 'Invalid email or password' };
    this.setSession(user);
    return { ok: true };
  }

  logout() {
    localStorage.removeItem(this.SESSION_KEY);
    this.currentUser.set(null);
  }
  constructor() {
    // add any seed user whose email isn't already stored
    const users = this.getUsers();
    const missing = SEED_USERS.filter((s) => !users.some((u) => u.email === s.email));
    if (missing.length) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify([...users, ...missing]));
    }
  }
  private getUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) ?? '[]');
  }
  private setSession(user: User) {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }
  private loadSession(): User | null {
    const raw = localStorage.getItem(this.SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
