import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, BlockedDate } from '../models/booking.model';

interface BookedDatesResponse extends ApiResponse {
  data: {
    booked: string[];
    blocked: string[];
    range: { start: string; end: string };
  };
}

@Injectable({ providedIn: 'root' })
export class CalendarService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  bookedDates(from?: string, to?: string): Observable<BookedDatesResponse> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get<BookedDatesResponse>(`${this.base}/calendar/booked-dates`, { params });
  }

  listBlocked(): Observable<ApiResponse<BlockedDate[]>> {
    return this.http.get<ApiResponse<BlockedDate[]>>(`${this.base}/blocked-dates`);
  }

  blockDate(date: string, reason?: string) {
    return this.http.post<ApiResponse>(`${this.base}/blocked-dates`, { date, reason });
  }

  unblock(id: number) {
    return this.http.delete<ApiResponse>(`${this.base}/blocked-dates/${id}`);
  }
}
