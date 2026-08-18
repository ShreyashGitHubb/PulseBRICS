import React from 'react';
import { useApp, COUNTRIES, ROLES } from '../context/AppContext.jsx';
import { 
  Globe2, 
  User, 
  Zap, 
  RefreshCw, 
  ChevronRight,
  ShieldCheck,
  Cloud
} from 'lucide-react';

export default function TopHeader({ activeTab }) {
  const { 
    selectedCountry, 
    setSelectedCountry, 
    currentRole, 
    setCurrentRole, 
    reloadData, 
    setCrisisSimulatorOpen,
    activeCrisisName,
    loading 
  } = useApp();

  const tabLabels = {
    OVERVIEW: 'Executive Overview',
    FACILITIES: `${selectedCountry.unit} Facilities Registry`,
    MAP: 'Geospatial Health Mesh',
    LOGISTICS: 'Logistics & Fleet Dispatches',
    ANALYTICS: 'Predictive Demand Forecaster',
    FEDERATION: 'BRICS Cross-Border Federation'
  };

  return (
    <header className="h-16 bg-[#1E1F20]/95 backdrop-blur-md border-b border-[#3C4043] px-6 flex items-center justify-between sticky top-0 z-30">
      
      {/* Breadcrumb Path */}
      <div className="flex items-center space-x-2 text-xs">
        <div className="flex items-center space-x-1.5 font-medium text-slate-300">
          <Cloud className="w-4 h-4 text-[#8AB4F8]" />
          <span>Google Cloud Health Mesh</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-slate-200 font-semibold">{selectedCountry.name} Node</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-[#8AB4F8] font-semibold">{tabLabels[activeTab] || 'Dashboard'}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        
        {/* Crisis Stress-Test Simulator Button */}
        <button
          onClick={() => setCrisisSimulatorOpen(true)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            activeCrisisName 
              ? 'bg-[#EA4335]/20 text-[#F28B82] border-[#EA4335]/50 animate-pulse' 
              : 'bg-[#28292A] hover:bg-[#35363A] text-slate-200 border-[#3C4043]'
          }`}
          title="Simulate disaster surges or load-shedding crises"
        >
          <Zap className={`w-3.5 h-3.5 ${activeCrisisName ? 'text-[#F28B82]' : 'text-[#FBBC04]'}`} />
          <span>{activeCrisisName ? `🚨 Active: ${activeCrisisName}` : 'Crisis Simulator'}</span>
        </button>

        {/* BRICS Member Country Selector */}
        <div className="relative">
          <select
            value={selectedCountry.code}
            onChange={(e) => {
              const c = COUNTRIES.find(cntry => cntry.code === e.target.value);
              if (c) setSelectedCountry(c);
            }}
            className="bg-[#28292A] hover:bg-[#35363A] text-slate-200 text-xs font-medium pl-3 pr-7 py-1.5 rounded-lg border border-[#3C4043] focus:outline-none focus:border-[#1A73E8] appearance-none cursor-pointer"
          >
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 text-[10px]">
            ▼
          </div>
        </div>

        {/* User Role Selector */}
        <div className="relative hidden md:block">
          <select
            value={currentRole.id}
            onChange={(e) => {
              const r = ROLES.find(role => role.id === e.target.value);
              if (r) setCurrentRole(r);
            }}
            className="bg-[#28292A] text-slate-300 text-xs pl-3 pr-7 py-1.5 rounded-lg border border-[#3C4043] focus:outline-none focus:border-[#1A73E8] appearance-none cursor-pointer"
          >
            {ROLES.map(r => (
              <option key={r.id} value={r.id}>
                👤 {r.label.split('(')[0].trim()}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 text-[10px]">
            ▼
          </div>
        </div>

        {/* Refresh Sync Button */}
        <button
          onClick={reloadData}
          disabled={loading}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-[#28292A] rounded-lg border border-[#3C4043] transition-colors"
          title="Refresh telemetry from Google Cloud"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#8AB4F8]' : ''}`} />
        </button>

      </div>

    </header>
  );
}
