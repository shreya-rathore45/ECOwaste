
import React from 'react';
import { WasteAnalysis, BinType } from '../types';

interface ResultCardProps {
  analysis: WasteAnalysis;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ analysis, onReset }) => {
  const binMap: Record<BinType, { color: string, icon: string, label: string, accent: string }> = {
    'RECYCLING': { color: 'text-blue-600 bg-blue-50 border-blue-100', accent: 'bg-blue-600', icon: '♻️', label: 'Recycling' },
    'COMPOST': { color: 'text-emerald-600 bg-emerald-50 border-emerald-100', accent: 'bg-emerald-600', icon: '🌿', label: 'Compost' },
    'LANDFILL': { color: 'text-slate-600 bg-slate-50 border-slate-100', accent: 'bg-slate-800', icon: '🗑️', label: 'Landfill' },
    'HAZARDOUS': { color: 'text-orange-600 bg-orange-50 border-orange-100', accent: 'bg-orange-600', icon: '⚡', label: 'Hazardous' },
    'E-WASTE': { color: 'text-indigo-600 bg-indigo-50 border-indigo-100', accent: 'bg-indigo-600', icon: '🔋', label: 'E-Waste' },
  };

  const b = binMap[analysis.binType];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-500">
      <div className="space-y-1">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Verified Protocol</h2>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Legal Disposal Documentation</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 form-card space-y-8 relative overflow-hidden">
        {/* Safety Header if applicable */}
        {analysis.binType === 'HAZARDOUS' && (
          <div className="absolute top-0 left-0 right-0 h-2 bg-orange-500 animate-pulse" />
        )}

        <div className="flex flex-col space-y-3">
          <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Bin Destination</label>
          <div className={`p-6 rounded-3xl border-2 flex items-center justify-between ${b.color}`}>
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{b.icon}</span>
              <div>
                <div className="font-black text-xl leading-none">{b.label}</div>
                <div className="text-xs font-bold opacity-70 mt-1 uppercase tracking-widest">Waste Class: {analysis.binType}</div>
              </div>
            </div>
            <div className="bg-white/50 px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm">Verified</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Item</label>
            <p className="font-black text-slate-800 capitalize text-lg">{analysis.item}</p>
          </div>
          <div className="space-y-2 text-right">
            <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Confidence</label>
            <p className="font-bold text-emerald-600">{Math.round(analysis.confidence * 100)}% Match</p>
          </div>
        </div>

        {/* Legal & Safety Section */}
        <div className="space-y-4 border-t border-slate-100 pt-6">
          {analysis.safetyWarning && (
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-start space-x-3">
              <span className="text-xl">🚨</span>
              <div>
                <h4 className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Safety Risk</h4>
                <p className="text-sm font-bold text-red-900 leading-tight">{analysis.safetyWarning}</p>
              </div>
            </div>
          )}

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center">
               <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" /></svg>
               Legal Disclaimer
             </h4>
             <p className="text-slate-600 text-xs font-semibold leading-relaxed">
               {analysis.legalDisclaimer} Always verify with your local municipality's specific bylaws as disposal regulations vary by region.
             </p>
          </div>
        </div>

        <div className="space-y-4 pt-4">
           <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Required Preparation</label>
             <p className="text-slate-800 font-bold bg-white p-3 border border-slate-100 rounded-xl shadow-sm">
               {analysis.instructions}
             </p>
           </div>
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full bg-slate-900 hover:bg-black text-white py-6 rounded-[2rem] font-black transition-all shadow-xl flex items-center justify-center space-x-3"
      >
        <span>Accept & Start New Form</span>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
      </button>
    </div>
  );
};

export default ResultCard;
