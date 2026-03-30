import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private mockUser: User = {
    id: 'USR-001',
    firstName: 'James',
    lastName: 'Chen',
    email: 'james.chen@email.com',
    phone: '+44 7700 900123',
    role: 'Premier Customer',
    lastLogin: '2026-03-26T14:30:00Z',
    customerSince: '2018-05-15',
    preferredBranch: 'London Canary Wharf'
  };

  constructor() {
    const stored = localStorage.getItem('hsbc_auth');
    if (stored) {
      this.currentUserSubject.next(this.mockUser);
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(email: string, password: string): Observable<User> {
    return of(this.mockUser).pipe(
      delay(1200),
      tap(user => {
        localStorage.setItem('hsbc_auth', 'true');
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('hsbc_auth');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  get isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
