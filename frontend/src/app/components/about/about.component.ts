import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <section class="page-hero">
      <div class="container">
        <small class="eyebrow">About</small>
        <h1>Discover Laxmi Palace Lawn</h1>
        <p class="lead">Royal heritage. Modern comfort. Unforgettable celebrations.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="grid-2">
          <div>
            <h2>Our Story</h2>
            <p>
              Established in 2010, Laxmi Palace Lawn has hosted thousands of weddings, receptions and
              cultural events across Chakia and surrounding districts. Built on the principle of
              providing world-class hospitality at accessible prices, we have become the venue of
              choice for families seeking elegance, space and reliability.
            </p>
            <p>
              Every event at Laxmi Palace is treated as our own. From the welcome drink to the final
              farewell, our team works tirelessly to ensure every guest leaves with a smile.
            </p>
          </div>
          <img class="hero-img" src="https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=900"
               alt="Laxmi Palace Lawn view">
        </div>
      </div>
    </section>

    <section class="section section--accent">
      <div class="container">
        <div class="section-title">
          <small class="eyebrow">By the Numbers</small>
          <h2>Lawn Details</h2>
        </div>
        <div class="stat-grid">
          <div class="card stat">
            <mat-icon>aspect_ratio</mat-icon>
            <strong>3 Acres</strong>
            <span>Total Lawn Area</span>
          </div>
          <div class="card stat">
            <mat-icon>groups</mat-icon>
            <strong>1500+</strong>
            <span>Guest Capacity</span>
          </div>
          <div class="card stat">
            <mat-icon>local_parking</mat-icon>
            <strong>200+</strong>
            <span>Parking Slots</span>
          </div>
          <div class="card stat">
            <mat-icon>meeting_room</mat-icon>
            <strong>15</strong>
            <span>AC Rooms</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-title">
          <small class="eyebrow">World-class</small>
          <h2>Facilities</h2>
        </div>
        <div class="facility-grid">
          <div class="card f"><mat-icon>ac_unit</mat-icon><h3>AC Banquet Hall</h3><p>Climate-controlled hall for off-season events.</p></div>
          <div class="card f"><mat-icon>restaurant_menu</mat-icon><h3>In-house Catering</h3><p>Multi-cuisine menu including veg / non-veg / Jain options.</p></div>
          <div class="card f"><mat-icon>lightbulb</mat-icon><h3>Stage & Lighting</h3><p>Premium stage decor, sound system and lighting.</p></div>
          <div class="card f"><mat-icon>bed</mat-icon><h3>Guest Rooms</h3><p>15 AC rooms for the bride, groom and outstation guests.</p></div>
          <div class="card f"><mat-icon>shower</mat-icon><h3>Bridal Suite</h3><p>Elegant make-up room with all amenities for the bride.</p></div>
          <div class="card f"><mat-icon>local_fire_department</mat-icon><h3>Mandap Area</h3><p>Traditional open mandap with customisable decor.</p></div>
          <div class="card f"><mat-icon>power</mat-icon><h3>Backup Power</h3><p>100% generator backup throughout the venue.</p></div>
          <div class="card f"><mat-icon>security</mat-icon><h3>24x7 Security</h3><p>CCTV surveillance and on-site security personnel.</p></div>
        </div>
      </div>
    </section>

    <section class="section section--accent">
      <div class="container">
        <div class="grid-2">
          <div>
            <h2><mat-icon style="vertical-align:middle;color:var(--color-gold)">local_parking</mat-icon> Parking Information</h2>
            <ul class="feature-list">
              <li><mat-icon>check_circle</mat-icon> Dedicated parking for 200+ cars</li>
              <li><mat-icon>check_circle</mat-icon> Separate two-wheeler parking</li>
              <li><mat-icon>check_circle</mat-icon> Valet parking available on request</li>
              <li><mat-icon>check_circle</mat-icon> Well-lit and CCTV monitored</li>
              <li><mat-icon>check_circle</mat-icon> Drop-off zone at main gate</li>
            </ul>
            <a routerLink="/booking" class="btn-luxury"><mat-icon>event_available</mat-icon> Book a Visit</a>
          </div>
          <img class="hero-img" src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=900"
               alt="Parking area">
        </div>
      </div>
    </section>
  `,
  styles: [`
    .page-hero {
      background: linear-gradient(135deg, var(--color-maroon-dark), var(--color-maroon));
      color: #fff;
      padding: 5rem 0 4rem;
      text-align: center;
    }
    .page-hero h1 { color: #fff; }
    .page-hero .lead { opacity: .9; }
    .eyebrow {
      display: inline-block;
      text-transform: uppercase; letter-spacing: 3px;
      font-size: .8rem; color: var(--color-gold);
    }
    .grid-2 {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 3rem; align-items: center;
    }
    .hero-img { border-radius: var(--radius); box-shadow: var(--shadow-elev-lg); }
    .stat-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }
    .stat { text-align: center; }
    .stat mat-icon {
      font-size: 2.5rem; width: 2.5rem; height: 2.5rem;
      color: var(--color-gold);
      margin-bottom: .5rem;
    }
    .stat strong {
      display: block; font-family: var(--font-display);
      font-size: 2rem; color: var(--color-maroon);
    }
    .stat span { color: var(--color-muted); }
    .facility-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
    }
    .f { text-align: center; }
    .f mat-icon {
      font-size: 2rem; width: 2rem; height: 2rem;
      color: var(--color-gold); margin-bottom: .5rem;
    }
    .feature-list { list-style: none; padding: 0; }
    .feature-list li { display: flex; gap: .5rem; padding: .5rem 0; }
    .feature-list mat-icon { color: var(--color-gold); }
    @media (max-width: 880px) { .grid-2 { grid-template-columns: 1fr; } }
  `]
})
export class AboutComponent {}
