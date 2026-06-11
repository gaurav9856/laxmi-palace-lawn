import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { BookingService } from '../../services/booking.service';
import { CalendarService } from '../../services/calendar.service';
import { AuthService } from '../../services/auth.service';
import { Booking, BlockedDate, DashboardStats } from '../../models/booking.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatTabsModule, MatChipsModule, MatDialogModule, MatSnackBarModule,
    MatProgressSpinnerModule, MatDatepickerModule, MatNativeDateModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  private bookingApi = inject(BookingService);
  private calendarApi = inject(CalendarService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  user = this.auth.currentUser;

  stats = signal<DashboardStats>({
    total: 0, pending: 0, approved: 0, rejected: 0, cancelled: 0,
    upcoming: 0, monthlyRevenue: 0
  });
  bookings = signal<Booking[]>([]);
  blockedDates = signal<BlockedDate[]>([]);
  loading = signal(false);

  // filters
  filterStatus = signal<string>('');
  filterFrom = signal<string>('');
  filterTo = signal<string>('');
  search = signal<string>('');

  // block-date form
  blockDate = signal<Date | null>(null);
  blockReason = signal<string>('');

  displayedColumns = ['id', 'event_date', 'customer_name', 'customer_mobile', 'event_type', 'guest_count', 'status', 'actions'];

  filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    return this.bookings().filter(b =>
      !q || b.customer_name.toLowerCase().includes(q) ||
      b.customer_mobile.includes(q) ||
      (b.customer_email || '').toLowerCase().includes(q) ||
      b.event_type.toLowerCase().includes(q)
    );
  });

  availableDateCount = computed(() => {
    const start = new Date();
    const end = new Date();
    end.setFullYear(end.getFullYear() + 1);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / 86400000);
    const taken = this.bookings().filter(b => b.status === 'APPROVED' && new Date(b.event_date) >= start).length;
    const blocked = this.blockedDates().filter(b => new Date(b.blocked_date) >= start).length;
    return Math.max(totalDays - taken - blocked, 0);
  });

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll() {
    this.loading.set(true);
    this.bookingApi.stats().subscribe(r => r.data && this.stats.set(r.data));
    this.calendarApi.listBlocked().subscribe(r => this.blockedDates.set(r.data || []));
    this.loadBookings();
  }

  loadBookings() {
    this.loading.set(true);
    this.bookingApi.list({
      status: this.filterStatus() || undefined,
      from: this.filterFrom() || undefined,
      to: this.filterTo() || undefined
    }).subscribe({
      next: r => { this.bookings.set(r.data || []); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }

  clearFilters() {
    this.filterStatus.set('');
    this.filterFrom.set('');
    this.filterTo.set('');
    this.search.set('');
    this.loadBookings();
  }

  approve(b: Booking) {
    if (!confirm(`Approve booking for ${b.customer_name} on ${b.event_date}?`)) return;
    this.bookingApi.approve(b.id).subscribe({
      next: r => { this.snack.open(r.message || 'Approved', 'Close', { duration: 3000 }); this.loadAll(); },
      error: err => this.snack.open(err?.error?.message || 'Failed', 'Close', { duration: 4000 })
    });
  }
  reject(b: Booking) {
    if (!confirm(`Reject booking for ${b.customer_name}?`)) return;
    this.bookingApi.reject(b.id).subscribe({
      next: r => { this.snack.open(r.message || 'Rejected', 'Close', { duration: 3000 }); this.loadAll(); }
    });
  }
  cancel(b: Booking) {
    if (!confirm(`Cancel booking for ${b.customer_name}?`)) return;
    this.bookingApi.cancel(b.id).subscribe({
      next: r => { this.snack.open(r.message || 'Cancelled', 'Close', { duration: 3000 }); this.loadAll(); }
    });
  }

  block() {
    if (!this.blockDate()) return;
    const iso = this.toIso(this.blockDate()!);
    this.calendarApi.blockDate(iso, this.blockReason()).subscribe({
      next: r => {
        this.snack.open(r.message || 'Date blocked', 'Close', { duration: 3000 });
        this.blockDate.set(null); this.blockReason.set('');
        this.loadAll();
      },
      error: err => this.snack.open(err?.error?.message || 'Failed', 'Close', { duration: 3000 })
    });
  }
  unblock(b: BlockedDate) {
    if (!confirm(`Unblock ${b.blocked_date}?`)) return;
    this.calendarApi.unblock(b.id).subscribe({
      next: () => { this.snack.open('Unblocked', 'Close', { duration: 2000 }); this.loadAll(); }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }

  statusColor(s: string): string {
    return ({
      'APPROVED': 'ok', 'PENDING': 'warn', 'REJECTED': 'err', 'CANCELLED': 'muted'
    } as Record<string, string>)[s] || '';
  }

  private toIso(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
