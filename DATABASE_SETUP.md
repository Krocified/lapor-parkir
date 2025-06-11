# MongoDB Atlas Setup Guide

## 🚀 Quick Setup (5 minutes)

### 1. Create MongoDB Atlas Account

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Click **"Try Free"**
3. Sign up with email or Google
4. Choose **"Free"** plan (M0 Sandbox)

### 2. Create Your First Cluster

1. **Cloud Provider**: AWS (default)
2. **Region**: Choose closest to you
3. **Cluster Name**: `lapor-parkir-cluster` (or any name)
4. Click **"Create Cluster"** (takes 2-3 minutes)

### 3. Create Database User

1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. **Authentication Method**: Password
4. **Username**: `lapor-parkir-user`
5. **Password**: Generate secure password (save it!)
6. **Database User Privileges**: Read and write to any database
7. Click **"Add User"**

### 4. Configure Network Access

1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Choose **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 5. Get Connection String

1. Go to **Clusters** (Dashboard)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. **Driver**: Node.js
5. **Version**: 4.1 or later
6. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

### 6. Update Environment Variables

**Local Development** (`.env` in root):

```bash
MONGODB_URI=mongodb+srv://lapor-parkir-user:YOUR_PASSWORD@lapor-parkir-cluster.abc123.mongodb.net/?retryWrites=true&w=majority
```

**Vercel Production**:

1. Go to Vercel dashboard
2. Project Settings → Environment Variables
3. Add: `MONGODB_URI` with your connection string

## 🧪 Test Connection

```bash
# Start backend
cd backend
npm install
npm run dev

# Visit health check
curl http://localhost:3000/
# Should show: "database": "MongoDB Atlas", "reports_count": 0
```

## 📊 Database Structure

Your database will automatically create:

- **Database**: `lapor-parkir`
- **Collection**: `reports`

**Document Schema**:

```javascript
{
  _id: ObjectId,           // MongoDB auto-generated
  plateNumber: "ABC123",   // License plate
  licensePlate: "ABC123",  // Duplicate for API compatibility
  plateType: "regular",    // Plate type
  violations: ["Double Parking"], // Array of violations
  location: {
    address: "Main St & 1st Ave"
  },
  notes: "Additional notes",
  timestamp: "2024-01-15T10:30:00.000Z",
  date: "1/15/2024",
  time: "10:30:00 AM",
  createdAt: Date        // For sorting/indexing
}
```

## 🔒 Security Tips

1. **Never commit** your connection string to Git
2. **Use strong passwords** for database users
3. **Restrict IP access** in production (remove 0.0.0.0/0)
4. **Rotate passwords** regularly

## 📈 Free Tier Limits

- **Storage**: 512 MB
- **RAM**: Shared
- **Connections**: 500 max
- **Perfect for**: Development and small apps

## 🛠️ MongoDB Atlas Dashboard

- **Browse Collections**: View your data
- **Metrics**: Monitor performance
- **Logs**: Debug connection issues
- **Backup**: Automatic backups included

## 🚨 Troubleshooting

**Connection Failed?**

1. Check username/password in connection string
2. Verify IP whitelist (0.0.0.0/0 for development)
3. Ensure cluster is running (not paused)

**Slow queries?**

1. Add indexes in Atlas dashboard
2. Limit query results
3. Consider upgrading cluster

**Need help?**

- MongoDB Atlas documentation
- Community forums
- Built-in Atlas support chat
