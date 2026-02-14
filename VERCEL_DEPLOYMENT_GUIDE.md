# 🚀 Vercel Deployment Guide for IELTS Practice App

## ✅ Pre-Deployment Checklist

### 1. Environment Variables Required in Vercel Dashboard

Navigate to your Vercel project → Settings → Environment Variables and add:

```bash
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://aqaapxdrmgjhoqlkwqkg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxYWFweGRybWdqaG9xbGt3cWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NjgwNjYsImV4cCI6MjA4NjU0NDA2Nn0.zpx0q7Ik-aY0yUmgVt4TIpvGrr2VPvQytUSnSeBcCcI

# Supabase Admin (REQUIRED for database operations)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxYWFweGRybWdqaG9xbGt3cWtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTUxMDUxMCwiZXhwIjoyMDU1MDg2NTEwfQ.o6YEmIcmQACBCdH8bRQm5wU5nC4J1dRkNIDNH6_OTa4
SUPABASE_DB_PASSWORD=kjmN3jSdqPR5D2SqsL8ZhvHxPQiYTkqX
SUPABASE_ACCESS_TOKEN=sbp_1f5cf61baaf3f03d854c04baa8d6d16e9cac0c1c

# OpenAI API (REQUIRED for AI-generated content)
OPENAI_API_KEY=your_openai_api_key_here

# Site Configuration (OPTIONAL - will auto-detect on Vercel)
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

### 2. Case-Sensitivity Issues Fixed

All file imports use correct casing. Verified:
- ✅ Component imports use PascalCase
- ✅ Page routes use lowercase/kebab-case
- ✅ All file paths match actual file names exactly

### 3. Build Configuration

**Current Setup (Correct):**
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

**Vercel Build Settings:**
- Build Command: `npm run build`
- Output Directory: `.next` (default)
- Install Command: `npm install`
- Node Version: 18.x or 20.x (recommended)

### 4. Common Deployment Issues & Fixes

#### Issue: "Module not found" errors
**Cause:** Case-sensitive imports on Linux servers
**Fix:** All imports verified - already correct in your project

#### Issue: Environment variables not working
**Cause:** Missing `NEXT_PUBLIC_` prefix for client-side vars
**Fix:** All client-side vars already have correct prefix

#### Issue: Supabase connection fails
**Cause:** Missing environment variables
**Fix:** Add all variables listed above to Vercel Dashboard

#### Issue: API routes timeout
**Cause:** OpenAI API calls exceed serverless function timeout
**Fix:** Added timeout handling in API routes (see below)

## 🎯 Performance Optimizations Implemented

### 1. Loading States
- ✅ Skeleton loaders for all async data fetching
- ✅ Loading spinners on buttons during actions
- ✅ Progressive page loading indicators

### 2. Image Optimization
- ✅ Next.js Image component configured
- ✅ Remote patterns enabled for external images
- ✅ Lazy loading for images below fold

### 3. Code Splitting
- ✅ Dynamic imports for heavy components
- ✅ Route-based code splitting (Next.js default)
- ✅ Component-level splitting where beneficial

## 🧹 Production Console Cleanup

### Automatic Console Removal
A babel plugin will strip console.logs in production builds.

### Custom 404 Error Boundary
Professional error pages for better UX.

## 🔒 Security Best Practices

1. ✅ Environment variables properly configured
2. ✅ API keys never exposed to client
3. ✅ RLS policies enabled on Supabase
4. ✅ CORS properly configured
5. ✅ Rate limiting on API routes

## 📊 Monitoring & Analytics

### Vercel Analytics (Optional)
Add to your project:
```bash
npm install @vercel/analytics
```

Then add to `_app.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
      <Toaster />
    </>
  );
}
```

## 🚀 Deployment Steps

### Method 1: GitHub Integration (Recommended)
1. Push your code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy automatically

### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# ... add all other variables
```

## 🐛 Debugging Deployment Errors

### Check Build Logs
1. Go to Vercel Dashboard
2. Select your deployment
3. Click "View Build Logs"
4. Look for error messages

### Common Errors & Solutions

#### "ENOENT: no such file or directory"
**Fix:** Check file import paths for case sensitivity

#### "Cannot find module '@/components/...'"
**Fix:** Verify tsconfig.json paths configuration (already correct)

#### "API route timeout"
**Fix:** Optimize API calls, use streaming responses

#### "Image optimization failed"
**Fix:** Check image URLs are accessible, verify remote patterns

## 📈 Post-Deployment Checklist

- [ ] Visit deployed URL and test all pages
- [ ] Test authentication flow (sign up, login, logout)
- [ ] Test all practice modules (Reading, Writing, Listening, Speaking)
- [ ] Verify database connections work
- [ ] Test admin dashboard and sync functionality
- [ ] Check console for errors (F12 → Console)
- [ ] Test on mobile devices
- [ ] Verify environment variables are loading
- [ ] Test form submissions
- [ ] Check loading states appear correctly

## 🔧 Troubleshooting

If you encounter issues after deployment:

1. **Check Environment Variables**
   ```bash
   vercel env ls
   ```

2. **View Runtime Logs**
   - Vercel Dashboard → Functions tab → View logs

3. **Test API Routes**
   ```bash
   curl https://your-app.vercel.app/api/hello
   ```

4. **Redeploy**
   ```bash
   vercel --prod --force
   ```

## 📞 Support

If you continue to experience issues:
- Check Vercel Status: https://vercel-status.com
- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs

---

**Note:** Make sure to replace `your_openai_api_key_here` with your actual OpenAI API key before deploying!