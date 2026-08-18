import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  fetchPHCNodes, 
  fetchEssentialMedicines, 
  fetchActiveDispatches, 
  fetchBRICSSignals, 
  fetchBRICSBenchmarks 
} from '../services/api.js';

const AppContext = createContext(null);

export const COUNTRIES = [
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: '₹ (INR)', unit: 'PHC', lat: 16.7384, lng: 74.5976, zoom: 9 },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', currency: 'R$ (BRL)', unit: 'UBS', lat: -22.9150, lng: -47.0380, zoom: 11 },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'R (ZAR)', unit: 'CHC', lat: -26.1076, lng: 28.0965, zoom: 10 },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', currency: '₽ (RUB)', unit: 'FAP', lat: 53.7820, lng: 82.3120, zoom: 8 },
  { code: 'CN', name: 'China', flag: '🇨🇳', currency: '¥ (CNY)', unit: 'THC', lat: 30.8980, lng: 103.5720, zoom: 9 }
];

export const ROLES = [
  { id: 'PHC_STAFF', label: 'Primary Clinic Staff (Nurse / Pharmacist)', desc: 'Multimodal Voice & Shelf Camera Entry' },
  { id: 'DISTRICT_OFFICER', label: 'District Medical Officer (DMO)', desc: 'Autonomous Rebalance Authorization & Map' },
  { id: 'BRICS_DELEGATE', label: 'National / BRICS Health Delegate', desc: 'Epidemiological Federation & Policy View' }
];

export function AppProvider({ children }) {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [currentRole, setCurrentRole] = useState(ROLES[1]); // Default to DMO for rich experience
  
  const [phcNodes, setPhcNodes] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [activeDispatches, setActiveDispatches] = useState([]);
  const [bricsSignals, setBricsSignals] = useState([]);
  const [bricsBenchmarks, setBricsBenchmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Selected Node & Modal States
  const [selectedPHC, setSelectedPHC] = useState(null);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [visionModalOpen, setVisionModalOpen] = useState(false);
  const [quickUpdateModalOpen, setQuickUpdateModalOpen] = useState(false);
  const [rebalanceModalOpen, setRebalanceModalOpen] = useState(false);
  const [rebalancePlan, setRebalancePlan] = useState(null);
  const [forecastModalOpen, setForecastModalOpen] = useState(false);
  const [forecastTargetMed, setForecastTargetMed] = useState('MED-01');
  const [crisisSimulatorOpen, setCrisisSimulatorOpen] = useState(false);
  const [activeCrisisName, setActiveCrisisName] = useState(null);
  const [guidedTourOpen, setGuidedTourOpen] = useState(false);
  const [pitchDeckOpen, setPitchDeckOpen] = useState(false);
  
  // Theme state: 'dark' | 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('pulse_brics_theme') || 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('pulse_brics_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Active filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL'); // ALL | CRITICAL_SURGE | WATCH | SURPLUS_DONOR

  const reloadData = async () => {
    try {
      const [nodes, meds, dispatches, signals, benchmarks] = await Promise.all([
        fetchPHCNodes(selectedCountry.code),
        fetchEssentialMedicines(),
        fetchActiveDispatches(),
        fetchBRICSSignals(),
        fetchBRICSBenchmarks()
      ]);
      setPhcNodes(nodes);
      setMedicines(meds);
      setActiveDispatches(dispatches);
      setBricsSignals(signals);
      setBricsBenchmarks(benchmarks);
      
      // Auto-select first node if none selected
      if (!selectedPHC && nodes.length > 0) {
        setSelectedPHC(nodes[0]);
      } else if (selectedPHC) {
        const updated = nodes.find(n => n.id === selectedPHC.id);
        if (updated) setSelectedPHC(updated);
      }
    } catch (err) {
      console.error('Error reloading app data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    reloadData();
  }, [selectedCountry]);

  // Periodic poll for active dispatch progress
  useEffect(() => {
    const interval = setInterval(async () => {
      const dispatches = await fetchActiveDispatches();
      setActiveDispatches(dispatches);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const openVoiceModalFor = (phc) => {
    setSelectedPHC(phc);
    setVoiceModalOpen(true);
  };

  const openVisionModalFor = (phc) => {
    setSelectedPHC(phc);
    setVisionModalOpen(true);
  };

  const openQuickUpdateFor = (phc) => {
    setSelectedPHC(phc);
    setQuickUpdateModalOpen(true);
  };

  const openForecastFor = (phc, medId = 'MED-01') => {
    setSelectedPHC(phc);
    setForecastTargetMed(medId);
    setForecastModalOpen(true);
  };

  const openRebalanceModalWith = (plan) => {
    setRebalancePlan(plan);
    setRebalanceModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        selectedCountry,
        setSelectedCountry,
        currentRole,
        setCurrentRole,
        phcNodes,
        setPhcNodes,
        medicines,
        activeDispatches,
        setActiveDispatches,
        bricsSignals,
        bricsBenchmarks,
        loading,
        reloadData,
        selectedPHC,
        setSelectedPHC,
        searchQuery,
        setSearchQuery,
        filterRisk,
        setFilterRisk,
        voiceModalOpen,
        setVoiceModalOpen,
        visionModalOpen,
        setVisionModalOpen,
        quickUpdateModalOpen,
        setQuickUpdateModalOpen,
        rebalanceModalOpen,
        setRebalanceModalOpen,
        rebalancePlan,
        setRebalancePlan,
        forecastModalOpen,
        setForecastModalOpen,
        forecastTargetMed,
        setForecastTargetMed,
        crisisSimulatorOpen,
        setCrisisSimulatorOpen,
        activeCrisisName,
        setActiveCrisisName,
        guidedTourOpen,
        setGuidedTourOpen,
        pitchDeckOpen,
        setPitchDeckOpen,
        theme,
        toggleTheme,
        openVoiceModalFor,
        openVisionModalFor,
        openQuickUpdateFor,
        openForecastFor,
        openRebalanceModalWith
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
