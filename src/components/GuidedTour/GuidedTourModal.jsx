import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Play, 
  CheckCircle2, 
  Zap, 
  TrendingUp, 
  Truck, 
  Globe2, 
  Mic, 
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import confetti from 'canvas-confetti';

const TOUR_STEPS = [
  {
    step: 1,
    badge: 'Edge Layer: Zero-Friction Logging',
    title: 'Multilingual Voice & Vision OCR Ingestion',
    icon: Mic,
    color: 'from-blue-600 to-indigo-600',
    borderColor: 'border-blue-500',
    description: 'Rural primary care workers speak in native BRICS dialects (Hindi, Portuguese, Zulu, Russian, Mandarin) or snap shelf photos. Gemini 2.0 Multimodal normalizes messy input into FHIR-compliant inventory records in under 2 seconds.',
    actionLabel: 'Open Voice Logger Demo',
    actionType: 'VOICE_MODAL',
    keyMetric: '94% Reduction in Reporting Delay'
  },
  {
    step: 2,
    badge: 'Predictive Intelligence',
    title: 'Vertex AI & BigQuery ML 30-Day Surge Forecaster',
    icon: TrendingUp,
    color: 'from-amber-600 to-yellow-600',
    borderColor: 'border-yellow-500',
    description: 'Time-series ARIMA_PLUS demand forecasting integrates historical consumption with meteorological monsoon rainfall indices, flood alerts, and vector-breeding risk to project stockouts 14-30 days before shelves hit zero.',
    actionLabel: 'View Predictive Cockpit',
    actionType: 'NAVIGATE_ANALYTICS',
    keyMetric: '30-Day Forward Visibility'
  },
  {
    step: 3,
    badge: 'Resilience Stress-Testing',
    title: 'Live Crisis Simulation Engine',
    icon: Zap,
    color: 'from-red-600 to-orange-600',
    borderColor: 'border-red-500',
    description: 'Allows hackathon judges and health ministers to simulate extreme stress events (Monsoon Flash Floods, Dengue Serotype-3 Outbreaks, Power Grid Blackouts) to observe automated system self-healing.',
    actionLabel: 'Trigger Crisis Simulator',
    actionType: 'CRISIS_SIMULATOR',
    keyMetric: 'Real-Time Dynamic Mesh Adaptation'
  },
  {
    step: 4,
    badge: 'Autonomous Agentic Logistics',
    title: 'Gemini Agent Cold-Chain Redistribution Mesh',
    icon: Truck,
    color: 'from-emerald-600 to-teal-600',
    borderColor: 'border-emerald-500',
    description: 'When a clinic faces an imminent stockout, the Gemini Agent matches with nearby facilities holding surplus stock nearing expiry (FEFO). It calculates cold-chain transit windows (2°C-8°C) and generates an automated transfer manifest in 1 click.',
    actionLabel: 'View Active Fleet Corridors',
    actionType: 'NAVIGATE_LOGISTICS',
    keyMetric: '45% Less Pharmaceutical Expiry Waste'
  },
  {
    step: 5,
    badge: 'Cross-Border Digital Public Good',
    title: 'BRICS Differential Privacy Federation Hub',
    icon: Globe2,
    color: 'from-cyan-600 to-blue-600',
    borderColor: 'border-cyan-500',
    description: 'Enables sovereign BRICS health ministries (India, Brazil, South Africa, Russia, China) to share privacy-preserving syndromic telemetry and early vector warnings without exposing citizen patient data.',
    actionLabel: 'Open BRICS Federation Hub',
    actionType: 'NAVIGATE_FEDERATION',
    keyMetric: '100% Sovereign & Privacy-Preserving'
  }
];

export default function GuidedTourModal({ setActiveTab }) {
  const { 
    guidedTourOpen, 
    setGuidedTourOpen, 
    phcNodes, 
    openVoiceModalFor, 
    setCrisisSimulatorOpen 
  } = useApp();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!guidedTourOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;

  const handleExecuteStepAction = () => {
    switch (currentStep.actionType) {
      case 'VOICE_MODAL':
        if (phcNodes.length > 0) openVoiceModalFor(phcNodes[0]);
        setGuidedTourOpen(false);
        break;
      case 'NAVIGATE_ANALYTICS':
        if (setActiveTab) setActiveTab('ANALYTICS');
        setGuidedTourOpen(false);
        break;
      case 'CRISIS_SIMULATOR':
        setCrisisSimulatorOpen(true);
        setGuidedTourOpen(false);
        break;
      case 'NAVIGATE_LOGISTICS':
        if (setActiveTab) setActiveTab('LOGISTICS');
        setGuidedTourOpen(false);
        break;
      case 'NAVIGATE_FEDERATION':
        if (setActiveTab) setActiveTab('FEDERATION');
        setGuidedTourOpen(false);
        break;
      default:
        break;
    }
  };

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      setGuidedTourOpen(false);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1E1F20] border border-[#3C4043] w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853]" />

        {/* Close Button */}
        <button
          onClick={() => setGuidedTourOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-[#28292A] hover:bg-[#35363A]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold bg-[#1A73E8]/20 text-[#8AB4F8] px-2.5 py-0.5 rounded border border-[#1A73E8]/30 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#FBBC04]" />
              <span>Judge Interactive Walkthrough</span>
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs font-semibold text-slate-300">
              Step {currentStep.step} of {TOUR_STEPS.length}
            </span>
          </div>

          <div className="flex items-center space-x-1 mr-8">
            {TOUR_STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentStepIndex 
                    ? 'w-6 bg-[#4285F4]' 
                    : i < currentStepIndex 
                    ? 'w-2 bg-[#34A853]' 
                    : 'w-2 bg-[#3C4043]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="p-5 rounded-xl bg-[#131314] border border-[#3C4043] space-y-4">
          <div className="flex items-start space-x-3.5">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${currentStep.color} text-white shadow-lg shrink-0`}>
              <StepIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8AB4F8]">
                {currentStep.badge}
              </span>
              <h3 className="text-base font-bold text-white leading-snug">
                {currentStep.title}
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {currentStep.description}
          </p>

          <div className="p-3 rounded-lg bg-[#1E1F20] border border-[#3C4043] flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Key Measured Impact:</span>
            <span className="font-mono text-[#81C995] font-bold">{currentStep.keyMetric}</span>
          </div>
        </div>

        {/* Interactive Action & Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <button
            onClick={handleExecuteStepAction}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-bold shadow flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{currentStep.actionLabel}</span>
          </button>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="px-3.5 py-2 rounded-xl bg-[#28292A] hover:bg-[#35363A] disabled:opacity-30 text-slate-200 text-xs font-semibold border border-[#3C4043] flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-[#34A853] hover:bg-[#188038] text-white text-xs font-bold shadow flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
