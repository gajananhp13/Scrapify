# Vercel Deployment Script for PowerShell
# Run this after authenticating with: vercel login

Write-Host "🚀 Starting Vercel deployment..." -ForegroundColor Green

# Deploy to preview environment first
Write-Host "📦 Deploying to preview environment..." -ForegroundColor Yellow
vercel

# Ask if user wants to deploy to production
$deployProd = Read-Host "Deploy to production? (y/n)"
if ($deployProd -eq "y" -or $deployProd -eq "Y") {
    Write-Host "🚀 Deploying to production..." -ForegroundColor Yellow
    vercel --prod
    Write-Host "✅ Production deployment complete!" -ForegroundColor Green
} else {
    Write-Host "✅ Preview deployment complete!" -ForegroundColor Green
}

