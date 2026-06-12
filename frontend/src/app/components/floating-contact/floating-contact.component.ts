import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-floating-contact',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="fab-wrap" [class.open]="open()">
      <!-- WhatsApp -->
      <a class="fab fab-wa"
         [href]="whatsappUrl"
         target="_blank"
         rel="noopener"
         aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
          <path d="M20.52 3.48A11.94 11.94 0 0 0 12.07 0C5.5 0 .15 5.36.15 11.93c0 2.1.55 4.15 1.6 5.95L0 24l6.27-1.65a11.93 11.93 0 0 0 5.8 1.48h.01c6.57 0 11.92-5.36 11.92-11.93 0-3.18-1.24-6.18-3.48-8.42zm-8.45 18.34h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.98 1-3.63-.24-.37a9.9 9.9 0 0 1-1.52-5.28c0-5.47 4.46-9.93 9.94-9.93 2.65 0 5.14 1.04 7.02 2.91a9.86 9.86 0 0 1 2.91 7.03c0 5.48-4.46 9.93-9.94 9.93zm5.45-7.43c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15s-.77.97-.94 1.17-.35.22-.65.07c-.3-.15-1.25-.46-2.39-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.07 2.88 1.22 3.08c.15.2 2.1 3.21 5.1 4.5.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z"/>
        </svg>
        <span class="label">Chat on WhatsApp</span>
      </a>

      <!-- Call -->
      <a class="fab fab-call"
         [href]="telUrl"
         aria-label="Call us now">
        <mat-icon>call</mat-icon>
        <span class="label">Call Now</span>
      </a>

      <!-- Toggle (only on mobile to save space) -->
      <button class="fab fab-toggle"
              (click)="open.set(!open())"
              [attr.aria-expanded]="open()"
              aria-label="Toggle contact menu">
        <mat-icon>{{ open() ? 'close' : 'support_agent' }}</mat-icon>
      </button>
    </div>
  `,
  styleUrl: './floating-contact.component.scss'
})
export class FloatingContactComponent {
  // 👉 Replace with the real venue phone number
  readonly phoneDigits = '919876543210';
  readonly whatsappMessage = encodeURIComponent(
    'Hello, I would like to book Laxmi Palace Lawn for an event.'
  );

  open = signal(true); // open by default on desktop, mobile starts collapsed

  get telUrl() { return `tel:+${this.phoneDigits}`; }
  get whatsappUrl() { return `https://wa.me/${this.phoneDigits}?text=${this.whatsappMessage}`; }
}
