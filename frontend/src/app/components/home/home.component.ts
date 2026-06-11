import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

interface Service {
  icon: string;
  title: string;
  description: string;
}
interface Testimonial {
  name: string;
  event: string;
  message: string;
  rating: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  mapUrl: SafeResourceUrl;

  services: Service[] = [
    { icon: 'favorite', title: 'Wedding Ceremonies',
      description: 'Make your wedding day truly unforgettable in our elegantly decorated lawn.' },
    { icon: 'celebration', title: 'Reception Parties',
      description: 'Host grand receptions with state-of-the-art lighting and catering.' },
    { icon: 'cake', title: 'Engagement & Tilak',
      description: 'Intimate or grand pre-wedding celebrations with traditional touch.' },
    { icon: 'business_center', title: 'Corporate Events',
      description: 'Professional setup for conferences, product launches and team events.' },
    { icon: 'school', title: 'Birthday & Anniversaries',
      description: 'Personalised setup for milestone celebrations of every kind.' },
    { icon: 'star', title: 'Cultural Functions',
      description: 'Open-air mandap and stage for cultural and religious gatherings.' }
  ];

  galleryPreview: string[] = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600',
    'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=600',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=600',
    'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600'
  ];

  testimonials: Testimonial[] = [
    { name: 'Anjali & Vikram', event: 'Wedding · Dec 2025', rating: 5,
      message: 'Laxmi Palace turned our dream wedding into reality. Spacious lawn, beautiful décor, and very supportive staff.' },
    { name: 'Sunita Devi', event: 'Engagement · Oct 2025', rating: 5,
      message: 'Best venue in Chakia. The arrangement was elegant and the food was loved by every guest.' },
    { name: 'Mahesh Singh', event: 'Birthday · Sept 2025', rating: 4,
      message: 'Perfect location with ample parking. The team handled everything professionally.' }
  ];

  constructor(sanitizer: DomSanitizer) {
    this.mapUrl = sanitizer.bypassSecurityTrustResourceUrl(environment.mapsEmbedUrl);
  }
}
