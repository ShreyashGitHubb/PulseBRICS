import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { 
  Search, 
  Filter, 
  Building2, 
  MapPin, 
  Thermometer, 
  Bed, 
  Users, 
  Mic, 
  Camera, 
  TrendingUp, 
  ChevronRight,
  Shield
} from 'lucide-react';
import PHCDetailDrawer from './PHCDetailDrawer.jsx';

export default function PHCDataTable() {
  const { 
    phcNodes, 
    selectedCountry, 
    selectedPHC, 
    setSelectedPHC, 
    openVoiceModalFor, 
    openVisionModalFor, 
    openForecastFor
  } = useApp();

  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const districts = Array.from(new Set(phcNodes.map(n => n.district)));

  const filtered = phcNodes.filter(phc => {
    const matchSearch = phc.name.toLowerCase().includes(search.toLowerCase()) || 
                        phc.id.toLowerCase().includes(search.toLowerCase());
    const matchDistrict = districtFilter === 'ALL' || phc.district === districtFilter;
    const matchRisk = riskFilter === 'ALL' || phc.riskStatus === riskFilter;
    return matchSearch && matchDistrict && matchRisk;
  });

  const handleRowClick = (phc) => {
    setSelectedPHC(phc);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-4">
      
      {/* Table Title & Filter Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 gcp-card p-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {selectedCountry.unit} Facilities Master Registry
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {filtered.length} of {phcNodes.length} facilities monitored • BigQuery Real-Time Sync
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${selectedCountry.unit} name or ID...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-[#131314] text-xs text-slate-900 dark:text-slate-200 pl-8 pr-3 py-1.5 rounded-lg border border-[#DADCE0] dark:border-[#3C4043] focus:outline-none focus:border-[#1A73E8]"
            />
          </div>

          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="bg-white dark:bg-[#131314] text-xs text-slate-800 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-[#DADCE0] dark:border-[#3C4043] focus:outline-none focus:border-[#1A73E8] cursor-pointer"
          >
            <option value="ALL">All Districts</option>
            {districts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-white dark:bg-[#131314] text-xs text-slate-800 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-[#DADCE0] dark:border-[#3C4043] focus:outline-none focus:border-[#1A73E8] cursor-pointer"
          >
            <option value="ALL">All Risk Statuses</option>
            <option value="CRITICAL_SURGE">Critical Surge</option>
            <option value="WATCH">Watch</option>
            <option value="SURPLUS_DONOR">Surplus Donor</option>
            <option value="ADEQUATE">Adequate</option>
          </select>
        </div>
      </div>

      {/* Google Cloud Style High-Density Data Table */}
      <div className="gcp-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F1F3F4] dark:bg-[#131314] text-slate-700 dark:text-slate-400 font-semibold border-b border-[#DADCE0] dark:border-[#3C4043] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Facility ID & Name</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Resilience Index</th>
                <th className="py-3 px-4">Risk Status</th>
                <th className="py-3 px-4">Cold Chain</th>
                <th className="py-3 px-4">Bed Occupancy</th>
                <th className="py-3 px-4">Staff On Duty</th>
                <th className="py-3 px-4 text-right">Quick AI Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DADCE0] dark:divide-[#3C4043] bg-white dark:bg-[#1E1F20]">
              {filtered.map(phc => {
                const isCritical = phc.riskStatus === 'CRITICAL_SURGE';
                const isSurplus = phc.riskStatus === 'SURPLUS_DONOR';

                return (
                  <tr
                    key={phc.id}
                    onClick={() => handleRowClick(phc)}
                    className="hover:bg-[#F8F9FA] dark:hover:bg-[#28292A] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{phc.name}</div>
                      <div className="text-[10px] font-mono text-[#1A73E8] dark:text-[#8AB4F8] mt-0.5">{phc.id}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      <div>{phc.district}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{phc.state}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-1.5 bg-[#E8EAED] dark:bg-[#131314] rounded-full overflow-hidden border border-[#DADCE0] dark:border-[#3C4043]">
                          <div
                            className={`h-full rounded-full ${
                              isCritical ? 'bg-[#EA4335]' : isSurplus ? 'bg-[#34A853]' : 'bg-[#FBBC04]'
                            }`}
                            style={{ width: `${phc.resilienceScore}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-slate-800 dark:text-white">{phc.resilienceScore}%</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                        isCritical
                          ? 'bg-[#EA4335]/15 text-[#EA4335] dark:text-[#F28B82] border-[#EA4335]/40'
                          : isSurplus
                          ? 'bg-[#34A853]/15 text-[#188038] dark:text-[#81C995] border-[#34A853]/40'
                          : 'bg-[#FBBC04]/15 text-[#E37400] dark:text-[#FDD663] border-[#FBBC04]/40'
                      }`}>
                        {phc.riskStatus?.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {phc.coldChainStatus?.split(' ')[0]}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {phc.occupiedBeds}/{phc.totalBeds} Active
                    </td>

                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                      {phc.doctorAttendance}
                    </td>

                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => openVoiceModalFor(phc)}
                          className="p-1.5 rounded-lg bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] text-slate-700 dark:text-slate-200 border border-[#DADCE0] dark:border-[#3C4043] transition-colors cursor-pointer"
                          title="Record Native Multilingual Voice Log"
                        >
                          <Mic className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
                        </button>
                        <button
                          onClick={() => openVisionModalFor(phc)}
                          className="p-1.5 rounded-lg bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] text-slate-700 dark:text-slate-200 border border-[#DADCE0] dark:border-[#3C4043] transition-colors cursor-pointer"
                          title="Run Gemini Multimodal Vision Shelf OCR"
                        >
                          <Camera className="w-3.5 h-3.5 text-[#188038] dark:text-[#81C995]" />
                        </button>
                        <button
                          onClick={() => openForecastFor(phc)}
                          className="p-1.5 rounded-lg bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] text-slate-700 dark:text-slate-200 border border-[#DADCE0] dark:border-[#3C4043] transition-colors cursor-pointer"
                          title="View 30-Day Predictive Demand Forecaster"
                        >
                          <TrendingUp className="w-3.5 h-3.5 text-[#E37400] dark:text-[#FDD663]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <PHCDetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        phc={selectedPHC}
      />

    </div>
  );
}
