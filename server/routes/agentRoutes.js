import express from 'express';
import { currentPHCNodes } from './phcRoutes.js';
import { findBestDonorCandidate, createActiveDispatch, ACTIVE_DISPATCHES } from '../services/logisticsAgent.js';

const router = express.Router();

// GET list of active dispatches in transit
router.get('/dispatches', (req, res) => {
  res.json({ success: true, count: ACTIVE_DISPATCHES.length, data: ACTIVE_DISPATCHES });
});

// Handler for finding best donor match
async function handleFindMatch(req, res) {
  try {
    const { recipientPhcId, medicineId, deficitQuantity } = req.body;

    const recipient = currentPHCNodes.find(n => n.id === recipientPhcId) || currentPHCNodes[0];
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient PHC not found' });
    }

    const matchPlan = await findBestDonorCandidate(
      currentPHCNodes,
      recipient,
      medicineId || 'MED-01',
      deficitQuantity || 20
    );

    res.json({ success: true, data: matchPlan });
  } catch (err) {
    console.error('Error finding rebalance match:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

// Handler for authorizing dispatch
function handleDispatch(req, res) {
  const { recipientId, donorId, medicineId, quantity, distanceKm, isColdChain } = req.body;

  const recipient = currentPHCNodes.find(n => n.id === recipientId);
  const donor = currentPHCNodes.find(n => n.id === donorId);

  if (!recipient || !donor) {
    return res.status(404).json({ success: false, message: 'Invalid recipient or donor PHC ID' });
  }

  // Deduct from donor inventory
  const donorInv = donor.inventory.find(i => i.medicineId === medicineId);
  if (donorInv) {
    donorInv.stock = Math.max(0, donorInv.stock - (quantity || 15));
  }

  // Create in-transit dispatch record
  const dispatchRecord = createActiveDispatch({
    recipientId: recipient.id,
    recipientName: recipient.name,
    recipientDistrict: recipient.district,
    donorId: donor.id,
    donorName: donor.name,
    donorDistrict: donor.district,
    medicineId: medicineId,
    medicineName: donorInv ? 'Polyvalent Snake Anti-Venom' : 'Essential Medicine',
    quantity: quantity || 20,
    unit: 'Vials',
    isColdChain: isColdChain !== undefined ? isColdChain : true,
    distanceKm: distanceKm || 8.4,
    estimatedMinutes: 28
  });

  // Temporarily adjust recipient resilience score upwards
  recipient.alertMessage = `Rebalancing Active: ${quantity || 20} units en-route from ${donor.name}. ETA: 28 mins.`;
  recipient.riskStatus = 'WATCH';

  res.json({
    success: true,
    message: 'Dispatch authorized and logged into PulseBRICS logistics mesh.',
    data: dispatchRecord
  });
}

// Mount both path styles for maximum interoperability
router.post('/find-match', handleFindMatch);
router.post('/rebalance/find-match', handleFindMatch);

router.post('/dispatch', handleDispatch);
router.post('/rebalance/dispatch', handleDispatch);

export default router;
