# Quick Start: Deploy to GitHub & Vercel in 5 Minutes

This guide will get your ContextLess app live on the internet in just a few minutes.

## Step 1: Push to GitHub (2 minutes)

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it `contextless` (or whatever you prefer)
   - **Don't** initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Push your code:**
   ```bash
   # In your project directory
   git add .
   git commit -m "Initial commit: ContextLess app ready for deployment"
   git remote add origin https://github.com/YOUR_USERNAME/contextless.git
   git branch -M main
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` with your GitHub username.

## Step 2: Deploy to Vercel (3 minutes)

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Sign in with your GitHub account

2. **Import your project:**
   - Click "Add New..." → "Project"
   - Select your `contextless` repository
   - Click "Import"

3. **Configure environment variables:**
   - Before clicking "Deploy", scroll down to "Environment Variables"
   - Add this variable:
     - **Name**: `GEMINI_API_KEY`
     - **Value**: Your Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
     - **Environments**: Check all three (Production, Preview, Development)

4. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - Vercel will give you a live URL like `https://contextless.vercel.app`

## Step 3: Test Your Deployment

1. Visit your Vercel URL
2. Paste some text into the input area
3. Click "Optimize Text"
4. Verify it works!

## Troubleshooting

**Build fails?**
- Check that `GEMINI_API_KEY` is set correctly
- View the build logs in Vercel for specific errors

**API not working?**
- Verify your Gemini API key is valid
- Check the function logs in Vercel Dashboard → Functions

**Need more help?**
- See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions
- Check Vercel's build logs for error messages

## Next Steps

- **Custom Domain**: Add your own domain in Vercel Settings → Domains
- **Environment Variables**: Add more in Vercel Settings → Environment Variables
- **Auto-Deploy**: Every push to `main` branch will automatically deploy
- **Preview Deployments**: Every pull request gets its own preview URL

---

**That's it!** Your app is now live and will automatically deploy whenever you push to GitHub. 🚀
