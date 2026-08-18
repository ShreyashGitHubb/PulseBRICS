import React, { useState } from 'react';
import { AppProvider } from './context/AppContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import TopHeader from './components/TopHeader.jsx';
import MobileBottomBar from './components/Navigation/MobileBottomBar.jsx';

// Views
import EnterpriseOverview from './components/Dashboard/EnterpriseOverview.jsx';
import PHCDataTable from './components/PHCNetwork/PHCDataTable.jsx';
import HealthGeoMap from './components/Map/HealthGeoMap.jsx';
import TransferTracker from './components/Logistics/TransferTracker.jsx';
import PredictiveAnalyticsView from './components/Analytics/PredictiveAnalyticsView.jsx';
import FederationHub from './components/BRICS/FederationHub.jsx';

// Modals
import VoiceLogModal from './components/PHCLogger/VoiceLogModal.jsx';
import VisionScanModal from './components/PHCLogger/VisionScanModal.jsx';
import QuickUpdateModal from './components/PHCLogger/QuickUpdateModal.jsx';
import RebalanceModal from './components/Logistics/RebalanceModal.jsx';
import PredictiveForecastModal from './components/Analytics/PredictiveForecastModal.jsx';
import CrisisSimulator from './components/Simulation/CrisisSimulator.jsx';
import GuidedTourModal from './components/GuidedTour/GuidedTourModal.jsx';
import PitchDeckModal from './components/PitchDeck/PitchDeckModal.jsx';

function MainApp() {
  const [activeTab, setActiveTab] = useState('OVERVIEW');

  return (
    <div className="min-h-screen flex bg-[#F8F9FA] dark:bg-[#090D16] text-slate-800 dark:text-slate-100 selection:bg-[#1A73E8] selection:text-white transition-colors duration-200">
      
      {/* Left Enterprise Sidebar (Desktop Sticky + Mobile Drawer) */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Right Content Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden pb-16 md:pb-0">
        
        {/* Top Header Controls */}
        <TopHeader activeTab={activeTab} />

        {/* Dynamic Main Workspace */}
        <main className="flex-1 p-3 sm:p-6 max-w-7xl w-full mx-auto">
          {activeTab === 'OVERVIEW' && <EnterpriseOverview setActiveTab={setActiveTab} />}
          {activeTab === 'FACILITIES' && <PHCDataTable />}
          {activeTab === 'MAP' && <HealthGeoMap />}
          {activeTab === 'LOGISTICS' && <TransferTracker />}
          {activeTab === 'ANALYTICS' && <PredictiveAnalyticsView />}
          {activeTab === 'FEDERATION' && <FederationHub />}
        </main>

        {/* Global Action Modals */}
        <VoiceLogModal />
        <VisionScanModal />
        <QuickUpdateModal />
        <RebalanceModal />
        <PredictiveForecastModal />
        <CrisisSimulator />
        <GuidedTourModal setActiveTab={setActiveTab} />
        <PitchDeckModal />

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomBar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Footer */}
        <footer className="border-t border-[#DADCE0] dark:border-slate-800/80 bg-white dark:bg-[#0B0F19] py-4 px-6 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 transition-colors hidden md:flex">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">PulseBRICS Health Mesh</span>
            <span>•</span>
            <span>Google Cloud BRICS Hackathon 2026</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            India's 2026 BRICS Chairship — Digital Public Infrastructure (DPI)
          </p>
          <div className="flex items-center space-x-3 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="text-[#1A73E8] font-medium">Gemini 2.0 AI</span>
            <span>•</span>
            <span className="text-[#188038] dark:text-emerald-400 font-medium">FHIR Interoperable</span>
          </div>
        </footer>

      </div>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
