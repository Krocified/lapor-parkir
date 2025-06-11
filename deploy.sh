#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploying Lapor Parkir to Vercel...${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI is not installed!${NC}"
    echo -e "${YELLOW}Install it with: npm install -g vercel${NC}"
    exit 1
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}🔐 Please login to Vercel first...${NC}"
    vercel login
fi

# Deploy Backend First
echo -e "${BLUE}📡 Deploying Backend...${NC}"
cd backend

# Install backend dependencies
echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend dependency installation failed!${NC}"
    exit 1
fi

# Deploy backend to production
echo -e "${YELLOW}🌍 Deploying backend to production...${NC}"
BACKEND_URL=$(vercel --prod --yes | grep -o 'https://[^[:space:]]*')

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend deployment failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend deployed to: ${BACKEND_URL}${NC}"

# Go back to root directory
cd ..

# Update Frontend API Configuration
echo -e "${BLUE}🔧 Updating frontend API configuration...${NC}"

# Update the production API URL in frontend config
sed -i.bak "s|API_BASE_URL: 'https://.*\.vercel\.app/api'|API_BASE_URL: '${BACKEND_URL}/api'|g" frontend/src/config/api.js

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend API configuration updated!${NC}"
    rm frontend/src/config/api.js.bak 2>/dev/null
else
    echo -e "${YELLOW}⚠️ Could not auto-update API config. Please manually update:${NC}"
    echo -e "${YELLOW}   frontend/src/config/api.js${NC}"
    echo -e "${YELLOW}   Set production API_BASE_URL to: ${BACKEND_URL}/api${NC}"
fi

# Deploy Frontend to existing Vercel project
echo -e "${BLUE}📱 Deploying Frontend to existing Vercel project...${NC}"
cd frontend

# Install frontend dependencies
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend dependency installation failed!${NC}"
    exit 1
fi

# Build the web version using npm run build:web
echo -e "${YELLOW}🏗️ Building frontend with npm run build:web...${NC}"
npm run build:web

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend build successful!${NC}"

# Deploy to existing Vercel project (lapor-parkir)
echo -e "${YELLOW}🌍 Deploying to existing Vercel project (lapor-parkir)...${NC}"
FRONTEND_URL=$(vercel --prod --yes | grep -o 'https://[^[:space:]]*')

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend deployment failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend deployed to: ${FRONTEND_URL}${NC}"

# Go back to root
cd ..

# Commit the API config changes
echo -e "${BLUE}💾 Committing configuration changes...${NC}"
git add frontend/src/config/api.js
if ! git diff-index --quiet HEAD --; then
    git commit -m "Deploy: Update API configuration for production - $(date '+%Y-%m-%d %H:%M:%S')"
    git push origin main
fi

# Success summary
echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📱 Frontend App:${NC} ${FRONTEND_URL}"
echo -e "${BLUE}📡 Backend API:${NC} ${BACKEND_URL}"
echo -e "${BLUE}🔍 API Health Check:${NC} ${BACKEND_URL}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo -e "1. Test your app at: ${FRONTEND_URL}"
echo -e "2. Verify API health: ${BACKEND_URL}"
echo -e "3. Check environment variables in Vercel dashboard if needed"
echo ""
