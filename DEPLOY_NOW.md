# 🚀 DEPLOY TO RENDER - QUICK GUIDE

## ✅ Status: Ready to Deploy!

All files committed and ready. Follow these steps:

---

## Step 1: Create GitHub Repository (2 minutes)

1. Go to https://github.com/new
2. Repository name: `sage-hr-singapore`
3. Description: `Singapore HR Document Generation System`
4. **Public** or **Private** (your choice)
5. **DO NOT** initialize with README (we already have one)
6. Click **"Create repository"**

---

## Step 2: Push to GitHub (1 minute)

Copy and run these commands in your terminal:

```bash
cd /Users/vijayshankar/sage-hr-mock

# Update this with YOUR GitHub username
git remote add origin https://github.com/YOUR_USERNAME/sage-hr-singapore.git

git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username!**

---

## Step 3: Deploy on Render (3 minutes)

### 3.1 Connect GitHub to Render

1. Go to https://dashboard.render.com
2. Sign in with your Render account
3. Click **"New +"** (top right)
4. Select **"Web Service"**
5. Click **"Connect account"** (if first time)
6. Authorize Render to access GitHub

### 3.2 Select Repository

1. Find `sage-hr-singapore` in the list
2. Click **"Connect"**

### 3.3 Configure Service

**Copy these exact settings:**

```
Name:              sage-hr-singapore
Region:            Singapore (or closest to you)
Branch:            main
Root Directory:    (leave blank)
Runtime:           Node
Build Command:     npm install
Start Command:     npm start
Instance Type:     Free
```

### 3.4 Deploy!

1. Click **"Create Web Service"**
2. Wait 2-3 minutes while Render:
   - Installs dependencies
   - Starts the server
   - Generates your URL

---

## Step 4: Test Your Deployment (1 minute)

Once deployment completes, you'll get a URL like:
```
https://sage-hr-singapore.onrender.com
```

### Test in Browser:
1. Open the URL in browser
2. You should see the HR system UI
3. Click on any employee
4. Go to Documents tab
5. Generate a document

### Test API:
```bash
# Replace YOUR_URL with your actual Render URL
curl https://YOUR_URL.onrender.com/api/employees | head -20

# Test document generation
curl -X POST https://YOUR_URL.onrender.com/api/documents/generate \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP055600",
    "type": "payslip",
    "country": "Singapore",
    "params": {"month": "February", "year": 2026}
  }'
```

---

## ✅ Deployment Complete!

Your Singapore HR Document System is now live at:
```
https://sage-hr-singapore.onrender.com
```

### Next Steps:

1. **Share the URL** with your team
2. **Update Atomicwork** webhook to point to your Render URL
3. **Test document generation** for all 4 types

---

## 📱 Share These URLs

**Web UI:**
```
https://YOUR_URL.onrender.com
```

**API Endpoint:**
```
POST https://YOUR_URL.onrender.com/api/documents/generate
```

**API Documentation:**
```
https://YOUR_URL.onrender.com/ATOMICWORK_INTEGRATION_READY.md
```

---

## 🔧 Update Atomicwork Integration

In your Atomicwork bridge code, change:

```python
# OLD (localhost)
SAGE_HR_API = "http://localhost:3000/api/documents/generate"

# NEW (Render)
SAGE_HR_API = "https://YOUR_URL.onrender.com/api/documents/generate"
```

---

## ⚡ Quick Troubleshooting

### Issue: First request is slow (30-60 seconds)
**Cause:** Free tier spins down after 15 mins of inactivity
**Solution:** This is normal. Subsequent requests are fast.
**Fix:** Upgrade to Starter plan ($7/month) for always-on service

### Issue: "Application failed to start"
**Cause:** Missing dependencies or syntax error
**Solution:**
1. Check Render logs (click "Logs" tab)
2. Fix the issue in your code
3. Git commit and push
4. Render auto-redeploys

### Issue: Can't see generated documents
**Cause:** Public folder not being served
**Solution:** Documents are in memory. They'll regenerate on each deploy.

---

## 🎉 You're Live!

Total time: **~7 minutes**

Now you can:
- ✅ Generate Singapore HR documents
- ✅ Access via REST API
- ✅ Integrate with Atomicwork
- ✅ Share with employees

**Ready to start testing!** 🚀

---

## Need Help?

1. **Render Logs:** Dashboard → Your Service → Logs
2. **GitHub Issues:** Create issue in your repo
3. **Render Docs:** https://render.com/docs

---

**Status:** 🟢 READY TO DEPLOY
**Estimated Time:** 7 minutes
**Cost:** FREE (Render Free Tier)
