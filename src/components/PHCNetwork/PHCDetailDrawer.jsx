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
      <div className="w-full max-w-xl bg-white dark:bg-[#1E1F20] border-l border-[#DADCE0] dark:border-[#3C4043] h-full flex flex-col shadow-2xl animate-slideLeft transition-colors">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#DADCE0] dark:border-[#3C4043] flex items-start justify-between bg-[#F8F9FA] dark:bg-[#131314]">
          <div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-mono text-[#1A73E8] dark:text-[#8AB4F8] font-bold">{phc.id}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 dark:text-slate-400">{phc.district}, {phc.state}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{phc.name}</h2>
            <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span>Catchment Pop: {phc.catchmentPopulation?.toLocaleString()}</span>
              <span>•</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">Connectivity: {phc.connectivity}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${
              isCritical
                ? 'bg-[#EA4335]/15 text-[#EA4335] dark:text-[#F28B82] border-[#EA4335]/40'
                : 'bg-[#34A853]/15 text-[#188038] dark:text-[#81C995] border-[#34A853]/40'
            }`}>
              {phc.resilienceScore}% Score
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-white dark:bg-[#1E1F20] border-b border-[#DADCE0] dark:border-[#3C4043] flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => openVoiceModalFor(phc)}
              className="px-3 py-1.5 rounded-lg bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice Note</span>
            </button>

            <button
              onClick={() => openVisionModalFor(phc)}
              className="px-3 py-1.5 rounded-lg bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] text-slate-800 dark:text-slate-200 text-xs font-semibold border border-[#DADCE0] dark:border-[#3C4043] flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-[#188038] dark:text-[#81C995]" />
              <span>Shelf Photo</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => openForecastFor(phc)}
              className="px-3 py-1.5 rounded-lg bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] text-slate-800 dark:text-slate-200 text-xs font-semibold border border-[#DADCE0] dark:border-[#3C4043] flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#E37400] dark:text-[#FDD663]" />
              <span>30d Forecaster</span>
            </button>

            {isCritical && (
              <button
                onClick={handleTriggerRebalance}
                className="px-3 py-1.5 rounded-lg bg-[#EA4335] hover:bg-[#C5221F] text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-[#FBBC04]" />
                <span>Rebalance</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#DADCE0] dark:border-[#3C4043] bg-[#F8F9FA] dark:bg-[#131314] px-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('INVENTORY')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'INVENTORY'
                ? 'border-[#1A73E8] text-[#1A73E8] dark:text-[#8AB4F8]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Essential Drug Stock ({phc.inventory?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('CLINICAL')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'CLINICAL'
                ? 'border-[#1A73E8] text-[#1A73E8] dark:text-[#8AB4F8]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Clinical Telemetry & Cold Chain
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white dark:bg-[#1E1F20]">
          
          {activeTab === 'INVENTORY' && (
            <div className="space-y-3">
              {phc.inventory?.map(item => {
                const medMeta = medicines.find(m => m.id === item.medicineId) || {};
                const isItemCritical = item.status === 'STOCKOUT_IMMINENT' || item.stock < 15;
                const isItemSurplus = item.status === 'SURPLUS' || item.status === 'SURPLUS_EXPIRING_SOON';

                return (
                  <div
                    key={item.medicineId}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isItemCritical
                        ? 'bg-[#EA4335]/5 border-[#EA4335]/40'
                        : 'bg-[#F8F9FA] dark:bg-[#131314] border-[#DADCE0] dark:border-[#3C4043]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-slate-900 dark:text-white text-xs">
                            {medMeta.name || item.medicineId}
                          </span>
                          {medMeta.isColdChain && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20">
                              Cold 2-8°C
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                          Category: {medMeta.category || 'Essential Medicine'} • Expiry: ~{item.expiryDays} days
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                          {item.stock} {medMeta.unit || 'Units'}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          Burn: {item.dailyAvgBurn}/day
                        </div>
                      </div>
                    </div>

                    {/* Stock Adjustment Controls */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#DADCE0] dark:border-[#3C4043]">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isItemCritical
                          ? 'bg-[#EA4335]/15 text-[#EA4335] dark:text-[#F28B82] border-[#EA4335]/30'
                          : isItemSurplus
                          ? 'bg-[#34A853]/15 text-[#188038] dark:text-[#81C995] border-[#34A853]/30'
                          : 'bg-[#FBBC04]/15 text-[#E37400] dark:text-[#FDD663] border-[#FBBC04]/30'
                      }`}>
                        {item.status?.replace('_', ' ')}
                      </span>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleStockDelta(item.medicineId, -5)}
                          className="p-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded bg-[#F1F3F4] dark:bg-[#28292A] border border-[#DADCE0] dark:border-[#3C4043] cursor-pointer"
                          title="Record 5 Units Dispensed / Consumed"
                        >
                          <MinusCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleStockDelta(item.medicineId, +10)}
                          className="p-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded bg-[#F1F3F4] dark:bg-[#28292A] border border-[#DADCE0] dark:border-[#3C4043] cursor-pointer"
                          title="Record 10 Units Stock Arrival"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'CLINICAL' && (
            <div className="space-y-4">
              
              <div className="p-4 rounded-xl bg-[#F8F9FA] dark:bg-[#131314] border border-[#DADCE0] dark:border-[#3C4043] space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <ThermometerSnowflake className="w-4 h-4 text-[#1A73E8] dark:text-[#8AB4F8]" />
                  <span>Cold Chain Refrigeration Integrity</span>
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043]">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px]">ILR Vaccine Cooler:</span>
                    <p className="font-mono text-slate-900 dark:text-white font-bold mt-0.5">{phc.coldChainStatus}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043]">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px]">Power Backup Buffer:</span>
                    <p className="font-mono text-[#188038] dark:text-[#81C995] font-bold mt-0.5">{phc.powerBackupHours} Hours (Generator)</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F9FA] dark:bg-[#131314] border border-[#DADCE0] dark:border-[#3C4043] space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Users className="w-4 h-4 text-[#188038] dark:text-[#81C995]" />
                  <span>Medical Staff & Bed Census</span>
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043]">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px]">Doctor Attendance:</span>
                    <p className="font-mono text-slate-900 dark:text-white font-bold mt-0.5">{phc.doctorAttendance}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043]">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px]">Nurse Attendance:</span>
                    <p className="font-mono text-slate-900 dark:text-white font-bold mt-0.5">{phc.nurseAttendance}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#1E1F20] border border-[#DADCE0] dark:border-[#3C4043] col-span-2">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px]">Inpatient Bed Census:</span>
                    <p className="font-mono text-slate-900 dark:text-white font-bold mt-0.5">
                      {phc.occupiedBeds} occupied / {phc.totalBeds} total available beds
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
