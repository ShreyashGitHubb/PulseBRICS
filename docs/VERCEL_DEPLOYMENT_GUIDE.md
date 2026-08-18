# ⚡ 1-Click Vercel Deployment Guide for PulseBRICS

PulseBRICS is configured for **Vercel** serverless deployment with full-stack React (Vite) frontend and Express API backend support.

---

## 🚀 Option 1: Deploy via Vercel Dashboard (Easiest)

1. Push your repository to **GitHub**:
   ```bash
   git add .
   git commit -m "feat: Google Light/Dark theme & Vercel deployment ready"
   git push origin main
   ```
2. Go to **[vercel.com/new](https://vercel.com/new)** and import your GitHub repository.
3. In **Project Settings**:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add **Environment Variables**:
   - `GEMINI_API_KEY`: *(Your Google AI Studio Gemini API Key)*
   - `NODE_ENV`: `production`
5. Click **Deploy**! 🚀

---

## 💻 Option 2: Deploy via Vercel CLI

```bash
# 1. Install Vercel CLI (if not already installed)
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to Preview
vercel

# 4. Deploy to Production
vercel --prod
```

---

## 📁 Key Vercel Configuration Files

- [`vercel.json`](file:///c:/Users/hp/Desktop/Hackthon/vercel.json): Configures API rewrites to `/api/index.js` and SPA routing fallback to `/index.html`.
- [`api/index.js`](file:///c:/Users/hp/Desktop/Hackthon/api/index.js): Serverless wrapper exporting the Express app handler.
- [`server/index.js`](file:///c:/Users/hp/Desktop/Hackthon/server/index.js): Dual-mode server (runs standalone on `localhost:5000` or serverless on Vercel).
