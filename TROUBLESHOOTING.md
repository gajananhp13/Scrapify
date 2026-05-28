# Troubleshooting Guide

## Issue: Stats Showing Zero (Visitors and Scraped Links)

If your deployed application on Vercel shows **0 visitors** and **0 scraped links**, this is almost certainly due to missing Upstash Redis environment variables.

### Root Cause

The application uses Upstash Redis to store visitor counts and scraped link statistics. Without the required environment variables, the stats API cannot connect to Redis and returns default values of 0.

### Solution

You need to configure Upstash Redis environment variables in your Vercel project:

#### Step 1: Get Upstash Redis Credentials

1. Go to [Upstash Console](https://console.upstash.com/)
2. Sign in or create an account
3. Create a new Redis database (or use an existing one)
4. Go to your database dashboard
5. Navigate to the **"REST API"** section
6. Copy the following:
   - **REST URL** (e.g., `https://your-db.upstash.io`)
   - **REST Token** (a long alphanumeric string)

#### Step 2: Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following two variables:

   **Variable 1:**
   - Name: `UPSTASH_REDIS_REST_URL`
   - Value: Your Upstash REST URL
   - Environment: Select **Production**, **Preview**, and **Development**

   **Variable 2:**
   - Name: `UPSTASH_REDIS_REST_TOKEN`
   - Value: Your Upstash REST Token
   - Environment: Select **Production**, **Preview**, and **Development**

4. Click **Save** for each variable

#### Step 3: Redeploy Your Application

After adding the environment variables:

1. Go to the **Deployments** tab in Vercel
2. Click the **"..."** menu on your latest deployment
3. Select **"Redeploy"**
4. Wait for the deployment to complete

Alternatively, you can trigger a new deployment by pushing a commit to your repository.

### Verification

After redeploying:

1. Visit your deployed application
2. The stats should start tracking:
   - Each visitor will increment the visitor count
   - Each scrape operation will increment the scraped links count
3. Check the browser console (F12) for any errors
4. Check Vercel function logs for Redis connection errors

### Additional Environment Variables

Make sure you also have these environment variables configured:

- `GOOGLE_GENAI_API_KEY` - Required for AI features (summarization, classification)
- `UPSTASH_REDIS_REST_URL` - Required for stats tracking
- `UPSTASH_REDIS_REST_TOKEN` - Required for stats tracking

### Testing Locally

To test locally, create a `.env.local` file in your project root:

```env
GOOGLE_GENAI_API_KEY=your_google_api_key
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

Then restart your development server.

### Common Issues

#### Issue: Stats still showing zero after adding variables

**Solution:**
- Make sure you redeployed after adding the variables
- Check that the variables are set for the correct environment (Production/Preview/Development)
- Verify the credentials are correct by checking Vercel function logs
- Ensure there are no typos in the variable names

#### Issue: Getting Redis connection errors

**Solution:**
- Verify your Upstash database is active and not paused
- Check that you copied the full URL and token (no extra spaces)
- Ensure your Upstash account has not exceeded its quota

#### Issue: Visitor count not incrementing

**Solution:**
- Visitor count increments once per browser session (uses sessionStorage)
- Try opening the site in an incognito/private window
- Check browser console for JavaScript errors
- Verify the `/api/stats` POST endpoint is being called

### Need More Help?

- Check the [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed deployment instructions
- Review [Upstash Documentation](https://docs.upstash.com/redis)
- Check Vercel function logs in your project dashboard under **Functions** tab

