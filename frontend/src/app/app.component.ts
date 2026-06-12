import { Component } from '@angular/core';
import { RouterOutlet, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FloatingContactComponent } from './components/floating-contact/floating-contact.component';
import { MobileBookCtaComponent } from './components/mobile-book-cta/mobile-book-cta.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet,
    HeaderComponent, FooterComponent,
    FloatingContactComponent, MobileBookCtaComponent
  ],
  template: `
    <app-header *ngIf="showShell" />
    <main [class.with-shell]="showShell" [class.with-mobile-cta]="showMobileCta">
      <router-outlet />
    </main>
    <app-footer *ngIf="showShell" />
    <app-floating-contact *ngIf="showShell" [class.lifted]="showMobileCta" />
    <app-mobile-book-cta *ngIf="showMobileCta" />
  `,
  styles: [`
    main { min-height: calc(100vh - 80px); }
    main.with-shell { padding-top: 80px; }
    /* When mobile CTA is visible, add bottom padding so footer/content isn't hidden behind the bar */
    @media (max-width: 720px) {
      main.with-mobile-cta { padding-bottom: 88px; }
    }
    /* Push floating contact above the sticky CTA bar */
    @media (max-width: 720px) {
      :host ::ng-deep .lifted .fab-wrap { bottom: calc(88px + env(safe-area-inset-bottom)) !important; }
    }
  `]
})
export class AppComponent {
  showShell = true;
  showMobileCta = false;

  constructor(router: Router) {
    router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e) => {
        const url = (e as NavigationEnd).urlAfterRedirects;
        this.showShell = !url.startsWith('/admin');
        // Hide CTA on the booking page itself + on admin
        this.showMobileCta = this.showShell && !url.startsWith('/booking');
      });
  }
}
