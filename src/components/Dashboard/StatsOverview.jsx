import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { 
  Building2, 
  AlertOctagon, 
  Pill, 
  Truck, 
  ThermometerSnowflake, 
  ShieldCheck 
} from 'lucide-react';

export default function StatsOverview() {
  const { phcNodes, selectedCountry, activeDispatches } = useApp();

  const totalPHCs = phcNodes.length;
  const criticalCount = phcNodes.filter(n => n.riskStatus === 'CRITICAL_SURGE' || n.resilienceScore < 50).length;
  const surplusCount = phcNodes.filter(n => n.riskStatus === 'SURPLUS_DONOR').length;

  let totalMedicinesInStock = 0;
  phcNodes.forEach(node => {
    node.inventory?.forEach(item => {
      totalMedicinesInStock += (item.stock || 0);
    });
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      
      {/* 1. Facilities Monitored */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Network Clinics</span>
          <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
            <Building2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-bold font-display text-white">{totalPHCs}</span>
          <span className="text-xs font-mono text-cyan-400">{selectedCountry.unit}s</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 truncate">
          {selectedCountry.flag} {selectedCountry.name} Health Grid
        </p>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-80" />
      </div>

      {/* 2. Critical Stockout Alerts */}
      <div className={`glass-panel rounded-2xl p-4 border relative overflow-hidden ${
        criticalCount > 0 ? 'border-rose-800/80 bg-rose-950/20 glow-badge-red' : 'border-slate-800'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Stockout Alerts</span>
          <div className={`p-2 rounded-xl ${criticalCount > 0 ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
            <AlertOctagon className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className={`text-2xl font-bold font-display ${criticalCount > 0 ? 'text-rose-400' : 'text-white'}`}>
            {criticalCount}
          </span>
          <span className="text-xs text-rose-300 font-medium">Immediate Risk</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          {criticalCount > 0 ? 'Antivenom & ORS deficit' : 'All buffers nominal'}
        </p>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500 opacity-80" />
      </div>

      {/* 3. Total Critical Units Monitored */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Essential Vials & Kits</span>
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
            <Pill className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-bold font-display text-white">{totalMedicinesInStock.toLocaleString()}</span>
          <span className="text-xs text-emerald-400 font-mono">Live Units</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          {surplusCount} Rebalance Donor Nodes
        </p>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 opacity-80" />
      </div>

      {/* 4. Active Autonomous Rebalances */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Active Dispatches</span>
          <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400">
            <Truck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-bold font-display text-cyan-400">{activeDispatches.length}</span>
          <span className="text-xs text-slate-300">En Route</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Gemini Agent Cross-District Mesh
        </p>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500 opacity-80" />
      </div>

      {/* 5. Cold Chain Integrity */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 relative overflow-hidden col-span-2 md:col-span-4 lg:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Cold Chain Integrity</span>
          <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
            <ThermometerSnowflake className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-bold font-display text-white">99.4%</span>
          <span className="text-xs text-blue-400 font-medium">Safe 2°C - 8°C</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Solar & Phase-Change Monitored
        </p>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 opacity-80" />
      </div>

    </div>
  );
}
