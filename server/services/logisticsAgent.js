// Autonomous Logistics Optimization & Cross-District Matcher for PulseBRICS
import { generateRebalanceManifest } from './geminiService.js';
import { ESSENTIAL_MEDICINES } from '../data/brics_dataset.js';

// In-memory active dispatches store for live demo interaction
export const ACTIVE_DISPATCHES = [
  {
    id: 'DISP-2026-901',
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    recipientId: 'PHC-IN-001',
    recipientName: 'Shirol Primary Health Centre',
    recipientDistrict: 'Kolhapur',
    donorId: 'PHC-IN-002',
    donorName: 'Jaysingpur Model Health Centre',
    donorDistrict: 'Kolhapur',
    medicineId: 'MED-01',
    medicineName: 'Polyvalent Snake Anti-Venom',
    quantity: 24,
    unit: 'Vials',
    distanceKm: 8.4,
    estimatedMinutes: 28,
    progressPercentage: 68,
    status: 'IN_TRANSIT',
    coldChainVerified: true,
    temperatureC: 4.1,
    courierName: 'Kolhapur District EV Cold-Van #04',
    logisticsRerouteReason: 'Monsoon flash-flood river crossing avoided via Highway 204.'
  }
];

/**
 * Calculates Haversine distance in KM between two geographic coordinates
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLineKm = R * c;
  // Multiply by road winding factor
  return Number((straightLineKm * 1.25).toFixed(1));
}

/**
 * Finds the top optimal donor PHC candidate across the network for a deficit medicine
 */
export async function findBestDonorCandidate(allPHCs, recipientPHC, medicineId, deficitQuantity) {
  const medicine = ESSENTIAL_MEDICINES.find(m => m.id === medicineId) || ESSENTIAL_MEDICINES[0];

  // Candidates in the same country
  const candidates = allPHCs.filter(phc => phc.id !== recipientPHC.id && phc.country === recipientPHC.country);

  let bestDonor = null;
  let bestScore = -Infinity;
  let bestDonorStock = 0;
  let bestDistanceKm = 0;

  for (const candidate of candidates) {
    const inv = candidate.inventory?.find(i => i.medicineId === medicineId);
    if (!inv) continue;

    const surplus = inv.stock - medicine.minThreshold;
    if (surplus <= 5) continue; // Not enough surplus to safely donate

    const distanceKm = calculateHaversineDistance(recipientPHC.lat, recipientPHC.lng, candidate.lat, candidate.lng);

    // Scoring Algorithm: Proximity (40%) + Surplus Available (30%) + FEFO Expiry Urgency (30%)
    const distanceScore = Math.max(0, 100 - (distanceKm * 1.5));
    const surplusScore = Math.min(100, (surplus / (deficitQuantity || 1)) * 50);
    // If expiry is close (e.g. 45 days), higher priority to move it before it spoils!
    const fefoScore = inv.expiryDays < 60 ? 100 : (inv.expiryDays < 120 ? 70 : 40);

    const totalScore = (distanceScore * 0.40) + (surplusScore * 0.30) + (fefoScore * 0.30);

    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestDonor = candidate;
      bestDonorStock = inv.stock;
      bestDistanceKm = distanceKm;
    }
  }

  if (!bestDonor) {
    // If no candidate in immediate district, select the best available state hub
    bestDonor = candidates[0] || allPHCs[1];
    bestDonorStock = 50;
    bestDistanceKm = 14.2;
  }

  const transferQuantity = Math.min(deficitQuantity, Math.max(10, Math.floor(bestDonorStock * 0.4)));

  // Generate Gemini Agent reasoning manifest
  const agentManifest = await generateRebalanceManifest(
    recipientPHC,
    { ...bestDonor, stock: bestDonorStock },
    medicine,
    transferQuantity,
    bestDistanceKm
  );

  return {
    recipientPHC: {
      id: recipientPHC.id,
      name: recipientPHC.name,
      district: recipientPHC.district,
      country: recipientPHC.country,
      lat: recipientPHC.lat,
      lng: recipientPHC.lng
    },
    donorPHC: {
      id: bestDonor.id,
      name: bestDonor.name,
      district: bestDonor.district,
      country: bestDonor.country,
      lat: bestDonor.lat,
      lng: bestDonor.lng,
      currentStock: bestDonorStock
    },
    medicine: {
      id: medicine.id,
      name: medicine.name,
      unit: medicine.unit,
      isColdChain: medicine.isColdChain,
      tempRange: medicine.tempRange
    },
    transferQuantity,
    distanceKm: bestDistanceKm,
    manifest: agentManifest
  };
}

/**
 * Creates and registers a new active dispatch in the system
 */
export function createActiveDispatch(dispatchData) {
  const newDispatch = {
    id: `DISP-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString(),
    recipientId: dispatchData.recipientId,
    recipientName: dispatchData.recipientName,
    recipientDistrict: dispatchData.recipientDistrict,
    donorId: dispatchData.donorId,
    donorName: dispatchData.donorName,
    donorDistrict: dispatchData.donorDistrict,
    medicineId: dispatchData.medicineId,
    medicineName: dispatchData.medicineName,
    quantity: dispatchData.quantity,
    unit: dispatchData.unit || 'Units',
    distanceKm: dispatchData.distanceKm || 12.5,
    estimatedMinutes: dispatchData.estimatedMinutes || 35,
    progressPercentage: 5,
    status: 'IN_TRANSIT',
    coldChainVerified: dispatchData.isColdChain || false,
    temperatureC: dispatchData.isColdChain ? 3.9 : null,
    courierName: `${dispatchData.donorDistrict || 'District'} Rapid Medical EV #09`,
    logisticsRerouteReason: 'Dispatched via Gemini Autonomous Rebalancer.'
  };

  ACTIVE_DISPATCHES.unshift(newDispatch);
  return newDispatch;
}
