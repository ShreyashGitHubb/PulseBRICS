import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { 
  Truck, 
  ThermometerSnowflake, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';

export default function TransferTracker() {
  const { activeDispatches, selectedCountry } = useApp();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="gcp-card p-5 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-[#1A73E8] dark:text-[#8AB4F8] font-bold">{selectedCountry.flag} {selectedCountry.name}</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-600 dark:text-slate-300">Live Logistics & Fleet Corridor</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            Active Cross-District Medical Dispatches
          </h2>
        </div>

        <div className="flex items-center space-x-3 text-xs bg-[#F1F3F4] dark:bg-[#131314] px-4 py-2 rounded-xl border border-[#DADCE0] dark:border-[#3C4043]">
          <div className="flex items-center space-x-1.5 text-[#1A73E8] dark:text-[#8AB4F8] font-bold">
            <Truck className="w-4 h-4" />
            <span>{activeDispatches.length} Fleet Vehicles Active</span>
          </div>
        </div>
      </div>

      {/* Dispatches List */}
      {activeDispatches.length === 0 ? (
        <div className="gcp-card p-12 text-center text-slate-500 dark:text-slate-400 space-y-3">
          <Truck className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No Active Dispatches in Transit</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            All primary clinics are currently balanced or awaiting autonomous rebalancing dispatch. 
            Use the <strong>Command Center</strong> or <strong>Crisis Simulator</strong> to initiate a transfer.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeDispatches.map(dispatch => (
            <div
              key={dispatch.id}
              className="gcp-card p-5 space-y-4 relative overflow-hidden shadow-lg border-l-4 border-l-[#1A73E8]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-[#1A73E8] dark:text-[#8AB4F8] font-bold">{dispatch.id}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#1A73E8]/10 text-[#1A73E8] dark:text-[#8AB4F8] text-[10px] font-mono border border-[#1A73E8]/30 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8] animate-ping"></span>
                      <span>IN TRANSIT</span>
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {dispatch.medicineName} ({dispatch.quantity} {dispatch.unit})
                  </h3>
                </div>

                {/* Cold Chain Temp Badge */}
                {dispatch.coldChainVerified && (
                  <div className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-mono font-bold flex items-center space-x-1">
                    <ThermometerSnowflake className="w-3.5 h-3.5" />
                    <span>{dispatch.temperatureC || '4.1'}°C</span>
                  </div>
                )}
              </div>

              {/* Donor to Recipient Node Route */}
              <div className="p-3 bg-[#F8F9FA] dark:bg-[#131314] rounded-xl border border-[#DADCE0] dark:border-[#3C4043] text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <div className="flex items-center space-x-1.5 truncate">
                    <MapPin className="w-3 h-3 text-[#188038] dark:text-emerald-400 shrink-0" />
                    <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">{dispatch.donorName}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Origin</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <div className="flex items-center space-x-1.5 truncate">
                    <MapPin className="w-3 h-3 text-[#EA4335] dark:text-rose-400 shrink-0" />
                    <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">{dispatch.recipientName}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Destination</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                  <span>Distance: {dispatch.distanceKm} km</span>
                  <span className="font-mono text-[#188038] dark:text-[#81C995] font-semibold">
                    ETA: ~{dispatch.estimatedMinutes} mins ({dispatch.progressPercent}%)
                  </span>
                </div>
                <div className="w-full bg-[#E8EAED] dark:bg-[#28292A] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#1A73E8] h-full rounded-full transition-all duration-500"
                    style={{ width: `${dispatch.progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-[#DADCE0] dark:border-[#3C4043]">
                <span className="flex items-center space-x-1">
                  <span>🚚</span>
                  <span>{dispatch.vehicleType || 'Cold Chain Electric Fleet #04'}</span>
                </span>
                <span className="text-[#188038] dark:text-[#81C995] font-semibold">Cold Chain Verified</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
