# Vercel Deployment Guide for Scrapify

This guide will help you deploy your Scrapify application to Vercel.

## Prerequisites

- A Vercel account ([sign up here](https://vercel.com/signup))
- A GitHub, GitLab, or Bitbucket account (for Git integration)
- Upstash Redis database credentials
- Google AI API key (for Gemini)

## Step 1: Prepare Your Repository

1. **Commit all your changes** to your Git repository:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Vercel will auto-detect Next.js and configure the project
5. **Configure Environment Variables** (see Step 3 below)
6. Click **"Deploy"**

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy your project:
   ```bash
   vercel
   ```

4. Follow the prompts to link your project

5. For production deployment:
   ```bash
   vercel --prod
   ```

## Step 3: Configure Environment Variables

In your Vercel project dashboard, go to **Settings → Environment Variables** and add the following:

### Required Environment Variables

1. **Google AI API Key** (for Gemini AI)
   - Variable Name: `GOOGLE_GENAI_API_KEY`
   - Value: Your Google AI API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Environment: Production, Preview, Development

2. **Upstash Redis URL**
   - Variable Name: `UPSTASH_REDIS_REST_URL`
   - Value: Your Upstash Redis REST URL
   - Environment: Production, Preview, Development

3. **Upstash Redis Token**
   - Variable Name: `UPSTASH_REDIS_REST_TOKEN`
   - Value: Your Upstash Redis REST Token
   - Environment: Production, Preview, Development

### How to Get Your API Keys

#### Google AI API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

#### Upstash Redis Credentials
1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database (or use existing)
3. Go to your database dashboard
4. Copy the **REST URL** and **REST Token** from the "REST API" section

## Step 4: Verify Deployment

1. After deployment, Vercel will provide you with a deployment URL
2. Visit your deployed application
3. Test the scraping functionality
4. Check that AI summarization and classification are working

## Step 5: Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to **Domains**
3. Add your custom domain
4. Follow the DNS configuration instructions

## Troubleshooting

### Build Errors

- **TypeScript Errors**: The project is configured to ignore build errors (`ignoreBuildErrors: true`), but check the build logs for any critical issues
- **Missing Environment Variables**: Ensure all required environment variables are set in Vercel dashboard

### Runtime Errors

- **Redis Connection Issues**: Verify your Upstash Redis credentials are correct
- **AI API Errors**: Check that your Google AI API key is valid and has sufficient quota
- **CORS Issues**: Vercel handles CORS automatically for Next.js API routes

### Function Timeout

- Vercel has a default timeout of 10 seconds for Hobby plan, 60 seconds for Pro
- If scraping large pages, consider upgrading your plan or optimizing the scraping logic

## Additional Configuration

### Build Settings

The project is already configured with:
- **Framework**: Next.js (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default)

### Performance Optimization

- Vercel automatically optimizes Next.js applications
- Images are optimized via Next.js Image component
- API routes run as serverless functions

## Support

For Vercel-specific issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)

For project-specific issues, refer to the main README.md

