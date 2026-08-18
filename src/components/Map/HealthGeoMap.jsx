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
function createCustomPin(riskStatus, resilienceScore) {
  let color = '#3b82f6'; // Blue
  let bgGlow = 'rgba(59, 130, 246, 0.4)';
  
  if (riskStatus === 'CRITICAL_SURGE' || resilienceScore < 50) {
    color = '#f43f5e'; // Rose/Red
    bgGlow = 'rgba(244, 63, 94, 0.6)';
  } else if (riskStatus === 'SURPLUS_DONOR') {
    color = '#10b981'; // Emerald/Green
    bgGlow = 'rgba(16, 185, 129, 0.5)';
  } else if (riskStatus === 'WATCH') {
    color = '#f59e0b'; // Amber
    bgGlow = 'rgba(245, 158, 11, 0.5)';
  }

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: #0f172a;
        border: 2px solid ${color};
        border-radius: 50%;
        box-shadow: 0 0 14px ${bgGlow};
        color: white;
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
            background: #f43f5e;
            border-radius: 50%;
            border: 2px solid #0f172a;
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></span>
        ` : ''}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
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
    activeDispatches
  } = useApp();

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

  return (
    <div className="space-y-4">
      
      {/* Map Controls Header */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span>{selectedCountry.flag}</span>
            <span>Geospatial Health Resilience Mesh — {selectedCountry.name}</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time telemetry, stockout early warning nodes, and active cross-district rebalancing corridors.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-xs bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-rose-400 font-medium">Critical Deficit</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-amber-400 font-medium">Watch</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-400 font-medium">Surplus Donor</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-cyan-400 border-dashed" />
            <span className="text-cyan-300 font-medium">Rebalance Corridor</span>
          </div>
        </div>
      </div>

      {/* Interactive Map Container */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden h-[620px] relative shadow-2xl">
        <MapContainer
          center={[selectedCountry.lat, selectedCountry.lng]}
          zoom={selectedCountry.zoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <MapRecenter center={[selectedCountry.lat, selectedCountry.lng]} zoom={selectedCountry.zoom} />
          
          {/* High-Contrast Dark CartoDB Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Active Rebalance Route Lines */}
          {activeRoutes.map(route => (
            <Polyline
              key={route.id}
              positions={route.positions}
              pathOptions={{
                color: '#06b6d4',
                weight: 3,
                dashArray: '8, 8',
                opacity: 0.85
              }}
            >
              <Popup>
                <div className="p-1 space-y-1 text-xs">
                  <div className="flex items-center space-x-1 text-cyan-400 font-bold">
                    <Truck className="w-3.5 h-3.5" />
                    <span>In-Transit Autonomous Rebalance</span>
                  </div>
                  <p className="text-slate-200 font-semibold">{route.medicineName} ({route.quantity} Vials)</p>
                  <p className="text-slate-400 text-[11px]">From: {route.donorName}</p>
                  <p className="text-slate-400 text-[11px]">To: {route.recipientName}</p>
                  <div className="text-slate-300 text-[10px] font-mono pt-1 border-t border-slate-700">
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
                icon={createCustomPin(phc.riskStatus, phc.resilienceScore)}
                eventHandlers={{
                  click: () => setSelectedPHC(phc)
                }}
              >
                <Popup>
                  <div className="space-y-2 p-1 min-w-[220px]">
                    <div className="border-b border-slate-700 pb-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-cyan-400">{phc.id}</span>
                        <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                          isCritical ? 'bg-rose-900/60 text-rose-300' : 'bg-slate-800 text-slate-300'
                        }`}>
                          Score: {phc.resilienceScore}%
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white mt-0.5">{phc.name}</h4>
                      <p className="text-[10px] text-slate-400">{phc.district}, {phc.state}</p>
                    </div>

                    {phc.alertMessage && (
                      <div className="text-[10px] text-rose-300 bg-rose-950/40 p-1.5 rounded border border-rose-800/50">
                        {phc.alertMessage}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-300">
                      <div>Beds: <span className="font-mono">{phc.occupiedBeds}/{phc.totalBeds}</span></div>
                      <div>Cold: <span className="font-mono">{phc.coldChainStatus?.split(' ')[0]}</span></div>
                    </div>

                    {/* Popup Actions */}
                    <div className="pt-1.5 border-t border-slate-700 grid grid-cols-2 gap-1">
                      <button
                        onClick={() => openVoiceModalFor(phc)}
                        className="p-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-medium flex items-center justify-center space-x-1"
                      >
                        <Mic className="w-3 h-3" />
                        <span>Voice</span>
                      </button>
                      <button
                        onClick={() => openVisionModalFor(phc)}
                        className="p-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-medium flex items-center justify-center space-x-1"
                      >
                        <Camera className="w-3 h-3" />
                        <span>Vision</span>
                      </button>
                      <button
                        onClick={() => openForecastFor(phc)}
                        className="p-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-medium flex items-center justify-center space-x-1 col-span-2"
                      >
                        <TrendingUp className="w-3 h-3" />
                        <span>30d Demand Forecast</span>
                      </button>
                      {isCritical && (
                        <button
                          onClick={() => handleTriggerRebalance(phc)}
                          className="p-1.5 rounded bg-gradient-to-r from-rose-600 to-amber-600 text-white text-[10px] font-bold flex items-center justify-center space-x-1 col-span-2 shadow"
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
