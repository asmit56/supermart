# ⚡ Vercel Commands - Complete Reference

**Installation & Deployment Commands for Vercel CLI**

---

## 🔧 INSTALLATION (First Time Only)

### Install Vercel CLI Globally
```powershell
npm install -g vercel
```

**Verify installation:**
```powershell
vercel --version
```

Should output something like: `Vercel CLI 33.0.0`

---

## 🚀 DEPLOYMENT COMMANDS

### Option A: Deploy via Web (EASIEST - No Commands Needed)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repo
5. Add environment variables
6. Click Deploy!

**No commands needed!** ✅

---

### Option B: Deploy via CLI (If you prefer commands)

#### Login to Vercel
```powershell
vercel login
```

**First time:** Opens browser to authorize
**Then:** Enter email, confirm

#### Deploy Your Project
```powershell
vercel
```

**First deployment asks:**
```
? Set up and deploy "D:\nextjs\suppermart"? [Y/n] y
? Which scope do you want to deploy to? (your-name)
? Link to existing project? [y/N] n
? What's your project's name? suppermart
? In which directory is your code located? ./
? Auto-detect build settings? [Y/n] y
```

**Press Enter for defaults. Then wait 2-3 minutes.**

**Output:**
```
🔗  Linked to your-name/suppermart (created .vercel)
🔍  Inspect: https://vercel.com/your-name/suppermart/xxxxx
✅  Production: https://suppermart-your-name.vercel.app
```

---

## 📊 PROJECT MANAGEMENT COMMANDS

### View Project Info
```powershell
vercel projects list
```

Shows all your Vercel projects with domain names.

### Link to Existing Project
If you already have a project on Vercel:
```powershell
vercel link
```

This creates `.vercel` folder locally.

### Unlink Project
```powershell
vercel unlink
```

Disconnects local project from Vercel.

---

## 🔐 ENVIRONMENT VARIABLES COMMANDS

### Set Environment Variable Locally (for testing)
```powershell
vercel env add MONGODB_URI
# Then paste: mongodb+srv://criticalgaming9999_db_user:FhZMvYQLhnrMgkYY@...

vercel env add NEXTAUTH_SECRET
# Then paste: suppermart-secret-key-production-2024

vercel env add NEXTAUTH_URL
# Then paste: https://suppermart-YOUR_USERNAME.vercel.app
```

### View Environment Variables
```powershell
vercel env list
```

Shows all env vars set in Vercel.

### Pull Environment Variables to Local
```powershell
vercel env pull .env.local
```

Downloads .env variables from Vercel to your computer.

### Remove Environment Variable
```powershell
vercel env remove MONGODB_URI
```

Deletes the variable from Vercel.

---

## 🔄 REBUILD & LOG COMMANDS

### Rebuild Latest Deployment
```powershell
vercel rebuild
```

Re-runs the build process.

### View Recent Deployments
```powershell
vercel deployments
```

Lists all your deployments (last 10).

### View Build Logs
```powershell
vercel logs
```

Shows real-time logs of your deployment.

### View Specific Deployment Logs
```powershell
vercel logs https://suppermart-your-name.vercel.app
```

Shows logs for that specific URL.

---

## 🧪 LOCAL TESTING COMMANDS

### Test Locally Before Deploying
```powershell
npm run dev
```

Runs your app at `http://localhost:3001`

### Preview Production Build Locally
```powershell
npm run build
npm start
```

Builds and runs as it would on Vercel.

---

## 🗑️ CLEANUP COMMANDS

### Remove Local Vercel Files
```powershell
Remove-Item .vercel -Recurse -Force
```

Deletes the `.vercel` folder (removes local link).

### Clear Vercel Cache
Go to [vercel.com](https://vercel.com) → Project Settings → Git → Clear Cache → Rebuild

---

## 📱 PREVIEW & SHARING COMMANDS

### Create Preview Deployment
```powershell
vercel --prod
```

Deploys to production URL.

### View Public URL
```powershell
vercel --prod --confirm
```

Shows your live URL: `https://suppermart-your-name.vercel.app`

### Share Preview Link
All deployments get a unique URL:
```
https://suppermart-[random].vercel.app
```

Share this link with others!

---

## ⚙️ SETTINGS & CONFIG COMMANDS

### View Current Settings
```powershell
vercel teams
```

Shows team/account info.

### Switch Account
```powershell
vercel switch
```

Switch between different Vercel accounts.

### Logout
```powershell
vercel logout
```

Logs out from Vercel CLI.

---

## 🐛 DEBUGGING COMMANDS

### Inspect Deployment
```powershell
vercel inspect https://suppermart-your-name.vercel.app
```

Shows detailed deployment info.

### Check Build Settings
```powershell
vercel build
```

Runs local build to see if there are errors.

### Verify Environment Variables are Set
```powershell
vercel env list --production
```

Lists all production environment variables.

---

## 📋 RECOMMENDED WORKFLOW

### For Development (Local Work):
```powershell
# 1. Make changes to code
# 2. Test locally
npm run dev

# 3. Commit to Git
git add .
git commit -m "Added feature X"

# 4. Push to GitHub
git push origin main

# 5. Vercel auto-deploys! (wait 2-3 minutes)
```

### For Emergency Fixes:
```powershell
# If Vercel needs to rebuild:
vercel rebuild

# Check logs if something went wrong:
vercel logs

# View all deployments:
vercel deployments
```

---

## 🎯 QUICK REFERENCE CHEAT SHEET

| Command | What It Does |
|---------|-------------|
| `vercel login` | Login to Vercel account |
| `vercel` | Deploy to Vercel |
| `vercel --prod` | Deploy to production |
| `vercel rebuild` | Rebuild current deployment |
| `vercel logs` | View deployment logs |
| `vercel deployments` | List all deployments |
| `vercel env add VAR_NAME` | Add environment variable |
| `vercel env list` | List all environment variables |
| `vercel env pull` | Download env vars to .env.local |
| `vercel projects list` | List all projects |
| `vercel link` | Link to existing project |
| `vercel unlink` | Disconnect from project |
| `vercel logout` | Logout |
| `vercel --version` | Check Vercel CLI version |

---

## 🔗 VERCEL WEB DASHBOARD (No Commands Needed)

Instead of CLI commands, you can also:

**Go to [vercel.com](https://vercel.com)**

Then:
- View all projects
- Manage environment variables
- View deployments & logs
- Change domains
- Update settings
- Invite team members
- View analytics

---

## ⚡ MOST USED COMMANDS

### For 99% of Users, You Only Need:

```powershell
# Deploy (first time, if using CLI)
vercel

# Push to GitHub (auto-deploys)
git push origin main

# Check logs if something fails
vercel logs

# That's it!
```

**Most deployments happen automatically when you push to GitHub!**

---

## 🚨 COMMON ERRORS & FIXES

### Error: "command not found: vercel"
**Fix:** Install Vercel CLI globally
```powershell
npm install -g vercel
```

### Error: "Not authenticated"
**Fix:** Login to Vercel
```powershell
vercel login
```

### Error: "Build failed"
**Fix:** Check logs and fix code
```powershell
vercel logs
```

### Error: "Environment variable not found"
**Fix:** Add env vars
```powershell
vercel env add VARIABLE_NAME
```

---

## 💡 TIPS & TRICKS

### Tip 1: Use GitHub Auto-Deployment (Recommended)
Push to GitHub → Vercel auto-deploys
**No CLI commands needed!**

### Tip 2: Save Environment Variables to File
```powershell
vercel env pull .env.production.local
```

### Tip 3: Preview Before Production
```powershell
npm run build
npm start
```

### Tip 4: Clear Cache When Stuck
Vercel dashboard → Settings → Git → Clear Cache → Rebuild

### Tip 5: Monitor in Real Time
```powershell
vercel logs --follow
```

Watches logs as they happen.

---

## 📚 MORE HELP

Get help for any command:
```powershell
vercel --help
vercel deploy --help
vercel env --help
```

Official Vercel Docs:
```
https://vercel.com/docs
```

---

## 🎉 YOU NOW KNOW ALL VERCEL COMMANDS!

**Remember:**
- ✅ Most of the time, just push to GitHub
- ✅ Vercel automatically deploys
- ✅ Use CLI commands only for advanced tasks
- ✅ Web dashboard works great for most users

**Start with:** `git push origin main` → Vercel auto-deploys! 🚀
