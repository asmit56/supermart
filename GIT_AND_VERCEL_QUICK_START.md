# 🚀 Git & Vercel Deployment - Step by Step Guide

**Time Required:** 15-20 minutes  
**Difficulty:** Easy (just copy-paste commands!)

---

## 📋 BEFORE YOU START - Checklist

Make sure you have:
- ✅ GitHub account (create at github.com if needed)
- ✅ Vercel account (create at vercel.com if needed)
- ✅ Terminal/PowerShell open in your project folder
- ✅ `.env.local` file with your credentials (NOT committed)
- ✅ `.gitignore` configured (so .env.local stays private)

---

## 🎯 PHASE 1: VERIFY EVERYTHING IS READY (2 minutes)

### Step 1.1: Check Git Status
Open PowerShell in your project folder and run:

```powershell
git status
```

**You should see:**
```
On branch main
nothing to commit, working tree clean
```

If you see changes, run:
```powershell
git add .
git commit -m "Final updates before deployment"
```

### Step 1.2: Verify .env.local is Protected
Run:
```powershell
git ls-files | Select-String ".env"
```

**Expected output:**
```
.env.example
```

**NOT** `.env.local` (this should NOT be in the list!)

If you see `.env.local`, run:
```powershell
git rm --cached .env.local
git commit -m "Remove .env.local from tracking"
```

---

## 📚 PHASE 2: CREATE GITHUB REPOSITORY (3 minutes)

### Step 2.1: Visit GitHub
Go to [github.com/new](https://github.com/new)

### Step 2.2: Fill Repository Details

| Field | Value |
|-------|-------|
| **Repository name** | `suppermart` |
| **Description** | `E-commerce platform with seller/buyer roles using Next.js, MongoDB, and NextAuth` |
| **Visibility** | **PUBLIC** ← Important! |
| **.gitignore** | None (we already have .gitignore) |
| **License** | MIT (optional) |

### Step 2.3: Click "Create repository"

You'll see a page like this:
```
Quick setup — if you've done this kind of thing before
or
HTTPS   SSH   GitHub CLI
```

---

## 🔧 PHASE 3: PUSH CODE TO GITHUB (5 minutes)

### Step 3.1: Copy the Commands from GitHub
GitHub shows you commands. They look like:

```
git remote add origin https://github.com/YOUR_USERNAME/suppermart.git
git branch -M main
git push -u origin main
```

### Step 3.2: Run Commands in PowerShell

Copy and paste each command. Replace `YOUR_USERNAME` with your actual GitHub username.

**Command 1:**
```powershell
git remote add origin https://github.com/YOUR_USERNAME/suppermart.git
```

**Command 2:**
```powershell
git branch -M main
```

**Command 3:**
```powershell
git push -u origin main
```

### Step 3.3: PowerShell Will Ask for Login
When you run command 3, you may see a browser popup asking to authorize GitHub.
- Click **"Authorize"**
- Return to PowerShell

### Step 3.4: Verify Upload
Go to [github.com/YOUR_USERNAME/suppermart](https://github.com/YOUR_USERNAME/suppermart)

You should see all your files uploaded! ✅

**Check:**
- ✅ All folders and files visible
- ✅ `.env.example` is there (with no real values)
- ✅ `.env.local` is NOT there (stays on your computer)

---

## 🌐 PHASE 4: CREATE VERCEL ACCOUNT (2 minutes)

### Step 4.1: Visit Vercel
Go to [vercel.com](https://vercel.com)

### Step 4.2: Sign Up with GitHub
Click **"Sign Up"**
→ Choose **"Continue with GitHub"**
→ Authorize Vercel to access GitHub
→ Complete signup

You're now logged in to Vercel! ✅

---

## 🚀 PHASE 5: DEPLOY TO VERCEL (5 minutes)

### Step 5.1: Import GitHub Repository
In Vercel dashboard:
1. Click **"Add New"** button
2. Click **"Project"**
3. Click **"Import Git Repository"**

### Step 5.2: Select Your Repository
Search for and select: **`suppermart`**

Click **"Select"**

### Step 5.3: Configure Project Settings
You'll see a page asking for project details:

- **Project Name:** `suppermart` (or any name you want)
- **Framework:** Should auto-detect **Next.js** ✅
- **Root Directory:** `.` (leave as is)

### Step 5.4: Add Environment Variables (CRITICAL!)

This is the most important step! You'll see:
```
Environment Variables
```

**If you don't see it, scroll down.**

Add **3 variables:**

#### Variable 1: MongoDB Connection
```
Name:  MONGODB_URI
Value: mongodb+srv://criticalgaming9999_db_user:FhZMvYQLhnrMgkYY@cluster0.xupmmwx.mongodb.net/suppermart?retryWrites=true&w=majority
```
Click checkmark ✓

#### Variable 2: NextAuth Secret
```
Name:  NEXTAUTH_SECRET
Value: suppermart-secret-key-production-2024
```
Click checkmark ✓

#### Variable 3: NextAuth URL
```
Name:  NEXTAUTH_URL
Value: https://suppermart-YOUR_USERNAME.vercel.app
```
(Replace `YOUR_USERNAME` with your Vercel username)
Click checkmark ✓

### Step 5.5: Click "Deploy"
Click the big blue **"Deploy"** button

**Wait 2-3 minutes...**

You'll see:
```
🎉 Congratulations!
Your project has been successfully deployed!
```

Click the link to visit your live site! 🎉

---

## ✅ PHASE 6: VERIFY DEPLOYMENT (3 minutes)

### Step 6.1: Visit Your Live Site
Go to: `https://suppermart-YOUR_USERNAME.vercel.app`

### Step 6.2: Test Basic Features
- [ ] Home page loads
- [ ] Products display with images
- [ ] Can click "Add to Cart"
- [ ] Quantity selector works
- [ ] Out of stock shows properly

### Step 6.3: If Something's Wrong

**Problem: Blank page**
→ Check environment variables in Vercel Settings
→ Make sure all 3 are added correctly

**Problem: Database connection error**
→ Go to Vercel → Settings → Environment Variables
→ Check MONGODB_URI is correct
→ May need to wait 5 minutes for deployment to refresh

**Problem: Login not working**
→ Check NEXTAUTH_URL matches your Vercel domain
→ Should be exactly: `https://suppermart-YOUR_USERNAME.vercel.app`

---

## 🔄 PHASE 7: MAKING UPDATES (After Deployment)

### Every Time You Update Code:

```powershell
# Step 1: Make your changes in VS Code

# Step 2: Test locally
npm run dev

# Step 3: Push to GitHub
git add .
git commit -m "Description of what changed"
git push origin main

# Step 4: Vercel auto-deploys! (wait 1-2 minutes)
```

**That's it!** Vercel automatically deploys when you push to GitHub.

---

## 🆘 TROUBLESHOOTING

### Problem: "Can't push to GitHub"
**Solution:** Run these commands:
```powershell
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### Problem: "fatal: cannot read Username"
**Solution:** GitHub updated their auth. Use this instead:
```powershell
git push origin main
```
Then authorize in browser when asked.

### Problem: "Repository not found"
**Solution:** Check username in URL matches your GitHub username:
```powershell
git remote -v
```

Should show URL with your actual GitHub username, not "YOUR_USERNAME"

### Problem: Vercel says "Build Failed"
**Solution:**
1. Check Vercel → Deployments → Failed deployment
2. Read error message carefully
3. Fix the issue locally
4. Push to GitHub again

---

## ✨ FINAL CHECKLIST

After completing all phases, you should have:

- ✅ Code on GitHub (public repo)
- ✅ Live site on Vercel
- ✅ Environment variables set in Vercel
- ✅ Database connected
- ✅ Can add products as seller
- ✅ Can browse as buyer
- ✅ Can add to cart
- ✅ Images display properly
- ✅ Stock status shows correctly

---

## 🎉 YOU'RE LIVE!

Your e-commerce platform is now live on the internet!

**Share with others:**
```
https://suppermart-YOUR_USERNAME.vercel.app
```

**Every code update:**
```
git push origin main
```
This automatically deploys your changes!

---

## 📞 QUICK REFERENCE COMMANDS

Save these for later:

```powershell
# Check git status
git status

# Add all changes
git add .

# Create commit
git commit -m "Your message here"

# Push to GitHub (auto-deploys to Vercel)
git push origin main

# View git history
git log --oneline

# See remote URL
git remote -v
```

---

**Questions?** Refer to:
- VERCEL_DEPLOYMENT_GUIDE.md (detailed)
- DEPLOY_CHECKLIST.md (quick reference)
- This file (GIT_AND_VERCEL_QUICK_START.md)

Good luck! 🚀
