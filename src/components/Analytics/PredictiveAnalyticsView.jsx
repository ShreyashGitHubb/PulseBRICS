import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { 
  ResponsiveContainer, 
  ComposedChart, 
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
  Sliders, 
  Clock, 
  Sparkles, 
  Building2, 
  AlertTriangle,
  Layers,
  Cpu
} from 'lucide-react';
import { fetchDemandForecast } from '../../services/api.js';

export default function PredictiveAnalyticsView() {
  const { phcNodes, medicines, selectedCountry, theme } = useApp();

  const [selectedPHCId, setSelectedPHCId] = useState(phcNodes[0]?.id || 'PHC-IN-001');
  const [selectedMedId, setSelectedMedId] = useState('MED-01');
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.0);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  const isDark = theme === 'dark';

  useEffect(() => {
    loadForecast();
  }, [selectedPHCId, selectedMedId, surgeMultiplier]);

  const loadForecast = async () => {
    setLoading(true);
    try {
      const res = await fetchDemandForecast(selectedPHCId, selectedMedId, surgeMultiplier);
      if (res.success && res.data) {
        setForecast(res.data);
      }
    } catch (err) {
      console.error('Error loading forecast analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentPHC = phcNodes.find(n => n.id === selectedPHCId) || phcNodes[0];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Vertex AI & BigQuery ML Predictive Demand Cockpit
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Time-Series ARIMA_PLUS Models factoring in Monsoon Rainfalls & Outbreak Multipliers
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-[#F1F3F4] dark:bg-[#1E1F20] px-3 py-1.5 rounded-lg border border-[#DADCE0] dark:border-[#3C4043] text-slate-800 dark:text-slate-200">
          <Cpu className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
          <span>Model: ARIMA_PLUS_ENSEMBLE (CI₉₅)</span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="gcp-card p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        
        {/* Facility Selector */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Target Facility:</label>
          <select
            value={selectedPHCId}
            onChange={(e) => setSelectedPHCId(e.target.value)}
            className="w-full bg-white dark:bg-[#131314] text-xs text-slate-900 dark:text-slate-200 p-2 rounded-lg border border-[#DADCE0] dark:border-[#3C4043] focus:outline-none focus:border-[#1A73E8] cursor-pointer"
          >
            {phcNodes.map(phc => (
              <option key={phc.id} value={phc.id}>
                {phc.name} ({phc.district})
              </option>
            ))}
          </select>
        </div>

        {/* Medicine Selector */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Essential Drug / Vaccine:</label>
          <select
            value={selectedMedId}
            onChange={(e) => setSelectedMedId(e.target.value)}
            className="w-full bg-white dark:bg-[#131314] text-xs text-slate-900 dark:text-slate-200 p-2 rounded-lg border border-[#DADCE0] dark:border-[#3C4043] focus:outline-none focus:border-[#1A73E8] cursor-pointer"
          >
            {medicines.map(med => (
              <option key={med.id} value={med.id}>
                {med.name} {med.isColdChain ? '❄️ 2°-8°C' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Outbreak / Flood Risk Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-600 dark:text-slate-400">Outbreak Surge Factor:</span>
            <span className="font-mono text-[#1A73E8] dark:text-[#8AB4F8] font-bold">{surgeMultiplier}x Demand Rate</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.1"
            value={surgeMultiplier}
            onChange={(e) => setSurgeMultiplier(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-[#E8EAED] dark:bg-[#28292A] rounded-lg appearance-none cursor-pointer accent-[#1A73E8]"
          />
        </div>

      </div>

      {/* Analytics KPI Overview */}
      {forecast && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="gcp-card p-4 space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Predicted Days to Stockout</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums font-mono">
              {forecast.predictedDaysUntilStockout} Days
            </div>
            <p className="text-[11px] text-[#EA4335] dark:text-[#F28B82] font-medium">
              {forecast.predictedDaysUntilStockout < 7 ? 'Critical Buffer Breach Imminent' : 'Buffer Nominal'}
            </p>
          </div>

          <div className="gcp-card p-4 space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Projected 30d Consumption</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums font-mono">
              {forecast.projected30DayDemand} Units
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Confidence Interval: 95%
            </p>
          </div>

          <div className="gcp-card p-4 space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Current On-Hand Buffer</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums font-mono">
              {forecast.currentStock} Units
            </div>
            <p className="text-[11px] text-[#188038] dark:text-[#81C995] font-medium">
              Lead Time Buffer: ~{Math.round(forecast.currentStock / 4)} Days
            </p>
          </div>

          <div className="gcp-card p-4 space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Recommended Replenishment</span>
            <div className="text-2xl font-bold text-[#1A73E8] dark:text-[#8AB4F8] tabular-nums font-mono">
              +{forecast.recommendedOrderQuantity} Units
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Auto-Trigger Rebalance Match
            </p>
          </div>
        </div>
      )}

      {/* Main Chart */}
      <div className="gcp-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-[#1A73E8] dark:text-[#8AB4F8]" />
              <span>30-Day Predictive Trajectory (Historical vs ARIMA_PLUS Upper/Lower Bound)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Blue fill represents 95% confidence interval bound. Red line indicates safety threshold stockout line.
            </p>
          </div>
        </div>

        <div className="h-[360px] w-full pt-4">
          {loading ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              Generating ARIMA Time-Series forecast...
            </div>
          ) : forecast && forecast.timeSeries ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forecast.timeSeries}>
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: isDark ? '#9AA0A6' : '#5F6368' }} 
                  axisLine={{ stroke: isDark ? '#3C4043' : '#DADCE0' }}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: isDark ? '#9AA0A6' : '#5F6368' }} 
                  axisLine={{ stroke: isDark ? '#3C4043' : '#DADCE0' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#1E1F20' : '#FFFFFF', 
                    borderColor: isDark ? '#3C4043' : '#DADCE0',
                    color: isDark ? '#FFFFFF' : '#202124',
                    borderRadius: '8px',
                    fontSize: '11px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <ReferenceLine y={15} stroke="#EA4335" strokeDasharray="3 3" label={{ value: 'Safety Threshold', fill: '#EA4335', fontSize: 10 }} />
                <Area 
                  type="monotone" 
                  dataKey="upperBound" 
                  stroke="none" 
                  fill="#4285F4" 
                  fillOpacity={0.15} 
                  name="ARIMA Upper CI (95%)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="predictedDemand" 
                  stroke="#1A73E8" 
                  strokeWidth={2.5} 
                  fill="none" 
                  name="Forecasted Consumption" 
                />
                <Bar 
                  dataKey="historicalUsage" 
                  fill="#34A853" 
                  opacity={0.7} 
                  name="Actual Historical Usage" 
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              No time-series telemetry available.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
