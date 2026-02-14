# 🚀 Vercel Integration Guide - IELTS Practice App

## Method 1: GitHub Integration (Recommended) ⭐

This is the easiest and most automated way to deploy to Vercel.

### Step 1: Push Your Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - IELTS Practice App"

# Create a new repository on GitHub
# Go to https://github.com/new

# Add remote origin (replace with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ielts-practice.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com
   - Log in or create account (use GitHub login for easier integration)

2. **Import Your Repository**
   - Click "Add New..." → "Project"
   - Click "Import Git Repository"
   - Select your GitHub repository: `ielts-practice`
   - Click "Import"

3. **Configure Project Settings**

   **Framework Preset:** Next.js (auto-detected)
   
   **Root Directory:** `./` (leave as default)
   
   **Build Command:** `npm run build` (auto-filled)
   
   **Output Directory:** `.next` (auto-filled)
   
   **Install Command:** `npm install` (auto-filled)

4. **Add Environment Variables**

   Click "Environment Variables" section and add each variable:

   ```
   Variable Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://aqaapxdrmgjhoqlkwqkg.supabase.co
   
   Variable Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxYWFweGRybWdqaG9xbGt3cWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NjgwNjYsImV4cCI6MjA4NjU0NDA2Nn0.zpx0q7Ik-aY0yUmgVt4TIpvGrr2VPvQytUSnSeBcCcI
   
   Variable Name: SUPABASE_SERVICE_ROLE_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxYWFweGRybWdqaG9xbGt3cWtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTUxMDUxMCwiZXhwIjoyMDU1MDg2NTEwfQ.o6YEmIcmQACBCdH8bRQm5wU5nC4J1dRkNIDNH6_OTa4
   
   Variable Name: SUPABASE_DB_PASSWORD
   Value: kjmN3jSdqPR5D2SqsL8ZhvHxPQiYTkqX
   
   Variable Name: SUPABASE_ACCESS_TOKEN
   Value: sbp_1f5cf61baaf3f03d854c04baa8d6d16e9cac0c1c
   
   Variable Name: OPENAI_API_KEY
   Value: [Your OpenAI API Key - Get from https://platform.openai.com/api-keys]
   ```

   **Important:** For each variable:
   - Select "Production", "Preview", and "Development" environments
   - Click "Add" after entering each variable

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - You'll get a URL like: `https://ielts-practice-xyz123.vercel.app`

### Step 3: Configure Custom Domain (Optional)

1. **Add Domain**
   - Go to Project Settings → Domains
   - Click "Add Domain"
   - Enter your domain (e.g., `ielts-practice.com`)
   - Follow DNS configuration instructions

2. **Update Supabase Redirect URLs**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your Vercel domain to redirect URLs

---

## Method 2: Vercel CLI Deployment

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

This will:
- Open browser for authentication
- Link your local CLI to your Vercel account

### Step 3: Deploy from Command Line

```bash
# Navigate to your project directory
cd /path/to/ielts-practice

# Deploy to Vercel
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? ielts-practice (or your choice)
# - Directory? ./ (press Enter)
# - Override settings? No
```

### Step 4: Add Environment Variables via CLI

```bash
# Add each environment variable
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste the value when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste the value when prompted

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Paste the value when prompted

vercel env add SUPABASE_DB_PASSWORD
# Paste the value when prompted

vercel env add SUPABASE_ACCESS_TOKEN
# Paste the value when prompted

vercel env add OPENAI_API_KEY
# Paste the value when prompted

# For each variable, select:
# - Production? Yes
# - Preview? Yes
# - Development? Yes
```

### Step 5: Deploy to Production

```bash
# Deploy to production
vercel --prod
```

---

## 🔄 Continuous Deployment (Automatic Updates)

### With GitHub Integration (Recommended)

Once connected, Vercel automatically:

1. **Builds on Every Push**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   # Vercel automatically builds and deploys
   ```

2. **Preview Deployments for PRs**
   - Create a pull request
   - Vercel creates a preview deployment
   - Test before merging to main

3. **Production Deployment**
   - Merge PR to main branch
   - Vercel automatically deploys to production

### Manual Redeployment

```bash
# Redeploy from CLI
vercel --prod

# Or from Vercel Dashboard
# Go to Deployments → Click "..." → Redeploy
```

---

## 📊 Vercel Integrations You Can Add

### 1. Vercel Analytics

Track real user performance metrics.

```bash
# Install
npm install @vercel/analytics

# Add to src/pages/_app.tsx
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
      <Analytics /> {/* Add this line */}
      <Toaster />
    </ErrorBoundary>
  );
}
```

**Enable in Vercel:**
1. Project Settings → Analytics
2. Enable Analytics
3. View metrics in Analytics tab

### 2. Vercel Speed Insights

Monitor Core Web Vitals.

```bash
# Install
npm install @vercel/speed-insights

# Add to src/pages/_app.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights /> {/* Add this line */}
      <Toaster />
    </ErrorBoundary>
  );
}
```

### 3. Vercel Logs (Monitoring)

Real-time function logs and errors.

**Access:**
- Vercel Dashboard → Logs tab
- Filter by: Functions, Builds, Static
- Search logs in real-time

### 4. Environment Variables Management

**Update Variables:**
1. Project Settings → Environment Variables
2. Edit or add new variables
3. Redeploy to apply changes

**Using Different Values per Environment:**
```bash
# Production
OPENAI_API_KEY=sk-prod-xxxxx

# Preview
OPENAI_API_KEY=sk-preview-xxxxx

# Development
OPENAI_API_KEY=sk-dev-xxxxx
```

### 5. Custom Domains

**Add Multiple Domains:**
1. Settings → Domains
2. Add domain
3. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### 6. Team Collaboration

**Invite Team Members:**
1. Settings → Team
2. Invite members by email
3. Set permissions: Owner, Member, Viewer

### 7. Deployment Protection

**Password Protection:**
1. Settings → Deployment Protection
2. Enable "Password Protection"
3. Set password for preview deployments

**Trusted IPs:**
1. Settings → Deployment Protection
2. Add IP addresses that can access previews

### 8. Vercel Postgres (Optional Database)

Alternative to Supabase:

```bash
# Create Vercel Postgres database
vercel postgres create

# Connect to your project
vercel link

# Get connection string
vercel env pull
```

### 9. Vercel Blob Storage (Optional)

For file uploads:

```bash
npm install @vercel/blob

# Use in API routes
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  const { url } = await put('file.pdf', file, {
    access: 'public',
  });
  return Response.json({ url });
}
```

### 10. Vercel Edge Config

Fast, globally replicated configuration:

```bash
# Create Edge Config
vercel env add EDGE_CONFIG

# Use in your app
import { get } from '@vercel/edge-config';

export async function getFeatureFlag() {
  return await get('featureFlag');
}
```

---

## 🔐 Security Best Practices

### 1. Protect Environment Variables

**Never commit `.env.local` to Git:**
```bash
# Add to .gitignore (already included)
.env*.local
.env.production
```

### 2. Use Vercel Environment Variables

All sensitive data should be in Vercel Dashboard, not in code:
- ✅ API keys in Vercel
- ✅ Database credentials in Vercel
- ❌ Hardcoded secrets in code

### 3. Enable Deployment Protection

For staging/preview environments:
1. Settings → Deployment Protection
2. Enable password or trusted IPs

### 4. Set Up Rate Limiting

Add to API routes:
```typescript
// src/pages/api/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});
```

---

## 🐛 Troubleshooting Common Issues

### Build Fails

**Check Build Logs:**
1. Vercel Dashboard → Deployments
2. Click failed deployment
3. View build logs

**Common fixes:**
```bash
# Clear cache and redeploy
vercel --prod --force

# Check Node version
# Vercel uses Node 18.x by default
# Add to package.json if needed:
{
  "engines": {
    "node": "18.x"
  }
}
```

### Environment Variables Not Working

**Verify variables are set:**
1. Settings → Environment Variables
2. Ensure "Production" is checked
3. Redeploy after adding variables

**Check variable names:**
- Client-side: Must start with `NEXT_PUBLIC_`
- Server-side: No prefix needed

### API Routes Timing Out

**Increase timeout (Pro/Enterprise only):**
```javascript
// vercel.json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

**Or optimize your API:**
- Use streaming responses
- Implement caching
- Move long operations to background jobs

### Database Connection Issues

**Check Supabase settings:**
1. Verify connection strings
2. Check RLS policies
3. Test connection from Vercel:
   ```bash
   vercel dev
   ```

---

## 📈 Monitoring Your Deployment

### View Deployment Status

**Real-time:**
```bash
vercel inspect [deployment-url]
```

**Web Dashboard:**
1. Deployments tab
2. Click deployment
3. View:
   - Build logs
   - Function logs
   - Runtime logs
   - Performance metrics

### Set Up Alerts

**Email Notifications:**
1. Settings → Notifications
2. Enable deployment notifications
3. Choose: Success, Failure, or Both

**Webhook Integration:**
1. Settings → Git
2. Add webhook URL
3. Receive POST requests on deployment events

---

## 🎯 Quick Reference Commands

```bash
# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod

# List deployments
vercel ls

# View logs
vercel logs [deployment-url]

# Add environment variable
vercel env add [VAR_NAME]

# Pull environment variables locally
vercel env pull

# Remove deployment
vercel rm [deployment-url]

# Link to existing project
vercel link

# Get project info
vercel inspect

# Redeploy
vercel --prod --force
```

---

## 📝 Checklist Before Going Live

- [ ] All environment variables added
- [ ] Custom domain configured (if needed)
- [ ] Analytics enabled
- [ ] Error monitoring set up
- [ ] 404/500 pages tested
- [ ] Mobile responsiveness verified
- [ ] Performance audit passed (Lighthouse)
- [ ] Security headers configured
- [ ] HTTPS enabled (automatic)
- [ ] Database connection tested
- [ ] Authentication flow working
- [ ] API routes tested
- [ ] Forms tested
- [ ] Email notifications working (if applicable)
- [ ] Backup strategy in place

---

## 🆘 Need Help?

**Vercel Support:**
- Documentation: https://vercel.com/docs
- Discord: https://vercel.com/discord
- GitHub: https://github.com/vercel/next.js
- Email: support@vercel.com

**Project-Specific Help:**
- Check VERCEL_DEPLOYMENT_GUIDE.md
- Review build logs
- Test locally with `vercel dev`

---

**You're all set! 🚀**

Choose Method 1 (GitHub Integration) for automatic deployments, or Method 2 (CLI) for manual control.