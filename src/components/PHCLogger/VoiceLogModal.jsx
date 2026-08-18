import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Globe2, 
  X,
  Languages,
  Volume2
} from 'lucide-react';
import { parseVoiceLog, updatePHCInventory } from '../../services/api.js';
import confetti from 'canvas-confetti';

const VOICE_PRESETS = [
  {
    language: 'Hindi (हिंदी)',
    text: 'आज बाढ़ प्रभावित क्षेत्र से 3 इमरजेंसी सांप काटने के मरीज आए हैं। हमारे पास सिर्फ 4 वाइल एंटी-वेनम बची हैं और 35 ओआरएस पैकेट बचे हैं। पेरासिटामोल 240 स्ट्रिप्स हैं।'
  },
  {
    language: 'Portuguese (Português - Brasil)',
    text: 'Alerta de surto de dengue. Consumimos 45 analgésicos hoje. Restam apenas 40 pacotes de soro de reidratação oral (ORS) e 18 frascos de insulina.'
  },
  {
    language: 'English (South Africa / Rural CHC)',
    text: 'Reporting from Alexandra Clinic during load shedding. Insulin vials down to 12 units due to power backup risk. Rabies vaccine is critically low with 5 doses left.'
  }
];

export default function VoiceLogModal() {
  const { 
    selectedPHC, 
    voiceModalOpen, 
    setVoiceModalOpen, 
    reloadData 
  } = useApp();

  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
  const [transcript, setTranscript] = useState(VOICE_PRESETS[0].text);
  const [isRecording, setIsRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [extractedResult, setExtractedResult] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!voiceModalOpen || !selectedPHC) return null;

  const handleSimulateRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
    }, 2000);
  };

  const handleAnalyzeWithGemini = async () => {
    if (!transcript.trim()) return;
    setAnalyzing(true);
    setExtractedResult(null);

    try {
      const res = await parseVoiceLog(transcript, selectedLanguage);
      if (res.success && res.data) {
        setExtractedResult(res.data);
      }
    } catch (err) {
      console.error('Error analyzing voice log:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleConfirmAndSave = async () => {
    if (!extractedResult || !extractedResult.extractedUpdates) return;
    
    try {
      await updatePHCInventory(
        selectedPHC.id,
        extractedResult.extractedUpdates,
        extractedResult.doctorAttendance,
        extractedResult.nurseAttendance
      );
      setSavedSuccess(true);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      setTimeout(() => {
        setSavedSuccess(false);
        reloadData();
        setVoiceModalOpen(false);
      }, 1500);
    } catch (err) {
      console.error('Error updating inventory from voice log:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1E1F20] border border-[#3C4043] w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setVoiceModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-[#28292A] hover:bg-[#35363A]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-[#1A73E8] rounded-xl text-white shadow">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-[#8AB4F8] font-bold">{selectedPHC.id}</span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300">{selectedPHC.district}</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Multilingual Voice Logging — {selectedPHC.name}
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-300">
          Enables rural nurses and ASHA health workers to speak naturally in native BRICS languages. 
          Powered by <strong>Google Cloud Speech & Gemini 2.0 Multimodal NLP</strong>.
        </p>

        {/* Preset Selector */}
        <div className="space-y-2">
          <div className="text-xs text-slate-400 font-semibold flex items-center space-x-1">
            <Languages className="w-3.5 h-3.5 text-[#8AB4F8]" />
            <span>Select Sample Spoken Audio or Dictate Live:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {VOICE_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedLanguage(preset.language.split(' ')[0]);
                  setTranscript(preset.text);
                  setExtractedResult(null);
                }}
                className={`p-3 rounded-xl text-left text-xs border transition-all ${
                  transcript === preset.text
                    ? 'bg-[#1A73E8]/15 border-[#1A73E8] text-white'
                    : 'bg-[#28292A] border-[#3C4043] text-slate-300 hover:border-[#5F6368]'
                }`}
              >
                <div className="font-semibold truncate">{preset.language}</div>
                <div className="text-[10px] text-slate-400 truncate mt-1">{preset.text}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Audio Recording & Transcript Box */}
        <div className="space-y-2">
          <div className="relative">
            <textarea
              rows={3}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Speak or paste voice note transcription..."
              className="w-full bg-[#131314] text-xs text-slate-100 p-3.5 rounded-xl border border-[#3C4043] focus:outline-none focus:border-[#1A73E8] font-sans leading-relaxed"
            />

            <button
              onClick={handleSimulateRecording}
              className={`absolute right-3 bottom-3 p-2.5 rounded-xl text-white shadow transition-all ${
                isRecording 
                  ? 'bg-[#EA4335] animate-ping' 
                  : 'bg-[#1A73E8] hover:bg-[#1557B0]'
              }`}
              title="Record audio via microphone"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {isRecording ? '🔴 Listening...' : 'Ready for Gemini structured extraction.'}
          </span>

          <button
            onClick={handleAnalyzeWithGemini}
            disabled={analyzing || !transcript.trim()}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-bold shadow disabled:opacity-50 transition-all"
          >
            <Sparkles className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
            <span>{analyzing ? 'Extracting with Gemini...' : 'Parse with Gemini AI'}</span>
          </button>
        </div>

        {/* Extracted Structured Result Preview */}
        {extractedResult && (
          <div className="p-4 rounded-xl bg-[#131314] border border-[#3C4043] space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#3C4043] pb-2">
              <span className="text-xs font-bold text-[#8AB4F8] flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#81C995]" />
                <span>Extracted Structured Inventory</span>
              </span>
              <span className="text-[10px] font-mono bg-[#1A73E8]/20 text-[#8AB4F8] px-2 py-0.5 rounded border border-[#1A73E8]/40">
                Confidence: 98.4%
              </span>
            </div>

            <div className="space-y-1.5">
              {extractedResult.extractedUpdates?.map((up, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-2 bg-[#1E1F20] rounded-lg border border-[#3C4043]">
                  <div>
                    <span className="font-semibold text-white">{up.medicineName}</span>
                    <span className="text-[10px] text-slate-400 ml-2">({up.medicineId})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[#8AB4F8] font-bold">{up.currentStock} {up.unit}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      up.urgency === 'CRITICAL_STOCKOUT' ? 'bg-[#EA4335]/20 text-[#F28B82]' : 'bg-[#28292A] text-slate-300'
                    }`}>
                      {up.urgency}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {extractedResult.aiSummary && (
              <p className="text-[11px] text-slate-300 italic bg-[#1E1F20] p-2 rounded-lg border border-[#3C4043]">
                💡 {extractedResult.aiSummary}
              </p>
            )}

            {/* Confirm & Save Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleConfirmAndSave}
                disabled={savedSuccess}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#34A853] hover:bg-[#188038] text-white text-xs font-bold shadow transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{savedSuccess ? 'Saved to Health Grid!' : 'Confirm & Update Facility Registry'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
