import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { 
  LayoutDashboard, 
  Building2, 
  Map, 
  Truck, 
  TrendingUp, 
  Globe2, 
  Cloud,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { phcNodes, activeDispatches, selectedCountry } = useApp();

  const criticalCount = phcNodes.filter(n => n.riskStatus === 'CRITICAL_SURGE' || n.resilienceScore < 50).length;

  const navItems = [
    {
      id: 'OVERVIEW',
      label: 'Executive Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'FACILITIES',
      label: `${selectedCountry.unit} Directory`,
      icon: Building2,
      badge: phcNodes.length
    },
    {
      id: 'MAP',
      label: 'Geospatial Resilience Grid',
      icon: Map,
      badge: criticalCount > 0 ? `${criticalCount} alert` : null,
      badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30'
    },
    {
      id: 'LOGISTICS',
      label: 'Logistics & Fleet',
      icon: Truck,
      badge: activeDispatches.length > 0 ? `${activeDispatches.length} active` : null,
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    },
    {
      id: 'ANALYTICS',
      label: 'Predictive Forecaster',
      icon: TrendingUp,
      badge: 'Vertex AI',
      badgeColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
    },
    {
      id: 'FEDERATION',
      label: 'BRICS Federation Hub',
      icon: Globe2,
      badge: '3 Nodes',
      badgeColor: 'bg-green-500/10 text-green-400 border-green-500/30'
    }
  ];

  return (
    <aside className="w-64 bg-[#1E1F20] border-r border-[#3C4043] flex flex-col justify-between shrink-0 h-screen sticky top-0">
      
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-[#3C4043]">
          <div className="flex items-center space-x-3">
            
            {/* Google 4-Color Brand Symbol */}
            <div className="w-9 h-9 rounded-lg bg-[#28292A] border border-[#3C4043] flex items-center justify-center p-1.5 shadow-sm">
              <div className="grid grid-cols-2 gap-1 w-full h-full">
                <span className="bg-[#4285F4] rounded-sm"></span>
                <span className="bg-[#EA4335] rounded-sm"></span>
                <span className="bg-[#FBBC04] rounded-sm"></span>
                <span className="bg-[#34A853] rounded-sm"></span>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-sm tracking-tight text-white">PulseBRICS</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#35363A] text-slate-300 border border-[#3C4043]">
                  GCP AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Code for Communities 2026</p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Health Supply Chain Mesh
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#1A73E8]/15 text-[#8AB4F8] font-semibold border border-[#1A73E8]/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-[#28292A]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#8AB4F8]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                    item.badgeColor || 'bg-[#28292A] text-slate-300 border-[#3C4043]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Google Cloud Stack Footer */}
      <div className="p-3.5 border-t border-[#3C4043] bg-[#131314]/60 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#34A853]"></span>
            <span>Google Cloud Run</span>
          </span>
          <span className="font-mono text-slate-400">asia-south1</span>
        </div>
        <div className="p-2 rounded-lg bg-[#28292A] border border-[#3C4043] text-[11px] text-slate-300 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#8AB4F8]" />
            <span>Gemini 2.0 & BigQuery ML</span>
          </div>
          <span className="text-[#81C995] text-[10px] font-mono font-bold">READY</span>
        </div>
      </div>

    </aside>
  );
}
