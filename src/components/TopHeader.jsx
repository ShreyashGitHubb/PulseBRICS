import React from 'react';
import { useApp, COUNTRIES, ROLES } from '../context/AppContext.jsx';
import { 
  Globe2, 
  User, 
  Zap, 
  RefreshCw, 
  ChevronRight,
  ShieldCheck,
  Cloud,
  Sparkles,
  Presentation,
  Compass,
  Sun,
  Moon
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
    setGuidedTourOpen,
    setPitchDeckOpen,
    theme,
    toggleTheme,
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
    <header className="h-16 bg-white/95 dark:bg-[#1E1F20]/95 backdrop-blur-md border-b border-[#DADCE0] dark:border-[#3C4043] px-6 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200">
      
      {/* Breadcrumb Path */}
      <div className="flex items-center space-x-2 text-xs">
        <div className="flex items-center space-x-1.5 font-medium text-slate-700 dark:text-slate-300">
          <Cloud className="w-4 h-4 text-[#1A73E8] dark:text-[#8AB4F8]" />
          <span className="hidden sm:inline">Google Cloud Health Mesh</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 hidden sm:inline" />
        <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedCountry.name}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
        <span className="text-[#1A73E8] dark:text-[#8AB4F8] font-semibold">{tabLabels[activeTab] || 'Dashboard'}</span>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center space-x-2">
        
        {/* 1-Click Interactive Guided Tour Button */}
        <button
          onClick={() => setGuidedTourOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1A73E8] hover:bg-[#1557B0] text-white shadow-sm transition-all cursor-pointer"
          title="Start 1-click step-by-step interactive walkthrough"
        >
          <Compass className="w-3.5 h-3.5 text-[#FBBC04]" />
          <span className="hidden md:inline">1-Click Guided Demo</span>
        </button>

        {/* Pitch Deck Button */}
        <button
          onClick={() => setPitchDeckOpen(true)}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] text-slate-700 dark:text-slate-200 border border-[#DADCE0] dark:border-[#3C4043] transition-colors cursor-pointer"
          title="Open official 12-slide hackathon presentation deck"
        >
          <Presentation className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
          <span className="hidden lg:inline">Pitch Deck</span>
        </button>

        {/* Crisis Stress-Test Simulator Button */}
        <button
          onClick={() => setCrisisSimulatorOpen(true)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            activeCrisisName 
              ? 'bg-[#EA4335]/15 dark:bg-[#EA4335]/20 text-[#EA4335] dark:text-[#F28B82] border-[#EA4335]/50 animate-pulse' 
              : 'bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] text-slate-700 dark:text-slate-200 border-[#DADCE0] dark:border-[#3C4043]'
          }`}
          title="Simulate disaster surges or load-shedding crises"
        >
          <Zap className={`w-3.5 h-3.5 ${activeCrisisName ? 'text-[#EA4335] dark:text-[#F28B82]' : 'text-[#FBBC04]'}`} />
          <span>{activeCrisisName ? `🚨 Active: ${activeCrisisName}` : 'Crisis Simulator'}</span>
        </button>

        {/* BRICS Member Country Selector (All 5 Nations) */}
        <div className="relative">
          <select
            value={selectedCountry.code}
            onChange={(e) => {
              const c = COUNTRIES.find(cntry => cntry.code === e.target.value);
              if (c) setSelectedCountry(c);
            }}
            className="bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] text-slate-800 dark:text-slate-200 text-xs font-medium pl-3 pr-7 py-1.5 rounded-lg border border-[#DADCE0] dark:border-[#3C4043] focus:outline-none focus:border-[#1A73E8] appearance-none cursor-pointer"
          >
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400 text-[10px]">
            ▼
          </div>
        </div>

        {/* User Role Selector */}
        <div className="relative hidden xl:block">
          <select
            value={currentRole.id}
            onChange={(e) => {
              const r = ROLES.find(role => role.id === e.target.value);
              if (r) setCurrentRole(r);
            }}
            className="bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] text-slate-700 dark:text-slate-300 text-xs pl-3 pr-7 py-1.5 rounded-lg border border-[#DADCE0] dark:border-[#3C4043] focus:outline-none focus:border-[#1A73E8] appearance-none cursor-pointer"
          >
            {ROLES.map(r => (
              <option key={r.id} value={r.id}>
                👤 {r.label.split('(')[0].trim()}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400 text-[10px]">
            ▼
          </div>
        </div>

        {/* Theme Toggle Button (Light ☀️ / Dark 🌙) */}
        <button
          onClick={toggleTheme}
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] rounded-lg border border-[#DADCE0] dark:border-[#3C4043] transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Theme (Google White)' : 'Switch to Dark Theme (Google Dark)'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#FBBC04]" />
          ) : (
            <Moon className="w-4 h-4 text-[#1A73E8]" />
          )}
        </button>

        {/* Refresh Sync Button */}
        <button
          onClick={reloadData}
          disabled={loading}
          className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] rounded-lg border border-[#DADCE0] dark:border-[#3C4043] transition-colors cursor-pointer"
          title="Refresh telemetry from Google Cloud"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#1A73E8] dark:text-[#8AB4F8]' : ''}`} />
        </button>

      </div>

    </header>
  );
}
