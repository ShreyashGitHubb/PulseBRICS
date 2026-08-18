import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { 
  Globe2, 
  ShieldCheck, 
  Share2, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  TrendingDown, 
  Lock, 
  Layers,
  Award
} from 'lucide-react';

export default function FederationHub() {
  const { bricsSignals, bricsBenchmarks } = useApp();

  return (
    <div className="space-y-6">
      
      {/* Initiative Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 relative overflow-hidden">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-2xl text-white shadow-lg shadow-cyan-500/20">
            <Globe2 className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-cyan-400 font-semibold">BRICS 2026 Theme: Resilience & Cooperation</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-emerald-400 font-mono">Digital Public Good (DPG)</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5">
              Federated Cross-Border Health Intelligence & Resilience Mesh
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          Diseases and global supply shocks don't stop at national borders. 
          <strong> PulseBRICS</strong> enables member nations (India, Brazil, South Africa, and expanding partners) to share 
          <strong> privacy-preserving syndromic telemetry</strong>, calibrate seasonal buffer stocks, and optimize cold-chain resilience without exposing confidential citizen health records.
        </p>

        <div className="flex items-center space-x-4 pt-2 text-xs text-slate-400">
          <div className="flex items-center space-x-1.5 text-slate-300">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Differential Privacy & FHIR Compliant</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-300">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>OpenLMIS & NDHM Interoperable</span>
          </div>
        </div>
      </div>

      {/* Comparative Resilience Benchmarks Across BRICS Nations */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Award className="w-4 h-4 text-cyan-400" />
          <span>Cross-Border Health Supply Chain Impact Benchmarks</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bricsBenchmarks.map((bench, idx) => (
            <div
              key={idx}
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-base font-bold text-white">{bench.country}</h4>
                <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
                  {bench.phcNetworkSize}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Stockout Rate:</span>
                  <span className="font-mono text-emerald-400 font-bold">{bench.avgStockoutRate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Digital Logging Adoption:</span>
                  <span className="font-mono text-cyan-400 font-bold">{bench.digitalAdoption}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Monthly Expiry Waste Averted:</span>
                  <span className="font-mono text-amber-400 font-bold">{bench.wasteAvoidedMonthly}</span>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Federated Syndromic & Vector Signals */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Share2 className="w-4 h-4 text-purple-400" />
          <span>Active Federated Outbreak Signals & Policy Transmissions</span>
        </h3>

        <div className="space-y-3">
          {bricsSignals.map(signal => (
            <div
              key={signal.id}
              className="glass-panel p-5 rounded-2xl border border-cyan-900/40 bg-slate-900/90 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-cyan-300">{signal.diseaseVector}</span>
                    <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-800">
                      Confidence: {signal.confidenceScore}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Source: <span className="text-slate-200 font-semibold">{signal.sourceCountry}</span> ➔ Transmitted to: <span className="text-slate-200 font-semibold">{signal.targetRelevance?.join(', ')}</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                "{signal.observation}"
              </p>

              <div className="text-xs text-emerald-400 font-medium flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Suggested Cross-Border Protocol: {signal.suggestedAction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
