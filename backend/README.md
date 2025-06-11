# Lapor Parkir Backend

Minimal Fastify API for parking violation reports.

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

- `GET /` - Health check
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
