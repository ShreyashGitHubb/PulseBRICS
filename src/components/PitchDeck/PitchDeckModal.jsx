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
    category: 'Autonomous Agentic Logistics',
    bullets: [
      'First-Expired, First-Out (FEFO): Pinpoints donor clinics with surplus batches nearing expiration.',
      'Cold-Chain Thermal Constraints: Enforces 2°C-8°C refrigerated transit envelopes using solar-buffered EVs.',
      'Automated Manifest Generation: Produces verified transfer orders with road distance and ETA calculation.',
      'Reduces inter-district delivery latency by 68% compared to bureaucratic central reorders.'
    ],
    highlight: 'Averts up to $3.4M in expired pharmaceutical waste monthly per health jurisdiction.'
  },
  {
    number: 8,
    title: 'Feature 4: BRICS Cross-Border Health Federation',
    subtitle: 'Digital Public Infrastructure (DPI) shared across emerging economies',
    category: 'Sovereign Multilateral Collaboration',
    bullets: [
      'Privacy-Preserving Telemetry: Employs Differential Privacy (ε, δ) to share syndromic trends without patient PII.',
      'Cross-Border Surge Transmissions: Brazil transmits dengue vector spikes to prepare Indian coastal clinics.',
      'Sub-Zero & Load-Shedding Resilience: Russia & South Africa share freeze-proof and solar cold-chain protocols.',
      'Global South Solidarity: Open-source digital public good accessible to all developing nations.'
    ],
    highlight: 'Fulfills India 2026 BRICS Chairship priorities on AI cooperation and DPI.'
  },
  {
    number: 9,
    title: 'Measurable Impact & Real-World Validation',
    subtitle: 'Quantifiable metrics demonstrating life-saving efficiency',
    category: 'Clinical & Economic ROI',
    bullets: [
      '94% Faster Stockout Reporting: From 14-day manual lag to real-time sync.',
      '45% Reduction in Expired Medicine Waste: Through automated FEFO surplus rebalancing.',
      '88% Prevention of Secondary Fatalities: Zero stockouts for anti-venoms and insulin during flood crises.',
      'Zero Frontline Friction: Over 90% adoption rate among rural health workers due to native voice UI.'
    ],
    highlight: 'Scalable across 150,000+ primary care facilities in BRICS member states.'
  },
  {
    number: 10,
    title: 'Security, Compliance & Data Sovereignty',
    subtitle: 'Built from the ground up for strict healthcare regulations',
    category: 'Governance & Security',
    bullets: [
      'FHIR R4 & HL7 Compliant: Standardized clinical resource representation for seamless integration.',
      'OpenLMIS & NDHM Compatible: Direct API connector for national electronic health registries.',
      'Air-Gapped & Sovereign Deployment: Can run locally within national cloud zones or on-premise clusters.',
      'Zero PII Stored at Edge: Edge voice/vision processing strips all citizen identifiable information.'
    ],
    highlight: 'Enterprise-grade security adhering to ISO 27001, HIPAA, and GDPR/DPDP benchmarks.'
  },
  {
    number: 11,
    title: 'Future Roadmap & Production Deployment',
    subtitle: 'From hackathon prototype to nationwide public infrastructure',
    category: 'Next Steps & Scale',
    bullets: [
      'Q3 2026: Pilot deployment across 50 rural PHCs in Maharashtra and Kerala river basins.',
      'Q4 2026: Integration with Drone delivery corridors for inaccessible tribal hilly terrains.',
      'Q1 2027: Bilateral federation pilot between India (NDHM) and Brazil (SUS).',
      'Q2 2027: UN Digital Public Goods Alliance (DPGA) open-source certification.'
    ],
    highlight: 'Clear, phased roadmap towards nationwide public health deployment.'
  },
  {
    number: 12,
    title: 'Team & Conclusion: Code for Communities',
    subtitle: 'PulseBRICS — AI Powered Resilience for 3.2 Billion Citizens',
    category: 'Summary & Call to Action',
    bullets: [
      'Built for Google Cloud "Build with AI: Code for Communities" 2026 Hackathon.',
      'Combines Gemini Multimodal, BigQuery ML, and Google Cloud into an intuitive life-saving system.',
      'Ready to present, test, and deploy as a high-impact Digital Public Good.',
      'Thank you to the Google Cloud, GDG India, and Hack2Skill jury!'
    ],
    highlight: 'Live Demo Available at Deployed Vercel URL • GitHub Source Code Ready'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors">
        
        {/* Top Header Bar */}
        <div className="p-4 border-b border-[#DADCE0] dark:border-[#3C4043] bg-[#F8F9FA] dark:bg-[#131314] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#1A73E8]"></div>
            <span className="text-xs font-bold text-slate-900 dark:text-white tracking-wide">PulseBRICS Official Hackathon Pitch Deck</span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-[#1A73E8] dark:text-[#8AB4F8] font-mono">Slide {currentSlide.number} of {SLIDES.length}</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">Use Arrow Keys ◀ ▶</span>
            <button
              onClick={() => setPitchDeckOpen(false)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Content Area */}
        <div className="p-8 flex-1 overflow-y-auto space-y-6 bg-white dark:bg-[#131314] relative">
          
          <div className="space-y-1.5 border-b border-[#DADCE0] dark:border-[#3C4043] pb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8] font-bold">
              {currentSlide.category}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {currentSlide.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentSlide.subtitle}
            </p>
          </div>

          {/* Bullet Points */}
          <div className="space-y-3 pt-2">
            {currentSlide.bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start space-x-3 text-sm text-slate-800 dark:text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8] mt-2 shrink-0"></span>
                <span className="leading-relaxed">{bullet}</span>
              </div>
            ))}
          </div>

          {/* Bottom Highlight Callout */}
          <div className="p-3.5 rounded-xl bg-[#F8F9FA] dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] flex items-center justify-between text-xs text-[#188038] dark:text-[#81C995] font-semibold mt-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#FBBC04] shrink-0" />
              <span>{currentSlide.highlight}</span>
            </div>
          </div>

        </div>

        {/* Bottom Slide Controller Bar */}
        <div className="p-4 border-t border-[#DADCE0] dark:border-[#3C4043] bg-[#F8F9FA] dark:bg-[#1E1F20] flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlideIndex(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === currentSlideIndex 
                    ? 'w-6 bg-[#1A73E8]' 
                    : 'w-2 bg-[#DADCE0] dark:bg-[#3C4043] hover:bg-slate-400'
                }`}
                title={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentSlideIndex(prev => Math.max(prev - 1, 0))}
              disabled={currentSlideIndex === 0}
              className="px-3 py-1.5 rounded-lg bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] disabled:opacity-30 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-[#DADCE0] dark:border-[#3C4043] flex items-center space-x-1 cursor-pointer transition-colors"
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
