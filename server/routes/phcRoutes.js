import express from 'express';
import { INITIAL_PHC_NODES, ESSENTIAL_MEDICINES } from '../data/brics_dataset.js';
import { calculateResilienceScore } from '../services/predictiveEngine.js';

const router = express.Router();

// In-memory working copy of PHC nodes so updates are interactive
export let currentPHCNodes = JSON.parse(JSON.stringify(INITIAL_PHC_NODES));

// GET all PHCs (optionally filter by country e.g. IN, BR, ZA)
router.get('/', (req, res) => {
  const { country, district } = req.query;
  let nodes = currentPHCNodes;
  if (country) {
    nodes = nodes.filter(n => n.country.toUpperCase() === country.toUpperCase());
  }
  if (district) {
    nodes = nodes.filter(n => n.district.toLowerCase() === district.toLowerCase());
  }

  // Recalculate dynamic scores
  const processed = nodes.map(node => {
    const { resilienceScore, riskStatus } = calculateResilienceScore(node);
    return {
      ...node,
      resilienceScore,
      riskStatus
    };
  });

  res.json({ success: true, count: processed.length, data: processed });
});

// GET single PHC by ID
router.get('/:id', (req, res) => {
  const node = currentPHCNodes.find(n => n.id === req.params.id);
  if (!node) {
    return res.status(404).json({ success: false, message: 'PHC node not found' });
  }
  const { resilienceScore, riskStatus } = calculateResilienceScore(node);
  res.json({ success: true, data: { ...node, resilienceScore, riskStatus } });
});

// GET list of essential medicines
router.get('/meta/medicines', (req, res) => {
  res.json({ success: true, count: ESSENTIAL_MEDICINES.length, data: ESSENTIAL_MEDICINES });
});

// POST update PHC inventory (from Voice Log, Vision Scan, or Quick Form)
router.post('/:id/inventory-update', (req, res) => {
  const { updates, doctorAttendance, nurseAttendance } = req.body;
  const nodeIndex = currentPHCNodes.findIndex(n => n.id === req.params.id);

  if (nodeIndex === -1) {
    return res.status(404).json({ success: false, message: 'PHC node not found' });
  }

  const phc = currentPHCNodes[nodeIndex];

  if (doctorAttendance) phc.doctorAttendance = doctorAttendance;
  if (nurseAttendance) phc.nurseAttendance = nurseAttendance;

  if (Array.isArray(updates)) {
    updates.forEach(u => {
      const invItem = phc.inventory.find(i => i.medicineId === u.medicineId || i.medicineId === u.id);
      if (invItem) {
        if (u.currentStock !== undefined) invItem.stock = Number(u.currentStock);
        if (u.consumedToday !== undefined) invItem.dailyAvgBurn = Number(u.consumedToday);
        if (u.stock !== undefined) invItem.stock = Number(u.stock);
      } else {
        phc.inventory.push({
          medicineId: u.medicineId || u.id,
          stock: Number(u.currentStock || u.stock || 20),
          dailyAvgBurn: Number(u.consumedToday || 2.0),
          expiryDays: 180,
          status: 'ADEQUATE'
        });
      }
    });
  }

  const { resilienceScore, riskStatus } = calculateResilienceScore(phc);
  phc.resilienceScore = resilienceScore;
  phc.riskStatus = riskStatus;

  res.json({
    success: true,
    message: 'Inventory updated successfully via PulseBRICS logging engine',
    data: phc
  });
});

// POST reset demo dataset
router.post('/meta/reset-demo', (req, res) => {
  currentPHCNodes = JSON.parse(JSON.stringify(INITIAL_PHC_NODES));
  res.json({ success: true, message: 'Dataset reset to initial state' });
});

export default router;
