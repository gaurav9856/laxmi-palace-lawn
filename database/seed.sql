-- =====================================================
-- Seed Data for Laxmi Palace Lawn
-- =====================================================
USE laxmi_palace_lawn;

-- Default super admin
-- Password: Admin@123  (bcrypt hash, cost 10)
INSERT INTO admins (name, email, password_hash, role) VALUES
  ('Super Admin', 'admin@laxmipalace.in',
   '$2a$10$f3pX0YxN.J9pkV2AfM67XO5SgWtH1JpqfHFkD4jVKnLqYcG2x3MtO',
   'SUPER_ADMIN');

-- Sample blocked dates (festivals / maintenance)
INSERT INTO blocked_dates (blocked_date, reason) VALUES
  ('2026-10-20', 'Diwali - Closed'),
  ('2026-03-25', 'Holi - Closed');

-- Sample customer & booking
INSERT INTO customers (name, mobile, email) VALUES
  ('Rajesh Kumar', '9876543210', 'rajesh@example.com');

INSERT INTO bookings (customer_id, event_date, event_type, guest_count, status, notes) VALUES
  (1, '2026-12-15', 'Wedding', 500, 'APPROVED', 'Sample wedding booking');

INSERT INTO payments (booking_id, amount, payment_status) VALUES
  (1, 150000.00, 'PENDING');
