import express from 'express';
import { parseVoiceInventoryLog, parseVisionShelfImage } from '../services/geminiService.js';

const router = express.Router();

// POST parse voice transcription (multilingual speech to structured inventory)
router.post('/voice-parse', async (req, res) => {
  try {
    const { transcript, language } = req.body;
    if (!transcript) {
      return res.status(400).json({ success: false, message: 'Transcript text is required' });
    }

    const result = await parseVoiceInventoryLog(transcript, language || 'Hindi');
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error in voice-parse route:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST parse shelf image (Gemini Multimodal OCR)
router.post('/vision-scan', async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    const result = await parseVisionShelfImage(imageBase64, mimeType || 'image/jpeg');
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error in vision-scan route:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST generate policy briefing for health ministers
router.post('/ministerial-briefing', (req, res) => {
  const { country, urgentCount, activeRebalanceCount } = req.body;
  const briefing = {
    title: `National Health Logistics Briefing — ${country || 'India'} (2026 BRICS Initiative)`,
    timestamp: new Date().toISOString(),
    executiveSummary: `Autonomous surveillance detected ${urgentCount || 3} last-mile clinics facing critical stockout vulnerabilities. Autonomous redistribution mesh has dispatched ${activeRebalanceCount || 2} cross-district transfers, saving an estimated 14 hours in delivery time and averting 100% of expired medicine waste.`,
    priorityActions: [
      'Approve emergency cold-chain express corridor between Jaysingpur and Shirol PHC.',
      'Deploy mobile solar refrigeration units to 2 rural clinics experiencing electrical instability.',
      'Calibrate sub-district ORS reserves ahead of incoming monsoon wave based on Brazilian Dengue-3 telemetry.'
    ],
    status: 'SYSTEM_OPTIMAL_ACTIVE_MITIGATION'
  };
  res.json({ success: true, data: briefing });
});

export default router;
