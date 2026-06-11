import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="login-shell">
      <div class="card login-card">
        <div class="brand">
          <span class="mark">L</span>
          <strong>Laxmi Palace</strong>
          <small>Admin Portal</small>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" autocomplete="username" required>
            <mat-icon matSuffix>email</mat-icon>
            <mat-error *ngIf="form.controls.email.invalid">Enter a valid email</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" [type]="show() ? 'text' : 'password'" autocomplete="current-password" required>
            <button type="button" matSuffix mat-icon-button (click)="show.set(!show())" aria-label="Toggle password">
              <mat-icon>{{ show() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="form.controls.password.invalid">Password is required</mat-error>
          </mat-form-field>

          <p class="err" *ngIf="error()">{{ error() }}</p>

          <button mat-raised-button color="primary" type="submit"
                  class="btn-luxury submit"
                  [disabled]="form.invalid || loading()">
            <mat-spinner *ngIf="loading()" diameter="20" class="spin"></mat-spinner>
            <ng-container *ngIf="!loading()">
              <mat-icon>login</mat-icon> Sign In
            </ng-container>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-shell {
      min-height: 100vh;
      display: grid; place-items: center;
      background:
        linear-gradient(135deg, rgba(74,10,28,.8), rgba(107,16,41,.85)),
        url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1920') center/cover;
      padding: 2rem;
    }
    .login-card { width: 100%; max-width: 420px; padding: 2.5rem; }
    .brand { text-align: center; margin-bottom: 2rem; }
    .brand .mark {
      display: inline-grid; place-items: center;
      width: 64px; height: 64px;
      font-family: var(--font-display);
      font-size: 2rem; color: #fff;
      background: linear-gradient(135deg, var(--color-gold), var(--color-maroon));
      border-radius: 50%;
      margin-bottom: .5rem;
    }
    .brand strong {
      display: block;
      font-family: var(--font-display);
      font-size: 1.5rem;
      color: var(--color-maroon-dark);
    }
    .brand small { color: var(--color-gold); letter-spacing: 2px; text-transform: uppercase; }
    .full { width: 100%; }
    .err {
      background: #fdecea; color: #c62828;
      padding: .75rem 1rem; border-radius: 6px;
      margin: .5rem 0 1rem;
      font-size: .9rem;
    }
    .submit { width: 100%; justify-content: center; margin-top: .5rem; }
    .spin { margin-right: .5rem; }
  `]
})
export class AdminLoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  show = signal(false);
  loading = signal(false);
  error = signal('');

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/admin/dashboard']);
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Invalid credentials');
      }
    });
  }
}
