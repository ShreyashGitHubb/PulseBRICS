# PulseBRICS — Deployment & Production Guide

This guide details how to deploy PulseBRICS to **Google Cloud Platform (Cloud Run & Firebase)**.

---

## 1. Local Development Setup

### Prerequisites
- Node.js >= 18
- npm >= 9

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Create `.env` in the root directory:
```env
PORT=5000
GEMINI_API_KEY=your_google_gemini_api_key
NODE_ENV=development
```

### Step 3: Run Development Server
```bash
npm run dev
```
- Frontend UI: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## 2. Deploy to Google Cloud Run (Containerized Serverless)

### Step 1: Build Docker Container
```bash
docker build -t gcr.io/[YOUR_GCP_PROJECT_ID]/pulse-brics:v1 .
```

### Step 2: Push to Google Artifact Registry
```bash
docker push gcr.io/[YOUR_GCP_PROJECT_ID]/pulse-brics:v1
```

### Step 3: Deploy to Cloud Run
```bash
gcloud run deploy pulse-brics \
  --image gcr.io/[YOUR_GCP_PROJECT_ID]/pulse-brics:v1 \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key_here,NODE_ENV=production
```

---

## 3. Deploy Frontend to Firebase Hosting (Optional)
```bash
npm run client:build
npx -y firebase-tools deploy --only hosting
```
