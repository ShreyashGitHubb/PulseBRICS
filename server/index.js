import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import phcRoutes from './routes/phcRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import predictRoutes from './routes/predictRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import bricsRoutes from './routes/bricsRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'PulseBRICS API Core',
    version: '1.0.0',
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
    timestamp: new Date().toISOString()
  });
});

// API Routes Mount
app.use('/api/phc', phcRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/brics', bricsRoutes);

// In production, serve Vite client build
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`
  =============================================================
   🌐 PulseBRICS Health Supply Chain AI Server Running!
   📡 Port: http://localhost:${PORT}
   🚀 API Endpoints:
      - GET  /api/health
      - GET  /api/phc (List PHCs)
      - POST /api/ai/voice-parse (Gemini Multilingual Audio)
      - POST /api/ai/vision-scan (Gemini Vision OCR)
      - GET  /api/predict/forecast (Time-Series Prediction)
      - POST /api/agent/rebalance/find-match (Gemini Logistics Agent)
      - GET  /api/brics/signals (Cross-Border Federation)
  =============================================================
  `);
});
