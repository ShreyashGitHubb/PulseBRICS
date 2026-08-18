// Comprehensive Realistic Health & Supply Chain Dataset for BRICS Nations
// Includes Primary Health Centres (PHCs / UBSs / CHCs), essential drugs, cold-chain status, and staff.

export const BRICS_COUNTRIES = {
  INDIA: {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currency: 'INR (₹)',
    healthSystem: 'Ayushman Bharat & National Health Mission (NHM)',
    unitType: 'Primary Health Centre (PHC)',
    centerCoordinates: [19.7515, 75.7139],
    zoom: 6,
    districts: ['Kolhapur', 'Pune', 'Ernakulam', 'Varanasi', 'Cuttack']
  },
  BRAZIL: {
    code: 'BR',
    name: 'Brazil',
    flag: '🇧🇷',
    currency: 'BRL (R$)',
    healthSystem: 'Sistema Único de Saúde (SUS)',
    unitType: 'Unidade Básica de Saúde (UBS)',
    centerCoordinates: [-14.2350, -51.9253],
    zoom: 5,
    districts: ['São Paulo', 'Campinas', 'Salvador', 'Manaus', 'Recife']
  },
  SOUTH_AFRICA: {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    currency: 'ZAR (R)',
    healthSystem: 'National Health Insurance (NHI) & Primary Care',
    unitType: 'Community Health Centre (CHC)',
    centerCoordinates: [-29.0852, 26.1596],
    zoom: 6,
    districts: ['Johannesburg', 'eThekwini (Durban)', 'Cape Town', 'Polokwane', 'Mthatha']
  }
};

export const ESSENTIAL_MEDICINES = [
  { id: 'MED-01', name: 'Polyvalent Snake Anti-Venom', category: 'Emergency Anti-Toxins', unit: 'Vials', minThreshold: 20, isColdChain: true, tempRange: '2°C - 8°C', criticalLevel: 'HIGH' },
  { id: 'MED-02', name: 'Human Insulin (Regular)', category: 'Chronic Disease', unit: 'Vials', minThreshold: 35, isColdChain: true, tempRange: '2°C - 8°C', criticalLevel: 'HIGH' },
  { id: 'MED-03', name: 'Oxytocin 10 IU Injection', category: 'Maternal Health', unit: 'Ampoules', minThreshold: 50, isColdChain: true, tempRange: '2°C - 8°C', criticalLevel: 'HIGH' },
  { id: 'MED-04', name: 'Amoxicillin 500mg', category: 'Essential Antibiotics', unit: 'Strips', minThreshold: 100, isColdChain: false, tempRange: 'Ambient', criticalLevel: 'MEDIUM' },
  { id: 'MED-05', name: 'Oral Rehydration Salts (ORS)', category: 'Pediatric & Dehydration', unit: 'Packets', minThreshold: 250, isColdChain: false, tempRange: 'Ambient', criticalLevel: 'HIGH' },
  { id: 'MED-06', name: 'Doxycycline 100mg', category: 'Vector-Borne (Lepto/Dengue)', unit: 'Tablets', minThreshold: 80, isColdChain: false, tempRange: 'Ambient', criticalLevel: 'MEDIUM' },
  { id: 'MED-07', name: 'Paracetamol 650mg', category: 'Analgesics / Antipyretics', unit: 'Strips', minThreshold: 200, isColdChain: false, tempRange: 'Ambient', criticalLevel: 'LOW' },
  { id: 'MED-08', name: 'Rabies Vaccine (PVRV)', category: 'Vaccines', unit: 'Doses', minThreshold: 30, isColdChain: true, tempRange: '2°C - 8°C', criticalLevel: 'HIGH' },
  { id: 'MED-09', name: 'Artesunate Injection (Malaria)', category: 'Anti-Malarial', unit: 'Vials', minThreshold: 25, isColdChain: false, tempRange: 'Ambient', criticalLevel: 'HIGH' },
  { id: 'MED-10', name: 'Erythromycin Eye Ointment', category: 'Neonatal Care', unit: 'Tubes', minThreshold: 40, isColdChain: false, tempRange: 'Ambient', criticalLevel: 'MEDIUM' }
];

export const INITIAL_PHC_NODES = [
  // --- INDIA (MAHARASHTRA / KERALA / UP) ---
  {
    id: 'PHC-IN-001',
    country: 'IN',
    name: 'Shirol Primary Health Centre',
    district: 'Kolhapur',
    state: 'Maharashtra',
    lat: 16.7384,
    lng: 74.5976,
    catchmentPopulation: 28400,
    totalBeds: 12,
    occupiedBeds: 11,
    doctorAttendance: '2/2 Present',
    nurseAttendance: '4/4 Present',
    coldChainStatus: 'STABLE (4.2°C)',
    powerBackupHours: 18,
    connectivity: '3G / Intermittent',
    resilienceScore: 42, // High risk
    riskStatus: 'CRITICAL_SURGE',
    alertMessage: 'Monsoon flood warning in river basin: Snake Anti-Venom & ORS running dangerously low (3 days buffer).',
    inventory: [
      { medicineId: 'MED-01', stock: 4, dailyAvgBurn: 2.8, expiryDays: 180, status: 'STOCKOUT_IMMINENT' },
      { medicineId: 'MED-02', stock: 42, dailyAvgBurn: 1.5, expiryDays: 95, status: 'ADEQUATE' },
      { medicineId: 'MED-03', stock: 12, dailyAvgBurn: 3.2, expiryDays: 120, status: 'LOW' },
      { medicineId: 'MED-04', stock: 110, dailyAvgBurn: 12.0, expiryDays: 240, status: 'ADEQUATE' },
      { medicineId: 'MED-05', stock: 35, dailyAvgBurn: 28.0, expiryDays: 360, status: 'STOCKOUT_IMMINENT' },
      { medicineId: 'MED-06', stock: 18, dailyAvgBurn: 6.0, expiryDays: 210, status: 'LOW' },
      { medicineId: 'MED-07', stock: 240, dailyAvgBurn: 15.0, expiryDays: 300, status: 'ADEQUATE' },
      { medicineId: 'MED-08', stock: 6, dailyAvgBurn: 1.8, expiryDays: 45, status: 'STOCKOUT_IMMINENT' }
    ]
  },
  {
    id: 'PHC-IN-002',
    country: 'IN',
    name: 'Jaysingpur Model Health Centre',
    district: 'Kolhapur',
    state: 'Maharashtra',
    lat: 16.7865,
    lng: 74.5614,
    catchmentPopulation: 34000,
    totalBeds: 20,
    occupiedBeds: 9,
    doctorAttendance: '3/3 Present',
    nurseAttendance: '6/6 Present',
    coldChainStatus: 'OPTIMAL (3.8°C)',
    powerBackupHours: 48,
    connectivity: '4G / Stable',
    resilienceScore: 92, // Strong surplus donor node
    riskStatus: 'SURPLUS_DONOR',
    alertMessage: 'Surplus Anti-Venom (54 vials) and ORS (480 pkts) with near-term expiry batch (45 days) available for rebalance.',
    inventory: [
      { medicineId: 'MED-01', stock: 58, dailyAvgBurn: 0.8, expiryDays: 42, status: 'SURPLUS_EXPIRING_SOON' },
      { medicineId: 'MED-02', stock: 85, dailyAvgBurn: 2.1, expiryDays: 210, status: 'ADEQUATE' },
      { medicineId: 'MED-03', stock: 78, dailyAvgBurn: 2.0, expiryDays: 190, status: 'ADEQUATE' },
      { medicineId: 'MED-04', stock: 340, dailyAvgBurn: 14.0, expiryDays: 320, status: 'ADEQUATE' },
      { medicineId: 'MED-05', stock: 520, dailyAvgBurn: 18.0, expiryDays: 60, status: 'SURPLUS' },
      { medicineId: 'MED-06', stock: 160, dailyAvgBurn: 4.0, expiryDays: 280, status: 'ADEQUATE' },
      { medicineId: 'MED-07', stock: 450, dailyAvgBurn: 20.0, expiryDays: 365, status: 'ADEQUATE' },
      { medicineId: 'MED-08', stock: 45, dailyAvgBurn: 1.2, expiryDays: 150, status: 'SURPLUS' }
    ]
  },
  {
    id: 'PHC-IN-003',
    country: 'IN',
    name: 'Kagal Sub-District Health Node',
    district: 'Kolhapur',
    state: 'Maharashtra',
    lat: 16.5796,
    lng: 74.3168,
    catchmentPopulation: 22000,
    totalBeds: 10,
    occupiedBeds: 7,
    doctorAttendance: '1/2 Present (1 on emergency transit)',
    nurseAttendance: '3/3 Present',
    coldChainStatus: 'STABLE (4.0°C)',
    powerBackupHours: 24,
    connectivity: '4G / Stable',
    resilienceScore: 68,
    riskStatus: 'WATCH',
    alertMessage: 'Rising Dengue cases reported in village clusters. Fast depletion of Doxycycline & Paracetamol.',
    inventory: [
      { medicineId: 'MED-01', stock: 22, dailyAvgBurn: 1.1, expiryDays: 140, status: 'ADEQUATE' },
      { medicineId: 'MED-02', stock: 31, dailyAvgBurn: 1.8, expiryDays: 110, status: 'LOW' },
      { medicineId: 'MED-03', stock: 45, dailyAvgBurn: 1.9, expiryDays: 150, status: 'ADEQUATE' },
      { medicineId: 'MED-04', stock: 95, dailyAvgBurn: 11.0, expiryDays: 180, status: 'LOW' },
      { medicineId: 'MED-05', stock: 180, dailyAvgBurn: 22.0, expiryDays: 200, status: 'ADEQUATE' },
      { medicineId: 'MED-06', stock: 32, dailyAvgBurn: 9.5, expiryDays: 120, status: 'LOW' },
      { medicineId: 'MED-07', stock: 85, dailyAvgBurn: 32.0, expiryDays: 180, status: 'STOCKOUT_IMMINENT' },
      { medicineId: 'MED-08', stock: 19, dailyAvgBurn: 0.9, expiryDays: 90, status: 'ADEQUATE' }
    ]
  },
  {
    id: 'PHC-IN-004',
    country: 'IN',
    name: 'Aluva Community Health Centre',
    district: 'Ernakulam',
    state: 'Kerala',
    lat: 10.1076,
    lng: 76.3516,
    catchmentPopulation: 31500,
    totalBeds: 16,
    occupiedBeds: 14,
    doctorAttendance: '3/3 Present',
    nurseAttendance: '5/5 Present',
    coldChainStatus: 'OPTIMAL (3.5°C)',
    powerBackupHours: 36,
    connectivity: 'Fiber / High Speed',
    resilienceScore: 84,
    riskStatus: 'ADEQUATE',
    alertMessage: 'Stable supply corridor. Ready to support flood-prone coastal units if emergency triggered.',
    inventory: [
      { medicineId: 'MED-01', stock: 38, dailyAvgBurn: 0.7, expiryDays: 200, status: 'ADEQUATE' },
      { medicineId: 'MED-02', stock: 72, dailyAvgBurn: 2.2, expiryDays: 180, status: 'ADEQUATE' },
      { medicineId: 'MED-03', stock: 65, dailyAvgBurn: 2.5, expiryDays: 220, status: 'ADEQUATE' },
      { medicineId: 'MED-04', stock: 260, dailyAvgBurn: 15.0, expiryDays: 310, status: 'ADEQUATE' },
      { medicineId: 'MED-05', stock: 390, dailyAvgBurn: 19.0, expiryDays: 300, status: 'ADEQUATE' },
      { medicineId: 'MED-06', stock: 140, dailyAvgBurn: 5.0, expiryDays: 260, status: 'ADEQUATE' },
      { medicineId: 'MED-07', stock: 380, dailyAvgBurn: 24.0, expiryDays: 365, status: 'ADEQUATE' },
      { medicineId: 'MED-08', stock: 34, dailyAvgBurn: 1.1, expiryDays: 130, status: 'ADEQUATE' }
    ]
  },

  // --- BRAZIL (SÃO PAULO / CAMPINAS / BAHIA) ---
  {
    id: 'UBS-BR-001',
    country: 'BR',
    name: 'UBS Jardim Paranapanema',
    district: 'Campinas',
    state: 'São Paulo',
    lat: -22.9150,
    lng: -47.0380,
    catchmentPopulation: 26000,
    totalBeds: 8,
    occupiedBeds: 7,
    doctorAttendance: '2/2 Present',
    nurseAttendance: '4/4 Present',
    coldChainStatus: 'STABLE (4.5°C)',
    powerBackupHours: 12,
    connectivity: '4G / Stable',
    resilienceScore: 38,
    riskStatus: 'CRITICAL_SURGE',
    alertMessage: 'Severe Dengue Type-3 outbreak: Rapid depletion of Hydration Packs (ORS) and Analgesics (2 days left).',
    inventory: [
      { medicineId: 'MED-01', stock: 12, dailyAvgBurn: 0.4, expiryDays: 160, status: 'ADEQUATE' },
      { medicineId: 'MED-02', stock: 18, dailyAvgBurn: 2.9, expiryDays: 90, status: 'STOCKOUT_IMMINENT' },
      { medicineId: 'MED-03', stock: 28, dailyAvgBurn: 1.6, expiryDays: 110, status: 'LOW' },
      { medicineId: 'MED-04', stock: 85, dailyAvgBurn: 9.0, expiryDays: 190, status: 'LOW' },
      { medicineId: 'MED-05', stock: 40, dailyAvgBurn: 35.0, expiryDays: 240, status: 'STOCKOUT_IMMINENT' },
      { medicineId: 'MED-06', stock: 45, dailyAvgBurn: 4.0, expiryDays: 180, status: 'ADEQUATE' },
      { medicineId: 'MED-07', stock: 70, dailyAvgBurn: 45.0, expiryDays: 220, status: 'STOCKOUT_IMMINENT' },
      { medicineId: 'MED-08', stock: 14, dailyAvgBurn: 0.8, expiryDays: 70, status: 'LOW' }
    ]
  },
  {
    id: 'UBS-BR-002',
    country: 'BR',
    name: 'UBS Centro de Saúde Taquaral',
    district: 'Campinas',
    state: 'São Paulo',
    lat: -22.8790,
    lng: -47.0520,
    catchmentPopulation: 38000,
    totalBeds: 14,
    occupiedBeds: 6,
    doctorAttendance: '4/4 Present',
    nurseAttendance: '7/7 Present',
    coldChainStatus: 'OPTIMAL (3.2°C)',
    powerBackupHours: 48,
    connectivity: 'Fiber / High Speed',
    resilienceScore: 90,
    riskStatus: 'SURPLUS_DONOR',
    alertMessage: 'Surplus ORS (420 units) and Paracetamol (600 units) available with 60-day expiry window for municipal rebalance.',
    inventory: [
      { medicineId: 'MED-01', stock: 35, dailyAvgBurn: 0.6, expiryDays: 240, status: 'ADEQUATE' },
      { medicineId: 'MED-02', stock: 90, dailyAvgBurn: 2.0, expiryDays: 200, status: 'SURPLUS' },
      { medicineId: 'MED-03', stock: 80, dailyAvgBurn: 1.8, expiryDays: 220, status: 'ADEQUATE' },
      { medicineId: 'MED-04', stock: 310, dailyAvgBurn: 10.0, expiryDays: 300, status: 'ADEQUATE' },
      { medicineId: 'MED-05', stock: 580, dailyAvgBurn: 14.0, expiryDays: 55, status: 'SURPLUS_EXPIRING_SOON' },
      { medicineId: 'MED-06', stock: 190, dailyAvgBurn: 3.5, expiryDays: 270, status: 'ADEQUATE' },
      { medicineId: 'MED-07', stock: 680, dailyAvgBurn: 22.0, expiryDays: 65, status: 'SURPLUS_EXPIRING_SOON' },
      { medicineId: 'MED-08', stock: 40, dailyAvgBurn: 1.0, expiryDays: 140, status: 'SURPLUS' }
    ]
  },

  // --- SOUTH AFRICA (GAUTENG / KWAZULU-NATAL) ---
  {
    id: 'CHC-ZA-001',
    country: 'ZA',
    name: 'Alexandra Community Health Centre',
    district: 'Johannesburg',
    state: 'Gauteng',
    lat: -26.1076,
    lng: 28.0965,
    catchmentPopulation: 45000,
    totalBeds: 24,
    occupiedBeds: 22,
    doctorAttendance: '4/5 Present',
    nurseAttendance: '8/8 Present',
    coldChainStatus: 'WARN: Generator Active (5.8°C)',
    powerBackupHours: 8,
    connectivity: '4G / Stable',
    resilienceScore: 45,
    riskStatus: 'CRITICAL_SURGE',
    alertMessage: 'Load-shedding alert: Cold-chain insulin & rabies vaccines at risk of thermal degradation; high diabetic footfall.',
    inventory: [
      { medicineId: 'MED-01', stock: 15, dailyAvgBurn: 0.5, expiryDays: 140, status: 'ADEQUATE' },
      { medicineId: 'MED-02', stock: 12, dailyAvgBurn: 4.8, expiryDays: 60, status: 'STOCKOUT_IMMINENT' },
      { medicineId: 'MED-03', stock: 32, dailyAvgBurn: 2.8, expiryDays: 130, status: 'LOW' },
      { medicineId: 'MED-04', stock: 120, dailyAvgBurn: 16.0, expiryDays: 180, status: 'LOW' },
      { medicineId: 'MED-05', stock: 140, dailyAvgBurn: 22.0, expiryDays: 200, status: 'LOW' },
      { medicineId: 'MED-06', stock: 65, dailyAvgBurn: 4.0, expiryDays: 240, status: 'ADEQUATE' },
      { medicineId: 'MED-07', stock: 190, dailyAvgBurn: 30.0, expiryDays: 180, status: 'LOW' },
      { medicineId: 'MED-08', stock: 5, dailyAvgBurn: 1.5, expiryDays: 30, status: 'STOCKOUT_IMMINENT' }
    ]
  },
  {
    id: 'CHC-ZA-002',
    country: 'ZA',
    name: 'Soweto Chiawelo Community Clinic',
    district: 'Johannesburg',
    state: 'Gauteng',
    lat: -26.2750,
    lng: 27.8420,
    catchmentPopulation: 41000,
    totalBeds: 18,
    occupiedBeds: 10,
    doctorAttendance: '3/3 Present',
    nurseAttendance: '6/6 Present',
    coldChainStatus: 'OPTIMAL: Solar Microgrid (3.6°C)',
    powerBackupHours: 72,
    connectivity: 'Fiber / High Speed',
    resilienceScore: 88,
    riskStatus: 'SURPLUS_DONOR',
    alertMessage: 'Solar resilient hub: 65 vials of cold-chain Human Insulin available for transfer to load-shedding affected clinics.',
    inventory: [
      { medicineId: 'MED-01', stock: 28, dailyAvgBurn: 0.4, expiryDays: 220, status: 'ADEQUATE' },
      { medicineId: 'MED-02', stock: 95, dailyAvgBurn: 2.2, expiryDays: 75, status: 'SURPLUS_EXPIRING_SOON' },
      { medicineId: 'MED-03', stock: 70, dailyAvgBurn: 2.0, expiryDays: 190, status: 'ADEQUATE' },
      { medicineId: 'MED-04', stock: 280, dailyAvgBurn: 12.0, expiryDays: 290, status: 'ADEQUATE' },
      { medicineId: 'MED-05', stock: 410, dailyAvgBurn: 16.0, expiryDays: 300, status: 'ADEQUATE' },
      { medicineId: 'MED-06', stock: 150, dailyAvgBurn: 3.5, expiryDays: 260, status: 'ADEQUATE' },
      { medicineId: 'MED-07', stock: 480, dailyAvgBurn: 20.0, expiryDays: 360, status: 'ADEQUATE' },
      { medicineId: 'MED-08', stock: 38, dailyAvgBurn: 0.9, expiryDays: 90, status: 'SURPLUS' }
    ]
  }
];

export const BRICS_EPIDEMIC_FEDERATION_SIGNALS = [
  {
    id: 'SIGNAL-01',
    sourceCountry: 'Brazil (São Paulo)',
    targetRelevance: ['India', 'South Africa'],
    diseaseVector: 'Dengue Serotype-3 (DENV-3) Surge Pattern',
    confidenceScore: 94,
    observation: 'Early monsoon spike in Brazil showed 2.4x higher pediatric fluid dehydration. Recommends raising minimum ORS and IV Saline buffer norms across Indian sub-tropical clinics by 40% before arrival of monsoon front.',
    suggestedAction: 'Increase ORS baseline minimum inventory threshold from 150 to 250 units in coastal and river basin PHCs.'
  },
  {
    id: 'SIGNAL-02',
    sourceCountry: 'South Africa (Gauteng)',
    targetRelevance: ['India', 'Brazil'],
    diseaseVector: 'Cold-Chain Resiliency & Load-Shedding Protocol',
    confidenceScore: 91,
    observation: 'Phase-change cold-box logistics with solar buffering preserved 99.4% insulin and anti-toxin potency during power grid interruptions.',
    suggestedAction: 'Deploy autonomous cold-chain rebalancing when clinic power backup drops below 10 hours.'
  },
  {
    id: 'SIGNAL-03',
    sourceCountry: 'India (Kerala)',
    targetRelevance: ['Brazil', 'South Africa'],
    diseaseVector: 'Community ASHA / PHC Real-time Syndromic Surveillance',
    confidenceScore: 96,
    observation: 'Multilingual voice logging reduced stockout reporting lag from 14 days to under 4 hours, preventing 88% of secondary snakebite and leptospirosis deaths in 2025.',
    suggestedAction: 'Adopt voice-first multimodal reporting for primary care health workers across BRICS languages.'
  }
];
