# Deployment Guide

This guide will walk you through deploying ContextLess to GitHub and Vercel.

## Table of Contents
- [Prerequisites](#prerequisites)
- [GitHub Setup](#github-setup)
- [Vercel Deployment](#vercel-deployment)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, make sure you have:
- A [GitHub](https://github.com) account
- A [Vercel](https://vercel.com) account
- A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- Git installed on your local machine

## GitHub Setup

### 1. Create a New Repository on GitHub

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., "contextless")
5. Add a description (optional)
6. Choose "Public" or "Private"
7. **DO NOT** initialize with README, .gitignore, or license (we already have these)
8. Click "Create repository"

### 2. Push Your Code to GitHub

Open your terminal in the project directory and run:

```bash
# Add all files to git
git add .

# Create your first commit
git commit -m "Initial commit: ContextLess AI optimization tool"

# Add your GitHub repository as remote (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/contextless.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Vercel Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository:
   - Click "Import Git Repository"
   - Select your `contextless` repository
4. Configure your project:
   - **Framework Preset**: Other (Vercel will auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: Leave empty or use: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
5. Add environment variables (see [Environment Variables](#environment-variables) section)
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# - Set up and deploy: Y
# - Which scope: Select your account
# - Link to existing project: N
# - Project name: contextless (or your preferred name)
# - Directory: ./ (current directory)
# - Override settings: N

# For production deployment
vercel --prod
```

## Environment Variables

You need to set these environment variables in Vercel:

### Required Variables

1. **GEMINI_API_KEY**
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - In Vercel Dashboard: Settings → Environment Variables
   - Name: `GEMINI_API_KEY`
   - Value: Your actual Gemini API key
   - Environments: Production, Preview, Development

### Optional Variables

2. **PORT** (optional, Vercel handles this automatically)
   - Default: 3001
   - Only needed for local development

3. **API_KEY** (optional - for API authentication)
   - If you want to secure your API with a key
   - Generate a secure random string
   - Add to Vercel environment variables

### Setting Environment Variables in Vercel

#### Via Dashboard:
1. Go to your project in Vercel
2. Click "Settings" → "Environment Variables"
3. Add each variable:
   - Enter variable name
   - Enter variable value
   - Select environments (Production, Preview, Development)
   - Click "Save"

#### Via CLI:
```bash
# Add environment variable
vercel env add GEMINI_API_KEY

# You'll be prompted to enter the value and select environments
```

## Post-Deployment

### 1. Verify Deployment

After deployment, Vercel will provide you with URLs:
- **Production URL**: `https://your-project.vercel.app`
- **Preview URLs**: Generated for each commit

### 2. Test Your Deployment

1. Visit your production URL
2. Test the compression feature with sample text
3. Check the API endpoint: `https://your-project.vercel.app/health`

### 3. Update Frontend Environment Variable

If your frontend needs to call the API at a different URL:

1. In Vercel Dashboard → Settings → Environment Variables
2. Add `VITE_API_URL` with your production API URL
3. Redeploy the project

### 4. Custom Domain (Optional)

To add a custom domain:

1. Go to your project in Vercel
2. Click "Settings" → "Domains"
3. Add your domain and follow the DNS configuration instructions

## Troubleshooting

### Build Fails

**Issue**: Build fails with "Cannot find module" error

**Solution**:
- Check that all dependencies are in `package.json`
- Verify `vercel.json` configuration
- Check build logs for specific errors

### API Not Working

**Issue**: API endpoints return 404 or 500 errors

**Solution**:
- Verify `GEMINI_API_KEY` is set in Vercel environment variables
- Check that the backend server.js file exists
- Review function logs in Vercel Dashboard

### Frontend Not Loading

**Issue**: Blank page or build errors

**Solution**:
- Verify the build command is correct
- Check that `frontend/dist` exists after build
- Review build logs in Vercel Dashboard

### Environment Variables Not Working

**Issue**: API key errors or configuration issues

**Solution**:
- Redeploy after adding environment variables
- Verify variable names match exactly (case-sensitive)
- Check that variables are enabled for the correct environments

## Updating Your Deployment

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:

```bash
# Make your changes
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel will automatically build and deploy your changes.

### Manual Redeployment

In Vercel Dashboard:
1. Go to "Deployments"
2. Find the deployment you want to redeploy
3. Click the three dots → "Redeploy"

## Development vs Production

### Local Development
```bash
# Backend
cd backend
npm install
npm start

# Frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

### Production (Vercel)
- Automatically builds and serves both frontend and backend
- Environment variables managed through Vercel
- Automatic HTTPS
- Global CDN for frontend assets

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Documentation](https://docs.github.com)
- [Google Gemini API Docs](https://ai.google.dev/docs)

## Support

If you encounter issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review Vercel build logs
3. Check GitHub Actions (if configured)
4. Open an issue on your GitHub repository

---

**Congratulations!** Your ContextLess app should now be live on Vercel. 🎉
