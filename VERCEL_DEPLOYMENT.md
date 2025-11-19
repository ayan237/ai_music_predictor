# Vercel Deployment Guide

## Pre-Deployment Checklist

### ✅ Code Changes Completed
- [x] Next.js configuration optimized for production
- [x] Security headers added
- [x] Image domains configured
- [x] Environment variable handling updated
- [x] Error handling improved

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your code is pushed to GitHub:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy Frontend to Vercel

#### Option A: Via Vercel Dashboard

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "Add New Project"**
3. **Import your GitHub repository**
4. **Configure Project Settings:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

5. **Add Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   NEXT_PUBLIC_ML_SERVICE_URL=https://your-ml-service-url.com
   ```

6. **Click "Deploy"**

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? ai-music-mood-matcher (or your choice)
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_ML_SERVICE_URL

# Deploy to production
vercel --prod
```

### 3. Environment Variables Setup

In Vercel Dashboard → Your Project → Settings → Environment Variables:

#### Required Variables:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
NEXT_PUBLIC_ML_SERVICE_URL=https://your-ml-service-url.railway.app
```

**Important Notes:**
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Use HTTPS URLs for production
- Update these after deploying backend and ML service

### 4. Backend Deployment (Railway/Render)

Your backend needs to be deployed separately. Update CORS in backend:

```javascript
// backend/server.js
app.use(cors({
  origin: [
    'https://your-vercel-app.vercel.app',
    'http://localhost:3000' // for local development
  ],
  credentials: true
}))
```

### 5. ML Service Deployment (Railway/Render)

Deploy your ML service and update the frontend environment variable.

### 6. Post-Deployment Configuration

1. **Update Backend CORS:**
   - Add your Vercel URL to allowed origins
   - Example: `https://ai-music-mood-matcher.vercel.app`

2. **Update Environment Variables:**
   - After backend/ML service deployment, update URLs in Vercel
   - Redeploy frontend if needed

3. **Test Deployment:**
   - Visit your Vercel URL
   - Test authentication flow
   - Test mood detection
   - Test playlist fetching

## Vercel-Specific Optimizations

### Automatic Optimizations
- ✅ Static page generation
- ✅ Image optimization
- ✅ Code splitting
- ✅ Edge caching
- ✅ CDN distribution

### Custom Domain Setup
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate is automatically provisioned

## Troubleshooting

### Build Errors

**Error: Module not found**
```bash
# Ensure all dependencies are in package.json
cd frontend
npm install
```

**Error: TypeScript errors**
```bash
# Check tsconfig.json
# Ensure all types are properly defined
```

### Runtime Errors

**CORS Errors:**
- Ensure backend CORS includes your Vercel URL
- Check that credentials are enabled

**API Connection Errors:**
- Verify environment variables are set correctly
- Check that backend/ML service URLs are accessible
- Ensure URLs use HTTPS in production

**Webcam Not Working:**
- Webcam requires HTTPS (Vercel provides this automatically)
- Check browser permissions
- Ensure camera permissions are granted

### Performance Issues

**Slow Initial Load:**
- Check bundle size: `npm run build` shows sizes
- Consider code splitting for large components
- Optimize images

**API Timeouts:**
- Increase timeout in axios requests if needed
- Check backend/ML service response times

## Environment Variables Reference

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_ML_SERVICE_URL=https://your-ml-service-url.com
```

### Backend (Railway/Render)
```env
PORT=5000
ML_SERVICE_URL=https://your-ml-service-url.com
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
SPOTIFY_CLIENT_ID=your-client-id
SPOTIFY_CLIENT_SECRET=your-client-secret
YOUTUBE_API_KEY=your-api-key
FRONTEND_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

### ML Service (Railway/Render)
```env
PORT=5001
FLASK_ENV=production
```

## Monitoring & Analytics

### Vercel Analytics
1. Enable Vercel Analytics in project settings
2. View real-time analytics in dashboard
3. Monitor performance metrics

### Error Tracking
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Vercel Analytics for performance

## Security Checklist

- [x] Security headers configured
- [x] HTTPS enforced (automatic on Vercel)
- [x] Environment variables secured
- [ ] Rate limiting (add to backend)
- [ ] API key rotation plan
- [ ] Regular security audits

## Performance Checklist

- [x] Image optimization enabled
- [x] Code splitting configured
- [x] Compression enabled
- [ ] CDN caching configured
- [ ] Database connection pooling
- [ ] API response caching

## Next Steps After Deployment

1. **Test All Features:**
   - User registration/login
   - Mood detection (face & text)
   - Playlist fetching
   - Favorites management
   - History viewing

2. **Monitor Performance:**
   - Check Vercel Analytics
   - Monitor API response times
   - Check error rates

3. **Optimize:**
   - Add caching where appropriate
   - Optimize database queries
   - Reduce bundle size if needed

4. **Set Up CI/CD:**
   - Vercel automatically deploys on git push
   - Configure preview deployments for PRs

## Support

For Vercel-specific issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

For project-specific issues:
- Check `CODE_ANALYSIS_REPORT.md` for known issues
- Review error logs in Vercel dashboard

---

**Ready to Deploy!** 🚀

Follow the steps above to deploy your frontend to Vercel. Remember to deploy backend and ML service first, then update the environment variables.

