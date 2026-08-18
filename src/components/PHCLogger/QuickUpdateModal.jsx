import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { X, CheckCircle2, Sliders, Users, Bed } from 'lucide-react';
import { updatePHCInventory } from '../../services/api.js';
import confetti from 'canvas-confetti';

export default function QuickUpdateModal() {
  const { 
    selectedPHC, 
    quickUpdateModalOpen, 
    setQuickUpdateModalOpen, 
    reloadData 
  } = useApp();

  const [doctorAttendance, setDoctorAttendance] = useState(selectedPHC?.doctorAttendance || '2/2 Present');
  const [nurseAttendance, setNurseAttendance] = useState(selectedPHC?.nurseAttendance || '4/4 Present');
  const [occupiedBeds, setOccupiedBeds] = useState(selectedPHC?.occupiedBeds || 8);
  const [saving, setSaving] = useState(false);

  if (!quickUpdateModalOpen || !selectedPHC) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePHCInventory(selectedPHC.id, [], doctorAttendance, nurseAttendance);
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
      setTimeout(() => {
        setSaving(false);
        reloadData();
        setQuickUpdateModalOpen(false);
      }, 800);
    } catch (err) {
      console.error('Error in quick update:', err);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-700 p-6 shadow-2xl space-y-5 relative">
        
        <button
          onClick={() => setQuickUpdateModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-3 bg-cyan-600 rounded-2xl text-white shadow-lg shadow-cyan-500/20">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Daily Operational Check — {selectedPHC.name}</h2>
            <p className="text-xs text-slate-400">{selectedPHC.district} • {selectedPHC.id}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Medical Officer / Doctor Attendance:</span>
            </label>
            <input
              type="text"
              value={doctorAttendance}
              onChange={(e) => setDoctorAttendance(e.target.value)}
              className="w-full bg-slate-900 text-xs text-slate-100 p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nursing & Paramedical Attendance:</span>
            </label>
            <input
              type="text"
              value={nurseAttendance}
              onChange={(e) => setNurseAttendance(e.target.value)}
              className="w-full bg-slate-900 text-xs text-slate-100 p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Bed className="w-3.5 h-3.5 text-blue-400" />
              <span>Occupied Inpatient Beds (out of {selectedPHC.totalBeds}):</span>
            </label>
            <input
              type="number"
              min="0"
              max={selectedPHC.totalBeds}
              value={occupiedBeds}
              onChange={(e) => setOccupiedBeds(parseInt(e.target.value))}
              className="w-full bg-slate-900 text-xs text-slate-100 p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setQuickUpdateModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20"
            >
              {saving ? 'Saving...' : 'Update Clinic Record'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
