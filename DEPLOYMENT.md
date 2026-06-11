# Deployment Guide — Laxmi Palace Lawn

This guide covers production deployment on a single Linux VPS (Ubuntu 22.04+)
with Nginx as a reverse proxy + static host, PM2 for the Node API, and MySQL 8 as the database.

## 1. Server Prerequisites

```bash
# System
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl ufw git build-essential

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# MySQL 8
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Nginx + PM2
sudo apt install -y nginx
sudo npm install -g pm2

# Firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 2. Database Setup

```bash
sudo mysql -u root -p
```
```sql
CREATE USER 'laxmi_app'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON laxmi_palace_lawn.* TO 'laxmi_app'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```
```bash
mysql -u laxmi_app -p < database/schema.sql
mysql -u laxmi_app -p < database/seed.sql
```

## 3. Backend Deployment

```bash
cd /var/www
sudo git clone https://your-repo-url laxmi-palace
sudo chown -R $USER:$USER laxmi-palace
cd laxmi-palace/backend
npm ci --omit=dev
cp .env.example .env
```

Edit `.env`:
```
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://laxmipalace.in

DB_HOST=localhost
DB_USER=laxmi_app
DB_PASSWORD=STRONG_PASSWORD_HERE
DB_NAME=laxmi_palace_lawn

JWT_SECRET=GENERATE_A_LONG_RANDOM_STRING_HERE
JWT_EXPIRES_IN=8h

SEED_ADMIN_NAME=Your Name
SEED_ADMIN_EMAIL=you@laxmipalace.in
SEED_ADMIN_PASSWORD=ChooseAStrongPassword!
```

Seed the admin and start with PM2:
```bash
node src/utils/seedAdmin.js
pm2 start src/server.js --name laxmi-api
pm2 save
pm2 startup systemd            # follow the printed command
```

## 4. Frontend Build

```bash
cd /var/www/laxmi-palace/frontend
npm ci
# Update src/environments/environment.prod.ts -> apiUrl: '/api'
npm run build
```

Build output lands in `dist/laxmi-palace-frontend/browser/`.

## 5. Nginx Configuration

`/etc/nginx/sites-available/laxmipalace.in`:
```nginx
server {
    listen 80;
    server_name laxmipalace.in www.laxmipalace.in;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name laxmipalace.in www.laxmipalace.in;

    # ssl_certificate     /etc/letsencrypt/live/laxmipalace.in/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/laxmipalace.in/privkey.pem;

    root /var/www/laxmi-palace/frontend/dist/laxmi-palace-frontend/browser;
    index index.html;

    # Angular SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API reverse proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache static assets
    location ~* \.(?:css|js|woff2?|svg|gif|png|jpg|jpeg|webp|ico)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    client_max_body_size 5m;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
}
```

Enable + reload:
```bash
sudo ln -s /etc/nginx/sites-available/laxmipalace.in /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 6. SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d laxmipalace.in -d www.laxmipalace.in
sudo systemctl enable --now certbot.timer
```

## 7. Post-Deployment Checklist

- [ ] Change default admin password (rerun `seedAdmin.js` with new `SEED_ADMIN_PASSWORD`)
- [ ] Rotate the `JWT_SECRET` to a long random string (`openssl rand -base64 48`)
- [ ] Confirm only ports 22, 80, 443 are exposed
- [ ] Configure MySQL automated backups (e.g. nightly `mysqldump` + offsite copy)
- [ ] Set up monitoring with `pm2 monit` or external uptime service
- [ ] Replace placeholder Google Maps URL in `environment.prod.ts` with the actual embed URL
- [ ] Replace stock photo URLs in `home.component.ts` / `gallery.component.ts` with real venue photos
- [ ] Verify the contact phone, email and address everywhere

## 8. Operating

```bash
pm2 status                       # see API health
pm2 logs laxmi-api                # tail logs
pm2 restart laxmi-api             # restart API after .env changes
sudo nginx -s reload              # apply Nginx config changes

# Update workflow
cd /var/www/laxmi-palace
git pull
cd backend && npm ci --omit=dev && pm2 restart laxmi-api
cd ../frontend && npm ci && npm run build
```

## 9. Backup & Restore

```bash
# Backup
mysqldump -u laxmi_app -p laxmi_palace_lawn > backup-$(date +%F).sql

# Restore
mysql -u laxmi_app -p laxmi_palace_lawn < backup-2026-06-11.sql
```

## 10. Security Notes

- Backend uses `helmet`, CORS allow-list, `express-rate-limit` on public endpoints, bcrypt password hashes, JWT auth, parameterised SQL queries and input validation via `express-validator`.
- Approve endpoint runs inside a transaction with `SELECT ... FOR UPDATE` to avoid race conditions on the same date.
- The database also enforces "one approved booking per date" with a generated-column unique index.
- Always serve the site over HTTPS in production; the frontend stores the JWT in `localStorage` — keep XSS attack surface minimal (the codebase uses Angular's default sanitisation; no `bypassSecurityTrustHtml` calls in user-facing output paths).
