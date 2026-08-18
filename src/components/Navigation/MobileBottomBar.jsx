import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { 
  LayoutDashboard, 
  Building2, 
  Map, 
  Truck, 
  TrendingUp, 
  Globe2 
} from 'lucide-react';

export default function MobileBottomBar({ activeTab, setActiveTab }) {
  const { phcNodes, activeDispatches } = useApp();

  const criticalCount = phcNodes.filter(n => n.riskStatus === 'CRITICAL_SURGE' || n.resilienceScore < 50).length;

  const tabs = [
    { id: 'OVERVIEW', label: 'Overview', icon: LayoutDashboard },
    { id: 'FACILITIES', label: 'Clinics', icon: Building2 },
    { id: 'MAP', label: 'Map', icon: Map, alert: criticalCount > 0 },
    { id: 'LOGISTICS', label: 'Fleet', icon: Truck, count: activeDispatches.length },
    { id: 'ANALYTICS', label: 'Forecast', icon: TrendingUp },
    { id: 'FEDERATION', label: 'BRICS', icon: Globe2 }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1E1F20]/95 backdrop-blur-md border-t border-[#DADCE0] dark:border-[#3C4043] px-2 py-1.5 flex items-center justify-around transition-colors shadow-lg">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
              isActive
                ? 'text-[#1A73E8] dark:text-[#8AB4F8] font-bold scale-105'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {tab.alert && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#EA4335] animate-ping" />
              )}
              {tab.count > 0 && (
                <span className="absolute -top-1 -right-2 px-1 text-[9px] font-mono font-bold rounded-full bg-[#1A73E8] text-white">
                  {tab.count}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
