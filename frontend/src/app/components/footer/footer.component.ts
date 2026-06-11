import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <h3>Laxmi Palace Lawn</h3>
          <p>A premier wedding & event venue in Chakia. Where every celebration becomes a memory.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a routerLink="/">Home</a></li>
            <li><a routerLink="/about">About</a></li>
            <li><a routerLink="/gallery">Gallery</a></li>
            <li><a routerLink="/booking">Book Now</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul class="contact">
            <li><mat-icon>place</mat-icon> Main Road, Chakia, Uttar Pradesh</li>
            <li><mat-icon>call</mat-icon> +91 98765 43210</li>
            <li><mat-icon>email</mat-icon> info&#64;laxmipalace.in</li>
          </ul>
        </div>
      </div>
      <div class="copyright">
        &copy; {{ year }} Laxmi Palace Lawn, Chakia. All rights reserved.
        &nbsp;|&nbsp; <a routerLink="/admin/login">Admin</a>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      background: linear-gradient(135deg, var(--color-maroon-dark), var(--color-maroon));
      color: #f8e9d2;
      padding: 3rem 0 1rem;
      margin-top: 4rem;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1.5fr;
      gap: 2rem;
    }
    .site-footer h3, .site-footer h4 { color: var(--color-gold); }
    .site-footer h3 { font-size: 1.5rem; }
    .site-footer ul { list-style: none; padding: 0; margin: 0; }
    .site-footer ul li { margin: .5rem 0; display: flex; align-items: center; gap: .5rem; }
    .site-footer a { color: #f8e9d2; }
    .site-footer a:hover { color: var(--color-gold); }
    .contact mat-icon { font-size: 1.1rem; color: var(--color-gold); }
    .copyright {
      text-align: center;
      padding: 1.25rem 1rem 0;
      margin-top: 2rem;
      border-top: 1px solid rgba(255,255,255,.1);
      font-size: .9rem;
    }
    @media (max-width: 768px) {
      .footer-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
}
