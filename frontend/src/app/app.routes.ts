import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'Laxmi Palace Lawn, Chakia | Luxury Wedding Venue'
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent),
    title: 'About | Laxmi Palace Lawn'
  },
  {
    path: 'gallery',
    loadComponent: () => import('./components/gallery/gallery.component').then(m => m.GalleryComponent),
    title: 'Gallery | Laxmi Palace Lawn'
  },
  {
    path: 'booking',
    loadComponent: () => import('./components/booking/booking.component').then(m => m.BookingComponent),
    title: 'Book Your Event | Laxmi Palace Lawn'
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./components/admin-login/admin-login.component').then(m => m.AdminLoginComponent),
    title: 'Admin Login'
  },
  {
    path: 'admin/dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    title: 'Admin Dashboard'
  },
  { path: '**', redirectTo: '' }
];
