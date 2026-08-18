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
    setForecastTargetMed,
    theme
  } = useApp();

  const [surgeMultiplier, setSurgeMultiplier] = useState(1.0);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isDark = theme === 'dark';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#1E1F20] w-full max-w-4xl rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-6 shadow-2xl space-y-5 relative max-h-[95vh] overflow-y-auto transition-colors">
        
        {/* Close Button */}
        <button
          onClick={() => setForecastModalOpen(false)}
          className="absolute top-5 right-5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1 rounded-lg bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-tr from-[#1A73E8] to-[#4285F4] rounded-2xl text-white shadow-lg shadow-blue-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-[#1A73E8] dark:text-[#8AB4F8] font-bold">{selectedPHC.id}</span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-600 dark:text-slate-300">{selectedPHC.district} District</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Vertex AI & BigQuery ML 30-Day Demand Projection
            </h2>
          </div>
        </div>

        {/* Controls: Medicine Selector & Surge Multiplier Slider */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-[#F8F9FA] dark:bg-[#131314] rounded-2xl border border-[#DADCE0] dark:border-[#3C4043] items-center">
          
          {/* Medicine Selector */}
          <div className="sm:col-span-6 space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Essential Drug / Vaccine:</label>
            <select
              value={forecastTargetMed}
              onChange={(e) => setForecastTargetMed(e.target.value)}
              className="w-full bg-white dark:bg-[#1E1F20] text-xs text-slate-900 dark:text-slate-100 p-2.5 rounded-xl border border-[#DADCE0] dark:border-[#3C4043] focus:outline-none focus:border-[#1A73E8] cursor-pointer"
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
              <span className="text-slate-700 dark:text-slate-300 flex items-center space-x-1 font-semibold">
                <Sliders className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
                <span>Simulate Outbreak Surge Multiplier:</span>
              </span>
              <span className="text-[#1A73E8] dark:text-[#8AB4F8] font-mono font-bold">{surgeMultiplier}x Demand</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="3.5"
              step="0.25"
              value={surgeMultiplier}
              onChange={(e) => setSurgeMultiplier(parseFloat(e.target.value))}
              className="w-full h-2 bg-[#E8EAED] dark:bg-[#28292A] rounded-lg appearance-none cursor-pointer accent-[#1A73E8]"
            />
          </div>

        </div>

        {/* Forecast KPI Metrics Banner */}
        {forecastData && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#F8F9FA] dark:bg-[#131314] p-3.5 rounded-2xl border border-[#DADCE0] dark:border-[#3C4043]">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Current Inventory</span>
              <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                {forecastData.currentStock} <span className="text-xs text-slate-500 font-normal">{forecastData.unit}</span>
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border ${
              forecastData.stockoutCritical 
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300' 
                : 'bg-[#F8F9FA] dark:bg-[#131314] border-[#DADCE0] dark:border-[#3C4043] text-slate-800 dark:text-slate-200'
            }`}>
              <span className="text-[10px] uppercase font-semibold opacity-80">Days Until Depletion</span>
              <div className="text-base font-bold font-mono mt-0.5 flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{forecastData.daysUntilStockout} {typeof forecastData.daysUntilStockout === 'number' ? 'Days' : ''}</span>
              </div>
            </div>

            <div className="bg-[#F8F9FA] dark:bg-[#131314] p-3.5 rounded-2xl border border-[#DADCE0] dark:border-[#3C4043]">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Recommended Buffer Order</span>
              <div className="text-base font-bold font-mono text-[#1A73E8] dark:text-[#8AB4F8] mt-0.5">
                +{forecastData.recommendedReorderQuantity} <span className="text-xs text-slate-500 font-normal">{forecastData.unit}</span>
              </div>
            </div>

            <div className="bg-[#F8F9FA] dark:bg-[#131314] p-3.5 rounded-2xl border border-[#DADCE0] dark:border-[#3C4043]">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">AI Forecasting Model</span>
              <div className="text-xs font-bold text-[#188038] dark:text-[#81C995] mt-1 truncate">
                ARIMA_PLUS Ensemble
              </div>
            </div>
          </div>
        )}

        {/* High-Resolution Recharts Chart */}
        <div className="p-4 rounded-2xl bg-[#F8F9FA] dark:bg-[#131314] border border-[#DADCE0] dark:border-[#3C4043] space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              30-Day Forward Stock Trajectory vs Consumption vs Safety Buffer
            </span>
            <span className="text-[10px] font-mono text-[#1A73E8] dark:text-[#8AB4F8]">
              Shaded: 95% Confidence Interval (CI₉₅)
            </span>
          </div>

          <div className="h-72 w-full">
            {forecastData && forecastData.forecastSeries ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={forecastData.forecastSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A73E8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1A73E8" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="displayDate" 
                    stroke={isDark ? '#9AA0A6' : '#5F6368'} 
                    fontSize={10} 
                    tickLine={false}
                  />
                  <YAxis 
                    stroke={isDark ? '#9AA0A6' : '#5F6368'} 
                    fontSize={10} 
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#1E1F20' : '#FFFFFF', 
                      borderColor: isDark ? '#3C4043' : '#DADCE0',
                      borderRadius: '0.75rem',
                      fontSize: '11px',
                      color: isDark ? '#FFFFFF' : '#202124',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  
                  {/* Safety Buffer Reference Line */}
                  <ReferenceLine 
                    y={forecastData.forecastSeries[0]?.safeThreshold || 20} 
                    stroke="#EA4335" 
                    strokeDasharray="4 4" 
                    label={{ value: 'Min Safety Buffer', fill: '#EA4335', fontSize: 10, position: 'right' }} 
                  />

                  {/* Daily Burn Rate Bar */}
                  <Bar dataKey="dailyConsumption" name="Daily Burn" fill="#34A853" opacity={0.6} barSize={8} />

                  {/* Projected Stock Area with Gradient */}
                  <Area 
                    type="monotone" 
                    dataKey="projectedStock" 
                    name="Projected Stock" 
                    stroke="#1A73E8" 
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
