import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { 
  Camera, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Eye, 
  FileText 
} from 'lucide-react';
import { parseVisionShelf, updatePHCInventory } from '../../services/api.js';
import confetti from 'canvas-confetti';

export default function VisionScanModal() {
  const { 
    selectedPHC, 
    visionModalOpen, 
    setVisionModalOpen, 
    reloadData 
  } = useApp();

  const [analyzing, setAnalyzing] = useState(false);
  const [visionResult, setVisionResult] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedSample, setSelectedSample] = useState('SHELF_SAMPLE_1');

  if (!visionModalOpen || !selectedPHC) return null;

  const handleScanImage = async () => {
    setAnalyzing(true);
    setVisionResult(null);

    try {
      // Send sample identifier or mock base64 to Gemini Vision parser
      const res = await parseVisionShelf('mock_base64_shelf_image', 'image/jpeg');
      if (res.success && res.data) {
        setVisionResult(res.data);
      }
    } catch (err) {
      console.error('Error in vision scan:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApplyVisionData = async () => {
    if (!visionResult || !visionResult.detectedItems) return;

    try {
      const updates = visionResult.detectedItems.map(item => ({
        medicineId: item.medicineId,
        currentStock: item.detectedCount
      }));

      await updatePHCInventory(selectedPHC.id, updates);
      setSavedSuccess(true);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      setTimeout(() => {
        setSavedSuccess(false);
        reloadData();
        setVisionModalOpen(false);
      }, 1500);
    } catch (err) {
      console.error('Error saving vision scan:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-slate-700 p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setVisionModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-cyan-400 font-semibold">{selectedPHC.id}</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-300">{selectedPHC.district}</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Gemini Multimodal Shelf & Ledger OCR — {selectedPHC.name}
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-300">
          Nurse points the mobile phone camera at the physical medicine shelf or handwritten daily stock ledger. 
          <strong>Gemini 2.0 Multimodal Vision</strong> extracts batch codes, expiration dates, and physical counts.
        </p>

        {/* Mock Camera Viewfinder / Sample Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Select Demonstration Source:</span>
            <span className="text-cyan-400 font-mono">Simulated Camera Stream</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setSelectedSample('SHELF_SAMPLE_1'); setVisionResult(null); }}
              className={`p-3 rounded-2xl text-left border transition-all ${
                selectedSample === 'SHELF_SAMPLE_1'
                  ? 'bg-blue-950/60 border-blue-500 text-blue-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white">Medicine Shelf Photo</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Visual count of Snake Antivenom & ORS cartons.
              </p>
            </button>

            <button
              onClick={() => { setSelectedSample('LEDGER_SAMPLE_2'); setVisionResult(null); }}
              className={`p-3 rounded-2xl text-left border transition-all ${
                selectedSample === 'LEDGER_SAMPLE_2'
                  ? 'bg-blue-950/60 border-blue-500 text-blue-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white">Handwritten Ledger Photo</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                OCR on rural PHC physical tally book register.
              </p>
            </button>
          </div>

          {/* Viewfinder Preview Box */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 p-6 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <UploadCloud className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {selectedSample === 'SHELF_SAMPLE_1' ? 'IMG_2026_PHC_SHELF_04.JPG' : 'IMG_2026_STOCK_REGISTER_PAGE12.JPG'}
              </p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Resolution: 1920x1080 • Ready for Gemini 2.0 Flash Multimodal Analysis
              </p>
            </div>

            <button
              onClick={handleScanImage}
              disabled={analyzing}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all"
            >
              <Sparkles className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
              <span>{analyzing ? 'Analyzing Image with Gemini Vision...' : 'Run Multimodal Vision OCR'}</span>
            </button>
          </div>
        </div>

        {/* Vision Result Detection Preview */}
        {visionResult && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-blue-900/60 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-blue-300 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Detected Items & Physical Counts</span>
              </span>
              <span className="text-[10px] font-mono bg-blue-950 text-blue-300 px-2 py-0.5 rounded-full border border-blue-800">
                Confidence: {visionResult.confidenceScore}%
              </span>
            </div>

            <div className="space-y-2">
              {visionResult.detectedItems?.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white">{item.medicineName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Batch: {item.batchNumber} • Exp: {item.expiry} • {item.shelfCondition}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-cyan-400 font-bold">{item.detectedCount} {item.unit}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      item.status === 'CRITICAL_STOCKOUT' ? 'bg-rose-950 text-rose-300' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {visionResult.visualAnomalyDetected && (
              <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-tight">{visionResult.visualAnomalyDetected}</p>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleApplyVisionData}
                disabled={savedSuccess}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{savedSuccess ? 'Synchronized to Health Grid!' : 'Approve & Sync Physical Counts'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
