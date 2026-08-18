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
  Sparkles, 
  Presentation, 
  Compass, 
  Sun, 
  Moon,
  X
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { 
    phcNodes, 
    activeDispatches, 
    selectedCountry,
    setGuidedTourOpen,
    setPitchDeckOpen,
    theme,
    toggleTheme,
    mobileMenuOpen,
    setMobileMenuOpen
  } = useApp();

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
      badgeColor: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30'
    },
    {
      id: 'LOGISTICS',
      label: 'Logistics & Fleet',
      icon: Truck,
      badge: activeDispatches.length > 0 ? `${activeDispatches.length} active` : null,
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
    },
    {
      id: 'ANALYTICS',
      label: 'Predictive Forecaster',
      icon: TrendingUp,
      badge: 'Vertex AI',
      badgeColor: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30'
    },
    {
      id: 'FEDERATION',
      label: 'BRICS Federation Hub',
      icon: Globe2,
      badge: '5 Nations',
      badgeColor: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30'
    }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const sidebarContent = (
    <div className="w-64 bg-white dark:bg-[#1E1F20] border-r border-[#DADCE0] dark:border-[#3C4043] flex flex-col justify-between shrink-0 h-full transition-colors duration-200">
      
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-[#DADCE0] dark:border-[#3C4043] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            
            {/* Google 4-Color Brand Symbol */}
            <div className="w-9 h-9 rounded-lg bg-[#F8F9FA] dark:bg-[#28292A] border border-[#DADCE0] dark:border-[#3C4043] flex items-center justify-center p-1.5 shadow-sm">
              <div className="grid grid-cols-2 gap-1 w-full h-full">
                <span className="bg-[#4285F4] rounded-sm"></span>
                <span className="bg-[#EA4335] rounded-sm"></span>
                <span className="bg-[#FBBC04] rounded-sm"></span>
                <span className="bg-[#34A853] rounded-sm"></span>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">PulseBRICS</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#F1F3F4] dark:bg-[#35363A] text-slate-700 dark:text-slate-300 border border-[#DADCE0] dark:border-[#3C4043]">
                  GCP AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Code for Communities 2026</p>
            </div>
          </div>

          {/* Mobile Close Button */}
          {mobileMenuOpen && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-[#F1F3F4] dark:bg-[#28292A]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Health Supply Chain Mesh
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1A73E8]/10 dark:bg-[#1A73E8]/15 text-[#1A73E8] dark:text-[#8AB4F8] font-semibold border border-[#1A73E8]/30 shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-[#F1F3F4] dark:hover:bg-[#28292A]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#1A73E8] dark:text-[#8AB4F8]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                    item.badgeColor || 'bg-[#F1F3F4] dark:bg-[#28292A] text-slate-600 dark:text-slate-300 border-[#DADCE0] dark:border-[#3C4043]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Quick Launch Hub */}
      <div className="p-3 border-t border-[#DADCE0] dark:border-[#3C4043] space-y-2">
        
        {/* Quick Launch Buttons */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => { setGuidedTourOpen(true); if (mobileMenuOpen) setMobileMenuOpen(false); }}
            className="p-2 rounded-lg bg-[#F8F9FA] hover:bg-[#F1F3F4] dark:bg-[#28292A] dark:hover:bg-[#35363A] text-slate-800 dark:text-slate-200 text-[11px] font-semibold border border-[#DADCE0] dark:border-[#3C4043] flex items-center justify-center space-x-1 transition-colors cursor-pointer"
            title="Start Interactive Guided Walkthrough"
          >
            <Compass className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
            <span>Guided Tour</span>
          </button>

          <button
            onClick={() => { setPitchDeckOpen(true); if (mobileMenuOpen) setMobileMenuOpen(false); }}
            className="p-2 rounded-lg bg-[#F8F9FA] hover:bg-[#F1F3F4] dark:bg-[#28292A] dark:hover:bg-[#35363A] text-slate-800 dark:text-slate-200 text-[11px] font-semibold border border-[#DADCE0] dark:border-[#3C4043] flex items-center justify-center space-x-1 transition-colors cursor-pointer"
            title="Open 12-Slide Pitch Presentation"
          >
            <Presentation className="w-3.5 h-3.5 text-[#EA4335] dark:text-[#F28B82]" />
            <span>Pitch Deck</span>
          </button>
        </div>

        {/* 5-Nation BRICS Mesh Status */}
        <div className="p-2.5 rounded-lg bg-[#F8F9FA] dark:bg-[#131314] border border-[#DADCE0] dark:border-[#3C4043] text-xs space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#FBBC04]" />
              <span>Federated Grid</span>
            </span>
            <span className="text-[#188038] dark:text-[#81C995] font-mono font-semibold">5/5 Online</span>
          </div>
          <div className="flex items-center space-x-1 text-sm pt-0.5">
            <span title="India (PHC)">🇮🇳</span>
            <span title="Brazil (UBS)">🇧🇷</span>
            <span title="South Africa (CHC)">🇿🇦</span>
            <span title="Russia (FAP)">🇷🇺</span>
            <span title="China (THC)">🇨🇳</span>
          </div>
        </div>

        {/* Theme Toggle in Sidebar */}
        <button
          onClick={toggleTheme}
          className="w-full py-1.5 px-3 rounded-lg text-xs font-medium bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] text-slate-700 dark:text-slate-300 border border-[#DADCE0] dark:border-[#3C4043] flex items-center justify-between transition-colors cursor-pointer"
        >
          <span className="flex items-center space-x-2">
            {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-[#1A73E8]" /> : <Sun className="w-3.5 h-3.5 text-[#FBBC04]" />}
            <span>Theme: {theme === 'dark' ? 'Google Dark' : 'Google White'}</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500">Toggle</span>
        </button>

      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:flex h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fadeIn">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Slide Drawer */}
          <div className="relative z-10 h-full shadow-2xl animate-slideRight">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
