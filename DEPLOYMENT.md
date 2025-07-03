# Deployment Checklist

## Pre-Deployment

- [ ] All features tested locally
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Preview works (`npm run preview`)
- [ ] Environment variables configured
- [ ] API endpoints accessible

## Vercel Deployment Steps

### 1. Prepare Repository
```bash
# Install Node.js types (if not already installed)
npm install --save-dev @types/node

# Ensure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy via Vercel CLI
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### 3. Configure Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_API_BASE_URL` | `https://fahimxgg-l2-ass-3-db.vercel.app/api` | Production |

### 4. Verify Deployment

- [ ] Application loads correctly
- [ ] All routes work (/, /books, /create-book, /borrow-summary)
- [ ] API calls succeed
- [ ] Book creation works
- [ ] Book editing works
- [ ] Book borrowing works
- [ ] Responsive design works on mobile
- [ ] Dark/light theme switching works

## Post-Deployment

- [ ] Test all functionality in production
- [ ] Check browser console for errors
- [ ] Verify API integration
- [ ] Test on different devices/browsers
- [ ] Monitor performance metrics

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check TypeScript errors: `npm run type-check`
   - Check ESLint errors: `npm run lint`
   - Verify all dependencies are installed
   - Install Node.js types: `npm install --save-dev @types/node`

2. **API Calls Fail**
   - Verify `VITE_API_BASE_URL` environment variable
   - Check CORS settings on backend
   - Verify API endpoints are accessible

3. **Routing Issues**
   - Ensure `vercel.json` is configured correctly
   - Check that all routes redirect to `index.html`

4. **Environment Variables Not Working**
   - Ensure variables start with `VITE_`
   - Redeploy after adding environment variables
   - Check variable names match exactly

### Performance Optimization

- [ ] Enable gzip compression (automatic on Vercel)
- [ ] Optimize images and assets
- [ ] Monitor bundle size
- [ ] Check Core Web Vitals

## Rollback Plan

If deployment fails:

1. Revert to previous deployment in Vercel dashboard
2. Fix issues locally
3. Test thoroughly
4. Redeploy

## Monitoring

- Monitor application performance in Vercel Analytics
- Check error logs in Vercel Functions tab
- Set up alerts for downtime or errors
