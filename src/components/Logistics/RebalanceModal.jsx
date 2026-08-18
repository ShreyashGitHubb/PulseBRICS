import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { 
  Zap, 
  Truck, 
  MapPin, 
  ThermometerSnowflake, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  X, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { authorizeDispatch } from '../../services/api.js';
import confetti from 'canvas-confetti';

export default function RebalanceModal() {
  const { 
    rebalanceModalOpen, 
    setRebalanceModalOpen, 
    rebalancePlan, 
    reloadData 
  } = useApp();

  const [authorizing, setAuthorizing] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  if (!rebalanceModalOpen || !rebalancePlan) return null;

  const { recipientPHC, donorPHC, medicine, transferQuantity, distanceKm, manifest } = rebalancePlan;

  const handleAuthorize = async () => {
    setAuthorizing(true);
    try {
      await authorizeDispatch({
        recipientId: recipientPHC.id,
        donorId: donorPHC.id,
        medicineId: medicine.id,
        quantity: transferQuantity,
        distanceKm: distanceKm,
        isColdChain: medicine.isColdChain
      });

      setAuthorized(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        setAuthorizing(false);
        setAuthorized(false);
        reloadData();
        setRebalanceModalOpen(false);
      }, 1800);
    } catch (err) {
      console.error('Error authorizing dispatch:', err);
      setAuthorizing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-slate-700 p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setRebalanceModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-tr from-rose-600 to-amber-600 rounded-2xl text-white shadow-lg shadow-rose-500/20">
            <Truck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-cyan-400 font-semibold">{manifest?.manifestId || 'AUTONOMOUS-DISPATCH'}</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-amber-400 font-medium">Gemini Agentic Rebalancer</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Autonomous Cross-District Supply Rebalancing
            </h2>
          </div>
        </div>

        {/* Donor vs Recipient Visual Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 items-center bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          
          {/* Donor Node */}
          <div className="sm:col-span-3 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Surplus Donor Node</span>
              <span className="text-[10px] bg-emerald-900/80 text-emerald-200 px-1.5 py-0.5 rounded">
                Stock: {donorPHC.currentStock}
              </span>
            </div>
            <h4 className="text-xs font-bold text-white truncate">{donorPHC.name}</h4>
            <p className="text-[11px] text-slate-400">{donorPHC.district} District</p>
          </div>

          {/* Transfer Quantity & Distance Arrow */}
          <div className="sm:col-span-1 flex flex-col items-center justify-center text-center py-2 sm:py-0">
            <span className="text-xs font-mono font-bold text-cyan-400">{transferQuantity}</span>
            <span className="text-[9px] text-slate-400 font-mono">{medicine.unit}</span>
            <ArrowRight className="w-4 h-4 text-cyan-400 my-0.5 hidden sm:block" />
            <span className="text-[9px] text-slate-400 font-mono">{distanceKm} km</span>
          </div>

          {/* Recipient Node */}
          <div className="sm:col-span-3 p-3 rounded-xl bg-rose-950/30 border border-rose-800/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-rose-400 font-bold uppercase">Critical Deficit Recipient</span>
              <span className="text-[10px] bg-rose-900/80 text-rose-200 px-1.5 py-0.5 rounded">
                Deficit
              </span>
            </div>
            <h4 className="text-xs font-bold text-white truncate">{recipientPHC.name}</h4>
            <p className="text-[11px] text-slate-400">{recipientPHC.district} District</p>
          </div>

        </div>

        {/* Medicine & Cold Chain Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase">Medicine</span>
            <div className="font-semibold text-white truncate">{medicine.name}</div>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase">Cold Chain</span>
            <div className="font-semibold text-blue-400 flex items-center space-x-1">
              <ThermometerSnowflake className="w-3.5 h-3.5" />
              <span>{medicine.isColdChain ? '2°C - 8°C Active' : 'Ambient'}</span>
            </div>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase">Travel ETA</span>
            <div className="font-semibold text-cyan-400 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>~{manifest?.estimatedTravelTimeMinutes || 28} mins</span>
            </div>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase">Logistics Fleet</span>
            <div className="font-semibold text-emerald-400 truncate">
              {manifest?.logisticsMethod || 'Cold-Chain EV'}
            </div>
          </div>
        </div>

        {/* Gemini AI Agent Reasoning Brief */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-900/60 space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Gemini Autonomous Routing & FEFO Policy Analysis</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {manifest?.agentReasoning}
          </p>
          <div className="text-[11px] text-emerald-400 font-mono bg-emerald-950/40 p-2 rounded-xl border border-emerald-900/60">
            ✅ {manifest?.fefoOptimization}
          </div>
        </div>

        {/* Authorize Dispatch Action Bar */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Requires District Medical Officer (DMO) Authorization
          </span>

          <button
            onClick={handleAuthorize}
            disabled={authorizing || authorized}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {authorized 
                ? '✅ Dispatch Authorized & In Transit!' 
                : authorizing 
                ? 'Authorizing with Health Mesh...' 
                : '1-Click Authorize & Dispatch'}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}
