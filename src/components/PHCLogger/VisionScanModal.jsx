import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { 
  Camera, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Eye, 
  FileText,
  ImageIcon,
  RefreshCw
} from 'lucide-react';
import { parseVisionShelf, updatePHCInventory } from '../../services/api.js';
import confetti from 'canvas-confetti';

const SAMPLE_IMAGES = [
  {
    id: 'SHELF_SAMPLE_1',
    label: 'Medicine Shelf (Anti-Venom & ORS)',
    description: 'Physical carton vials of Snake Anti-Venom and ORS packets.',
    previewUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=60'
  },
  {
    id: 'LEDGER_SAMPLE_2',
    label: 'Handwritten Daily Stock Ledger',
    description: 'Rural primary clinic paper tally register with handwritten counts.',
    previewUrl: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=600&auto=format&fit=crop&q=60'
  },
  {
    id: 'COLD_CHAIN_SAMPLE_3',
    label: 'Vaccine & Insulin Cold-Box',
    description: 'Temperature-monitored biologicals inside 4°C vaccine carrier.',
    previewUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=60'
  }
];

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
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [customImageBase64, setCustomImageBase64] = useState(null);
  const [customImageName, setCustomImageName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);

  if (!visionModalOpen || !selectedPHC) return null;

  const handleFileUpload = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setCustomImageBase64(e.target.result);
      setCustomImageName(file.name);
      setVisionResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleScanImage = async () => {
    setAnalyzing(true);
    setVisionResult(null);

    try {
      const base64Data = customImageBase64 ? customImageBase64.split(',')[1] : 'mock_base64_shelf_image';
      const mimeType = customImageBase64 ? customImageBase64.split(';')[0].split(':')[1] : 'image/jpeg';
      
      const res = await parseVisionShelf(base64Data, mimeType);
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
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
      setTimeout(() => {
        setSavedSuccess(false);
        reloadData();
        setVisionModalOpen(false);
      }, 1400);
    } catch (err) {
      console.error('Error saving vision scan:', err);
    }
  };

  const currentPreview = customImageBase64 || SAMPLE_IMAGES[selectedSampleIndex].previewUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1E1F20] border border-[#3C4043] w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-5 relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setVisionModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-[#28292A] hover:bg-[#35363A]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-[#4285F4] rounded-xl text-white shadow flex items-center justify-center">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-[#8AB4F8] font-bold">{selectedPHC.id}</span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300">{selectedPHC.district}</span>
              <span className="text-slate-500">•</span>
              <span className="text-[11px] font-mono px-2 py-0.2 rounded bg-blue-500/10 text-[#8AB4F8] border border-[#1A73E8]/30">
                Gemini 2.0 Flash Vision OCR
              </span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Multimodal Shelf & Ledger OCR — {selectedPHC.name}
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-300">
          Upload a live photo or select a sample shelf/ledger to extract batch numbers, expiration dates, and physical counts in seconds.
        </p>

        {/* Preset Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Select Demo Dataset Sample or Upload Real Photo:</span>
            {customImageBase64 && (
              <button
                onClick={() => { setCustomImageBase64(null); setVisionResult(null); }}
                className="text-[11px] text-[#8AB4F8] hover:underline flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset to Sample</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SAMPLE_IMAGES.map((sample, idx) => (
              <button
                key={sample.id}
                onClick={() => {
                  setCustomImageBase64(null);
                  setSelectedSampleIndex(idx);
                  setVisionResult(null);
                }}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  !customImageBase64 && selectedSampleIndex === idx
                    ? 'bg-[#1A73E8]/15 border-[#1A73E8] text-white shadow-sm'
                    : 'bg-[#28292A] border-[#3C4043] text-slate-300 hover:border-[#5F6368]'
                }`}
              >
                <div className="font-semibold text-xs truncate">{sample.label}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{sample.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Drag & Drop Viewfinder Box */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`relative rounded-xl overflow-hidden border-2 transition-all p-4 text-center ${
            isDragOver 
              ? 'border-[#4285F4] bg-[#1A73E8]/10' 
              : 'border-dashed border-[#3C4043] bg-[#131314] hover:border-[#5F6368]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
            accept="image/*"
            className="hidden"
          />

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="w-40 h-28 rounded-lg overflow-hidden border border-[#3C4043] bg-black shrink-0 relative group">
              <img
                src={currentPreview}
                alt="Shelf Scan Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-semibold">
                Preview Frame
              </div>
            </div>

            <div className="space-y-2 text-left">
              <p className="text-xs font-semibold text-slate-200">
                {customImageName || SAMPLE_IMAGES[selectedSampleIndex].label}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                Model: Gemini 2.0 Flash Vision • Multimodal Inference
              </p>
              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-[#28292A] hover:bg-[#35363A] text-slate-200 text-xs font-semibold border border-[#3C4043] flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-[#8AB4F8]" />
                  <span>Upload Live Photo</span>
                </button>
                <button
                  onClick={handleScanImage}
                  disabled={analyzing}
                  className="px-4 py-1.5 rounded-lg bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-bold shadow flex items-center space-x-1.5 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : 'text-[#FBBC04]'}`} />
                  <span>{analyzing ? 'Scanning OCR...' : 'Run Vision OCR'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Vision Result Detection Preview */}
        {visionResult && (
          <div className="p-4 rounded-xl bg-[#131314] border border-[#3C4043] space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#3C4043] pb-2">
              <span className="text-xs font-bold text-[#8AB4F8] flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#81C995]" />
                <span>Extracted Items & Batch Telemetry</span>
              </span>
              <span className="text-[10px] font-mono bg-[#1A73E8]/20 text-[#8AB4F8] px-2 py-0.5 rounded border border-[#1A73E8]/40">
                Confidence: {visionResult.confidenceScore}%
              </span>
            </div>

            <div className="space-y-1.5">
              {visionResult.detectedItems?.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-2 bg-[#1E1F20] rounded-lg border border-[#3C4043]">
                  <div>
                    <span className="font-semibold text-white">{item.medicineName}</span>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Batch: {item.batchNumber} • Exp: {item.expiry} • {item.shelfCondition}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[#8AB4F8] font-bold">{item.detectedCount} {item.unit}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      item.status === 'CRITICAL_STOCKOUT' ? 'bg-[#EA4335]/20 text-[#F28B82]' : 'bg-[#28292A] text-slate-300'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {visionResult.visualAnomalyDetected && (
              <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-tight">{visionResult.visualAnomalyDetected}</p>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleApplyVisionData}
                disabled={savedSuccess}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#34A853] hover:bg-[#188038] text-white text-xs font-bold shadow transition-all cursor-pointer"
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
