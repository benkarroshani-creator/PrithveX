import React from 'react';
import { Recycle, Heart, ShieldCheck, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-700 flex items-center justify-center text-white">
                <Recycle className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Prithve<span className="text-emerald-400">X</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India produces over 62 million tonnes of municipal solid waste annually, with less than 25% currently segregated and processed at source. PrithveX empowers citizens with instant segregation intelligence, verified local recycler directories, and civic reporting.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Aligned with Swachh Bharat & SWM 2016</span>
            </div>
          </div>

          {/* Col 2: Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3">
              Explore PrithveX
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('identify')} className="text-slate-400 hover:text-emerald-400 transition-colors">
                  AI Waste Identifier (Vision)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('search')} className="text-slate-400 hover:text-emerald-400 transition-colors">
                  What Should I Do? (Database)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('recyclers')} className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Find Verified Recyclers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('learn')} className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Composting & Segregation Guides
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('community')} className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Community Action Wall
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('report')} className="text-slate-400 hover:text-rose-400 transition-colors">
                  Report Waste Dumping Issue
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Citizen Impact Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Practical Indian Waste Streams */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3">
              Segregation Streams
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Wet / Organic (Green Bin - Compost)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Dry Recyclables (Blue Bin - Kabadiwala)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>Domestic Hazardous & Batteries</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>E-Waste & Electronics (CPCB Authorized)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <span>Sanitary Waste (Red Dot Paper Wrap)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Used Cooking Oil (FSSAI RUCO)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Statutory & Hackathon Notes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3">
              Important Disclaimers
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              AI classifications are advisory. Please observe municipal bin collection protocols in your urban local body (BBMP, BMC, MCD, PMC, etc.).
            </p>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-[11px] text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">Hackathon Prototype</p>
              <p>Designed for scalable municipal and consumer deployment using modern React, Express, and multimodal Gemini 3.8 Flash.</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} PrithveX. Built for sustainable, circular communities across India.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
              About Project
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('learn')} className="hover:text-white transition-colors">
              Knowledge Base
            </button>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Planet Earth
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
