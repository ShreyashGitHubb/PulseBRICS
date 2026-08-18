import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import StatsOverview from './StatsOverview.jsx';
import InventoryTable from './InventoryTable.jsx';
import { 
  Search, 
  Filter, 
  Mic, 
  Camera, 
  TrendingUp, 
  RefreshCw, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Thermometer,
  Bed,
  Users,
  MapPin
} from 'lucide-react';
import { findRebalanceMatch } from '../../services/api.js';

export default function CommandCenter() {
  const {
    phcNodes,
    selectedPHC,
    setSelectedPHC,
    selectedCountry,
    searchQuery,
    setSearchQuery,
    filterRisk,
    setFilterRisk,
    openVoiceModalFor,
    openVisionModalFor,
    openQuickUpdateFor,
    openForecastFor,
    openRebalanceModalWith,
    loading
  } = useApp();

  // Filtered nodes
  const filteredNodes = phcNodes.filter(node => {
    const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          node.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === 'ALL' || node.riskStatus === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const handleTriggerRebalance = async (phc, e) => {
    e.stopPropagation();
    try {
      // Look for a stockout item in this PHC
      const stockoutItem = phc.inventory?.find(i => i.status === 'STOCKOUT_IMMINENT' || i.stock < 15) || {
        medicineId: 'MED-01'
      };
      
      const planResponse = await findRebalanceMatch(phc.id, stockoutItem.medicineId, 25);
      if (planResponse.success) {
        openRebalanceModalWith(planResponse.data);
      }
    } catch (err) {
      console.error('Error triggering rebalance:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top KPI Metric Cards */}
      <StatsOverview />

      {/* Main Grid: Left PHC List, Right Active Selected Node Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Search, Filter, and Clinic Grid */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2 items-center justify-between glass-panel p-3 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search ${selectedCountry.unit}s or districts...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 text-xs text-slate-200 pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 placeholder-slate-500"
              />
            </div>

            <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {['ALL', 'CRITICAL_SURGE', 'WATCH', 'SURPLUS_DONOR'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterRisk(status)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                    filterRisk === status
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
                  }`}
                >
                  {status === 'ALL' && 'All Clinics'}
                  {status === 'CRITICAL_SURGE' && '🚨 Critical Surge'}
                  {status === 'WATCH' && '⚠️ Watch'}
                  {status === 'SURPLUS_DONOR' && '🟢 Surplus Donors'}
                </button>
              ))}
            </div>
          </div>

          {/* List of Clinic Cards */}
          <div className="space-y-3">
            {filteredNodes.length === 0 ? (
              <div className="glass-panel rounded-2xl p-8 text-center text-slate-400 border border-slate-800">
                <p>No primary clinics matching your filter query.</p>
              </div>
            ) : (
              filteredNodes.map(phc => {
                const isSelected = selectedPHC?.id === phc.id;
                const isCritical = phc.riskStatus === 'CRITICAL_SURGE';
                const isSurplus = phc.riskStatus === 'SURPLUS_DONOR';

                return (
                  <div
                    key={phc.id}
                    onClick={() => setSelectedPHC(phc)}
                    className={`glass-panel glass-panel-hover rounded-2xl p-4 border cursor-pointer relative overflow-hidden transition-all ${
                      isSelected 
                        ? 'border-cyan-500 bg-slate-900/90 ring-1 ring-cyan-500/50' 
                        : isCritical
                        ? 'border-rose-800/60 bg-rose-950/10'
                        : 'border-slate-800/80 bg-slate-900/60'
                    }`}
                  >
                    {/* Header: Name, District, Resilience Score Badge */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400">
                            {phc.name}
                          </h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            {phc.id}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-slate-400">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-cyan-400" />
                            <span>{phc.district}, {phc.state}</span>
                          </span>
                          <span>•</span>
                          <span>Pop: {phc.catchmentPopulation?.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Resilience Score Gauge */}
                      <div className="flex flex-col items-end">
                        <div className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold flex items-center space-x-1 ${
                          isCritical
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : isSurplus
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          <Shield className="w-3 h-3" />
                          <span>{phc.resilienceScore}%</span>
                        </div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 mt-0.5">
                          {phc.riskStatus?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Alert Message Banner if any */}
                    {phc.alertMessage && (
                      <div className={`mt-2.5 p-2 rounded-xl text-xs flex items-start space-x-2 ${
                        isCritical
                          ? 'bg-rose-900/30 border border-rose-800/60 text-rose-200'
                          : 'bg-slate-800/80 border border-slate-700 text-slate-300'
                      }`}>
                        <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isCritical ? 'text-rose-400' : 'text-amber-400'}`} />
                        <p className="text-[11px] leading-tight">{phc.alertMessage}</p>
                      </div>
                    )}

                    {/* Operational Telemetry Pills */}
                    <div className="grid grid-cols-3 gap-2 mt-3 text-[11px]">
                      <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800 flex items-center space-x-2">
                        <Thermometer className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <div className="truncate">
                          <div className="text-[9px] text-slate-400 uppercase">Cold Chain</div>
                          <div className="font-mono text-slate-200 truncate">{phc.coldChainStatus}</div>
                        </div>
                      </div>

                      <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800 flex items-center space-x-2">
                        <Bed className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <div>
                          <div className="text-[9px] text-slate-400 uppercase">Beds</div>
                          <div className="font-mono text-slate-200">{phc.occupiedBeds}/{phc.totalBeds} Active</div>
                        </div>
                      </div>

                      <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800 flex items-center space-x-2">
                        <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <div className="truncate">
                          <div className="text-[9px] text-slate-400 uppercase">Staff</div>
                          <div className="font-mono text-slate-200 truncate">{phc.doctorAttendance}</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); openVoiceModalFor(phc); }}
                          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs border border-cyan-500/30 transition-colors"
                          title="Record Native Multilingual Voice Note"
                        >
                          <Mic className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="font-medium">Voice Log</span>
                        </button>

                        <button
                          onClick={(e) => { e.stopPropagation(); openVisionModalFor(phc); }}
                          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-xs border border-blue-500/30 transition-colors"
                          title="Scan Medicine Shelf / Register with Gemini Vision"
                        >
                          <Camera className="w-3.5 h-3.5 text-blue-400" />
                          <span className="font-medium">Vision OCR</span>
                        </button>

                        <button
                          onClick={(e) => { e.stopPropagation(); openForecastFor(phc); }}
                          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs border border-purple-500/30 transition-colors"
                          title="30-Day Demand & Depletion Projection"
                        >
                          <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                          <span className="font-medium">Forecast</span>
                        </button>
                      </div>

                      {/* Autonomous Rebalance Trigger */}
                      {isCritical && (
                        <button
                          onClick={(e) => handleTriggerRebalance(phc, e)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 animate-pulse transition-all"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Auto-Rebalance</span>
                        </button>
                      )}
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Column: Detailed Live Inventory & Clinic Inspector */}
        <div className="lg:col-span-5 space-y-4">
          {selectedPHC ? (
            <InventoryTable phc={selectedPHC} />
          ) : (
            <div className="glass-panel rounded-2xl p-8 text-center text-slate-400 border border-slate-800">
              <p>Select a clinic from the list to view real-time inventory and forecasting.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
