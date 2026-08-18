import express from 'express';
import { currentPHCNodes } from './phcRoutes.js';
import { generateDemandForecast } from '../services/predictiveEngine.js';

const router = express.Router();

// GET 30-day forecast for a PHC and medicine
router.get('/forecast', (req, res) => {
  const { phcId, medicineId, surgeMultiplier } = req.query;

  const phc = currentPHCNodes.find(n => n.id === phcId) || currentPHCNodes[0];
  const medId = medicineId || 'MED-01';

  const forecast = generateDemandForecast(phc, medId, {
    surgeMultiplier: parseFloat(surgeMultiplier) || 1.0
  });

  res.json({ success: true, data: forecast });
});

// POST simulate crisis injection
router.post('/simulate-crisis', (req, res) => {
  const { crisisType, district, country } = req.body;

  // Crisis presets
  // 1. MONSOON_FLOOD: Accelerates snakebites (MED-01) and gastro-enteritis (MED-05)
  // 2. DENGUE_OUTBREAK: Accelerates hydration (MED-05), antipyretics (MED-07), and antibiotics (MED-06)
  // 3. LOAD_SHEDDING_GRID: Degrades cold-chain refrigeration score

  let affectedCount = 0;

  currentPHCNodes.forEach(phc => {
    if (phc.country === (country || 'IN') && (!district || phc.district.toLowerCase() === district.toLowerCase())) {
      affectedCount++;

      if (crisisType === 'MONSOON_FLOOD') {
        phc.riskStatus = 'CRITICAL_SURGE';
        phc.resilienceScore = Math.max(20, phc.resilienceScore - 35);
        phc.alertMessage = '🚨 SIMULATION ACTIVE: Flash flood alert. Snakebite admissions up 340%, acute diarrhea spike.';
        
        // Deplete critical stock
        const sav = phc.inventory.find(i => i.medicineId === 'MED-01');
        if (sav) sav.stock = Math.max(2, Math.floor(sav.stock * 0.4));
        const ors = phc.inventory.find(i => i.medicineId === 'MED-05');
        if (ors) ors.stock = Math.max(15, Math.floor(ors.stock * 0.3));
      } else if (crisisType === 'DENGUE_OUTBREAK') {
        phc.riskStatus = 'CRITICAL_SURGE';
        phc.resilienceScore = Math.max(25, phc.resilienceScore - 30);
        phc.alertMessage = '🚨 SIMULATION ACTIVE: Dengue Type-3 outbreak wave. Massive fever clinic footfall.';
        
        const para = phc.inventory.find(i => i.medicineId === 'MED-07');
        if (para) para.stock = Math.max(25, Math.floor(para.stock * 0.25));
        const ors = phc.inventory.find(i => i.medicineId === 'MED-05');
        if (ors) ors.stock = Math.max(20, Math.floor(ors.stock * 0.35));
      } else if (crisisType === 'LOAD_SHEDDING') {
        phc.coldChainStatus = 'CRITICAL: Thermal Rise (8.6°C)';
        phc.powerBackupHours = 2;
        phc.resilienceScore = Math.max(30, phc.resilienceScore - 25);
        phc.alertMessage = '🚨 SIMULATION ACTIVE: Grid blackout. Cold-chain storage at risk of total spoilage.';
      }
    }
  });

  res.json({
    success: true,
    message: `Crisis "${crisisType}" triggered across ${affectedCount} facilities in ${district || country}`,
    crisisType,
    affectedCount
  });
});

export default router;
