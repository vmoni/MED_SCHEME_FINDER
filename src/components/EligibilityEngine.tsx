import React from 'react';
import { ShieldCheck, User, MapPin, IndianRupee, Landmark } from 'lucide-react';
import { DemographicProfile } from '../types';

interface EligibilityEngineProps {
  profile: DemographicProfile;
  onChange: (profile: DemographicProfile) => void;
}

export default function EligibilityEngine({ profile, onChange }: EligibilityEngineProps) {
  const updateField = (key: keyof DemographicProfile, value: any) => {
    onChange({
      ...profile,
      [key]: value
    });
  };

  const commonStates = [
    "Maharashtra", "Tamil Nadu", "Delhi", "Karnataka", "West Bengal", "Gujarat", "Uttar Pradesh", "Telangana", "Andhra Pradesh", "Kerala"
  ];

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="space-y-0.5 border-b border-slate-800 pb-3">
        <span className="text-[9px] font-black text-teal-400 tracking-wider uppercase flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-teal-400" /> RECOMMENDER & ELIGIBILITY CONTEXT
        </span>
        <h3 className="text-xs font-bold text-white uppercase tracking-tight">Demographic Profile Engine</h3>
      </div>

      <div className="text-[11px] text-slate-400 leading-normal">
        Your dynamic profile is evaluated server-side against welfare criteria. RAG results will be automatically customized for your circumstances.
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3.5">
          {/* Age field */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">
              Patient Age
            </label>
            <div className="relative">
              <input 
                type="number" 
                placeholder="Years"
                value={profile.age}
                onChange={(e) => updateField("age", e.target.value)}
                className="w-full bg-slate-950 text-white placeholder-slate-600 border border-slate-850 hover:border-slate-800 focus:border-teal-500/60 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none transition-all pl-8.5"
              />
              <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            </div>
          </div>

          {/* Gender field */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">
              Gender
            </label>
            <select
              value={profile.gender}
              onChange={(e) => updateField("gender", e.target.value)}
              className="w-full bg-slate-950 text-white border border-slate-850 hover:border-slate-800 focus:border-teal-500/60 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none transition-all"
            >
              <option value="">Choose Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {/* Income field */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">
              Family Annual Income
            </label>
            <div className="relative">
              <input 
                type="number" 
                placeholder="e.g. 150000"
                value={profile.income}
                onChange={(e) => updateField("income", e.target.value)}
                className="w-full bg-slate-950 text-white placeholder-slate-600 border border-slate-850 hover:border-slate-800 focus:border-teal-500/60 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none transition-all pl-8.5"
              />
              <span className="absolute left-3 top-2 text-slate-500 text-xs font-extrabold font-mono">₹</span>
            </div>
          </div>

          {/* State of residence field */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">
              State of Residence
            </label>
            <div className="relative">
              <input 
                type="text" 
                list="states-list"
                placeholder="e.g. Tamil Nadu"
                value={profile.state}
                onChange={(e) => updateField("state", e.target.value)}
                className="w-full bg-slate-950 text-white placeholder-slate-600 border border-slate-850 hover:border-slate-800 focus:border-teal-500/60 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none transition-all pl-8.5"
              />
              <MapPin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <datalist id="states-list">
                {commonStates.map(st => <option key={st} value={st} />)}
              </datalist>
            </div>
          </div>
        </div>

        {/* Binary togglers */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* BPL (Below Poverty Line) */}
          <label className="bg-slate-950 border border-slate-850 hover:border-slate-800/80 rounded-xl p-3 flex items-center justify-between cursor-pointer select-none transition-colors">
            <div>
              <span className="text-[9.5px] font-bold text-white block">BPL Card Holder</span>
              <span className="text-[8px] text-slate-500 block leading-tight mt-0.5">Below Poverty Line status</span>
            </div>
            <input 
              type="checkbox" 
              checked={profile.bplStatus}
              onChange={(e) => updateField("bplStatus", e.target.checked)}
              className="accent-teal-500 h-4 w-4 rounded bg-slate-905"
            />
          </label>

          {/* Disability status */}
          <label className="bg-slate-950 border border-slate-850 hover:border-slate-800/80 rounded-xl p-3 flex items-center justify-between cursor-pointer select-none transition-colors">
            <div>
              <span className="text-[9.5px] font-bold text-white block">Physically Disabled</span>
              <span className="text-[8px] text-slate-500 block leading-tight mt-0.5">Qualifies for specialized quotas</span>
            </div>
            <input 
              type="checkbox" 
              checked={profile.disabilityStatus}
              onChange={(e) => updateField("disabilityStatus", e.target.checked)}
              className="accent-teal-500 h-4 w-4 rounded bg-slate-905"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
