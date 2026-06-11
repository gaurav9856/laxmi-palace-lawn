export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface Booking {
  id: number;
  event_date: string;
  event_type: string;
  guest_count: number;
  status: BookingStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  customer_id: number;
  customer_name: string;
  customer_mobile: string;
  customer_email?: string | null;
}

export interface BookingCreateRequest {
  name: string;
  mobile: string;
  email?: string;
  eventDate: string;   // YYYY-MM-DD
  eventType: string;
  guestCount: number;
  notes?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface AvailabilityResponse extends ApiResponse {
  available: boolean;
  reason?: 'BOOKED' | 'BLOCKED';
}

export interface DashboardStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
  upcoming: number;
  monthlyRevenue: number;
}

export interface BlockedDate {
  id: number;
  blocked_date: string;
  reason?: string | null;
  created_at: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
}
