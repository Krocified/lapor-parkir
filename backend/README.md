# Lapor Parkir Backend

Minimal Fastify API for parking violation reports.

## Configuration

The backend uses environment variables from the root directory (../.env).
Copy the root .env.example to .env and configure as needed:

```bash
# From the root directory
cp .env.example .env
```

Environment variables used:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `SUPPORT_EMAIL` - Support contact email
- `GITHUB_URL` - GitHub repository URL

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or start production server
npm start
```

## API Endpoints

- `GET /` - Health check (includes environment info)
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Create new report
- `GET /api/reports/:id` - Get specific report
- `DELETE /api/reports/:id` - Delete report

## Example Request

```bash
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "licensePlate": "ABC123",
    "violations": ["Double Parking", "No Parking Zone"],
    "location": "Main St & 1st Ave",
    "notes": "Blocking traffic"
  }'
```

Server runs on http://localhost:3000

The server will log the configured support email and GitHub URL on startup.
