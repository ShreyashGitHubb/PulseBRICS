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
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-cyan-400 font-semibold">{selectedCountry.flag} {selectedCountry.name}</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300">Live Logistics & Fleet Corridor</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-0.5">
            Active Cross-District Medical Dispatches
          </h2>
        </div>

        <div className="flex items-center space-x-3 text-xs bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-1.5 text-cyan-400 font-bold">
            <Truck className="w-4 h-4" />
            <span>{activeDispatches.length} Fleet Vehicles Active</span>
          </div>
        </div>
      </div>

      {/* Dispatches List */}
      {activeDispatches.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center text-slate-400 border border-slate-800 space-y-3">
          <Truck className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-200">No Active Dispatches in Transit</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            All primary clinics are currently balanced or awaiting autonomous rebalancing dispatch. 
            Use the <strong>Command Center</strong> or <strong>Crisis Simulator</strong> to initiate a transfer.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeDispatches.map(dispatch => (
            <div
              key={dispatch.id}
              className="glass-panel rounded-2xl p-5 border border-cyan-900/60 bg-slate-900/80 space-y-4 relative overflow-hidden shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-cyan-400 font-bold">{dispatch.id}</span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 text-[10px] font-mono border border-cyan-800 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                      <span>IN TRANSIT</span>
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1">
                    {dispatch.medicineName} ({dispatch.quantity} {dispatch.unit})
                  </h3>
                </div>

                {/* Cold Chain Temp Badge */}
                {dispatch.coldChainVerified && (
                  <div className="px-2.5 py-1 rounded-xl bg-blue-950/80 border border-blue-800 text-blue-300 text-xs font-mono font-bold flex items-center space-x-1">
                    <ThermometerSnowflake className="w-3.5 h-3.5" />
                    <span>{dispatch.temperatureC || '4.1'}°C</span>
                  </div>
                )}
              </div>

              {/* Donor to Recipient Node Route */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center space-x-1.5 truncate">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-slate-100 truncate">{dispatch.donorName}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Origin</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center space-x-1.5 truncate">
                    <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                    <span className="font-semibold text-slate-100 truncate">{dispatch.recipientName}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Destination</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Distance: {dispatch.distanceKm} km</span>
                  <span className="text-cyan-400 font-bold">ETA: ~{dispatch.estimatedMinutes} mins ({dispatch.progressPercentage}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${Math.min(100, dispatch.progressPercentage)}%` }}
                  >
                    <span className="absolute right-0 top-0 bottom-0 w-2 bg-white/60 animate-pulse"></span>
                  </div>
                </div>
              </div>

              {/* Courier & Policy Rationale */}
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                <span className="truncate">🚚 {dispatch.courierName}</span>
                <span className="text-emerald-400 font-mono">Cold Chain Verified</span>
              </div>

              {dispatch.logisticsRerouteReason && (
                <p className="text-[10px] text-cyan-300/90 italic bg-cyan-950/30 p-2 rounded-lg border border-cyan-900/40">
                  🛡️ {dispatch.logisticsRerouteReason}
                </p>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
