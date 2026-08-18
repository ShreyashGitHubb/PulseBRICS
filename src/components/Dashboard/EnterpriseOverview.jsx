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
    <div className="space-y-6">
      
      {/* Top Banner with Google Cloud Code for Communities Branding */}
      <div className="gcp-card p-5 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-[#4285F4]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold text-[#8AB4F8] bg-[#1A73E8]/10 px-2 py-0.5 rounded border border-[#1A73E8]/30 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#FBBC04]" />
              <span>Google Cloud Build with AI: Code for Communities</span>
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-300">2nd Edition</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            {selectedCountry.flag} National Health Supply & Resilience Command — {selectedCountry.name}
          </h1>
          <p className="text-xs text-slate-400">
            Real-time telemetry, Gemini 2.0 Multimodal edge logging, and autonomous cross-district logistics.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('FACILITIES')}
            className="px-3.5 py-2 rounded-lg bg-[#28292A] hover:bg-[#35363A] text-slate-200 text-xs font-semibold border border-[#3C4043] transition-colors"
          >
            Open Facility Directory
          </button>
          <button
            onClick={() => setActiveTab('MAP')}
            className="px-3.5 py-2 rounded-lg bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-semibold transition-colors shadow"
          >
            Geospatial Mesh Map
          </button>
        </div>
      </div>

      {/* Google 4-Color Styled KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Google Blue: Total Clinics */}
        <div className="gcp-card p-4 space-y-2 relative overflow-hidden border-t-2 border-t-[#4285F4]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Facilities Monitored</span>
            <Building2 className="w-4 h-4 text-[#8AB4F8]" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white tabular-nums">{totalPHCs}</span>
            <span className="text-xs text-slate-400 font-mono">{selectedCountry.unit}s</span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-[#3C4043] flex items-center justify-between">
            <span>Surplus Donors: {surplusNodes.length}</span>
            <span className="text-[#81C995] font-mono font-semibold">100% Online</span>
          </div>
        </div>

        {/* 2. Google Red: Stockout Alerts */}
        <div className={`gcp-card p-4 space-y-2 relative overflow-hidden border-t-2 border-t-[#EA4335] ${
          criticalNodes.length > 0 ? 'bg-[#EA4335]/5' : ''
        }`}>
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Stockout Vulnerabilities</span>
            <AlertTriangle className={`w-4 h-4 ${criticalNodes.length > 0 ? 'text-[#F28B82]' : 'text-slate-400'}`} />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl font-bold tabular-nums ${criticalNodes.length > 0 ? 'text-[#F28B82]' : 'text-white'}`}>
              {criticalNodes.length}
            </span>
            <span className="text-xs text-slate-400">Immediate Risk</span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-[#3C4043] flex items-center justify-between">
            <span>{criticalNodes.length > 0 ? 'Antivenom / ORS Deficit' : 'Buffers Nominal'}</span>
            <span className={criticalNodes.length > 0 ? 'text-[#F28B82] font-semibold' : 'text-slate-400'}>
              {criticalNodes.length > 0 ? 'Action Required' : 'Safe'}
            </span>
          </div>
        </div>

        {/* 3. Google Green: Essential Medicine Units */}
        <div className="gcp-card p-4 space-y-2 relative overflow-hidden border-t-2 border-t-[#34A853]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Essential Drug Units</span>
            <Pill className="w-4 h-4 text-[#81C995]" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white tabular-nums">{totalMedicines.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-mono">Live Vials</span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-[#3C4043] flex items-center justify-between">
            <span>10 Essential Drug Classes</span>
            <span className="text-[#81C995] font-mono">FEFO Managed</span>
          </div>
        </div>

        {/* 4. Google Yellow: Cold Chain Compliance */}
        <div className="gcp-card p-4 space-y-2 relative overflow-hidden border-t-2 border-t-[#FBBC04]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Cold Chain Integrity</span>
            <ThermometerSnowflake className="w-4 h-4 text-[#FDD663]" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white tabular-nums">99.4%</span>
            <span className="text-xs text-[#FDD663] font-mono">2°C - 8°C</span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-[#3C4043] flex items-center justify-between">
            <span>Solar & Phase-Change</span>
            <span className="text-[#FDD663] font-mono">Monitored</span>
          </div>
        </div>

      </div>

      {/* Main Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Facilities Operations Queue */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
              <span>Operational Facility Queue</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#28292A] text-slate-300 border border-[#3C4043]">
                {phcNodes.length} Clinics
              </span>
            </h2>
            <span className="text-xs text-slate-400">Ranked by Resilience Score</span>
          </div>

          <div className="space-y-3">
            {phcNodes.map(phc => {
              const isCritical = phc.riskStatus === 'CRITICAL_SURGE';
              const isSurplus = phc.riskStatus === 'SURPLUS_DONOR';

              return (
                <div
                  key={phc.id}
                  className={`gcp-card p-4 space-y-3 transition-all ${
                    isCritical ? 'border-[#EA4335]/60 bg-[#EA4335]/5' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-semibold text-white">{phc.name}</h3>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#28292A] text-slate-300 border border-[#3C4043]">
                          {phc.id}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-[#8AB4F8]" />
                          <span>{phc.district}, {phc.state}</span>
                        </span>
                        <span>•</span>
                        <span>Beds: {phc.occupiedBeds}/{phc.totalBeds} Active</span>
                        <span>•</span>
                        <span>Doctors: {phc.doctorAttendance?.split(' ')[0]}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-xs font-mono font-bold px-2 py-0.5 rounded border inline-block ${
                        isCritical
                          ? 'bg-[#EA4335]/15 text-[#F28B82] border-[#EA4335]/40'
                          : isSurplus
                          ? 'bg-[#34A853]/15 text-[#81C995] border-[#34A853]/40'
                          : 'bg-[#FBBC04]/15 text-[#FDD663] border-[#FBBC04]/40'
                      }`}>
                        {phc.resilienceScore}% Score
                      </div>
                    </div>
                  </div>

                  {phc.alertMessage && (
                    <div className={`p-2.5 rounded-lg text-xs flex items-start space-x-2 ${
                      isCritical
                        ? 'bg-[#EA4335]/15 border border-[#EA4335]/30 text-[#F28B82]'
                        : 'bg-[#28292A] border border-[#3C4043] text-slate-300'
                    }`}>
                      <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isCritical ? 'text-[#F28B82]' : 'text-[#FDD663]'}`} />
                      <p className="text-[11px] leading-tight">{phc.alertMessage}</p>
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#3C4043]">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openVoiceModalFor(phc)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#28292A] hover:bg-[#35363A] text-slate-200 text-xs font-medium border border-[#3C4043] flex items-center space-x-1.5 transition-colors"
                      >
                        <Mic className="w-3.5 h-3.5 text-[#8AB4F8]" />
                        <span>Voice Entry</span>
                      </button>

                      <button
                        onClick={() => openVisionModalFor(phc)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#28292A] hover:bg-[#35363A] text-slate-200 text-xs font-medium border border-[#3C4043] flex items-center space-x-1.5 transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5 text-[#8AB4F8]" />
                        <span>Shelf OCR</span>
                      </button>

                      <button
                        onClick={() => openForecastFor(phc)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#28292A] hover:bg-[#35363A] text-slate-200 text-xs font-medium border border-[#3C4043] flex items-center space-x-1.5 transition-colors"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-[#8AB4F8]" />
                        <span>Forecast</span>
                      </button>
                    </div>

                    {isCritical && (
                      <button
                        onClick={() => handleRebalance(phc)}
                        className="px-3 py-1.5 rounded-lg bg-[#EA4335] hover:bg-[#D93025] text-white text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Auto-Rebalance</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Columns: Active Logistics Corridors */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
              <Truck className="w-4 h-4 text-[#8AB4F8]" />
              <span>Active Logistics Corridors</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">{activeDispatches.length} In-Transit</span>
          </div>

          <div className="space-y-3">
            {activeDispatches.map(disp => (
              <div key={disp.id} className="gcp-card p-4 space-y-3 border-l-4 border-l-[#1A73E8]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#8AB4F8] font-bold">{disp.id}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1A73E8]/15 text-[#8AB4F8] border border-[#1A73E8]/30 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8AB4F8] animate-ping"></span>
                    <span>IN TRANSIT</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">{disp.medicineName} ({disp.quantity} {disp.unit})</div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span className="truncate">Origin: {disp.donorName}</span>
                    <span className="truncate">Dest: {disp.recipientName}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{disp.distanceKm} km</span>
                    <span className="text-[#8AB4F8] font-bold">ETA: ~{disp.estimatedMinutes}m ({disp.progressPercentage}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#131314] rounded-full overflow-hidden border border-[#3C4043]">
                    <div 
                      className="h-full bg-[#1A73E8] rounded-full transition-all duration-1000"
                      style={{ width: `${disp.progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-[#3C4043]">
                  <span className="truncate">🚚 {disp.courierName}</span>
                  <span className="text-[#81C995] font-mono font-semibold">{disp.temperatureC || '4.1'}°C</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
