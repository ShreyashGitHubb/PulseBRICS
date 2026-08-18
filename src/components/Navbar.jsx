import React from 'react';
import { useApp, COUNTRIES, ROLES } from '../context/AppContext.jsx';
import { 
  Activity, 
  Globe2, 
  ShieldCheck, 
  Zap, 
  AlertTriangle, 
  RefreshCw, 
  Stethoscope, 
  UserCheck 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
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

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Hackathon Initiative Banner */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <Activity className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-display font-black tracking-tight text-white">
                  Pulse<span className="text-cyan-400">BRICS</span>
                </h1>
                <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                  Resilience AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Federated Health Supply Chain & Autonomous Redistribution Mesh
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('COMMAND')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'COMMAND'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Command Center
            </button>
            <button
              onClick={() => setActiveTab('MAP')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'MAP'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Geospatial Mesh
            </button>
            <button
              onClick={() => setActiveTab('LOGISTICS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'LOGISTICS'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Logistics & Dispatches
            </button>
            <button
              onClick={() => setActiveTab('FEDERATION')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'FEDERATION'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              BRICS Federation Hub
            </button>
          </nav>

          {/* Right Action Controls: Country Selector, Role Switcher, Simulator */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Crisis Simulator Launcher Button */}
            <button
              onClick={() => setCrisisSimulatorOpen(true)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCrisisName 
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-600/30 border border-rose-400' 
                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
              title="Trigger simulated epidemic surge or natural disaster"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">
                {activeCrisisName ? `🚨 Crisis: ${activeCrisisName}` : 'Crisis Simulator'}
              </span>
            </button>

            {/* BRICS Country Selector */}
            <div className="relative">
              <select
                value={selectedCountry.code}
                onChange={(e) => {
                  const c = COUNTRIES.find(cntry => cntry.code === e.target.value);
                  if (c) setSelectedCountry(c);
                }}
                className="bg-slate-800 hover:bg-slate-700/80 text-slate-200 text-xs font-medium pl-2.5 pr-7 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                ▼
              </div>
            </div>

            {/* Role Switcher */}
            <div className="relative hidden lg:block">
              <select
                value={currentRole.id}
                onChange={(e) => {
                  const r = ROLES.find(role => role.id === e.target.value);
                  if (r) setCurrentRole(r);
                }}
                className="bg-slate-800/90 text-slate-300 text-xs pl-2.5 pr-6 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
              >
                {ROLES.map(r => (
                  <option key={r.id} value={r.id}>
                    👤 {r.label.split('(')[0]}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-slate-400 text-[10px]">
                ▼
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={reloadData}
              disabled={loading}
              className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Refresh Data from Google Cloud"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
