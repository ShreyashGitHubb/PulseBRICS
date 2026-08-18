import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { 
  X, 
  Building2, 
  MapPin, 
  ThermometerSnowflake, 
  Bed, 
  Users, 
  Pill, 
  TrendingUp, 
  Mic, 
  Camera, 
  Zap, 
  Clock, 
  PlusCircle, 
  MinusCircle,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { updatePHCInventory, findRebalanceMatch } from '../../services/api.js';

export default function PHCDetailDrawer({ isOpen, onClose, phc }) {
  const { 
    medicines, 
    openVoiceModalFor, 
    openVisionModalFor, 
    openForecastFor, 
    openRebalanceModalWith,
    reloadData 
  } = useApp();

  const [activeTab, setActiveTab] = useState('INVENTORY');

  if (!isOpen || !phc) return null;

  const handleStockDelta = async (medicineId, delta) => {
    const currentItem = phc.inventory?.find(i => i.medicineId === medicineId);
    if (!currentItem) return;

    const newStock = Math.max(0, currentItem.stock + delta);
    try {
      await updatePHCInventory(phc.id, [
        { medicineId, currentStock: newStock }
      ]);
      reloadData();
    } catch (err) {
      console.error('Error adjusting stock in drawer:', err);
    }
  };

  const handleTriggerRebalance = async () => {
    try {
      const stockoutItem = phc.inventory?.find(i => i.status === 'STOCKOUT_IMMINENT' || i.stock < 15) || {
        medicineId: 'MED-01'
      };
      const planResponse = await findRebalanceMatch(phc.id, stockoutItem.medicineId, 24);
      if (planResponse.success) {
        openRebalanceModalWith(planResponse.data);
      }
    } catch (err) {
      console.error('Error triggering rebalance from drawer:', err);
    }
  };

  const isCritical = phc.riskStatus === 'CRITICAL_SURGE';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn flex justify-end">
      <div className="w-full max-w-xl bg-[#1E1F20] border-l border-[#3C4043] h-full flex flex-col shadow-2xl animate-slideLeft">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#3C4043] flex items-start justify-between bg-[#131314]">
          <div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-mono text-[#8AB4F8] font-bold">{phc.id}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{phc.district}, {phc.state}</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">{phc.name}</h2>
            <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
              <span>Catchment Pop: {phc.catchmentPopulation?.toLocaleString()}</span>
              <span>•</span>
              <span className="font-mono text-slate-300">Connectivity: {phc.connectivity}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${
              isCritical
                ? 'bg-[#EA4335]/15 text-[#F28B82] border-[#EA4335]/40'
                : 'bg-[#34A853]/15 text-[#81C995] border-[#34A853]/40'
            }`}>
              {phc.resilienceScore}% Score
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#28292A] hover:bg-[#35363A] text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#3C4043] px-5 bg-[#1E1F20]">
          <button
            onClick={() => setActiveTab('INVENTORY')}
            className={`py-3 text-xs font-medium border-b-2 mr-6 transition-all ${
              activeTab === 'INVENTORY'
                ? 'border-[#1A73E8] text-[#8AB4F8] font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Inventory Matrix ({phc.inventory?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('TELEMETRY')}
            className={`py-3 text-xs font-medium border-b-2 transition-all ${
              activeTab === 'TELEMETRY'
                ? 'border-[#1A73E8] text-[#8AB4F8] font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Cold Chain & Power
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {phc.alertMessage && (
            <div className="p-3 rounded-lg bg-[#EA4335]/15 border border-[#EA4335]/30 text-xs text-[#F28B82] flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-[#F28B82] shrink-0 mt-0.5" />
              <p className="leading-relaxed">{phc.alertMessage}</p>
            </div>
          )}

          {activeTab === 'INVENTORY' && (
            <div className="space-y-2.5">
              {phc.inventory?.map(item => {
                const meta = medicines.find(m => m.id === item.medicineId) || {
                  name: item.medicineId,
                  unit: 'Units',
                  isColdChain: false,
                  minThreshold: 20
                };
                const isStockout = item.status === 'STOCKOUT_IMMINENT' || item.stock < 10;
                const bufferDays = item.dailyAvgBurn > 0 ? (item.stock / item.dailyAvgBurn).toFixed(1) : '>30';

                return (
                  <div
                    key={item.medicineId}
                    className={`gcp-card p-3 space-y-2 ${
                      isStockout ? 'border-[#EA4335]/50 bg-[#EA4335]/5' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-semibold text-white">{meta.name}</span>
                          {meta.isColdChain && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#1A73E8]/20 text-[#8AB4F8] border border-[#1A73E8]/40">
                              2°-8°C
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center space-x-2">
                          <span>Burn: {item.dailyAvgBurn} {meta.unit}/day</span>
                          <span>•</span>
                          <span>{item.expiryDays}d Expiry</span>
                        </div>
                      </div>

                      {/* Stock Adjuster */}
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 bg-[#131314] px-2 py-1 rounded border border-[#3C4043]">
                          <button
                            onClick={() => handleStockDelta(item.medicineId, -1)}
                            className="text-slate-400 hover:text-[#F28B82] p-0.5"
                          >
                            <MinusCircle className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-xs font-bold text-white px-1">
                            {item.stock}
                          </span>
                          <button
                            onClick={() => handleStockDelta(item.medicineId, 1)}
                            className="text-slate-400 hover:text-[#81C995] p-0.5"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{meta.unit}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#3C4043]">
                      <span className={`font-mono ${isStockout ? 'text-[#F28B82] font-bold' : 'text-slate-400'}`}>
                        {isStockout ? `⚠️ Depletion in ${bufferDays} days` : `Buffer: ${bufferDays} days`}
                      </span>

                      <button
                        onClick={() => openForecastFor(phc, item.medicineId)}
                        className="text-[#8AB4F8] hover:text-white flex items-center space-x-1 text-xs font-medium"
                      >
                        <TrendingUp className="w-3 h-3" />
                        <span>30d Curve</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'TELEMETRY' && (
            <div className="space-y-3 text-xs">
              <div className="gcp-card p-4 space-y-2">
                <span className="text-slate-400 font-semibold">Cold Chain Status</span>
                <div className="text-sm font-bold text-white font-mono">{phc.coldChainStatus}</div>
                <p className="text-[11px] text-slate-400">
                  Monitored via IoT thermal sensors compliant with WHO PQS specifications.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="gcp-card p-3 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Power Generator</span>
                  <div className="text-sm font-bold text-white font-mono">{phc.powerBackupHours} Hours</div>
                </div>

                <div className="gcp-card p-3 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Inpatient Beds</span>
                  <div className="text-sm font-bold text-white font-mono">{phc.occupiedBeds} / {phc.totalBeds} Active</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Drawer Action Footer */}
        <div className="p-4 border-t border-[#3C4043] bg-[#131314] flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => openVoiceModalFor(phc)}
              className="px-3 py-2 rounded-lg bg-[#28292A] hover:bg-[#35363A] text-slate-200 text-xs font-medium border border-[#3C4043] flex items-center space-x-1.5"
            >
              <Mic className="w-3.5 h-3.5 text-[#8AB4F8]" />
              <span>Voice Entry</span>
            </button>
            <button
              onClick={() => openVisionModalFor(phc)}
              className="px-3 py-2 rounded-lg bg-[#28292A] hover:bg-[#35363A] text-slate-200 text-xs font-medium border border-[#3C4043] flex items-center space-x-1.5"
            >
              <Camera className="w-3.5 h-3.5 text-[#8AB4F8]" />
              <span>Shelf OCR</span>
            </button>
          </div>

          {isCritical && (
            <button
              onClick={handleTriggerRebalance}
              className="px-4 py-2 rounded-lg bg-[#EA4335] hover:bg-[#D93025] text-white text-xs font-bold shadow flex items-center space-x-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Auto-Rebalance</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
