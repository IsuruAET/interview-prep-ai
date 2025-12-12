# Quick Deployment Checklist

## Backend on Render (5 minutes)

1. **GitHub**: Push code to GitHub
2. **Render**: New → Web Service → Connect repo
3. **Settings**:
   - Name: `interview-prep-ai-backend`
   - Root Directory: `backend`
   - Build: `npm install && npm run build`
   - Start: `npm start`
4. **Env Vars** (click "Add Environment Variable"):
   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   (Copy directly from MongoDB Atlas)
   JWT_SECRET=your-secret-here
   CLIENT_URL=https://your-frontend.vercel.app
   GROQ_API_KEY=your-groq-key
   AWS_ACCESS_KEY_ID=your-aws-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret
   AWS_REGION=ap-southeast-2
   AWS_S3_BUCKET_NAME=your-bucket-name
   ```
5. **Deploy** → Copy backend URL

## Frontend on Vercel (3 minutes)

1. **Vercel**: New Project → Import repo
2. **Settings**:
   - Root Directory: `frontend`
3. **Env Vars**:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
4. **Deploy** → Copy frontend URL
5. **Update Backend**: Set `CLIENT_URL` in Render to your Vercel URL

## MongoDB URI

**Just copy the connection string directly from MongoDB Atlas** - it handles encoding automatically.

**Only if you get connection errors** with special characters: use [urlencoder.org](https://www.urlencoder.org/) to encode just the password part.

**All other env vars**: Use as-is, no encoding needed!
