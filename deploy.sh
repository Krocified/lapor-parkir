#!/bin/bash

# Build the web version
echo "🏗️  Building web version..."
npx expo export --platform web

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Add dist folder to git and deploy to gh-pages branch
echo "🚀 Deploying to GitHub Pages..."

# Add all changes
git add .

# Commit changes (if any)
if ! git diff-index --quiet HEAD --; then
    git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Push to main branch
git push origin main

# Deploy to gh-pages using subtree
git subtree push --prefix dist origin gh-pages

echo "🎉 Deployment complete!"
echo "Your app will be available at: https://Krocified.github.io/lapor-parkir"
