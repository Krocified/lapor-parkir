# Production Deployment Guide

## 🚀 Traditional Server Deployment (VPS/Cloud Instance)

### Prerequisites

1. **Server with Node.js 18+**

   - Ubuntu/Debian VPS
   - Cloud instance (AWS EC2, DigitalOcean, etc.)
   - Local server

2. **MongoDB Atlas** (or self-hosted MongoDB)
   - Follow [DATABASE_SETUP.md](./DATABASE_SETUP.md)

### Quick Setup

```bash
# 1. Clone and setup
git clone <your-repo>
cd lapor-parkir

# 2. Install dependencies
cd backend
npm install

# 3. Configure environment
cp ../.env.example ../.env
# Edit .env with your values

# 4. Test connection
npm run dev

# 5. Run in production
npm run prod
```

## 🔧 Environment Configuration

**Required Variables (.env):**

```bash
# Backend
PORT=3000
HOST=0.0.0.0
NODE_ENV=production

# Frontend (your deployed frontend URL)
FRONTEND_URL=https://your-frontend-domain.com

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/...

# Optional
SUPPORT_EMAIL=your-email@example.com
GITHUB_URL=https://github.com/yourusername/lapor-parkir
```

## 🖥️ Available Scripts

```bash
# Development with auto-reload
npm run dev

# Production with nodemon (recommended)
npm run prod

# Production with node (basic)
npm start
```

## 🌐 Production Setup Examples

### 1. PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start with PM2
cd backend
pm2 start npm --name "lapor-parkir-api" -- run prod

# PM2 commands
pm2 status           # Check status
pm2 logs lapor-parkir-api  # View logs
pm2 restart lapor-parkir-api  # Restart
pm2 stop lapor-parkir-api     # Stop
pm2 delete lapor-parkir-api   # Remove
```

### 2. Systemd Service

Create `/etc/systemd/system/lapor-parkir.service`:

```ini
[Unit]
Description=Lapor Parkir API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/lapor-parkir/backend
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
sudo systemctl enable lapor-parkir
sudo systemctl start lapor-parkir
sudo systemctl status lapor-parkir
```

### 3. Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ .
COPY .env .env

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t lapor-parkir-api .
docker run -d -p 3000:3000 --name lapor-parkir-api lapor-parkir-api
```

## 🔒 Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/lapor-parkir-api
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/lapor-parkir-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 📊 Health Monitoring

**Health Check Endpoint:**

```bash
curl http://your-server:3000/
```

**Response:**

```json
{
  "message": "Lapor Parkir API is running!",
  "environment": "production",
  "port": 3000,
  "database": "MongoDB Atlas",
  "reports_count": 42,
  "uptime": 3600.5
}
```

## 🔍 Troubleshooting

**Port already in use:**

```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

**Database connection issues:**

- Check MongoDB Atlas IP whitelist
- Verify connection string in .env
- Test connection: `curl http://localhost:3000/`

**CORS issues:**

- Set correct `FRONTEND_URL` in .env
- Ensure frontend URL matches exactly

**Logs with PM2:**

```bash
pm2 logs lapor-parkir-api --lines 100
```

## 🚀 Performance Tips

1. **Use PM2 cluster mode:**

   ```bash
   pm2 start npm --name "lapor-parkir-api" -i max -- run prod
   ```

2. **Enable MongoDB indexes:**

   - Add indexes in MongoDB Atlas dashboard
   - Index on `timestamp` for sorting

3. **Set up monitoring:**
   - PM2 monitoring: `pm2 plus`
   - Log aggregation
   - Uptime monitoring

## 🔄 Updates & Deployment

```bash
# Update process
git pull origin main
cd backend
npm install  # If dependencies changed
pm2 restart lapor-parkir-api
```

Your API will be running at `http://your-server:3000` 🚀
