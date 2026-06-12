import { Component } from '@angular/core';
import { RouterOutlet, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FloatingContactComponent } from './components/floating-contact/floating-contact.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, FloatingContactComponent],
  template: `
    <app-header *ngIf="showShell" />
    <main [class.with-shell]="showShell">
      <router-outlet />
    </main>
    <app-footer *ngIf="showShell" />
    <app-floating-contact *ngIf="showShell" />
  `,
  styles: [`
    main { min-height: calc(100vh - 80px); }
    main.with-shell { padding-top: 80px; }
  `]
})
export class AppComponent {
  showShell = true;
  constructor(router: Router) {
    router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e) => {
        const url = (e as NavigationEnd).urlAfterRedirects;
        this.showShell = !url.startsWith('/admin');
      });
  }
}
