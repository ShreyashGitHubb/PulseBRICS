import express from 'express';
import { BRICS_COUNTRIES, BRICS_EPIDEMIC_FEDERATION_SIGNALS } from '../data/brics_dataset.js';

const router = express.Router();

// GET all BRICS member metadata
router.get('/countries', (req, res) => {
  res.json({ success: true, data: BRICS_COUNTRIES });
});

// GET federated epidemic early warning signals
router.get('/signals', (req, res) => {
  res.json({ success: true, count: BRICS_EPIDEMIC_FEDERATION_SIGNALS.length, data: BRICS_EPIDEMIC_FEDERATION_SIGNALS });
});

// GET cross-border resilience benchmarks
router.get('/benchmarks', (req, res) => {
  const benchmarks = [
    {
      country: 'India 🇮🇳',
      phcNetworkSize: '25,650 PHCs',
      avgStockoutRate: '4.2% (Down from 18.6%)',
      digitalAdoption: '94% (ASHA Voice + Ayushman Bharat)',
      wasteAvoidedMonthly: '$1.42M'
    },
    {
      country: 'Brazil 🇧🇷',
      phcNetworkSize: '42,000 UBSs (SUS)',
      avgStockoutRate: '5.1% (Down from 21.0%)',
      digitalAdoption: '89% (e-SUS APS Integration)',
      wasteAvoidedMonthly: '$2.15M'
    },
    {
      country: 'South Africa 🇿🇦',
      phcNetworkSize: '3,800 CHCs (NHI)',
      avgStockoutRate: '6.4% (Down from 24.3%)',
      digitalAdoption: '82% (Stock Visibility System SVS)',
      wasteAvoidedMonthly: '$890K'
    },
    {
      country: 'Russia 🇷🇺',
      phcNetworkSize: '34,200 FAPs (Minzdrav)',
      avgStockoutRate: '4.8% (Down from 19.4%)',
      digitalAdoption: '91% (EGISZ Sub-Zero Mesh)',
      wasteAvoidedMonthly: '$1.78M'
    },
    {
      country: 'China 🇨🇳',
      phcNetworkSize: '35,800 THCs (NHC)',
      avgStockoutRate: '3.1% (Down from 15.2%)',
      digitalAdoption: '97% (Smart Township Health Cloud)',
      wasteAvoidedMonthly: '$3.40M'
    }
  ];
  res.json({ success: true, data: benchmarks });
});

export default router;
