# Laxmi Palace Lawn, Chakia — Full-Stack Booking Website

A production-ready website for Laxmi Palace Lawn featuring an elegant public site,
a real-time booking calendar, and a secure admin dashboard.

## Stack
- **Frontend:** Angular 20+ (standalone components) · Angular Material · TypeScript · responsive SCSS
- **Backend:** Node.js · Express · REST API · JWT auth · express-validator · helmet · rate-limit
- **Database:** MySQL 8.0 (connection pooling via `mysql2`)
- **Theme:** Luxury gold + maroon, Playfair Display + Poppins typography

## Project Structure
```
laxmi-palace-lawn/
├── backend/             Node.js + Express API
├── frontend/            Angular 20 application
├── database/
│   ├── schema.sql       MySQL schema (run first)
│   └── seed.sql         Sample seed data
├── README.md
└── DEPLOYMENT.md
```

## Features

### Public Site
- Hero banner, About, Services grid, Gallery preview, Testimonials, Contact + Google Maps
- About page with capacity, facilities, parking info
- Filterable gallery with lightbox (Wedding / Reception / Event)
- **Booking** page with monthly + yearly calendar
  - 🟢 Green dates  = Available
  - 🔴 Red dates    = Already booked
  - ⚪ Gray dates   = Blocked / closed
  - Real-time availability check when a date is selected
  - Submit button disabled if the date is already booked
- Mobile responsive, SEO meta tags, smooth animations

### Booking Rules
- Only one booking per date (enforced at DB level with a unique index on approved bookings, and at API level inside a transaction with `SELECT ... FOR UPDATE`)
- If the date is already booked, the API returns:
  `"Laxmi Palace Lawn is already booked on this date"`
- Blocked dates cannot be booked

### Admin Dashboard (JWT-protected)
- Dashboard cards: Total bookings · Upcoming events · Pending requests · Available dates · Monthly revenue
- Bookings table with search + filter by status / date range
- One-click Approve / Reject / Cancel (with date re-check on approve)
- Block / unblock specific dates with a reason
- Role-based access (`SUPER_ADMIN`, `ADMIN`)

## Quick Start (Local)

### 1. Database
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env       # edit credentials
npm install
npm run seed               # creates super admin
npm run dev                # http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm start                  # http://localhost:4200
```

Default admin login: `admin@laxmipalace.in` / `Admin@123`
(change immediately in production — set `SEED_ADMIN_PASSWORD` in `.env` and rerun `npm run seed`)

## API Reference (summary)

| Method | Endpoint                                | Auth   | Description                          |
|--------|-----------------------------------------|--------|--------------------------------------|
| POST   | `/api/bookings`                         | public | Create booking request               |
| GET    | `/api/bookings/availability/:date`      | public | Check if a date is available         |
| GET    | `/api/bookings`                         | admin  | List with filters                    |
| GET    | `/api/bookings/stats`                   | admin  | Dashboard statistics                 |
| PUT    | `/api/bookings/:id/approve`             | admin  | Approve (re-checks date)             |
| PUT    | `/api/bookings/:id/reject`              | admin  | Reject                               |
| PUT    | `/api/bookings/:id/cancel`              | admin  | Cancel                               |
| POST   | `/api/admin/login`                      | public | JWT login                            |
| GET    | `/api/admin/me`                         | admin  | Current admin info                   |
| GET    | `/api/calendar/booked-dates?from&to`    | public | Booked + blocked dates for calendar  |
| GET    | `/api/blocked-dates`                    | public | List blocked dates                   |
| POST   | `/api/blocked-dates`                    | admin  | Block a date                         |
| DELETE | `/api/blocked-dates/:id`                | admin  | Unblock a date                       |

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment instructions.
