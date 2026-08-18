import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { 
  Pill, 
  ThermometerSnowflake, 
  TrendingUp, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  PlusCircle, 
  MinusCircle,
  Zap,
  Sparkles
} from 'lucide-react';
import { updatePHCInventory } from '../../services/api.js';

export default function InventoryTable({ phc }) {
  const { medicines, openForecastFor, reloadData, openQuickUpdateFor } = useApp();

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
      console.error('Error updating stock delta:', err);
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-4 sticky top-20">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-cyan-400 font-semibold">{phc.id}</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-300">{phc.district} District</span>
          </div>
          <h2 className="text-base font-bold text-white mt-0.5">{phc.name}</h2>
        </div>

        <button
          onClick={() => openQuickUpdateFor(phc)}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Quick Update</span>
        </button>
      </div>

      {/* Stock Summary Banner */}
      <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-950/80 border border-slate-800">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300 font-medium">Real-Time Inventory Mesh</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Sync: Automated Edge Logging
        </span>
      </div>

      {/* Medicines Table */}
      <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
        {phc.inventory?.map(item => {
          const medMeta = medicines.find(m => m.id === item.medicineId) || {
            name: item.medicineId,
            unit: 'Units',
            isColdChain: false,
            minThreshold: 20
          };

          const isStockout = item.status === 'STOCKOUT_IMMINENT' || item.stock < 10;
          const isSurplusExpiring = item.status === 'SURPLUS_EXPIRING_SOON';
          const daysToDepletion = item.dailyAvgBurn > 0 ? (item.stock / item.dailyAvgBurn).toFixed(1) : '> 30';

          return (
            <div
              key={item.medicineId}
              className={`p-3 rounded-xl border transition-all ${
                isStockout 
                  ? 'bg-rose-950/20 border-rose-900/60' 
                  : isSurplusExpiring
                  ? 'bg-amber-950/20 border-amber-900/60'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-semibold text-white">{medMeta.name}</span>
                    {medMeta.isColdChain && (
                      <span className="p-0.5 px-1.5 rounded-full bg-blue-950 text-blue-300 text-[9px] font-mono flex items-center space-x-0.5 border border-blue-800">
                        <ThermometerSnowflake className="w-2.5 h-2.5" />
                        <span>2°-8°C</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <span>Burn: {item.dailyAvgBurn} {medMeta.unit}/day</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{item.expiryDays}d Exp</span>
                    </span>
                  </div>
                </div>

                {/* Stock Count & Quick Delta */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => handleStockDelta(item.medicineId, -1)}
                      className="p-0.5 text-slate-400 hover:text-rose-400"
                      title="Decrement stock (-1)"
                    >
                      <MinusCircle className="w-3.5 h-3.5" />
                    </button>
                    <span className={`px-1.5 font-mono text-xs font-bold ${
                      isStockout ? 'text-rose-400 font-extrabold' : 'text-slate-100'
                    }`}>
                      {item.stock}
                    </span>
                    <button
                      onClick={() => handleStockDelta(item.medicineId, 1)}
                      className="p-0.5 text-slate-400 hover:text-emerald-400"
                      title="Increment stock (+1)"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{medMeta.unit}</span>
                </div>
              </div>

              {/* Status and Forecast Trigger */}
              <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[10px]">
                  <span className={`px-2 py-0.5 rounded-full font-mono font-medium ${
                    isStockout
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : isSurplusExpiring
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {isStockout ? `⚠️ Runs out in ${daysToDepletion} days` : `Buffer: ${daysToDepletion} days`}
                  </span>
                </div>

                <button
                  onClick={() => openForecastFor(phc, item.medicineId)}
                  className="flex items-center space-x-1 text-[11px] text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  <TrendingUp className="w-3 h-3" />
                  <span>30d Forecast</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
