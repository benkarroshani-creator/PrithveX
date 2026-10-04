import React from 'react';
import { 
  Recycle, 
  ShieldCheck, 
  Code2, 
  Sparkles, 
  Heart, 
  Users, 
  Database, 
  Server, 
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
          About PrithveX
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Empowering India's Circular Economy Through Intelligent Waste Segregation
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
          PrithveX (derived from 'Prithvi' meaning Mother Earth, and 'X' symbolizing circular transformation) is an open civic and sustainability platform created to solve the root problem of Indian waste management: lack of segregation at source.
        </p>
      </div>

      {/* The Core Problem & Indian Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            The Reality on the Ground
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            Why Technology Must Support, Not Replace, Segregation
          </h2>
          <p>
            India produces over <strong>62 million tonnes</strong> of municipal solid waste annually. Despite progressive legislation such as the <strong>Solid Waste Management Rules 2016</strong> and the <strong>Plastic Waste Management Amendment Rules 2021</strong>, less than a quarter of all waste is segregated into green and blue streams at the household doorstep.
          </p>
          <p>
            When organic kitchen waste mixes with recyclable paper and dry plastics, the entire batch becomes contaminated and unrecoverable, ending up in smoking mega-landfills like Ghazipur (Delhi) or Deonar (Mumbai).
          </p>
          <p>
            PrithveX solves this by giving citizens and housing societies instant, pocket-sized clarity: what bin does this belong to, how should it be cleaned, where can it be recycled, and how can local recyclers be accessed.
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Statutory & Regulatory Alignment</span>
          </h3>

          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <strong className="text-slate-800">SWM Rules 2016:</strong>
              <p className="text-[11px] mt-0.5">Mandates 3-stream segregation (Wet, Dry, Domestic Hazardous) for all waste generators.</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <strong className="text-slate-800">Plastic Waste Rules 2021/2022:</strong>
              <p className="text-[11px] mt-0.5">Nationwide ban on 19 single-use plastics + Extended Producer Responsibility (EPR) mandates.</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <strong className="text-slate-800">Battery Management Rules 2022:</strong>
              <p className="text-[11px] mt-0.5">Channels toxic lithium and lead-acid batteries to formal hydrometallurgical extractors.</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <strong className="text-slate-800">FSSAI RUCO Initiative:</strong>
              <p className="text-[11px] mt-0.5">Prevents toxic repeated frying oil reuse and sewer dumping by converting oil into biodiesel.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Architecture for 2nd Year IT Student */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Engineered for Hackathon Rigor
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            Technology Stack & Clean Architectural Design
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Easy to explain to judges, modular for rapid production deployment, and resilient to offline or missing API conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Frontend Layer</h3>
            <p className="text-slate-600">
              <strong>React 19 + TypeScript + Vite + Tailwind CSS.</strong> Highly modular components, accessible semantic markup, zero external UI framework bloat, and smooth client-side routing.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Server className="w-5 h-5 text-blue-700" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Backend & AI Layer</h3>
            <p className="text-slate-600">
              <strong>Express Full-Stack Server + Google Gemini 3.8 Flash SDK.</strong> Server-side API key protection with structured JSON schema responses, backed by deterministic offline fallback rules.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Database className="w-5 h-5 text-purple-700" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Data & Persistence</h3>
            <p className="text-slate-600">
              <strong>Pluggable Storage Service.</strong> Pre-seeded with 30+ Indian items, verified recyclers across 8 hubs, and community moderation. Easily migratable to Firebase Firestore or Supabase in minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Team / Hackathon presentation pledge */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-base text-slate-100">
            Ready to test PrithveX with real waste items?
          </h3>
          <p className="text-xs text-slate-400">
            Try uploading a milk pouch, banana peel, or laptop battery in the AI Vision identifier.
          </p>
        </div>
        <button
          onClick={() => onNavigate('identify')}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shrink-0"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>Launch AI Classifier</span>
        </button>
      </div>
    </div>
  );
};
