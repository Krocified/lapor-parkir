# Deploy Backend to Vercel

## Prerequisites

1. Install Vercel CLI globally:

   ```bash
   npm install -g vercel
   ```

2. Create a Vercel account at [vercel.com](https://vercel.com)

3. **Environment Setup**: The backend uses environment variables from the root directory. Make sure you have a `.env` file in the root:

   ```bash
   # From project root
   cp .env.example .env
   # Edit .env with your values
   ```

## Deployment Steps

### 1. Login to Vercel

```bash
vercel login
```

### 2. Deploy from Backend Directory

```bash
cd backend
npm install
vercel
```

### 3. Follow the prompts:

- **Set up and deploy project?** → Yes
- **Which scope?** → Select your account/team
- **Link to existing project?** → No
- **Project name** → Use default or choose a name (e.g., `lapor-parkir-api`)
- **Directory** → `./` (current directory)

### 4. Production Deployment

```bash
npm run deploy
# or
vercel --prod
```

## After Deployment

1. **Copy the deployment URL** (e.g., `https://lapor-parkir-api-xyz123.vercel.app`)

2. **Set Environment Variables in Vercel Dashboard**:

   - Go to your project in Vercel dashboard
   - Settings → Environment Variables
   - Add these variables:
     - `SUPPORT_EMAIL` → your-email@example.com
     - `GITHUB_URL` → https://github.com/yourusername/lapor-parkir
     - `NODE_ENV` → production
     - `PORT` → 3000

3. **Update Frontend Configuration**:
   Edit `frontend/src/config/api.js`:

   ```javascript
   production: {
     API_BASE_URL: 'https://your-actual-vercel-url.vercel.app/api',
   },
   ```

4. **Test the API**:
   ```bash
   curl https://lapor-parkir.vercel.app/
   curl https://lapor-parkir.vercel.app/api/reports
   ```

## Environment Variables

**Required in Vercel Dashboard:**

- `NODE_ENV=production`
- `PORT=3000`

**Optional but recommended:**

- `SUPPORT_EMAIL=your-email@example.com`
- `GITHUB_URL=https://github.com/yourusername/lapor-parkir`

## Useful Commands

```bash
# Preview deployment
npm run deploy-preview

# Production deployment
npm run deploy

# Check deployment status
vercel ls

# View logs
vercel logs
```

## Notes

- **Environment Variables**: Backend reads from root directory's .env in development, but uses Vercel environment variables in production
- **Serverless Limitations**: Data is stored in memory and will reset on each deployment
- **Database**: Consider adding a database (MongoDB, PostgreSQL) for persistent storage
- **CORS**: Configured to allow all origins - restrict in production if needed
- **Rate Limiting**: Consider adding rate limiting for production use
