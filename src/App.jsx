import React, { useState } from 'react';
import { AppProvider } from './context/AppContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import TopHeader from './components/TopHeader.jsx';

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

function MainApp() {
  const [activeTab, setActiveTab] = useState('OVERVIEW');

  return (
    <div className="min-h-screen flex bg-[#090D16] text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Left Enterprise Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Right Content Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Top Header Controls */}
        <TopHeader activeTab={activeTab} />

        {/* Dynamic Main Workspace */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
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

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-[#0B0F19] py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-300">PulseBRICS Health Mesh</span>
            <span>•</span>
            <span>Google Cloud BRICS Hackathon 2026</span>
          </div>
          <p className="text-[11px] text-slate-400">
            India's 2026 BRICS Chairship — Digital Public Infrastructure (DPI)
          </p>
          <div className="flex items-center space-x-3 text-[11px] text-slate-400">
            <span className="text-indigo-400">Gemini 2.0 AI</span>
            <span>•</span>
            <span className="text-emerald-400">FHIR Interoperable</span>
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
