import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { 
  Zap, 
  Waves, 
  Bug, 
  BatteryWarning, 
  RotateCcw, 
  X, 
  AlertTriangle, 
  CheckCircle2,
  Sparkles 
} from 'lucide-react';
import { triggerCrisisSimulation, resetDemoDataset } from '../../services/api.js';
import confetti from 'canvas-confetti';

const CRISES = [
  {
    id: 'MONSOON_FLOOD',
    name: 'Monsoon Flash Flood & Snakebite Surge',
    icon: Waves,
    color: 'from-[#1A73E8] to-[#4285F4]',
    targetCategory: 'Snake Anti-Venom & ORS',
    description: 'Simulates river overflow in sub-tropical river plains. Snakebite emergencies surge by +340% and floodwater contamination triggers acute diarrhea clusters.',
    impact: 'Depletes Snake Anti-Venom (MED-01) and ORS (MED-05) to critical stockout.'
  },
  {
    id: 'DENGUE_OUTBREAK',
    name: 'Dengue Serotype-3 Outbreak Wave',
    icon: Bug,
    color: 'from-[#EA4335] to-[#FBBC04]',
    targetCategory: 'Hydration Salts, Analgesics, Antibiotics',
    description: 'High mosquito breeding post-rains causes severe fever footfalls. Dengue shock cases require rapid intravenous and oral electrolyte rebalancing.',
    impact: 'Depletes Paracetamol (MED-07) and ORS (MED-05) within 48 hours.'
  },
  {
    id: 'LOAD_SHEDDING',
    name: 'Electrical Grid Blackout (Cold-Chain Emergency)',
    icon: BatteryWarning,
    color: 'from-[#FBBC04] to-[#E37400]',
    targetCategory: 'Cold-Chain Insulin & Rabies Vaccines',
    description: 'Power grid blackout leaves clinic backup generator with under 2 hours. Temperature rises toward 8.6°C, risking complete thermal degradation of biologicals.',
    impact: 'Triggers autonomous solar-refrigerated emergency transfer corridor.'
  }
];

export default function CrisisSimulator() {
  const { 
    crisisSimulatorOpen, 
    setCrisisSimulatorOpen, 
    selectedCountry, 
    setActiveCrisisName, 
    reloadData 
  } = useApp();

  const [triggering, setTriggering] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!crisisSimulatorOpen) return null;

  const handleTriggerCrisis = async (crisis) => {
    setTriggering(true);
    try {
      await triggerCrisisSimulation(crisis.id, selectedCountry.code);
      setActiveCrisisName(crisis.name);
      setSuccessMsg(`Simulated "${crisis.name}" active across ${selectedCountry.name}!`);
      reloadData();
      setTimeout(() => {
        setTriggering(false);
        setCrisisSimulatorOpen(false);
      }, 1000);
    } catch (err) {
      console.error('Error triggering crisis:', err);
      setTriggering(false);
    }
  };

  const handleResetBaseline = async () => {
    setTriggering(true);
    try {
      await resetDemoDataset();
      setActiveCrisisName(null);
      setSuccessMsg('Reset all health nodes to nominal safe baseline.');
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
      reloadData();
      setTimeout(() => {
        setTriggering(false);
        setCrisisSimulatorOpen(false);
      }, 1000);
    } catch (err) {
      console.error('Error resetting dataset:', err);
      setTriggering(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#1E1F20] w-full max-w-2xl rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto transition-colors">
        
        {/* Close Button */}
        <button
          onClick={() => setCrisisSimulatorOpen(false)}
          className="absolute top-5 right-5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1 rounded-lg bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-tr from-[#EA4335] to-[#FBBC04] rounded-2xl text-white shadow-lg shadow-amber-500/20">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-[#E37400] dark:text-[#FDD663] font-semibold">Demo Day Simulation Mode</span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-600 dark:text-slate-300">{selectedCountry.flag} {selectedCountry.name}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Health Crisis & Epidemic Surge Stress-Testing
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300">
          Select a realistic disaster or epidemiological shock below to evaluate how 
          <strong> PulseBRICS Autonomous Rebalancing & Predictive AI</strong> detects stock-outs and redistributes life-saving supplies in real time.
        </p>

        {/* Crisis Cards */}
        <div className="space-y-3">
          {CRISES.map(crisis => {
            const Icon = crisis.icon;
            return (
              <div
                key={crisis.id}
                className="p-4 rounded-2xl bg-[#F8F9FA] dark:bg-[#131314] border border-[#DADCE0] dark:border-[#3C4043] space-y-2 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${crisis.color} text-white shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{crisis.name}</h3>
                      <span className="text-[10px] font-mono text-[#1A73E8] dark:text-[#8AB4F8]">Target: {crisis.targetCategory}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTriggerCrisis(crisis)}
                    disabled={triggering}
                    className="px-3.5 py-1.5 rounded-xl bg-[#EA4335] hover:bg-[#C5221F] text-white text-xs font-bold shadow transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Simulate Shock</span>
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">{crisis.description}</p>
                <div className="text-[11px] text-[#E37400] dark:text-amber-200 font-medium bg-amber-50 dark:bg-amber-950/30 p-2 rounded-xl border border-amber-200 dark:border-amber-900/40">
                  ⚡ Impact: {crisis.impact}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reset Baseline Action */}
        <div className="pt-2 border-t border-[#DADCE0] dark:border-[#3C4043] flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {successMsg ? <span className="text-[#188038] dark:text-[#81C995] font-semibold">{successMsg}</span> : 'Restore system to nominal state:'}
          </span>

          <button
            onClick={handleResetBaseline}
            disabled={triggering}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] text-slate-800 dark:text-slate-200 text-xs font-semibold border border-[#DADCE0] dark:border-[#3C4043] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#1A73E8] dark:text-[#8AB4F8]" />
            <span>Reset Demo Baseline</span>
          </button>
        </div>

      </div>
    </div>
  );
}
