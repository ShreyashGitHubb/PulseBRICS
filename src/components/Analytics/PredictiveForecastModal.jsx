import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { 
  TrendingUp, 
  AlertOctagon, 
  CheckCircle2, 
  Sparkles, 
  Sliders, 
  X, 
  Clock, 
  Layers 
} from 'lucide-react';
import { fetchDemandForecast } from '../../services/api.js';

export default function PredictiveForecastModal() {
  const { 
    selectedPHC, 
    forecastModalOpen, 
    setForecastModalOpen, 
    medicines, 
    forecastTargetMed, 
    setForecastTargetMed 
  } = useApp();

  const [surgeMultiplier, setSurgeMultiplier] = useState(1.0);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (forecastModalOpen && selectedPHC) {
      loadForecast();
    }
  }, [forecastModalOpen, selectedPHC, forecastTargetMed, surgeMultiplier]);

  const loadForecast = async () => {
    setLoading(true);
    try {
      const res = await fetchDemandForecast(selectedPHC.id, forecastTargetMed, surgeMultiplier);
      if (res.success && res.data) {
        setForecastData(res.data);
      }
    } catch (err) {
      console.error('Error loading forecast:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!forecastModalOpen || !selectedPHC) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-4xl rounded-3xl border border-slate-700 p-6 shadow-2xl space-y-5 relative max-h-[95vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setForecastModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl text-white shadow-lg shadow-purple-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-purple-400 font-semibold">{selectedPHC.id}</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-300">{selectedPHC.district} District</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Vertex AI & BigQuery ML 30-Day Demand Projection
            </h2>
          </div>
        </div>

        {/* Controls: Medicine Selector & Surge Multiplier Slider */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-slate-900/80 rounded-2xl border border-slate-800 items-center">
          
          {/* Medicine Selector */}
          <div className="sm:col-span-6 space-y-1">
            <label className="text-xs font-medium text-slate-400">Target Essential Drug / Vaccine:</label>
            <select
              value={forecastTargetMed}
              onChange={(e) => setForecastTargetMed(e.target.value)}
              className="w-full bg-slate-950 text-xs text-slate-100 p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              {medicines.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.unit}) {m.isColdChain ? '❄️ 2°-8°C' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Crisis Surge Scenario Multiplier */}
          <div className="sm:col-span-6 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 flex items-center space-x-1">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <span>Simulate Outbreak Surge Multiplier:</span>
              </span>
              <span className="text-purple-400 font-mono font-bold">{surgeMultiplier}x Demand</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="3.5"
              step="0.25"
              value={surgeMultiplier}
              onChange={(e) => setSurgeMultiplier(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

        </div>

        {/* Forecast KPI Metrics Banner */}
        {forecastData && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Current Inventory</span>
              <div className="text-base font-bold font-mono text-white mt-0.5">
                {forecastData.currentStock} <span className="text-xs text-slate-400 font-normal">{forecastData.unit}</span>
              </div>
            </div>

            <div className={`p-3 rounded-2xl border ${
              forecastData.stockoutCritical 
                ? 'bg-rose-950/40 border-rose-800/80 text-rose-300' 
                : 'bg-slate-900 border-slate-800'
            }`}>
              <span className="text-[10px] uppercase opacity-80">Days Until Depletion</span>
              <div className="text-base font-bold font-mono mt-0.5 flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{forecastData.daysUntilStockout} {typeof forecastData.daysUntilStockout === 'number' ? 'Days' : ''}</span>
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Recommended Buffer Order</span>
              <div className="text-base font-bold font-mono text-cyan-400 mt-0.5">
                +{forecastData.recommendedReorderQuantity} <span className="text-xs text-slate-400 font-normal">{forecastData.unit}</span>
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">AI Forecasting Model</span>
              <div className="text-xs font-bold text-emerald-400 mt-1 truncate">
                ARIMA_PLUS Ensemble
              </div>
            </div>
          </div>
        )}

        {/* High-Resolution Recharts Chart */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-200">
              30-Day Forward Stock Trajectory vs Consumption vs Safety Buffer
            </span>
            <span className="text-[10px] font-mono text-purple-400">
              Shaded: 95% Confidence Interval (CI₉₅)
            </span>
          </div>

          <div className="h-72 w-full">
            {forecastData && forecastData.forecastSeries ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={forecastData.forecastSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="displayDate" 
                    stroke="#64748b" 
                    fontSize={10} 
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={10} 
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '11px',
                      color: '#f8fafc'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  
                  {/* Safety Buffer Reference Line */}
                  <ReferenceLine 
                    y={forecastData.forecastSeries[0]?.safeThreshold || 20} 
                    stroke="#f43f5e" 
                    strokeDasharray="4 4" 
                    label={{ value: 'Min Safety Buffer', fill: '#f43f5e', fontSize: 10, position: 'right' }} 
                  />

                  {/* Daily Burn Rate Bar */}
                  <Bar dataKey="dailyConsumption" name="Daily Burn" fill="#06b6d4" opacity={0.6} barSize={8} />

                  {/* Projected Stock Area with Gradient */}
                  <Area 
                    type="monotone" 
                    dataKey="projectedStock" 
                    name="Projected Stock" 
                    stroke="#a855f7" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#stockGradient)" 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                Loading time-series forecast...
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
