# 🚀 Deployment Guide - TimeTracker Pro

## Quick Deployment to Netlify (Recommended)

### Step 1: Prepare for Deployment
```bash
# Build the production version
npm run build
```

### Step 2: Deploy to Netlify
1. **Option A: Drag & Drop**
   - Go to [Netlify](https://netlify.com)
   - Drag the `dist` folder to the deployment area
   - Get your live URL instantly

2. **Option B: Git Integration**
   - Push code to GitHub/GitLab
   - Connect repository to Netlify
   - Automatic deployments on every push

### Step 3: Configure Environment Variables
In Netlify dashboard:
1. Go to Site Settings → Environment Variables
2. Add: `VITE_GOOGLE_CLIENT_ID` = your Google Client ID
3. Redeploy the site

### Step 4: Set Up Custom Domain (Optional)
1. In Netlify: Domain Settings → Add Custom Domain
2. Update DNS records as instructed
3. SSL certificate automatically provisioned

## Google OAuth Configuration

### 1. Create Google Cloud Project
```
1. Visit: https://console.developers.google.com/
2. Click "Create Project"
3. Name: "TimeTracker Pro - [Company Name]"
4. Click "Create"
```

### 2. Enable Required APIs
```
1. Go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click "Enable"
```

### 3. Create OAuth Credentials
```
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Application type: "Web application"
4. Name: "TimeTracker Pro"
5. Authorized origins:
   - http://localhost:5173 (for development)
   - https://your-domain.com (your production URL)
6. Click "Create"
7. Copy the Client ID
```

### 4. Configure Application
```bash
# Create .env file
echo "VITE_GOOGLE_CLIENT_ID=your-client-id-here" > .env
```

## Alternative Deployment Options

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add VITE_GOOGLE_CLIENT_ID
```

### Deploy to Company Server
```bash
# Build the application
npm run build

# Copy dist folder to your web server
scp -r dist/* user@server:/var/www/html/timetracker/

# Configure web server (Apache/Nginx) to serve the files
```

### Deploy to AWS S3 + CloudFront
```bash
# Build the application
npm run build

# Upload to S3 bucket
aws s3 sync dist/ s3://your-bucket-name --delete

# Configure CloudFront distribution for SPA routing
```

## Security Considerations

### 1. Domain Restrictions
- Only add trusted domains to Google OAuth
- Use HTTPS in production
- Regularly review authorized origins

### 2. Data Privacy
- All data stored locally in browser
- No server-side data collection
- GDPR compliant by design

### 3. Access Control
- Google Workspace domain restrictions
- Employee email domain validation
- Admin controls through Google Admin Console

## Testing Checklist

### Pre-Deployment Testing
- [ ] Google OAuth login works
- [ ] Demo login functions properly
- [ ] Time tracking accuracy
- [ ] Task management features
- [ ] Break tracking functionality
- [ ] Data persistence across sessions
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### Post-Deployment Testing
- [ ] Production URL accessible
- [ ] Google OAuth with production domain
- [ ] SSL certificate active
- [ ] Performance optimization
- [ ] Error monitoring setup

## Monitoring & Maintenance

### Performance Monitoring
```javascript
// Add to index.html for basic analytics
<script>
  // Google Analytics or similar
  // Monitor page load times
  // Track user engagement
</script>
```

### Error Tracking
```javascript
// Add error boundary for React components
// Monitor console errors
// Set up alerting for critical issues
```

### Regular Maintenance
- Monthly dependency updates
- Quarterly security reviews
- Annual feature assessments
- Continuous user feedback collection

## Troubleshooting

### Common Issues

**Google OAuth Not Working**
```
1. Check Client ID in environment variables
2. Verify authorized origins include your domain
3. Ensure HTTPS is used in production
4. Check browser console for errors
```

**Build Failures**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Performance Issues**
```
1. Enable gzip compression on server
2. Configure proper caching headers
3. Optimize images and assets
4. Monitor bundle size
```

## Support Resources

### Documentation
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Google Identity Services](https://developers.google.com/identity/gsi/web)

### Community Support
- GitHub Issues for bug reports
- Stack Overflow for technical questions
- Company IT support for deployment assistance

---

**Need help with deployment? Contact your IT team or follow this guide step by step.**