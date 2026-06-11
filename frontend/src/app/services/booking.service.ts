import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ApiResponse, AvailabilityResponse, Booking, BookingCreateRequest, DashboardStats
} from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/bookings`;

  create(payload: BookingCreateRequest): Observable<ApiResponse<{ id: number }>> {
    return this.http.post<ApiResponse<{ id: number }>>(this.base, payload);
  }

  checkAvailability(dateIso: string): Observable<AvailabilityResponse> {
    return this.http.get<AvailabilityResponse>(`${this.base}/availability/${dateIso}`);
  }

  list(filters: { status?: string; from?: string; to?: string; q?: string } = {}): Observable<ApiResponse<Booking[]>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params = params.set(k, v); });
    return this.http.get<ApiResponse<Booking[]>>(this.base, { params });
  }

  approve(id: number) { return this.http.put<ApiResponse>(`${this.base}/${id}/approve`, {}); }
  reject(id: number)  { return this.http.put<ApiResponse>(`${this.base}/${id}/reject`, {}); }
  cancel(id: number)  { return this.http.put<ApiResponse>(`${this.base}/${id}/cancel`, {}); }

  stats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.base}/stats`);
  }
}
