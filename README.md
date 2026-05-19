# 🎓 Scholar OS

A complete student operating system — academics, habits, college prep, life goals — built with React + Zustand + persistent storage. Inspired by Atomic Habits and systems thinking.

---

## 🚀 Deployment Guide — Zero Terminal Required

You'll use only your browser. Everything happens through web interfaces: GitHub.com, Vercel.com, Supabase.com.

### Total time: 10–15 minutes

---

## STEP 1 — Create a GitHub Account & Upload the Project

### 1a. Sign up for GitHub
1. Go to **[github.com](https://github.com)**
2. Click **Sign up** (free)
3. Verify your email

### 1b. Create a new repository
1. Click the **+** in the top right → **New repository**
2. Repository name: `scholar-os`
3. Set it to **Public** (required for Vercel free tier)
4. Do NOT check "Initialize with README"
5. Click **Create repository**

### 1c. Upload the files
1. On the empty repo page, click **uploading an existing file** (it's a blue link in the middle of the page)
2. Open the `scholar-os` folder on your computer
3. **Select ALL contents** (Ctrl+A on Windows, Cmd+A on Mac) inside the `scholar-os` folder
4. Drag everything into the GitHub upload area
5. Wait for all files to finish uploading (you'll see progress bars)
6. Scroll down, type a commit message: `Initial commit`
7. Click **Commit changes**

✅ **Done.** Your code is now on GitHub.

> 📝 **Note:** Do NOT drag the parent `scholar-os` folder itself — drag its CONTENTS (the `src` folder, `package.json`, `index.html`, etc.). Otherwise it nests one level too deep.

---

## STEP 2 — Deploy to Vercel

### 2a. Sign up for Vercel
1. Go to **[vercel.com](https://vercel.com)**
2. Click **Sign Up**
3. Choose **Continue with GitHub** (easiest)
4. Authorize Vercel to access GitHub

### 2b. Import your project
1. On the Vercel dashboard, click **Add New** → **Project**
2. You'll see your GitHub repositories. Find `scholar-os` and click **Import**
3. Vercel auto-detects it's a Vite project — leave all settings as default
4. Click **Deploy**
5. Wait ~1 minute for the build to complete

✅ **Done.** Your app is live!

Vercel gives you a URL like `https://scholar-os-yourname.vercel.app`. Click **Visit** to see your live app.

> Every time you make changes on GitHub, Vercel will automatically rebuild and redeploy.

---

## STEP 3 — Supabase (Optional, for Cloud Sync)

The app works perfectly without Supabase — everything saves to your browser's local storage. But if you want cloud sync (access from any device), follow these steps.

### 3a. Sign up for Supabase
1. Go to **[supabase.com](https://supabase.com)**
2. Click **Start your project**
3. Sign in with GitHub
4. Click **New project**
5. Pick the free **Organization**, name it `scholar-os`, choose your region, set a database password (save it!)
6. Wait ~2 minutes for provisioning

### 3b. Get your API keys
1. In your Supabase project, click the gear icon (**Settings**) in the left sidebar
2. Click **API**
3. You'll see two values you need:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** API key

### 3c. Add environment variables to Vercel
1. Go to **vercel.com** → your `scholar-os` project → **Settings** → **Environment Variables**
2. Add these two:
   ```
   Name: VITE_SUPABASE_URL
   Value: [paste your Project URL]

   Name: VITE_SUPABASE_ANON_KEY
   Value: [paste your anon public key]
   ```
3. Click **Save**
4. Go to **Deployments** tab → click the three dots on the latest deployment → **Redeploy**

> Cloud sync is wired up in the codebase but not active by default — your data lives in `localStorage`. The Supabase integration is ready for when you want to add user accounts.

---

## 🎉 You're Done!

Your Scholar OS is live and ready to use. Bookmark your Vercel URL.

---

## 🔄 How to Make Changes Later

Everything is done in the browser, no terminal needed:

1. Go to your GitHub repo
2. Click any file → click the pencil icon → make changes → **Commit changes**
3. Vercel automatically rebuilds and deploys within ~1 minute

To add brand-new files: on the GitHub repo home, click **Add file** → **Create new file** or **Upload files**.

---

## 🌐 Custom Domain (Optional)

If you own a domain (e.g. from Namecheap, GoDaddy):

1. In Vercel → your project → **Settings** → **Domains**
2. Enter your domain (e.g. `scholaros.app`) → **Add**
3. Vercel shows you DNS records to add
4. Go to your domain registrar's DNS settings and add the records Vercel shows
5. Wait 5–60 minutes for DNS to propagate

---

## 📚 Features

### Academic Hub
- **Dashboard** — Daily overview with stats, deadlines, habits
- **Assignments** — Track every task with priority, status, due dates
- **Exams** — Plan tests with study hour goals
- **Classes** — Color-coded class cards with grades
- **Notes** — Distraction-free writing per class
- **Flashcards** — Spaced repetition (SM-2 algorithm) for active recall
- **Study Room** — Pomodoro timer, study music, technique guide

### College Hub
- **College Tracker** — Dream / Target / Safety tiers
- **Essay Organizer** — Word count tracking, status, prompts
- **Score Tracker** — SAT, ACT, AP, PSAT with goal comparison
- **Awards** — School to international level badges
- **Activities** — Common App formatted (150-char limit enforced)
- **Scholarships** — Track applications, total won
- **Stanford Prep** — Grade 9-12 actionable checklists based on Stanford's stated values

### Life Hub
- **Habits** — 7-day grid, streak tracking, weekly stats
- **Goals** — SMART framework with progress bars
- **Skills** — Level tracking with categories
- **Books** — Reading status with star ratings
- **Spending** — Category breakdown
- **Journal** — Mood, gratitude, reflections daily template

### Mission Control
- **Long-term Goals** — Annual, quarterly, life vision goals
- **Milestones** — Roadmap each goal with deadlines

### Projects
- **Portfolio** — Track tech stack, GitHub, demo links
- **Kanban** — Todo / In Progress / Done columns

### Tools
- **Calendar** — Month + agenda view of all deadlines
- **Analytics** — Habit heatmap (90 days), focus charts, completion rate
- **Search** — Global search across everything

### Always-on
- **Pomodoro Timer** in top bar (fixed stale-closure bug)
- **Notifications** for deadlines and missed habits
- **Dark mode** by default
- **Persistent storage** — survives reload

---

## 💡 Inspired By

- **Atomic Habits** (James Clear) — focus on systems over goals
- **Building Systems** — Scholar OS framework
- **The 1% better daily** philosophy

> "You do not rise to the level of your goals. You fall to the level of your systems."

---

## 🛠 Tech Stack

- **React 18** — UI framework
- **Zustand** — State management with localStorage persistence
- **Vite** — Build tool
- **No backend required** — everything runs in your browser

---

## 📄 License

MIT — Free to use, modify, and share.
