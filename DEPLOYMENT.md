# Deployment Guide

Trade Journal is a static React (Vite) app. No backend or API keys are required for core features; market data uses Binance public WebSocket from the browser.

## Quick Deploy Options

### Option 1: Vercel (Recommended)

**One-Click Deploy**
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel auto-detects Vite config
6. Click "Deploy"

**Via CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

Vercel automatically:
- Detects build command (`npm run build`)
- Sets output directory (`dist`)
- Enables automatic deployments on git push
- Provides preview URLs for branches

---

### Option 2: Netlify

**Drag and Drop**
```bash
# Build the project
npm run build

# Go to netlify.com
# Drag and drop the 'dist' folder
```

**Via CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

**netlify.toml** (optional, for advanced config)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Option 3: GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

**Update vite.config.ts** for GitHub Pages:
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/stock-notes/', // Your repo name
})
```

---

### Option 4: Custom Server

**Any Static Host (AWS S3, Azure, etc.)**

```bash
# Build the project
npm run build

# Upload 'dist' folder contents to your host
# Configure server to serve index.html for all routes
```

**Nginx Configuration**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache Configuration** (.htaccess)
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## Build Configuration

### Vite Build Settings

Default configuration in `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### Build Output

```bash
npm run build
```

Generates:
- `dist/index.html` - Entry point
- `dist/assets/` - Bundled JS and CSS
- All files are minified and optimized

### Build Statistics
- Run `npm run build` and check `dist/` for actual sizes.
- Vite minifies and tree-shakes; Tailwind purges unused CSS.

---

## Environment Variables

No environment variables are required. Market data uses Binance public WebSocket streams (no API key). Trades are stored in the browser’s localStorage.

If you add a backend later, you can use:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Build & Deploy → Environment

---

## Pre-Deployment Checklist

- [ ] Run `npm run build` locally to verify
- [ ] Test production build with `npm run preview`
- [ ] Check all features work in production mode
- [ ] Verify responsive design on mobile
- [ ] Test in different browsers
- [ ] Ensure demo data loads correctly
- [ ] Confirm localStorage persistence works
- [ ] Review console for any warnings/errors

---

## Post-Deployment Steps

1. **Test the deployed app**
   - Create a trade
   - Load demo data
   - Verify localStorage works
   - Test on mobile device

2. **Set up monitoring** (optional)
   - Google Analytics
   - Sentry for error tracking
   - Vercel Analytics

3. **Custom Domain** (optional)
   - Purchase domain
   - Configure DNS
   - Add domain in hosting platform

---

## Performance Optimization

### Already Optimized
✅ Tree-shaking enabled
✅ Code minification
✅ CSS purging (Tailwind)
✅ Fast refresh in development
✅ Efficient bundling (Vite)

### Future Optimizations
- [ ] Code splitting by route
- [ ] Image optimization
- [ ] Service Worker for offline support
- [ ] Preloading critical resources
- [ ] Lazy loading components

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Blank Page After Deploy
- Check browser console for errors
- Verify `base` path in vite.config.ts matches deployment URL
- Ensure server is configured for SPA routing

### localStorage Not Working
- Check if hosting platform allows localStorage
- Verify no Content Security Policy blocking storage
- Test in incognito mode (extensions can block)

### Live Market Data Not Updating
- Binance WebSocket runs in the browser; no server config needed
- Ensure the deployed site is served over HTTPS (WSS required)
- Check browser console for WebSocket errors or CORS issues

### Styles Not Loading
- Verify Tailwind config is correct
- Check if PostCSS is running
- Ensure index.css imports are present

---

## Rollback Strategy

### Vercel
- Go to Deployments tab
- Click on previous successful deployment
- Click "Promote to Production"

### Netlify
- Go to Deploys tab
- Click on previous deploy
- Click "Publish deploy"

### Manual
- Keep previous `dist` folder as backup
- Replace current deployment with backup

---

## CI/CD Setup (Optional)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy
      # Add your deployment step here
```

---

## Security Headers (Recommended)

Add to hosting platform:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

**Vercel** - Add `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

---

## Monitoring and Analytics

### Add Analytics (Optional)

```bash
npm install @vercel/analytics
```

```typescript
// In App.tsx
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <Analytics />
      {/* rest of app */}
    </>
  );
}
```

---

## Cost Considerations

**All these platforms offer free tiers:**
- ✅ Vercel: Free for personal projects
- ✅ Netlify: Free for 100GB bandwidth/month
- ✅ GitHub Pages: Free for public repos
- ✅ No backend = No server costs!

---

## Support

For deployment issues:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- GitHub Pages: [pages.github.com](https://pages.github.com)

For application issues, review:
- README.md
- ARCHITECTURE.md
- Source code comments
