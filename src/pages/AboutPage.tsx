import React from 'react';
import { 
  ShieldCheck, 
  Code2, 
  Server, 
  Database, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 pb-8 space-y-3 max-w-3xl">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>Platform Overview & Architecture</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>Open Climate & Civic Infrastructure</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
          Intelligent Waste Segregation for India's Circular Economy
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          PrithveX (from <em>Prithvi</em>, Earth, and <em>X</em>, circular transition) is a technology platform built to address the single largest barrier in Indian municipal solid waste: the failure of segregation at the household source.
        </p>
      </div>

      {/* The Core Challenge & Statutory Foundation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7 space-y-4 text-xs text-slate-700 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900">
            Why Source Segregation Governs Entire Circular Systems
          </h2>
          <p>
            India generates over <strong>62 million tonnes</strong> of municipal solid waste annually. Under 25% is segregated into wet and dry streams at the doorstep. When unsegregated organic waste mixes with clean dry recyclables, batch moisture immediately renders paper, cardboard, and flexible film plastics unrecyclable.
          </p>
          <p>
            The resulting contaminated mass ends up in overflowing dumpsites and landfills such as Ghazipur (Delhi) and Deonar (Mumbai), generating toxic methane emissions and groundwater leachate.
          </p>
          <p>
            PrithveX translates complex statutory guidelines into clear household instructions: identifying materials, specifying bin stream colors, outlining cleaning protocols, and connecting residents directly to authorized recyclers.
          </p>
        </div>

        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 space-y-3">
          <h3 className="font-semibold text-slate-900 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Statutory Regulations Enforced</span>
          </h3>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <strong className="text-slate-900">Solid Waste Management (SWM) Rules 2016:</strong>
              <p className="text-[11px] mt-0.5 text-slate-600">Rule 4 mandates 3-stream segregation (Wet, Dry, Domestic Hazardous) for all generators.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <strong className="text-slate-900">Plastic Waste Management Rules 2021/2022:</strong>
              <p className="text-[11px] mt-0.5 text-slate-600">Nationwide ban on 19 single-use plastic commodities + Extended Producer Responsibility (EPR).</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <strong className="text-slate-900">E-Waste & Battery Management Rules 2022:</strong>
              <p className="text-[11px] mt-0.5 text-slate-600">Mandates formal hydrometallurgical recycling and safe channelization of spent cells.</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Architecture */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            System Architecture & Resilience
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full-stack TypeScript architecture built with failover resilience and cloud persistence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
              <Code2 className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 text-xs">1. Presentation Layer</h3>
            <p className="text-slate-600 leading-relaxed">
              React 19 + TypeScript + Vite + Tailwind CSS. Strictly modular components, responsive layouts, accessibility compliance, and zero bloated external UI dependencies.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
              <Server className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 text-xs">2. Classifier Engine</h3>
            <p className="text-slate-600 leading-relaxed">
              Node.js Express proxy with Google Gemini 3.8 Flash SDK. Server-side key isolation returning structured JSON schemas, with instant deterministic rule-based local fallback.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 text-xs">3. Cloud Persistence</h3>
            <p className="text-slate-600 leading-relaxed">
              Firebase Firestore + Firebase Authentication + Cloud Storage. Hardened with Zero-Trust security rules, atomic counters, and multi-tenant citizen tracking.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-white">Experience the Multimodal Classifier</h3>
          <p className="text-xs text-slate-400 mt-0.5">Test any household item with the camera or 1-click test presets.</p>
        </div>
        <button
          onClick={() => onNavigate('identify')}
          className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch AI Classifier</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
