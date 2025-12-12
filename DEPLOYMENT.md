# Deployment Guide: Interview Prep AI

This guide will walk you through deploying your app to **Render** (backend) and **Vercel** (frontend).

## Prerequisites

- GitHub repository with your code
- MongoDB database (MongoDB Atlas or similar)
- Render account
- Vercel account
- All API keys and credentials ready

---

## Part 1: Deploy Backend to Render

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the repository `interview-prep-ai`

### Step 3: Configure Build Settings

- **Name**: `interview-prep-ai-backend`
- **Environment**: `Node`
- **Root Directory**: `backend` (important!)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### Step 4: Set Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add these:

#### Required Environment Variables:

1. **NODE_ENV**

   - Value: `production`

2. **PORT**

   - ⚠️ **Don't set this!** Render automatically sets `PORT` environment variable. Your code already handles it with `process.env.PORT || 5000`.

3. **MONGO_URI**

   - Value: Copy the connection string directly from MongoDB Atlas
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`
   - ⚠️ **Note**: MongoDB Atlas automatically URL-encodes passwords when generating connection strings. Just copy and paste it directly. Only if you manually edit the password or get connection errors, you might need to URL-encode special characters (see troubleshooting section).

4. **JWT_SECRET**

   - Value: A long random string (e.g., generate with `openssl rand -base64 32`)
   - ⚠️ **Special Characters**: Use the value as-is, no encoding needed. Render handles it properly.

5. **CLIENT_URL**

   - Value: Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)

6. **GROQ_API_KEY**

   - Value: Your Groq API key from [console.groq.com](https://console.groq.com)

7. **AWS_ACCESS_KEY_ID**

   - Value: Your AWS access key

8. **AWS_SECRET_ACCESS_KEY**

   - Value: Your AWS secret key
   - ⚠️ **Special Characters**: Use as-is, no encoding needed.

9. **AWS_REGION**

   - Value: `ap-southeast-2` (or your preferred region)

10. **AWS_S3_BUCKET_NAME**
    - Value: Your S3 bucket name

### Step 5: Deploy

Click **"Create Web Service"**. Render will:

- Clone your repo
- Install dependencies
- Build the TypeScript code
- Start the server

### Step 6: Get Your Backend URL

After deployment, you'll get a URL like:

```
https://interview-prep-ai-backend.onrender.com
```

Copy this URL - you'll need it for the frontend.

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

### Step 2: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select the repository `interview-prep-ai`

### Step 3: Configure Project Settings

- **Framework Preset**: Vite (or Other, Vercel will auto-detect)
- **Root Directory**: `frontend`
- **Build Command**: Leave default (Vercel will use `vercel.json` config)
- **Output Directory**: Leave default (Vercel will use `vercel.json` config)
- **Install Command**: `npm install`

**Note**: If you have `vercel.json` in the root (which you do), Vercel will use those settings automatically.

### Step 4: Set Environment Variables

Click **"Environment Variables"** and add:

1. **VITE_API_URL**
   - Value: Your Render backend URL (e.g., `https://interview-prep-ai-backend.onrender.com`)
   - ⚠️ **No trailing slash**: Don't include `/` at the end
   - Production: ✅
   - Preview: ✅
   - Development: (optional, your local URL)

### Step 5: Deploy

Click **"Deploy"**. Vercel will:

- Install dependencies
- Build the React app
- Deploy to production

### Step 6: Update Backend CORS

Once you have your Vercel URL, update the backend's `CLIENT_URL` env var in Render:

1. Go to Render dashboard
2. Open your backend service
3. Go to **"Environment"**
4. Update `CLIENT_URL` to your Vercel URL (e.g., `https://your-app.vercel.app`)
5. Click **"Save Changes"** (service will automatically redeploy)

Also update `backend/src/index.ts` to remove the hardcoded origin for cleaner code:

```typescript
const allowedOrigins = [process.env.CLIENT_URL].filter(Boolean) as string[];
```

Remove the hardcoded `"https://finance-tracker-frontend-kappa.vercel.app"` line.

---

## Part 3: MongoDB URI Encoding (Only if Needed)

**Most users**: MongoDB Atlas automatically handles URL encoding. Just copy the connection string directly.

**Only if you encounter connection errors** with passwords containing special characters:

1. Copy your connection string from MongoDB Atlas
2. If the password part looks wrong or you get connection errors, manually encode the password:
   - Use an online tool: [urlencoder.org](https://www.urlencoder.org/)
   - Or JavaScript: `encodeURIComponent("your-password")`
   - Replace only the password part in the URI

**All other environment variables** (JWT_SECRET, AWS keys, API keys, etc.): Use as-is, no encoding needed.

---

## Troubleshooting

### Backend Issues

1. **Build fails**

   - Check Node version (should be 18+)
   - Verify `backend/package.json` has correct build script

2. **Database connection fails**

   - Copy MONGO_URI directly from MongoDB Atlas (don't manually edit)
   - Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for Render)
   - Verify database user has correct permissions
   - If password has special characters and connection fails, try URL-encoding just the password part using [urlencoder.org](https://www.urlencoder.org/)

3. **Port issues**

   - Render auto-assigns PORT, but ensure your code uses `process.env.PORT || 10000`

4. **CORS errors**
   - Verify CLIENT_URL matches your Vercel URL exactly
   - Check for trailing slashes
   - Verify both URLs are in allowedOrigins array

### Frontend Issues

1. **Build fails**

   - Check Node version (should be 18+)
   - Verify VITE_API_URL is set correctly

2. **API calls fail**

   - Verify VITE_API_URL points to correct Render backend URL
   - Check browser console for CORS errors
   - Verify backend is running (check Render logs)

3. **Blank page**
   - Check browser console for errors
   - Verify build output in Vercel deployment logs

### Environment Variable Issues

1. **Special characters in MongoDB password causing connection issues**

   - MongoDB Atlas usually handles this automatically
   - If connection fails, try URL-encoding the password part of the URI using an online tool
   - Don't encode other env vars (JWT_SECRET, API keys, etc.) - use them as-is

2. **Changes not taking effect**
   - Restart service after changing env vars (Render does this automatically)
   - Clear browser cache for frontend changes

---

## Quick Reference

### Render (Backend)

- **URL**: https://dashboard.render.com
- **Build**: `cd backend && npm install && npm run build`
- **Start**: `cd backend && npm start`
- **Port**: Uses `process.env.PORT` (auto-assigned by Render)

### Vercel (Frontend)

- **URL**: https://vercel.com/dashboard
- **Root**: `frontend`
- **Build**: `npm run build`
- **Output**: `dist`

### Required Env Vars Summary

**Backend (Render)**:

- `NODE_ENV=production`
- `PORT` (auto-set by Render, don't add manually)
- `MONGO_URI` (copy directly from MongoDB Atlas)
- `JWT_SECRET`
- `CLIENT_URL`
- `GROQ_API_KEY`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_S3_BUCKET_NAME`

**Frontend (Vercel)**:

- `VITE_API_URL` (your Render backend URL)

---

## Next Steps

1. ✅ Test your deployed backend at `https://your-backend.onrender.com/health`
2. ✅ Test your deployed frontend
3. ✅ Update MongoDB Atlas IP whitelist if needed
4. ✅ Set up custom domains (optional)
5. ✅ Configure auto-deploy on git push (enabled by default)

---

## Notes

- Render free tier services **spin down after 15 minutes of inactivity** and may take 30-60 seconds to wake up
- Consider Render's paid tier for always-on services
- Vercel has excellent free tier with no spin-down issues
- Monitor both platforms for deployment logs and errors
