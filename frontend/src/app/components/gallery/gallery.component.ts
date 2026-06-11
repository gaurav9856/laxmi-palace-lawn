import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

interface Photo { src: string; category: 'wedding' | 'reception' | 'event'; alt: string; }

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonToggleModule],
  template: `
    <section class="page-hero">
      <div class="container">
        <small class="eyebrow">Memories</small>
        <h1>Our Gallery</h1>
        <p class="lead">Captured moments from celebrations we have hosted.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <mat-button-toggle-group [value]="filter()" (change)="filter.set($event.value)" class="filter">
          <mat-button-toggle value="all">All</mat-button-toggle>
          <mat-button-toggle value="wedding">Weddings</mat-button-toggle>
          <mat-button-toggle value="reception">Receptions</mat-button-toggle>
          <mat-button-toggle value="event">Events</mat-button-toggle>
        </mat-button-toggle-group>

        <div class="masonry">
          <div *ngFor="let p of visible(); let i = index" class="tile" (click)="open(i)">
            <img [src]="p.src" [alt]="p.alt" loading="lazy">
            <span class="zoom"><mat-icon>zoom_in</mat-icon></span>
          </div>
        </div>
      </div>
    </section>

    <!-- Lightbox -->
    <div class="lightbox" *ngIf="active() !== null" (click)="close()">
      <button class="lb-close" aria-label="Close" (click)="close(); $event.stopPropagation()">
        <mat-icon>close</mat-icon>
      </button>
      <button class="lb-nav prev" aria-label="Previous" (click)="prev(); $event.stopPropagation()">
        <mat-icon>chevron_left</mat-icon>
      </button>
      <img [src]="visible()[active()!].src" [alt]="visible()[active()!].alt" (click)="$event.stopPropagation()">
      <button class="lb-nav next" aria-label="Next" (click)="next(); $event.stopPropagation()">
        <mat-icon>chevron_right</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .page-hero {
      background: linear-gradient(135deg, var(--color-maroon-dark), var(--color-maroon));
      color: #fff; padding: 5rem 0 4rem; text-align: center;
    }
    .page-hero h1 { color: #fff; }
    .eyebrow {
      display: inline-block; text-transform: uppercase; letter-spacing: 3px;
      font-size: .8rem; color: var(--color-gold);
    }
    .filter {
      display: flex; justify-content: center; margin-bottom: 2rem; flex-wrap: wrap;
    }
    .masonry {
      column-count: 3; column-gap: 1rem;
    }
    .tile {
      position: relative;
      break-inside: avoid;
      margin-bottom: 1rem;
      border-radius: var(--radius);
      overflow: hidden;
      box-shadow: var(--shadow-elev);
      cursor: pointer;
    }
    .tile img { width: 100%; display: block; transition: transform .4s; }
    .tile:hover img { transform: scale(1.05); }
    .zoom {
      position: absolute; inset: 0;
      display: grid; place-items: center;
      background: rgba(74,10,28,.4);
      color: #fff;
      opacity: 0;
      transition: opacity .25s;
    }
    .zoom mat-icon { font-size: 2rem; width: 2rem; height: 2rem; }
    .tile:hover .zoom { opacity: 1; }
    .lightbox {
      position: fixed; inset: 0;
      background: rgba(0,0,0,.92);
      display: grid; place-items: center;
      z-index: 200;
      animation: fade .25s ease;
    }
    .lightbox img {
      max-width: 90vw; max-height: 85vh;
      border-radius: 8px;
      box-shadow: 0 20px 60px rgba(0,0,0,.6);
    }
    .lb-close, .lb-nav {
      position: absolute;
      background: rgba(255,255,255,.1);
      border: none; color: #fff;
      width: 48px; height: 48px;
      display: grid; place-items: center;
      border-radius: 50%;
      cursor: pointer;
      transition: background .2s;
    }
    .lb-close:hover, .lb-nav:hover { background: rgba(255,255,255,.25); }
    .lb-close { top: 24px; right: 24px; }
    .lb-nav.prev { left: 24px; top: 50%; transform: translateY(-50%); }
    .lb-nav.next { right: 24px; top: 50%; transform: translateY(-50%); }
    @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
    @media (max-width: 900px) { .masonry { column-count: 2; } }
    @media (max-width: 600px) { .masonry { column-count: 1; } }
  `]
})
export class GalleryComponent {
  filter = signal<'all' | 'wedding' | 'reception' | 'event'>('all');
  active = signal<number | null>(null);

  photos: Photo[] = [
    { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900', category: 'wedding', alt: 'Wedding decor' },
    { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=900', category: 'wedding', alt: 'Wedding mandap' },
    { src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900', category: 'reception', alt: 'Reception dinner' },
    { src: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=900', category: 'reception', alt: 'Reception couple' },
    { src: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=900', category: 'event', alt: 'Event lighting' },
    { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900', category: 'event', alt: 'Event arrangement' },
    { src: 'https://images.unsplash.com/photo-1519741347686-c1e30c5b04f6?w=900', category: 'wedding', alt: 'Wedding flowers' },
    { src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=900', category: 'wedding', alt: 'Bride and groom' },
    { src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900', category: 'reception', alt: 'Reception stage' },
    { src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900', category: 'event', alt: 'Stage lighting' },
    { src: 'https://images.unsplash.com/photo-1542665952-14513db15293?w=900', category: 'wedding', alt: 'Wedding lawn' },
    { src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=900', category: 'reception', alt: 'Couple dance' }
  ];

  visible = () => this.filter() === 'all'
    ? this.photos
    : this.photos.filter(p => p.category === this.filter());

  open(i: number)  { this.active.set(i); }
  close()          { this.active.set(null); }
  next()           {
    const n = this.visible().length;
    this.active.update(v => v === null ? null : (v + 1) % n);
  }
  prev()           {
    const n = this.visible().length;
    this.active.update(v => v === null ? null : (v - 1 + n) % n);
  }
}
