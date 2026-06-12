import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-mobile-book-cta',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <div class="mobile-cta-bar">
      <a routerLink="/booking" class="cta-main">
        <mat-icon>event_available</mat-icon>
        <span>Book Your Date</span>
      </a>
    </div>
  `,
  styles: [`
    .mobile-cta-bar {
      display: none;
      position: fixed;
      left: 0; right: 0;
      bottom: 0;
      z-index: 80;
      padding: .75rem 1rem calc(.75rem + env(safe-area-inset-bottom));
      background: rgba(255, 255, 255, 0.97);
      backdrop-filter: blur(10px);
      border-top: 1px solid rgba(0, 0, 0, 0.08);
      box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
    }
    .cta-main {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: .5rem;
      width: 100%;
      padding: .95rem 1rem;
      background: linear-gradient(135deg, var(--color-gold), var(--color-maroon));
      color: #fff !important;
      text-decoration: none;
      font-weight: 600;
      letter-spacing: .5px;
      font-size: 1.05rem;
      border-radius: 999px;
      box-shadow: 0 4px 12px rgba(107, 16, 41, 0.3);
      transition: transform .15s ease;
    }
    .cta-main:active { transform: scale(.98); }
    .cta-main mat-icon {
      font-size: 1.4rem;
      width: 1.4rem;
      height: 1.4rem;
    }
    @media (max-width: 720px) {
      .mobile-cta-bar { display: block; }
    }
  `]
})
export class MobileBookCtaComponent {}
