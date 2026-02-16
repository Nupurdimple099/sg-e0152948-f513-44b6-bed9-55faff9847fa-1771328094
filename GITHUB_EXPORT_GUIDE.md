# 📤 GitHub Export Guide - IELTS Practice App

## Quick Start Options

### 🎯 Option 1: Automated Script (Easiest!)

**For Mac/Linux:**
```bash
chmod +x push-to-github.sh
./push-to-github.sh
```

**For Windows (Git Bash):**
```bash
bash push-to-github.sh
```

The script will:
- ✅ Check Git installation
- ✅ Initialize repository
- ✅ Create .gitignore
- ✅ Add and commit files
- ✅ Guide you through GitHub setup
- ✅ Push your code

---

### 🖱️ Option 2: GitHub Desktop (No Command Line!)

**Step 1: Install GitHub Desktop**
- Download: https://desktop.github.com/
- Install and sign in to GitHub

**Step 2: Add Your Project**
1. Open GitHub Desktop
2. File → Add Local Repository
3. Browse to your project folder
4. Click "Add Repository"

**Step 3: Publish**
1. Click "Publish repository"
2. Name: `ielts-practice-app`
3. Description: "Professional IELTS Practice Platform"
4. Choose Public or Private
5. Click "Publish Repository"

✅ **Done!** Your code is on GitHub!

---

### 💻 Option 3: Manual Command Line

**Step 1: Create GitHub Repository**
1. Go to https://github.com/new
2. Repository name: `ielts-practice-app`
3. Description: "Professional IELTS Practice Platform with AI-powered test generation"
4. Choose Public or Private
5. **DO NOT** check "Initialize with README"
6. Click "Create repository"
7. **Copy the repository URL** (e.g., `https://github.com/USERNAME/ielts-practice-app.git`)

**Step 2: Initialize Git Locally**
```bash
# Navigate to your project folder
cd /path/to/your/project

# Initialize Git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - IELTS Practice App"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/ielts-practice-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Step 3: Enter Credentials**
- GitHub will ask for username and password
- **Note:** Use a Personal Access Token instead of password
- Get token at: https://github.com/settings/tokens

---

## 🔐 GitHub Personal Access Token Setup

If Git asks for credentials:

**Step 1: Create Token**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: "IELTS Practice Deployment"
4. Expiration: 90 days (or your preference)
5. Select scopes:
   - ✅ repo (Full control of private repositories)
   - ✅ workflow (Update GitHub Actions workflows)
6. Click "Generate token"
7. **Copy the token immediately** (you won't see it again!)

**Step 2: Use Token**
- Username: Your GitHub username
- Password: Paste the token (not your GitHub password)

**Step 3: Save Credentials (Optional)**
```bash
# Save credentials for future pushes
git config --global credential.helper store
```

---

## 📋 What Gets Pushed to GitHub

### ✅ Included Files:
- All source code (`src/`)
- Configuration files (`next.config.mjs`, `tailwind.config.ts`)
- Package files (`package.json`, `package-lock.json`)
- Documentation (`README.md`, guides)
- Public assets (`public/`)
- Supabase migrations (`supabase/migrations/`)

### ❌ Excluded Files (in .gitignore):
- `node_modules/` (dependencies)
- `.env.local` (sensitive credentials)
- `.next/` (build files)
- `logs/` (log files)
- IDE files (`.vscode`, `.idea`)

**Important:** Your `.env.local` file with credentials is NOT pushed to GitHub (for security).

---

## 🔄 Future Updates - How to Push Changes

After your initial push, use these commands for updates:

```bash
# 1. Check what changed
git status

# 2. Add changes
git add .

# 3. Commit with descriptive message
git commit -m "Add new feature: Test Management UI"

# 4. Push to GitHub
git push

# That's it! Your changes are now on GitHub
```

---

## 🚀 After Pushing to GitHub

### Next Step: Deploy to Vercel

**Option A: Automatic Deployment**
1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Configure environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   SUPABASE_DB_PASSWORD
   SUPABASE_ACCESS_TOKEN
   OPENAI_API_KEY
   ```
5. Click "Deploy"

**Benefits:**
- ✅ Auto-deploy on every push to main branch
- ✅ Preview deployments for branches
- ✅ Instant rollbacks
- ✅ No manual deployments needed

**Option B: Manual Deployment**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

---

## 🛠️ Troubleshooting

### "Git is not installed"
**Windows:**
- Download: https://git-scm.com/download/win
- Run installer with default settings

**Mac:**
```bash
brew install git
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install git
```

### "Permission denied (publickey)"
**Solution 1: Use HTTPS instead of SSH**
```bash
# If you used SSH URL (git@github.com:...)
git remote set-url origin https://github.com/USERNAME/ielts-practice-app.git
git push -u origin main
```

**Solution 2: Set up SSH Key**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub
# Go to: https://github.com/settings/keys
# Click "New SSH key"
# Paste the contents of: ~/.ssh/id_ed25519.pub
```

### "Repository not found"
- Check that the repository exists on GitHub
- Verify you have access to the repository
- Double-check the URL spelling

### "Failed to push some refs"
```bash
# If remote has changes you don't have locally
git pull origin main --rebase
git push origin main
```

### Large Files Warning
If you see "file is larger than 100MB":
```bash
# Use Git LFS for large files
git lfs install
git lfs track "*.mp3"
git lfs track "*.mp4"
git add .gitattributes
git commit -m "Add Git LFS tracking"
git push
```

---

## 📊 Verify Your Upload

After pushing, verify on GitHub:

1. **Go to your repository page:**
   `https://github.com/YOUR_USERNAME/ielts-practice-app`

2. **Check these files exist:**
   - ✅ `package.json`
   - ✅ `next.config.mjs`
   - ✅ `src/pages/index.tsx`
   - ✅ `README.md`
   - ✅ `supabase/migrations/`

3. **Verify .env.local is NOT there** (should be in .gitignore)

4. **Check commit history:**
   - Click "Commits" to see your commits
   - Verify all files were added

---

## 🔒 Security Checklist

Before making repository public:

- [ ] `.env.local` is in `.gitignore`
- [ ] No API keys in code
- [ ] No passwords in code
- [ ] No database credentials exposed
- [ ] Sensitive files excluded

**If you accidentally pushed secrets:**
```bash
# Remove file from Git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.local" \
  --prune-empty --tag-name-filter cat -- --all

# Force push
git push origin --force --all

# IMPORTANT: Regenerate all exposed credentials!
```

---

## 📚 Helpful Git Commands

```bash
# View commit history
git log --oneline

# View changes
git diff

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# View remote URL
git remote -v

# Change remote URL
git remote set-url origin NEW_URL

# Create and switch to new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Merge branch
git merge feature/new-feature

# Delete branch
git branch -d feature/new-feature
```

---

## 🎓 Git Best Practices

1. **Commit Often**
   - Small, focused commits
   - Clear commit messages

2. **Use Branches**
   ```bash
   git checkout -b feature/test-management
   # Make changes
   git push -u origin feature/test-management
   ```

3. **Write Good Commit Messages**
   ```bash
   # Good ✅
   git commit -m "feat: Add test management UI with filtering"
   git commit -m "fix: Resolve authentication redirect loop"
   
   # Bad ❌
   git commit -m "updates"
   git commit -m "fix"
   ```

4. **Pull Before Push**
   ```bash
   git pull origin main
   git push origin main
   ```

---

## 🆘 Get Help

- **GitHub Docs:** https://docs.github.com
- **Git Documentation:** https://git-scm.com/doc
- **GitHub Support:** https://support.github.com
- **Stack Overflow:** https://stackoverflow.com/questions/tagged/git

---

## ✅ Success Checklist

After following this guide:

- [ ] Code is on GitHub
- [ ] Repository is accessible
- [ ] All files uploaded correctly
- [ ] .env.local NOT in repository
- [ ] Can view repository online
- [ ] Ready to deploy to Vercel

**Next:** Open `VERCEL_INTEGRATION_GUIDE.md` for deployment instructions!

---

**Need help?** Run the automated script:
```bash
./push-to-github.sh
```

It will guide you through the entire process! 🚀