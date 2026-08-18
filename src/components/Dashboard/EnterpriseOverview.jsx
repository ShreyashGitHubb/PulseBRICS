import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { 
  Building2, 
  AlertTriangle, 
  Pill, 
  Truck, 
  ThermometerSnowflake, 
  Mic, 
  Camera, 
  Zap, 
  TrendingUp, 
  MapPin, 
  Sparkles, 
  Cloud 
} from 'lucide-react';
import { findRebalanceMatch } from '../../services/api.js';

export default function EnterpriseOverview({ setActiveTab }) {
  const { 
    phcNodes, 
    selectedCountry, 
    activeDispatches, 
    openVoiceModalFor, 
    openVisionModalFor, 
    openForecastFor, 
    openRebalanceModalWith 
  } = useApp();

  const totalPHCs = phcNodes.length;
  const criticalNodes = phcNodes.filter(n => n.riskStatus === 'CRITICAL_SURGE' || n.resilienceScore < 50);
  const surplusNodes = phcNodes.filter(n => n.riskStatus === 'SURPLUS_DONOR');

  let totalMedicines = 0;
  phcNodes.forEach(node => {
    node.inventory?.forEach(item => {
      totalMedicines += (item.stock || 0);
    });
  });

  const handleRebalance = async (phc) => {
    try {
      const stockoutItem = phc.inventory?.find(i => i.status === 'STOCKOUT_IMMINENT' || i.stock < 15) || {
        medicineId: 'MED-01'
      };
      const planResponse = await findRebalanceMatch(phc.id, stockoutItem.medicineId, 24);
      if (planResponse.success) {
        openRebalanceModalWith(planResponse.data);
      }
    } catch (err) {
      console.error('Error rebalancing:', err);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Top Banner with Google Cloud Code for Communities Branding */}
      <div className="gcp-card p-4 sm:p-5 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-[#4285F4]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 flex-wrap gap-1">
            <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#1A73E8] dark:text-[#8AB4F8] bg-[#1A73E8]/10 px-2 py-0.5 rounded border border-[#1A73E8]/30 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#FBBC04]" />
              <span>Google Cloud Build with AI: Code for Communities</span>
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">•</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">2nd Edition</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {selectedCountry.flag} Health Resilience Command — {selectedCountry.name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time telemetry, Gemini 2.0 Multimodal edge logging, and autonomous cross-district logistics.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('FACILITIES')}
            className="flex-1 sm:flex-initial px-3 py-2 rounded-lg bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] text-slate-800 dark:text-slate-200 text-xs font-semibold border border-[#DADCE0] dark:border-[#3C4043] transition-colors cursor-pointer text-center"
          >
            Facility Directory
          </button>
          <button
            onClick={() => setActiveTab('MAP')}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer text-center"
          >
            Geospatial Mesh Map
          </button>
        </div>
      </div>

      {/* Google 4-Color Styled KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* 1. Google Blue: Total Clinics */}
        <div className="gcp-card p-3 sm:p-4 space-y-1.5 sm:space-y-2 relative overflow-hidden border-t-2 border-t-[#4285F4]">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] sm:text-xs font-semibold truncate">Facilities</span>
            <Building2 className="w-4 h-4 text-[#1A73E8] dark:text-[#8AB4F8] shrink-0" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{totalPHCs}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{selectedCountry.unit}s</span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-[#DADCE0] dark:border-[#3C4043] flex items-center justify-between">
            <span className="truncate">Donors: {surplusNodes.length}</span>
            <span className="text-[#188038] dark:text-[#81C995] font-mono font-semibold">100% Online</span>
          </div>
        </div>

        {/* 2. Google Red: Stockout Alerts */}
        <div className={`gcp-card p-3 sm:p-4 space-y-1.5 sm:space-y-2 relative overflow-hidden border-t-2 border-t-[#EA4335] ${
          criticalNodes.length > 0 ? 'bg-[#EA4335]/5' : ''
        }`}>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] sm:text-xs font-semibold truncate">Stockout Alerts</span>
            <AlertTriangle className={`w-4 h-4 shrink-0 ${criticalNodes.length > 0 ? 'text-[#EA4335] dark:text-[#F28B82]' : 'text-slate-400'}`} />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className={`text-xl sm:text-2xl font-bold tabular-nums ${criticalNodes.length > 0 ? 'text-[#EA4335] dark:text-[#F28B82]' : 'text-slate-900 dark:text-white'}`}>
              {criticalNodes.length}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Deficits</span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-[#DADCE0] dark:border-[#3C4043] flex items-center justify-between">
            <span className="truncate">{criticalNodes.length > 0 ? 'Surge Risk' : 'Buffers Nominal'}</span>
            <span className={criticalNodes.length > 0 ? 'text-[#EA4335] dark:text-[#F28B82] font-semibold' : 'text-slate-400'}>
              {criticalNodes.length > 0 ? 'Action Req' : 'Safe'}
            </span>
          </div>
        </div>

        {/* 3. Google Green: Essential Medicine Units */}
        <div className="gcp-card p-3 sm:p-4 space-y-1.5 sm:space-y-2 relative overflow-hidden border-t-2 border-t-[#34A853]">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] sm:text-xs font-semibold truncate">Drug Stock</span>
            <Pill className="w-4 h-4 text-[#188038] dark:text-[#81C995] shrink-0" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{totalMedicines.toLocaleString()}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Units</span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-[#DADCE0] dark:border-[#3C4043] flex items-center justify-between">
            <span>10 Essential Classes</span>
            <span className="text-[#188038] dark:text-[#81C995] font-mono">FEFO</span>
          </div>
        </div>

        {/* 4. Google Yellow: Cold Chain Compliance */}
        <div className="gcp-card p-3 sm:p-4 space-y-1.5 sm:space-y-2 relative overflow-hidden border-t-2 border-t-[#FBBC04]">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] sm:text-xs font-semibold truncate">Cold Chain</span>
            <ThermometerSnowflake className="w-4 h-4 text-[#FBBC04] shrink-0" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tabular-nums">99.4%</span>
            <span className="text-[11px] text-[#E37400] dark:text-[#FDD663] font-mono">2°-8°C</span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-[#DADCE0] dark:border-[#3C4043] flex items-center justify-between">
            <span>Solar & ILR</span>
            <span className="text-[#E37400] dark:text-[#FDD663] font-mono">Active</span>
          </div>
        </div>

      </div>

      {/* Main Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Facilities Operations Queue */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
              <span>Operational Facility Queue</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#F1F3F4] dark:bg-[#28292A] text-slate-700 dark:text-slate-300 border border-[#DADCE0] dark:border-[#3C4043]">
                {phcNodes.length} Clinics
              </span>
            </h2>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">Ranked by Resilience Score</span>
          </div>

          <div className="space-y-3">
            {phcNodes.map(phc => {
              const isCritical = phc.riskStatus === 'CRITICAL_SURGE';
              const isSurplus = phc.riskStatus === 'SURPLUS_DONOR';

              return (
                <div
                  key={phc.id}
                  className={`gcp-card p-3.5 sm:p-4 space-y-3 transition-all ${
                    isCritical ? 'border-[#EA4335]/60 bg-[#EA4335]/5' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{phc.name}</h3>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F1F3F4] dark:bg-[#28292A] text-slate-700 dark:text-slate-300 border border-[#DADCE0] dark:border-[#3C4043]">
                          {phc.id}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-[#1A73E8] dark:text-[#8AB4F8]" />
                          <span>{phc.district}</span>
                        </span>
                        <span>•</span>
                        <span>Beds: {phc.occupiedBeds}/{phc.totalBeds}</span>
                        <span>•</span>
                        <span>Doc: {phc.doctorAttendance?.split(' ')[0]}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`text-xs font-mono font-bold px-2 py-0.5 rounded border inline-block ${
                        isCritical
                          ? 'bg-[#EA4335]/15 text-[#EA4335] dark:text-[#F28B82] border-[#EA4335]/40'
                          : isSurplus
                          ? 'bg-[#34A853]/15 text-[#188038] dark:text-[#81C995] border-[#34A853]/40'
                          : 'bg-[#FBBC04]/15 text-[#E37400] dark:text-[#FDD663] border-[#FBBC04]/40'
                      }`}>
                        {phc.resilienceScore}%
                      </div>
                    </div>
                  </div>

                  {phc.alertMessage && (
                    <div className={`p-2.5 rounded-lg text-xs flex items-start space-x-2 ${
                      isCritical
                        ? 'bg-[#EA4335]/15 border border-[#EA4335]/30 text-[#EA4335] dark:text-[#F28B82]'
                        : 'bg-[#F8F9FA] dark:bg-[#28292A] border border-[#DADCE0] dark:border-[#3C4043] text-slate-700 dark:text-slate-300'
                    }`}>
                      <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isCritical ? 'text-[#EA4335] dark:text-[#F28B82]' : 'text-[#FBBC04]'}`} />
                      <p className="text-[11px] leading-tight">{phc.alertMessage}</p>
                    </div>
                  )}

                  {/* Actions Row - Responsive wrapping for mobile touch */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#DADCE0] dark:border-[#3C4043]">
                    <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                      <button
                        onClick={() => openVoiceModalFor(phc)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] text-slate-700 dark:text-slate-200 text-xs font-medium border border-[#DADCE0] dark:border-[#3C4043] flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Mic className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
                        <span>Voice</span>
                      </button>

                      <button
                        onClick={() => openVisionModalFor(phc)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] text-slate-700 dark:text-slate-200 text-xs font-medium border border-[#DADCE0] dark:border-[#3C4043] flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-[#188038] dark:text-[#81C995]" />
                        <span>Vision</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                      <button
                        onClick={() => openForecastFor(phc.id, 'MED-01')}
                        className="px-2.5 py-1.5 rounded-lg bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] text-slate-700 dark:text-slate-200 text-xs font-medium border border-[#DADCE0] dark:border-[#3C4043] flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-[#E37400] dark:text-[#FDD663]" />
                        <span>Forecast</span>
                      </button>

                      {isCritical && (
                        <button
                          onClick={() => handleRebalance(phc)}
                          className="px-3 py-1.5 rounded-lg bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 text-[#FBBC04]" />
                          <span>Rebalance</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: Active Fleet & Cross-Border Telemetry */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6">
          
          {/* Active Logistics Fleet */}
          <div className="gcp-card p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#DADCE0] dark:border-[#3C4043] pb-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Truck className="w-4 h-4 text-[#1A73E8] dark:text-[#8AB4F8]" />
                <span>Cold-Chain Transit Corridors</span>
              </h2>
              <span className="text-xs font-mono text-[#188038] dark:text-[#81C995] font-semibold">
                {activeDispatches.length} Active
              </span>
            </div>

            {activeDispatches.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <p>No emergency fleet in transit currently.</p>
                <p className="text-[11px]">Click "Auto Rebalance" on any critical clinic to launch an autonomous cold-chain corridor.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeDispatches.map(dispatch => (
                  <div key={dispatch.id} className="p-3 rounded-xl bg-[#F8F9FA] dark:bg-[#131314] border border-[#DADCE0] dark:border-[#3C4043] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900 dark:text-white">{dispatch.medicineName}</span>
                      <span className="font-mono text-[#1A73E8] dark:text-[#8AB4F8] font-bold">
                        {dispatch.quantity} {dispatch.unit}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>From: {dispatch.donorPhcName?.split(' ')[0]}</span>
                      <span>To: {dispatch.recipientPhcName?.split(' ')[0]}</span>
                    </div>

                    <div className="w-full bg-[#E8EAED] dark:bg-[#28292A] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#1A73E8] h-full rounded-full transition-all duration-500"
                        style={{ width: `${dispatch.progressPercent || 35}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1 font-mono">
                      <span>Temp: {dispatch.temperatureCelsius}°C</span>
                      <span className="text-[#188038] dark:text-[#81C995]">ETA: {dispatch.etaMinutes} mins</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Google AI Tech Stack Badge */}
          <div className="p-4 rounded-xl bg-[#1A73E8]/5 border border-[#1A73E8]/20 space-y-2 text-xs">
            <span className="font-bold text-[#1A73E8] dark:text-[#8AB4F8] flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-[#FBBC04]" />
              <span>Google Cloud AI Powered</span>
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              PulseBRICS uses <strong>Gemini 2.0 Flash</strong> for multimodal audio/visual OCR edge logging, 
              <strong> BigQuery ML ARIMA_PLUS</strong> for 30-day demand surge prediction, and <strong>Gemini Tool Calling</strong> for autonomous cold-chain rebalancing.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
