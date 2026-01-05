
import React, { useState } from 'react';
import CameraView from './components/CameraView';
import ResultCard from './components/ResultCard';
import { WasteAnalysis } from './types';
import { analyzeWasteImage } from './services/geminiService';

type FormStep = 'INPUT' | 'PROCESSING' | 'RESULT';

const App: React.FC = () => {
  const [step, setStep] = useState<FormStep>('INPUT');
  const [currentAnalysis, setCurrentAnalysis] = useState<WasteAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasConsent, setHasConsent] = useState(false);

  const handleCapture = async (base64Image: string) => {
    if (!hasConsent) {
      setError("Please accept the safety and legal terms before scanning.");
      return;
    }
    setStep('PROCESSING');
    setError(null);
    try {
      const analysis = await analyzeWasteImage(base64Image);
      setCurrentAnalysis(analysis);
      setStep('RESULT');
    } catch (err) {
      setError("Analysis form failed. Please ensure the item is clearly visible and retry.");
      setStep('INPUT');
    }
  };

  const resetForm = () => {
    setCurrentAnalysis(null);
    setStep('INPUT');
    setError(null);
  };

  return (
    <div className="min-h-screen p-6 md:p-12 flex flex-col items-center">
      {/* Form Container */}
      <div className="w-full max-w-lg space-y-12 pb-12">
        
        {/* Form Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100">
               <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-slate-900">EcoForm</h1>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Legal & Safe Waste Assistant</p>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end">
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Step Status</span>
             <div className="flex space-x-1.5">
               <div className={`w-3 h-3 rounded-full ${step === 'INPUT' ? 'bg-emerald-500 scale-125' : 'bg-slate-200'}`} />
               <div className={`w-3 h-3 rounded-full ${step === 'PROCESSING' ? 'bg-emerald-500 scale-125' : 'bg-slate-200'}`} />
               <div className={`w-3 h-3 rounded-full ${step === 'RESULT' ? 'bg-emerald-500 scale-125' : 'bg-slate-200'}`} />
             </div>
          </div>
        </div>

        {/* Form Steps */}
        <div className="space-y-12">
          {step === 'INPUT' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-left-5 duration-500">
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-[0.9]">Safe Disposal<br/><span className="text-emerald-500">Intake Form.</span></h2>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Identify materials accurately to ensure legal and environmental compliance.
                </p>
              </div>

              <div className="bg-white p-8 rounded-[3rem] border border-slate-200 form-card space-y-8">
                {/* Privacy & Legal Consent */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex items-start space-x-3">
                    <input 
                      type="checkbox" 
                      id="consent" 
                      checked={hasConsent}
                      onChange={(e) => setHasConsent(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="consent" className="text-xs font-bold text-slate-600 leading-tight cursor-pointer">
                      I acknowledge that EcoForm is an AI advisor. I agree to follow my local municipal laws and safety guidelines over AI suggestions.
                    </label>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-normal font-medium">
                    Privacy Note: Images are analyzed in real-time and not stored on our servers after processing.
                  </p>
                </div>

                <div className={`${!hasConsent ? 'opacity-30 pointer-events-none' : 'opacity-100 transition-opacity'}`}>
                  <CameraView onCapture={handleCapture} isProcessing={(step as string) === 'PROCESSING'} />
                </div>
              </div>

              {error && (
                <div className="p-5 bg-red-50 border border-red-100 rounded-3xl text-red-700 text-sm font-bold flex items-center space-x-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}

          {step === 'PROCESSING' && (
             <div className="h-96 flex flex-col items-center justify-center space-y-6">
                <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Analyzing Legality</h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Cross-referencing Material Safety Data Sheets</p>
                </div>
             </div>
          )}

          {step === 'RESULT' && currentAnalysis && (
            <ResultCard analysis={currentAnalysis} onReset={resetForm} />
          )}
        </div>

        {/* Persistent Legal Footer */}
        <footer className="pt-12 flex flex-col items-center space-y-6 border-t border-slate-200">
           <div className="flex space-x-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <button className="hover:text-emerald-600 transition-colors">Privacy Policy</button>
              <button className="hover:text-emerald-600 transition-colors">Terms of Service</button>
              <button className="hover:text-emerald-600 transition-colors">Safety FAQ</button>
           </div>
           <p className="text-slate-300 text-[9px] font-bold text-center leading-loose max-w-xs">
             Legal Compliance v2.4 • Gemini Vision 3.0 • Verified Disposal Protocols<br/>
             © 2024 EcoForm Intelligence Systems. Not a substitute for local law.
           </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
