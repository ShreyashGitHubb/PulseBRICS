// PulseBRICS Frontend API Client
const API_BASE = '/api';

export async function fetchPHCNodes(country = '', district = '') {
  try {
    const params = new URLSearchParams();
    if (country) params.append('country', country);
    if (district) params.append('district', district);
    
    const res = await fetch(`${API_BASE}/phc?${params.toString()}`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('Failed to fetch PHCs:', err);
    return [];
  }
}

export async function fetchEssentialMedicines() {
  try {
    const res = await fetch(`${API_BASE}/phc/meta/medicines`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('Failed to fetch medicines:', err);
    return [];
  }
}

export async function parseVoiceLog(transcript, language = 'Hindi') {
  const res = await fetch(`${API_BASE}/ai/voice-parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript, language })
  });
  return await res.json();
}

export async function parseVisionShelf(imageBase64, mimeType = 'image/jpeg') {
  const res = await fetch(`${API_BASE}/ai/vision-scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, mimeType })
  });
  return await res.json();
}

export async function updatePHCInventory(phcId, updates, doctorAttendance, nurseAttendance) {
  const res = await fetch(`${API_BASE}/phc/${phcId}/inventory-update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ updates, doctorAttendance, nurseAttendance })
  });
  return await res.json();
}

export async function fetchDemandForecast(phcId, medicineId, surgeMultiplier = 1.0) {
  const res = await fetch(`${API_BASE}/predict/forecast?phcId=${phcId}&medicineId=${medicineId}&surgeMultiplier=${surgeMultiplier}`);
  return await res.json();
}

export async function triggerCrisisSimulation(crisisType, country = 'IN', district = '') {
  const res = await fetch(`${API_BASE}/predict/simulate-crisis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ crisisType, country, district })
  });
  return await res.json();
}

export async function findRebalanceMatch(recipientPhcId, medicineId, deficitQuantity) {
  const res = await fetch(`${API_BASE}/agent/rebalance/find-match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipientPhcId, medicineId, deficitQuantity })
  });
  return await res.json();
}

export async function authorizeDispatch(dispatchData) {
  const res = await fetch(`${API_BASE}/agent/dispatch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dispatchData)
  });
  return await res.json();
}

export async function fetchActiveDispatches() {
  try {
    const res = await fetch(`${API_BASE}/agent/dispatches`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('Failed to fetch dispatches:', err);
    return [];
  }
}

export async function fetchBRICSSignals() {
  try {
    const res = await fetch(`${API_BASE}/brics/signals`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('Failed to fetch signals:', err);
    return [];
  }
}

export async function fetchBRICSBenchmarks() {
  try {
    const res = await fetch(`${API_BASE}/brics/benchmarks`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error('Failed to fetch benchmarks:', err);
    return [];
  }
}

export async function resetDemoDataset() {
  const res = await fetch(`${API_BASE}/phc/meta/reset-demo`, { method: 'POST' });
  return await res.json();
}
