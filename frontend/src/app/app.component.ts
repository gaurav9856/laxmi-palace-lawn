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
    main { min-height: calc(100vh - 64px); }
    /* Push content below fixed header */
    main.with-shell { padding-top: 80px; }
    @media (max-width: 880px) {
      main.with-shell { padding-top: 64px; }
    }
    /* Add bottom padding when sticky mobile CTA is visible */
    @media (max-width: 720px) {
      main.with-mobile-cta { padding-bottom: 80px; }
    }
    /* Lift floating contact above the sticky bottom CTA */
    @media (max-width: 720px) {
      :host ::ng-deep .lifted .fab-wrap { bottom: 80px !important; }
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
        this.showMobileCta = this.showShell && !url.startsWith('/booking');
      });
  }
}
