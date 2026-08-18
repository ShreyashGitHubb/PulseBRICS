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
      <div className="gcp-card p-6 rounded-3xl space-y-3 relative overflow-hidden border-l-4 border-l-[#1A73E8]">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-tr from-[#1A73E8] to-[#4285F4] rounded-2xl text-white shadow-lg shadow-blue-500/20">
            <Globe2 className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-[#1A73E8] dark:text-[#8AB4F8] font-semibold">BRICS 2026 Theme: Resilience & Cooperation</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-[#188038] dark:text-[#81C995] font-mono">Digital Public Good (DPG)</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              Federated Cross-Border Health Intelligence & Resilience Mesh
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Diseases and global supply shocks don't stop at national borders. 
          <strong> PulseBRICS</strong> enables member nations (India, Brazil, South Africa, Russia, China, and expanding partners) to share 
          <strong> privacy-preserving syndromic telemetry</strong>, calibrate seasonal buffer stocks, and optimize cold-chain resilience without exposing confidential citizen health records.
        </p>

        <div className="flex items-center space-x-4 pt-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
            <Lock className="w-4 h-4 text-[#1A73E8] dark:text-[#8AB4F8]" />
            <span>Differential Privacy & FHIR Compliant</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
            <Layers className="w-4 h-4 text-[#188038] dark:text-[#81C995]" />
            <span>OpenLMIS & NDHM Interoperable</span>
          </div>
        </div>
      </div>

      {/* Comparative Resilience Benchmarks Across BRICS Nations */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Award className="w-4 h-4 text-[#1A73E8] dark:text-[#8AB4F8]" />
          <span>Cross-Border Health Supply Chain Impact Benchmarks</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {bricsBenchmarks.map((bench, idx) => (
            <div
              key={idx}
              className="gcp-card p-4 space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-[#DADCE0] dark:border-[#3C4043] pb-2.5">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{bench.country}</h4>
                <span className="text-[10px] font-mono bg-[#F1F3F4] dark:bg-[#28292A] px-2 py-0.5 rounded-full text-slate-700 dark:text-slate-300 border border-[#DADCE0] dark:border-[#3C4043]">
                  {bench.phcNetworkSize}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Stockout Rate:</span>
                  <span className="font-mono text-[#188038] dark:text-[#81C995] font-bold">{bench.avgStockoutRate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Digital Adoption:</span>
                  <span className="font-mono text-[#1A73E8] dark:text-[#8AB4F8] font-bold">{bench.digitalAdoption}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Waste Averted:</span>
                  <span className="font-mono text-[#E37400] dark:text-[#FDD663] font-bold">{bench.wasteAvoidedMonthly}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Federated Syndromic & Vector Signals */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Share2 className="w-4 h-4 text-[#9334E8] dark:text-[#D8B4FE]" />
          <span>Active Federated Outbreak Signals & Policy Transmissions</span>
        </h3>

        <div className="space-y-3">
          {bricsSignals.map(signal => (
            <div
              key={signal.id}
              className="gcp-card p-5 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#1A73E8] dark:text-[#8AB4F8]">{signal.diseaseVector}</span>
                    <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-950 text-[#1A73E8] dark:text-[#8AB4F8] px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 font-semibold">
                      Confidence: {signal.confidenceScore}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Source: <span className="text-slate-800 dark:text-slate-200 font-semibold">{signal.sourceCountry}</span> ➔ Transmitted to: <span className="text-slate-800 dark:text-slate-200 font-semibold">{signal.targetRelevance?.join(', ')}</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed bg-[#F8F9FA] dark:bg-[#131314] p-3.5 rounded-xl border border-[#DADCE0] dark:border-[#3C4043]">
                "{signal.observation}"
              </div>

              <div className="text-xs text-[#188038] dark:text-[#81C995] font-medium flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#188038] dark:text-[#81C995] shrink-0" />
                <span>Suggested Cross-Border Protocol: {signal.suggestedAction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
