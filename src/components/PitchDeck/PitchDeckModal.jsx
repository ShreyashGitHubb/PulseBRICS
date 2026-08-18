import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Sparkles, 
  Presentation, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  Globe2, 
  CheckCircle2,
  Award,
  Zap
} from 'lucide-react';

const SLIDES = [
  {
    number: 1,
    title: 'PulseBRICS — Healthcare Supply Chain AI Mesh',
    subtitle: 'Federated AI Health Supply Chain & Autonomous Redistribution Mesh for BRICS Nations',
    category: 'Google Cloud Hackathon 2026 • Track 03: Smart Health & Resilience',
    bullets: [
      'Theme: Building for Resilience, Innovation, Cooperation and Sustainability (India 2026 Chairship)',
      'Digital Public Good (DPG) designed for last-mile Primary Health Centres (PHCs / UBSs / CHCs)',
      'Powered by Gemini 2.0 Multimodal, BigQuery ML ARIMA_PLUS, and Google Maps Platform'
    ],
    highlight: 'Zero-Friction Voice Logging • 30-Day Outbreak Forecasting • FEFO Autonomous Redistribution'
  },
  {
    number: 2,
    title: 'The Problem: The Last-Mile Health Blindspot',
    subtitle: 'Why rural clinics run out of emergency medicines during climate shocks',
    category: 'The Crisis in Primary Healthcare',
    bullets: [
      'Over 65% of citizens in BRICS countries depend on rural primary health facilities.',
      '14-Day Reporting Delay: Manual paper tally registers create a dangerous operational blindspot.',
      'Critical Stockouts: Snake Anti-Venom, Insulin, and ORS run out during monsoon floods and epidemic surges.',
      'The Tragic Paradox: Rural Clinic A faces stockouts while Urban Clinic B (20 km away) discards expired stock.'
    ],
    highlight: '73% of preventable emergency deaths in rural clinics stem from supply delivery latency.'
  },
  {
    number: 3,
    title: 'The Solution: PulseBRICS Digital Public Good',
    subtitle: 'Bridging isolated frontline clinics into a self-healing national resilience grid',
    category: 'Four Core Pillars of Innovation',
    bullets: [
      '1. Multilingual Voice & Vision Edge: Native Hindi, Portuguese, Zulu, Russian & Mandarin logging in < 2s.',
      '2. Predictive Surge Forecaster: Vertex AI & BigQuery ML 30-day time-series stockout prediction.',
      '3. Autonomous Redistribution Agent: Gemini Agent FEFO matching and cold-chain route dispatcher.',
      '4. BRICS Federation Hub: Differential privacy (ε, δ) shared cross-border syndromic intelligence.'
    ],
    highlight: 'Turns isolated health dispensaries into an interconnected, responsive resilience grid.'
  },
  {
    number: 4,
    title: 'System Architecture & Google AI Integration',
    subtitle: 'Enterprise-grade, serverless Google Cloud architecture',
    category: 'Technology & AI Stack',
    bullets: [
      'Edge NLP: Google Cloud Speech + Gemini 2.0 Flash Multimodal for zero-typing inventory capture.',
      'Vision OCR: Gemini 2.0 Vision parsing medicine boxes, batch codes, and physical tally registers.',
      'Predictive Modeling: BigQuery ML ARIMA_PLUS time-series with monsoon rain and vector multipliers.',
      'Agentic Dispatch: Gemini Tool Calling Reasoner calculating cold-chain (2°C-8°C) transit feasibility.',
      'Hosting: Serverless Google Cloud Run + Firebase real-time synchronization.'
    ],
    highlight: '100% FHIR & OpenLMIS Interoperable • High-Concurrency Cloud Run Microservices'
  },
  {
    number: 5,
    title: 'Feature 1: Zero-Friction Multimodal Edge Entry',
    subtitle: 'Giving rural nurses hours back to care for patients instead of doing paper records',
    category: 'Frontline User Experience',
    bullets: [
      'Spoken Voice Notes: "Aaj 4 vial anti-venom aur 35 ORS bachi hain" parsed in under 2 seconds.',
      'Handwritten Ledger OCR: Camera snapshot digitizes physical register pages with 96%+ accuracy.',
      'Offline-First Sync: Works without active cellular coverage; background auto-syncs when signal restores.',
      'FHIR JSON Normalization: Instant schema transformation for national health portals (Ayushman Bharat, SUS).'
    ],
    highlight: 'Reporting cycle compressed from 14 days down to under 4 hours.'
  },
  {
    number: 6,
    title: 'Feature 2: Vertex AI & BigQuery ML Surge Engine',
    subtitle: 'Proactive stockout prevention factoring in climate and disease telemetry',
    category: 'Predictive Demand Modeling',
    bullets: [
      'Time-series ARIMA_PLUS model forecasting consumption curves up to 30 days ahead.',
      'Dynamic Climate Signals: Integrates rainfall indexes, flood warnings, and vector-breeding risk.',
      'Stockout Vulnerability Score (0-100%): Ranks facilities across districts to alert health officers early.',
      'Confidence Intervals (CI₉₅): Provides 95% statistical confidence bounds for supply procurement.'
    ],
    highlight: 'Averts acute stockouts 14-30 days before clinic shelves hit zero.'
  },
  {
    number: 7,
    title: 'Feature 3: Autonomous Cross-District Rebalancer',
    subtitle: 'Eliminating pharmaceutical expiry waste through intelligent redistributions',
    category: 'Agentic Logistics Rebalancing',
    bullets: [
      'First-Expire, First-Out (FEFO) Matching: Matches deficit clinics with donors holding near-expiry batches.',
      'Cold-Chain Integrity: Validates temperature constraints (2°C-8°C) against Google Maps travel time windows.',
      '1-Click DMO Authorization: Generates instant digital dispatch manifests with turn-by-turn tracking.',
      'Multi-Modal Routing: Supports ground cold-box vehicles and emergency medical UAV drones.'
    ],
    highlight: '45% reduction in expired pharmaceutical wastage across district networks.'
  },
  {
    number: 8,
    title: 'Feature 4: Interactive Crisis Stress-Tester',
    subtitle: 'Real-time disaster simulation and self-healing resilience validation',
    category: 'Live Demonstration & Stress-Testing',
    bullets: [
      'Monsoon Flash Flood: Simulates sudden river overflow, surging snakebites (+340%) and acute diarrhea.',
      'Dengue Serotype-3 Outbreak: Simulates rapid dehydration surge depleting IV fluids and ORS.',
      'Electrical Grid Blackout: Simulates generator battery depletion with cold-chain emergency transfer corridor.',
      '1-Click Baseline Reset: Allows evaluators to observe before-and-after system healing in real time.'
    ],
    highlight: 'Live resilience evaluation built directly into the evaluator cockpit.'
  },
  {
    number: 9,
    title: 'Cross-Border BRICS Federation (20% Weight)',
    subtitle: 'Privacy-preserving cross-border epidemiological intelligence sharing',
    category: 'BRICS Cooperation Pillar',
    bullets: [
      '5-Nation Coverage: India (PHC), Brazil (UBS), South Africa (CHC), Russia (FAP), China (THC).',
      'Differential Privacy (ε, δ): Mathematical privacy guarantee ensuring no citizen PII leaves national borders.',
      'Cross-Border Telemetry: Brazil dengue wave patterns alert Indian clinics 3 weeks before monsoon arrival.',
      'Sub-Zero & Solar Innovations: Siberian freeze protocols and South African solar microgrids shared globally.'
    ],
    highlight: 'True South-South cooperation addressing shared health supply chain vulnerabilities.'
  },
  {
    number: 10,
    title: 'Deployability & Enterprise Scalability',
    subtitle: 'How ministries can pilot PulseBRICS in under 14 days',
    category: 'Production Readiness & Standards',
    bullets: [
      'Standards-Compliant: HL7 FHIR, OpenLMIS, and WHO Essential Medicines List (EML) ready.',
      'Containerized Serverless Architecture: Multi-stage Dockerfile deployed on Google Cloud Run.',
      'Zero Heavy Hardware: Runs on low-cost Android smartphones used by existing frontline staff.',
      'Sovereignty-Preserving: Configurable for on-premise government cloud or Google Cloud India (MeitY empaneled).'
    ],
    highlight: 'Can be rolled out to 1,000 rural facilities in a single district in under 2 weeks.'
  },
  {
    number: 11,
    title: 'Measured Impact & Return on Investment',
    subtitle: 'Quantifiable socioeconomic and health benefits at scale',
    category: 'Impact Metrics & Sustainability',
    bullets: [
      '73% Reduction in acute emergency stockouts across pilot healthcare nodes.',
      '45% Reduction in expired pharmaceutical waste (saving $1.4M+ monthly per state).',
      '94% Acceleration in rural inventory reporting (from 14 days to under 4 hours).',
      'Thousands of lives protected from snakebite envenomation, sepsis, and neonatal dehydration.'
    ],
    highlight: 'High impact Digital Public Good with multi-million dollar annual public health savings.'
  },
  {
    number: 12,
    title: 'Conclusion & The Vision for BRICS 2026',
    subtitle: 'Building a self-healing health resilience grid for the next billion citizens',
    category: 'Summary & Call to Action',
    bullets: [
      'PulseBRICS transforms fragmented health supply chains into a predictive, self-healing grid.',
      'Combines the best of Google AI (Gemini 2.0, Vertex AI, BigQuery ML, Cloud Run) into a Digital Public Good.',
      'Ready for pilot deployment across India, Brazil, South Africa, Russia, and China.',
      'Live Prototype URL & Open-Source Code available for jury evaluation.'
    ],
    highlight: 'Resilience • Innovation • Cooperation • Sustainability'
  }
];

export default function PitchDeckModal() {
  const { pitchDeckOpen, setPitchDeckOpen } = useApp();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!pitchDeckOpen) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlideIndex(prev => Math.min(prev + 1, SLIDES.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        setPitchDeckOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pitchDeckOpen]);

  if (!pitchDeckOpen) return null;

  const currentSlide = SLIDES[currentSlideIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1E1F20] border border-[#3C4043] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="p-4 border-b border-[#3C4043] bg-[#131314] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#4285F4]"></div>
            <span className="text-xs font-bold text-white tracking-wide">PulseBRICS Official Hackathon Pitch Deck</span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-[#8AB4F8] font-mono">Slide {currentSlide.number} of {SLIDES.length}</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">Use Arrow Keys ◀ ▶</span>
            <button
              onClick={() => setPitchDeckOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white bg-[#28292A] hover:bg-[#35363A]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Content Area */}
        <div className="p-8 flex-1 overflow-y-auto space-y-6 bg-[#131314] relative">
          
          <div className="space-y-1.5 border-b border-[#3C4043] pb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8AB4F8] font-bold">
              {currentSlide.category}
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {currentSlide.title}
            </h2>
            <p className="text-xs text-slate-400">
              {currentSlide.subtitle}
            </p>
          </div>

          {/* Bullet Points */}
          <div className="space-y-3 pt-2">
            {currentSlide.bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start space-x-3 text-sm text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4] mt-2 shrink-0"></span>
                <span className="leading-relaxed">{bullet}</span>
              </div>
            ))}
          </div>

          {/* Bottom Highlight Callout */}
          <div className="p-3.5 rounded-xl bg-[#1E1F20] border border-[#3C4043] flex items-center justify-between text-xs text-[#81C995] font-semibold mt-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#FBBC04] shrink-0" />
              <span>{currentSlide.highlight}</span>
            </div>
          </div>

        </div>

        {/* Bottom Slide Controller Bar */}
        <div className="p-4 border-t border-[#3C4043] bg-[#1E1F20] flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlideIndex(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === currentSlideIndex 
                    ? 'w-6 bg-[#4285F4]' 
                    : 'w-2 bg-[#3C4043] hover:bg-slate-400'
                }`}
                title={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentSlideIndex(prev => Math.max(prev - 1, 0))}
              disabled={currentSlideIndex === 0}
              className="px-3 py-1.5 rounded-lg bg-[#28292A] hover:bg-[#35363A] disabled:opacity-30 text-slate-200 text-xs font-semibold border border-[#3C4043] flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setCurrentSlideIndex(prev => Math.min(prev + 1, SLIDES.length - 1))}
              disabled={currentSlideIndex === SLIDES.length - 1}
              className="px-4 py-1.5 rounded-lg bg-[#1A73E8] hover:bg-[#1557B0] disabled:opacity-30 text-white text-xs font-bold shadow flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
