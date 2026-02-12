# 🚀 Render Deployment Guide

## Quick Deploy to Render

### Step 1: Push to GitHub

```bash
# Initialize git (already done)
git add .
git commit -m "Initial commit - Singapore HR Document System"

# Create GitHub repository (do this on github.com first)
# Then connect:
git remote add origin https://github.com/YOUR_USERNAME/sage-hr-singapore.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render

1. **Go to Render Dashboard**
   - Visit https://render.com
   - Sign in with your account

2. **Create New Web Service**
   - Click **"New +"** button (top right)
   - Select **"Web Service"**

3. **Connect Repository**
   - Click **"Connect account"** (if not connected)
   - Select your GitHub repository: `sage-hr-singapore`
   - Click **"Connect"**

4. **Configure Service**
   ```
   Name:              sage-hr-singapore
   Region:            Singapore (or closest)
   Branch:            main
   Root Directory:    (leave blank)
   Runtime:           Node
   Build Command:     npm install
   Start Command:     npm start
   Instance Type:     Free
   ```

5. **Environment Variables** (Optional)
   - `NODE_ENV` = `production`
   - No other variables needed (PORT is auto-set by Render)

6. **Deploy**
   - Click **"Create Web Service"**
   - Wait 2-3 minutes for deployment
   - Your URL will be: `https://sage-hr-singapore.onrender.com`

### Step 3: Verify Deployment

Once deployed, test the API:

```bash
# Replace YOUR_RENDER_URL with your actual URL
curl https://YOUR_RENDER_URL.onrender.com/api/employees | jq '.data[0]'

# Test document generation
curl -X POST https://YOUR_RENDER_URL.onrender.com/api/documents/generate \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP055600",
    "type": "payslip",
    "country": "Singapore",
    "params": {"month": "February", "year": 2026}
  }'
```

---

## Important Notes

### Free Tier Limitations
- ✅ Free instance spins down after 15 mins of inactivity
- ✅ First request after spin-down takes 30-60 seconds
- ✅ 750 hours/month free (enough for 24/7)
- ✅ Automatic HTTPS

### For Production
Consider upgrading to **Starter plan ($7/month)** for:
- No spin-down
- Faster response times
- Better reliability

---

## Atomicwork Integration

Once deployed, update your Atomicwork webhook to call:

```
https://YOUR_RENDER_URL.onrender.com/api/documents/generate
```

Example Python bridge code:

```python
SAGE_HR_API = "https://sage-hr-singapore.onrender.com/api/documents/generate"

response = requests.post(SAGE_HR_API, json={
    "employeeId": requester_email,
    "type": "payslip",
    "country": "Singapore",
    "params": {"month": "February", "year": 2026}
})
```

---

## Monitoring

### View Logs
1. Go to Render Dashboard
2. Click on your service
3. Click **"Logs"** tab
4. View real-time logs

### Check Health
```bash
curl https://YOUR_RENDER_URL.onrender.com/api/employees
```

Should return:
```json
{
  "success": true,
  "data": [...]
}
```

---

## Troubleshooting

### Issue: "Application failed to start"
**Solution:** Check logs for errors. Usually missing dependencies.

```bash
# Ensure all files are committed
git status
git add .
git commit -m "Fix deployment"
git push
```

### Issue: "Cannot GET /"
**Solution:** This is normal. The app serves:
- `/` - Web UI (HTML)
- `/api/employees` - API endpoint

### Issue: Slow first request
**Solution:** Normal on free tier. Upgrade to Starter plan to prevent spin-down.

---

## Files Needed for Deployment

✅ All files already configured:

- `package.json` - Dependencies and scripts
- `server.js` - Main application (PORT from env)
- `document-generator.js` - Document generation
- `document-generator-sg.js` - Singapore documents
- `public/` - Static files
- `.gitignore` - Ignore node_modules

---

## Auto-Deploy on Push

Render automatically redeploys when you push to `main`:

```bash
# Make changes
git add .
git commit -m "Update documents"
git push

# Render auto-deploys in 2-3 minutes
```

---

## Custom Domain (Optional)

1. Go to service settings
2. Click "Custom Domain"
3. Add your domain: `hr.company.com.sg`
4. Update DNS with provided CNAME

---

## Ready to Deploy! 🎉

Follow Step 1 to push to GitHub, then Step 2 to deploy on Render.

Your Singapore HR system will be live in 5 minutes!
