import React from 'react';
import { ShieldCheck, Coins, Store, Compass, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#111C2E] text-[#E3E8EF] border-t border-[#253247] pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#253247] text-xs">
          {/* Brand & Mandate */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="dark" size="md" />
            <p className="text-white font-bold text-xs">
              Better Waste Decisions. Sustainable Action.
            </p>
            <p className="text-[#718096] text-xs leading-relaxed max-w-md">
              PrithveX connects the complete Indian circular economy journey: Identify → Classify → Segregate → Reuse/Repair/Donate → Find Verified Recyclers & Buyers → P2P Waste Marketplace → Real Impact Tracking.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-[#E3E8EF] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#19B5A5] shrink-0" />
              <span>MoEFCC · CPCB SWM 2016 · PWM 2021 Statutory Architecture</span>
            </div>
          </div>

          {/* Navigation Matrix */}
          <div>
            <p className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Circular Directories
            </p>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onNavigate('map')} className="hover:text-white transition-colors text-left flex items-center gap-1.5 text-[#19B5A5] font-bold">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Circularity Map</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('identify')} className="hover:text-white transition-colors text-left flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#7667E8]" />
                  <span>AI Waste Identifier</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('search')} className="hover:text-white transition-colors text-left">
                  Household Waste Database
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('recyclers')} className="hover:text-white transition-colors text-left">
                  Verified Recyclers & NGOs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('buyers')} className="hover:text-white transition-colors text-left flex items-center gap-1.5 text-[#E8A84E] font-medium">
                  <Coins className="w-3 h-3" />
                  <span>Waste Buyers & Aggregators</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('marketplace')} className="hover:text-white transition-colors text-left flex items-center gap-1.5 text-[#19B5A5]">
                  <Store className="w-3 h-3" />
                  <span>P2P Waste Marketplace</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('report')} className="hover:text-white transition-colors text-left text-rose-300">
                  Civic Grievance Reporting
                </button>
              </li>
            </ul>
          </div>

          {/* Statutory Streams */}
          <div>
            <p className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Segregation Streams
            </p>
            <ul className="space-y-2.5 text-[#718096]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                <span className="text-[#E3E8EF]">Wet / Organic (Green Bin)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]" />
                <span className="text-[#E3E8EF]">Dry Recyclable (Blue Bin)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
                <span className="text-[#E3E8EF]">Domestic Hazardous (Red Bin)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8A84E]" />
                <span className="text-[#E3E8EF]">Used Cooking Oil (RUCO)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7667E8]" />
                <span className="text-[#E3E8EF]">E-Waste & Batteries (TSDF)</span>
              </li>
            </ul>
          </div>

          {/* Legal & Standards */}
          <div>
            <p className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Governance & Action
            </p>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onNavigate('learn')} className="hover:text-white transition-colors text-left">
                  Zero-Waste Living Guides
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('community')} className="hover:text-white transition-colors text-left">
                  Citizen Action Wall
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors text-left">
                  Personal Impact Balance Sheet
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors text-left">
                  Statutory Methodology
                </button>
              </li>
              <li>
                <span className="text-[#718096] block leading-relaxed text-[11px] pt-1">
                  Classifications serve as advisory guidance under Municipal Corporation Bye-laws.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#718096] gap-3">
          <p>© {new Date().getFullYear()} PrithveX. Better Waste Decisions. Sustainable Action.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
              Documentation
            </button>
            <span aria-hidden="true" className="text-[#253247]">·</span>
            <button onClick={() => onNavigate('learn')} className="hover:text-white transition-colors">
              Compliance Rules
            </button>
            <span aria-hidden="true" className="text-[#253247]">·</span>
            <span className="text-[#E3E8EF]">Swachh Bharat Mission Aligned</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
