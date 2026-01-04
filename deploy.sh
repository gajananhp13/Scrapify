#!/bin/bash
# Vercel Deployment Script
# Run this after authenticating with: vercel login

echo "🚀 Starting Vercel deployment..."

# Deploy to preview environment first
echo "📦 Deploying to preview environment..."
vercel

# Ask if user wants to deploy to production
read -p "Deploy to production? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🚀 Deploying to production..."
    vercel --prod
    echo "✅ Production deployment complete!"
else
    echo "✅ Preview deployment complete!"
fi

