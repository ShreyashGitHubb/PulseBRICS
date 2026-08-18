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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#1E1F20] w-full max-w-lg rounded-3xl border border-[#DADCE0] dark:border-[#3C4043] p-6 shadow-2xl space-y-5 relative transition-colors">
        
        <button
          onClick={() => setQuickUpdateModalOpen(false)}
          className="absolute top-5 right-5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1 rounded-lg bg-[#F1F3F4] hover:bg-[#E8EAED] dark:bg-[#28292A] dark:hover:bg-[#35363A] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-3 bg-[#1A73E8] rounded-2xl text-white shadow-lg shadow-blue-500/20">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Daily Operational Check — {selectedPHC.name}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{selectedPHC.district} • {selectedPHC.id}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
              <span>Medical Officer / Doctor Attendance:</span>
            </label>
            <input
              type="text"
              value={doctorAttendance}
              onChange={(e) => setDoctorAttendance(e.target.value)}
              className="w-full bg-[#F8F9FA] dark:bg-[#131314] text-xs text-slate-900 dark:text-slate-100 p-3 rounded-xl border border-[#DADCE0] dark:border-[#3C4043] focus:outline-none focus:border-[#1A73E8]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-[#188038] dark:text-[#81C995]" />
              <span>Nursing & Paramedical Attendance:</span>
            </label>
            <input
              type="text"
              value={nurseAttendance}
              onChange={(e) => setNurseAttendance(e.target.value)}
              className="w-full bg-[#F8F9FA] dark:bg-[#131314] text-xs text-slate-900 dark:text-slate-100 p-3 rounded-xl border border-[#DADCE0] dark:border-[#3C4043] focus:outline-none focus:border-[#1A73E8]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <Bed className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
              <span>Occupied Inpatient Beds (out of {selectedPHC.totalBeds}):</span>
            </label>
            <input
              type="number"
              min="0"
              max={selectedPHC.totalBeds}
              value={occupiedBeds}
              onChange={(e) => setOccupiedBeds(parseInt(e.target.value))}
              className="w-full bg-[#F8F9FA] dark:bg-[#131314] text-xs text-slate-900 dark:text-slate-100 p-3 rounded-xl border border-[#DADCE0] dark:border-[#3C4043] focus:outline-none focus:border-[#1A73E8]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-bold shadow-lg transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{saving ? 'Updating Operational Census...' : 'Save & Publish Telemetry'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
