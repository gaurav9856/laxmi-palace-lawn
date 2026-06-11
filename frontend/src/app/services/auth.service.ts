import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AdminUser } from '../models/booking.model';

interface LoginResponse {
  success: boolean;
  token: string;
  admin: AdminUser;
}

const TOKEN_KEY = 'lpl_admin_token';
const USER_KEY = 'lpl_admin_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  readonly currentUser = signal<AdminUser | null>(this.loadUser());

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/admin/login`, { email, password })
      .pipe(tap(res => {
        if (res.success) {
          localStorage.setItem(TOKEN_KEY, res.token);
          localStorage.setItem(USER_KEY, JSON.stringify(res.admin));
          this.currentUser.set(res.admin);
        }
      }));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  private loadUser(): AdminUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }
}
