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
  Moon,
  Menu
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
    setMobileMenuOpen,
    loading 
  } = useApp();

  const tabLabels = {
    OVERVIEW: 'Overview',
    FACILITIES: `${selectedCountry.unit} Directory`,
    MAP: 'Geo Mesh',
    LOGISTICS: 'Logistics',
    ANALYTICS: 'Surge Forecast',
    FEDERATION: 'BRICS Hub'
  };

  return (
    <header className="h-16 bg-white/95 dark:bg-[#1E1F20]/95 backdrop-blur-md border-b border-[#DADCE0] dark:border-[#3C4043] px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200">
      
      {/* Left: Mobile Menu Trigger + Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs min-w-0">
        
        {/* Hamburger Menu on Mobile */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] border border-[#DADCE0] dark:border-[#3C4043] shrink-0"
          title="Open Navigation Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-1 font-medium text-slate-700 dark:text-slate-300 truncate">
          <Cloud className="w-4 h-4 text-[#1A73E8] dark:text-[#8AB4F8] shrink-0 hidden sm:inline" />
          <span className="hidden lg:inline">Google Cloud Health Mesh</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 hidden sm:inline" />
          <span className="text-slate-800 dark:text-slate-200 font-semibold truncate">{selectedCountry.flag} {selectedCountry.name}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
          <span className="text-[#1A73E8] dark:text-[#8AB4F8] font-semibold truncate">{tabLabels[activeTab] || 'Dashboard'}</span>
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
        
        {/* 1-Click Guided Demo Button */}
        <button
          onClick={() => setGuidedTourOpen(true)}
          className="flex items-center space-x-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1A73E8] hover:bg-[#1557B0] text-white shadow-sm transition-all cursor-pointer"
          title="Start 1-click step-by-step interactive walkthrough"
        >
          <Compass className="w-3.5 h-3.5 text-[#FBBC04]" />
          <span className="hidden md:inline">1-Click Guided Demo</span>
          <span className="inline md:hidden text-[11px]">Tour</span>
        </button>

        {/* Pitch Deck Button */}
        <button
          onClick={() => setPitchDeckOpen(true)}
          className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] text-slate-700 dark:text-slate-200 border border-[#DADCE0] dark:border-[#3C4043] transition-colors cursor-pointer"
          title="Open official 12-slide hackathon presentation deck"
        >
          <Presentation className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
          <span className="hidden xl:inline">Pitch Deck</span>
        </button>

        {/* Crisis Stress-Test Simulator Button */}
        <button
          onClick={() => setCrisisSimulatorOpen(true)}
          className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            activeCrisisName 
              ? 'bg-[#EA4335]/15 dark:bg-[#EA4335]/20 text-[#EA4335] dark:text-[#F28B82] border-[#EA4335]/50 animate-pulse' 
              : 'bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] text-slate-700 dark:text-slate-200 border-[#DADCE0] dark:border-[#3C4043]'
          }`}
          title="Simulate disaster surges or load-shedding crises"
        >
          <Zap className={`w-3.5 h-3.5 ${activeCrisisName ? 'text-[#EA4335] dark:text-[#F28B82]' : 'text-[#FBBC04]'}`} />
          <span className="hidden md:inline">{activeCrisisName ? `🚨 ${activeCrisisName}` : 'Crisis Simulator'}</span>
          <span className="inline md:hidden text-[11px]">Crisis</span>
        </button>

        {/* BRICS Member Country Selector */}
        <div className="relative">
          <select
            value={selectedCountry.code}
            onChange={(e) => {
              const c = COUNTRIES.find(cntry => cntry.code === e.target.value);
              if (c) setSelectedCountry(c);
            }}
            className="bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] text-slate-800 dark:text-slate-200 text-xs font-medium pl-2 sm:pl-3 pr-6 py-1.5 rounded-lg border border-[#DADCE0] dark:border-[#3C4043] focus:outline-none focus:border-[#1A73E8] appearance-none cursor-pointer"
          >
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-slate-500 dark:text-slate-400 text-[10px]">
            ▼
          </div>
        </div>

        {/* Theme Toggle Button (Light ☀️ / Dark 🌙) */}
        <button
          onClick={toggleTheme}
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] rounded-lg border border-[#DADCE0] dark:border-[#3C4043] transition-colors cursor-pointer shrink-0"
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
          className="hidden sm:inline-flex p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] rounded-lg border border-[#DADCE0] dark:border-[#3C4043] transition-colors cursor-pointer shrink-0"
          title="Refresh telemetry from Google Cloud"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#1A73E8] dark:text-[#8AB4F8]' : ''}`} />
        </button>

      </div>

    </header>
  );
}
