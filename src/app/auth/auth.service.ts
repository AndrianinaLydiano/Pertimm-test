import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private baseUrl = 'https://hire-game.pertimm.dev';

  register(payload: { email: string; password1: string; password2: string; }) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/api/v1.1/auth/register/`, payload).pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
        })
      );;
  }

  login(payload: { email: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/api/v1.1/auth/login/`, payload)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
