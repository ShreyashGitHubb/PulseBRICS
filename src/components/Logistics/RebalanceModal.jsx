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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#1E1F20] w-full max-w-2xl rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto transition-colors">
        
        {/* Close Button */}
        <button
          onClick={() => setRebalanceModalOpen(false)}
          className="absolute top-5 right-5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1 rounded-lg bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-tr from-[#EA4335] to-[#FBBC04] rounded-2xl text-white shadow-lg shadow-red-500/20">
            <Truck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-[#1A73E8] dark:text-[#8AB4F8] font-bold">{manifest?.manifestId || 'AUTONOMOUS-DISPATCH'}</span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-[#E37400] dark:text-[#FDD663] font-medium">Gemini Agentic Rebalancer</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Autonomous Cross-District Supply Rebalancing
            </h2>
          </div>
        </div>

        {/* Donor vs Recipient Visual Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 items-center bg-[#F8F9FA] dark:bg-[#131314] p-4 rounded-2xl border border-[#DADCE0] dark:border-[#3C4043]">
          
          {/* Donor Node */}
          <div className="sm:col-span-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#188038] dark:text-emerald-400 font-bold uppercase">Surplus Donor Node</span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded font-mono">
                {donorPHC.id}
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{donorPHC.name}</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{donorPHC.district}, {donorPHC.state}</p>
            <div className="text-[11px] text-[#188038] dark:text-emerald-300 font-mono font-semibold pt-1">
              Surplus: {donorPHC.currentStock} Units (FEFO Priority)
            </div>
          </div>

          {/* Transfer Indicator Arrow */}
          <div className="sm:col-span-1 flex flex-col items-center justify-center text-[#1A73E8] dark:text-[#8AB4F8] py-1">
            <span className="text-[10px] font-mono font-bold">{distanceKm} km</span>
            <ArrowRight className="w-5 h-5 my-0.5 hidden sm:block" />
            <span className="text-[10px] text-slate-500 dark:text-slate-400">~28 min</span>
          </div>

          {/* Recipient Node */}
          <div className="sm:col-span-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#EA4335] dark:text-rose-400 font-bold uppercase">Deficit Recipient Node</span>
              <span className="text-[10px] bg-rose-100 dark:bg-rose-900/80 text-rose-800 dark:text-rose-200 px-1.5 py-0.5 rounded font-mono">
                {recipientPHC.id}
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{recipientPHC.name}</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{recipientPHC.district}, {recipientPHC.state}</p>
            <div className="text-[11px] text-[#EA4335] dark:text-rose-300 font-mono font-semibold pt-1">
              Buffer Deficit: {recipientPHC.currentStock} Units
            </div>
          </div>

        </div>

        {/* Transfer Manifest Breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
            <span>AI Dispatch Manifest & Chain of Custody</span>
          </h3>

          <div className="p-4 rounded-xl bg-[#F8F9FA] dark:bg-[#131314] border border-[#DADCE0] dark:border-[#3C4043] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Rebalance Material:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{medicine.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Allocated Transfer Quantity:</span>
              <span className="font-mono text-[#1A73E8] dark:text-[#8AB4F8] font-bold">
                {transferQuantity} {medicine.unit}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Cold Chain Thermal Requirement:</span>
              <span className="font-mono text-[#188038] dark:text-[#81C995]">
                {medicine.isColdChain ? '❄️ 2°C - 8°C Continuous ILR Protocol' : 'Room Temp (20-25°C)'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Transport Asset:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">District EV Cold-Van #04 (Solar Buffered)</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-between border-t border-[#DADCE0] dark:border-[#3C4043]">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Compliant with NDHM / FHIR Logistics & Inter-State Health Protocols
          </span>

          <button
            onClick={handleAuthorize}
            disabled={authorizing || authorized}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center space-x-2 cursor-pointer ${
              authorized
                ? 'bg-[#188038] text-white'
                : 'bg-gradient-to-r from-[#1A73E8] to-[#4285F4] hover:from-[#1557B0] hover:to-[#1A73E8] text-white'
            }`}
          >
            {authorized ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Corridor Authorized & Dispatched!</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-[#FBBC04]" />
                <span>{authorizing ? 'Authorizing Dispatch...' : 'Authorize Autonomous Fleet Corridor'}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
