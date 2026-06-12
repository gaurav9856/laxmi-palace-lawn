import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { BookingService } from '../../services/booking.service';
import { CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule,
    MatDatepickerModule, MatNativeDateModule, MatCalendar,
    MatProgressSpinnerModule, MatSnackBarModule
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements OnInit {
  private fb = inject(FormBuilder);
  private bookingApi = inject(BookingService);
  private calendarApi = inject(CalendarService);
  private snack = inject(MatSnackBar);
  private route = inject(ActivatedRoute);

  bookedDates = signal<Set<string>>(new Set());
  blockedDates = signal<Set<string>>(new Set());
  selectedDate = signal<Date | null>(null);
  availability = signal<{ checked: boolean; available: boolean; message: string }>({
    checked: false, available: true, message: ''
  });
  submitting = signal(false);
  loadingCal = signal(true);

  eventTypes = ['Wedding', 'Reception', 'Engagement', 'Tilak', 'Birthday', 'Anniversary', 'Corporate Event', 'Cultural Function', 'Other'];

  minDate = new Date();

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    email: ['', [Validators.email]],
    eventType: ['', Validators.required],
    guestCount: [100, [Validators.required, Validators.min(1), Validators.max(10000)]],
    notes: ['']
  });

  canBook = computed(() =>
    this.selectedDate() !== null &&
    this.availability().checked &&
    this.availability().available &&
    !this.submitting()
  );

  ngOnInit(): void {
    this.loadCalendar();
    // Pre-select date from ?date=YYYY-MM-DD query param (set by quick-check on Home)
    const qDate = this.route.snapshot.queryParamMap.get('date');
    if (qDate && /^\d{4}-\d{2}-\d{2}$/.test(qDate)) {
      const [y, m, d] = qDate.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      if (date >= this.startOfToday()) {
        this.onDateSelected(date);
      }
    }
  }

  loadCalendar() {
    this.loadingCal.set(true);
    this.calendarApi.bookedDates().subscribe({
      next: (res) => {
        this.bookedDates.set(new Set(res.data.booked.map(this.toIso)));
        this.blockedDates.set(new Set(res.data.blocked.map(this.toIso)));
        this.loadingCal.set(false);
      },
      error: () => {
        this.snack.open('Could not load calendar. Please retry.', 'Close', { duration: 3000 });
        this.loadingCal.set(false);
      }
    });
  }

  toIso = (d: string | Date): string => {
    if (d instanceof Date) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
    return d.slice(0, 10);
  };

  dateClass = (d: Date): string => {
    const iso = this.toIso(d);
    if (this.blockedDates().has(iso)) return 'cal-blocked';
    if (this.bookedDates().has(iso)) return 'cal-booked';
    if (d >= this.startOfToday()) return 'cal-available';
    return '';
  };

  dateFilter = (d: Date | null): boolean => {
    if (!d) return false;
    if (d < this.startOfToday()) return false;
    const iso = this.toIso(d);
    return !this.blockedDates().has(iso); // booked dates still selectable so we can show error
  };

  onDateSelected(d: Date | null) {
    this.selectedDate.set(d);
    this.availability.set({ checked: false, available: true, message: '' });
    if (!d) return;
    const iso = this.toIso(d);
    this.bookingApi.checkAvailability(iso).subscribe({
      next: res => this.availability.set({
        checked: true,
        available: res.available,
        message: res.message || (res.available ? 'Date is available' : 'Date not available')
      }),
      error: () => this.availability.set({
        checked: true, available: false, message: 'Could not check availability. Try again.'
      })
    });
  }

  submit() {
    if (this.form.invalid || !this.selectedDate() || !this.availability().available) return;
    const v = this.form.getRawValue();
    const payload = {
      name: v.name.trim(),
      mobile: v.mobile.trim(),
      email: v.email?.trim() || undefined,
      eventDate: this.toIso(this.selectedDate()!),
      eventType: v.eventType,
      guestCount: Number(v.guestCount),
      notes: v.notes?.trim() || undefined
    };

    this.submitting.set(true);
    this.bookingApi.create(payload).subscribe({
      next: res => {
        this.submitting.set(false);
        this.snack.open(res.message || 'Booking request submitted!', 'Close',
          { duration: 5000, panelClass: 'success-snack' });
        this.form.reset({ guestCount: 100, eventType: '', name: '', mobile: '', email: '', notes: '' });
        this.selectedDate.set(null);
        this.availability.set({ checked: false, available: true, message: '' });
        this.loadCalendar();
      },
      error: err => {
        this.submitting.set(false);
        const msg = err?.error?.message || 'Could not submit booking. Please try again.';
        this.snack.open(msg, 'Close', { duration: 5000 });
      }
    });
  }

  private startOfToday(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }
}
