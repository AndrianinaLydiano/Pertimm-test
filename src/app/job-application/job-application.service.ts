import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, timer, switchMap, takeWhile } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {
  private http = inject(HttpClient);

  private baseUrl = 'https://hire-game.pertimm.dev/api/v1.1/job-application-request/';

  createApplication(payload: { email: string; first_name: string; last_name: string }) {
    return this.http.post<{ url: string }>(this.baseUrl, payload);
  }

  getStatusUntilCompleted(url: string): Observable<{ status: string; confirmation_url?: string }> {
    return timer(0, 2000).pipe(
      switchMap(() => this.http.get<{ status: string; confirmation_url?: string }>(url)),
      takeWhile((res: { status: string; confirmation_url?: string }) => res.status !== 'COMPLETED', true)
    );
  }

  confirmApplication(confirmationUrl: string): Observable<HttpResponse<void>> {
    return this.http.patch<HttpResponse<void>>(confirmationUrl, {confirmed: true});
  }
}

