import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../context/AppContext.jsx';
import { 
  Shield, 
  MapPin, 
  Thermometer, 
  AlertTriangle, 
  TrendingUp, 
  Mic, 
  Camera, 
  Zap,
  Truck
} from 'lucide-react';
import { findRebalanceMatch } from '../../services/api.js';

// Helper component to smoothly re-center map when country changes
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

// Custom Leaflet Icons for Health Nodes
function createCustomPin(riskStatus, resilienceScore, isDark = true) {
  let color = '#1A73E8'; // Blue
  let bgGlow = 'rgba(26, 115, 232, 0.4)';
  
  if (riskStatus === 'CRITICAL_SURGE' || resilienceScore < 50) {
    color = '#EA4335'; // Red
    bgGlow = 'rgba(234, 67, 53, 0.6)';
  } else if (riskStatus === 'SURPLUS_DONOR') {
    color = '#188038'; // Green
    bgGlow = 'rgba(24, 128, 56, 0.5)';
  } else if (riskStatus === 'WATCH') {
    color = '#E37400'; // Amber
    bgGlow = 'rgba(227, 116, 0, 0.5)';
  }

  const bgColor = isDark ? '#1E1F20' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#202124';

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        background: ${bgColor};
        border: 2.5px solid ${color};
        border-radius: 50%;
        box-shadow: 0 2px 10px ${bgGlow};
        color: ${textColor};
        font-family: monospace;
        font-size: 10px;
        font-weight: bold;
      ">
        <span style="color: ${color};">${resilienceScore}%</span>
        ${riskStatus === 'CRITICAL_SURGE' ? `
          <span style="
            position: absolute;
            top: -4px;
            right: -4px;
            width: 10px;
            height: 10px;
            background: #EA4335;
            border-radius: 50%;
            border: 2px solid ${bgColor};
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></span>
        ` : ''}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17]
  });
}

export default function HealthGeoMap() {
  const {
    selectedCountry,
    phcNodes,
    selectedPHC,
    setSelectedPHC,
    openVoiceModalFor,
    openVisionModalFor,
    openForecastFor,
    openRebalanceModalWith,
    activeDispatches,
    theme
  } = useApp();

  const isDark = theme === 'dark';

  const handleTriggerRebalance = async (phc) => {
    try {
      const planResponse = await findRebalanceMatch(phc.id, 'MED-01', 24);
      if (planResponse.success) {
        openRebalanceModalWith(planResponse.data);
      }
    } catch (err) {
      console.error('Error triggering rebalance from map:', err);
    }
  };

  // Build active dispatch polylines
  const activeRoutes = activeDispatches.map(dispatch => {
    const recipient = phcNodes.find(n => n.id === dispatch.recipientId);
    const donor = phcNodes.find(n => n.id === dispatch.donorId);
    if (recipient && donor) {
      return {
        id: dispatch.id,
        positions: [
          [donor.lat, donor.lng],
          [recipient.lat, recipient.lng]
        ],
        donorName: donor.name,
        recipientName: recipient.name,
        medicineName: dispatch.medicineName,
        quantity: dispatch.quantity,
        distanceKm: dispatch.distanceKm,
        eta: dispatch.estimatedMinutes
      };
    }
    return null;
  }).filter(Boolean);

  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  return (
    <div className="space-y-4">
      
      {/* Map Controls Header */}
      <div className="gcp-card p-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>{selectedCountry.flag}</span>
            <span>Geospatial Health Resilience Mesh — {selectedCountry.name}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time telemetry, stockout early warning nodes, and active cross-district rebalancing corridors.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-[11px] sm:text-xs bg-[#F1F3F4] dark:bg-[#131314] px-3 sm:px-3.5 py-1.5 rounded-xl border border-[#DADCE0] dark:border-[#3C4043]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335] animate-ping" />
            <span className="text-[#EA4335] dark:text-[#F28B82] font-semibold">Critical Deficit</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC04]" />
            <span className="text-[#E37400] dark:text-[#FDD663] font-semibold">Watch</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
            <span className="text-[#188038] dark:text-[#81C995] font-semibold">Surplus Donor</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-[#1A73E8] dark:bg-[#8AB4F8] border-dashed" />
            <span className="text-[#1A73E8] dark:text-[#8AB4F8] font-semibold">Rebalance Corridor</span>
          </div>
        </div>
      </div>

      {/* Interactive Map Container */}
      <div className="gcp-card rounded-2xl overflow-hidden h-[380px] sm:h-[500px] md:h-[620px] relative shadow-lg">
        <MapContainer
          key={theme}
          center={[selectedCountry.lat, selectedCountry.lng]}
          zoom={selectedCountry.zoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <MapRecenter center={[selectedCountry.lat, selectedCountry.lng]} zoom={selectedCountry.zoom} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={tileUrl}
          />

          {/* Active Rebalance Route Lines */}
          {activeRoutes.map(route => (
            <Polyline
              key={route.id}
              positions={route.positions}
              pathOptions={{
                color: '#1A73E8',
                weight: 3,
                dashArray: '8, 8',
                opacity: 0.85
              }}
            >
              <Popup>
                <div className="p-1 space-y-1 text-xs">
                  <div className="flex items-center space-x-1 text-[#1A73E8] font-bold">
                    <Truck className="w-3.5 h-3.5" />
                    <span>In-Transit Autonomous Rebalance</span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold">{route.medicineName} ({route.quantity} Vials)</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">From: {route.donorName}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">To: {route.recipientName}</p>
                  <div className="text-slate-600 dark:text-slate-300 text-[10px] font-mono pt-1 border-t border-slate-200 dark:border-slate-700">
                    Distance: {route.distanceKm} km | ETA: ~{route.eta} mins
                  </div>
                </div>
              </Popup>
            </Polyline>
          ))}

          {/* PHC Map Markers */}
          {phcNodes.map(phc => {
            const isCritical = phc.riskStatus === 'CRITICAL_SURGE';

            return (
              <Marker
                key={phc.id}
                position={[phc.lat, phc.lng]}
                icon={createCustomPin(phc.riskStatus, phc.resilienceScore, isDark)}
                eventHandlers={{
                  click: () => setSelectedPHC(phc)
                }}
              >
                <Popup>
                  <div className="space-y-2 p-1 min-w-[220px]">
                    <div className="border-b border-slate-200 dark:border-slate-700 pb-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#1A73E8] dark:text-[#8AB4F8] font-bold">{phc.id}</span>
                        <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                          isCritical ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          Score: {phc.resilienceScore}%
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{phc.name}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{phc.district}, {phc.state}</p>
                    </div>

                    {phc.alertMessage && (
                      <div className="text-[10px] text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 p-1.5 rounded border border-rose-200 dark:border-rose-800/50">
                        {phc.alertMessage}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-700 dark:text-slate-300">
                      <div>Beds: <span className="font-mono font-semibold">{phc.occupiedBeds}/{phc.totalBeds}</span></div>
                      <div>Cold: <span className="font-mono font-semibold">{phc.coldChainStatus?.split(' ')[0]}</span></div>
                    </div>

                    {/* Popup Actions */}
                    <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-1">
                      <button
                        onClick={() => openVoiceModalFor(phc)}
                        className="p-1 rounded bg-[#1A73E8] hover:bg-[#1557B0] text-white text-[10px] font-medium flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Mic className="w-3 h-3" />
                        <span>Voice</span>
                      </button>
                      <button
                        onClick={() => openVisionModalFor(phc)}
                        className="p-1 rounded bg-[#188038] hover:bg-[#137333] text-white text-[10px] font-medium flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Camera className="w-3 h-3" />
                        <span>Vision</span>
                      </button>
                      <button
                        onClick={() => openForecastFor(phc)}
                        className="p-1 rounded bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] text-slate-800 dark:text-slate-200 border border-[#DADCE0] dark:border-[#3C4043] text-[10px] font-medium flex items-center justify-center space-x-1 col-span-2 cursor-pointer"
                      >
                        <TrendingUp className="w-3 h-3 text-[#E37400] dark:text-[#FDD663]" />
                        <span>30d Demand Forecast</span>
                      </button>
                      {isCritical && (
                        <button
                          onClick={() => handleTriggerRebalance(phc)}
                          className="p-1.5 rounded bg-gradient-to-r from-[#EA4335] to-[#FBBC04] text-white text-[10px] font-bold flex items-center justify-center space-x-1 col-span-2 shadow cursor-pointer"
                        >
                          <Zap className="w-3 h-3" />
                          <span>Gemini Auto-Rebalance</span>
                        </button>
                      )}
                    </div>

                  </div>
                </Popup>
              </Marker>
            );
          })}

        </MapContainer>
      </div>

    </div>
  );
}
