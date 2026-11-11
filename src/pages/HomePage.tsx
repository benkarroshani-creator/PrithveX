import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Coins, 
  Store, 
  Compass, 
  AlertTriangle,
  Building2,
  Cpu,
  Layers,
  Shield,
  FileText
} from 'lucide-react';
import { WASTE_ITEMS } from '../data/wasteItems';
import { WasteCard } from '../components/WasteCard';
import { WasteItem } from '../types';
import { 
  heroSegregationImg, 
  wasteBinsImg, 
  mrfFacilityImg, 
  handleImageFallback 
} from '../utils/imageUtils';

interface HomePageProps {
  onNavigate: (tab: string, filter?: string) => void;
  onSelectSearchItem: (item: WasteItem) => void;
  onLogItem: (item: WasteItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  onNavigate, 
  onSelectSearchItem,
  onLogItem 
}) => {
  const [quickSearch, setQuickSearch] = useState('');

  // Popular items slice
  const popularItems = WASTE_ITEMS.slice(0, 6);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      onNavigate('search', quickSearch.trim());
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-16 bg-[#F4F6F8]">
      {/* 1. Hero Section: Editorial, Confident & Restrained */}
      <section className="bg-[#111C2E] text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#253247]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Proposition & Action */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs text-[#E3E8EF] font-medium">
                <span className="text-[#19B5A5] font-bold uppercase tracking-wider">Swachh Bharat & SWM Compliant</span>
                <span aria-hidden="true" className="text-[#718096]">·</span>
                <span>Circular Economy Infrastructure</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                  Turn Waste Into <br className="hidden sm:inline" />
                  <span className="text-[#19B5A5]">
                    Better Decisions.
                  </span>
                </h1>
                <p className="text-[#E3E8EF] text-sm sm:text-base leading-relaxed max-w-xl pt-1">
                  Identify waste, discover responsible disposal options and connect with recyclers and buyers through one intelligent platform.
                </p>
              </div>

              {/* Fast Search Input */}
              <form 
                onSubmit={handleSearchSubmit}
                className="max-w-lg flex items-center bg-[#253247]/60 border border-[#253247] rounded-xl p-1.5 focus-within:border-[#19B5A5] transition-colors"
              >
                <Search className="w-4 h-4 text-[#718096] ml-2.5 shrink-0" />
                <input
                  type="text"
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  placeholder="Search item (e.g. milk pouch, lithium battery, cardboard, PET)..."
                  className="w-full px-3 py-2 text-xs sm:text-sm text-white placeholder-[#718096] bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#19B5A5] text-white hover:bg-[#138D81] text-xs font-bold rounded-lg transition-colors shrink-0 shadow-sm"
                >
                  Search
                </button>
              </form>

              {/* Primary & Secondary Action CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('identify')}
                  className="px-5 py-3 bg-[#19B5A5] hover:bg-[#138D81] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Identify Waste</span>
                </button>

                <button
                  onClick={() => onNavigate('map')}
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm"
                >
                  <Compass className="w-4 h-4 text-[#19B5A5]" />
                  <span>Explore Circularity Map</span>
                </button>

                <button
                  onClick={() => onNavigate('buyers')}
                  className="px-4 py-3 bg-transparent hover:bg-white/5 text-[#E3E8EF] hover:text-white border border-[#253247] font-semibold rounded-xl text-xs flex items-center gap-2 transition-all"
                >
                  <Coins className="w-3.5 h-3.5 text-[#E8A84E]" />
                  <span>Find Buyers</span>
                </button>
              </div>

              {/* Key Baseline Metrics */}
              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-[#253247] max-w-lg">
                <div>
                  <p className="text-xl font-bold text-white tabular-nums">11 Layers</p>
                  <p className="text-[11px] text-[#718096] mt-0.5">Circularity Map Markers</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-white tabular-nums">100% SPCB</p>
                  <p className="text-[11px] text-[#718096] mt-0.5">Authorized Directory</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-white tabular-nums">0.35 kg</p>
                  <p className="text-[11px] text-[#718096] mt-0.5">Diverted per Sort</p>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Visual Asset */}
            <div className="lg:col-span-5">
              <div className="relative border border-[#253247] rounded-2xl overflow-hidden bg-[#111C2E] shadow-2xl">
                <img
                  src={heroSegregationImg}
                  onError={(e) => handleImageFallback(e, wasteBinsImg)}
                  alt="Household source segregation with clean dry recyclable boxes and compost khamba"
                  className="w-full h-80 lg:h-96 object-cover"
                  loading="eager"
                />
                <div className="p-4 bg-[#111C2E]/95 border-t border-[#253247] text-xs">
                  <div className="flex items-center justify-between text-[11px] text-[#E3E8EF] mb-1">
                    <span className="font-bold text-white">Urban Source Segregation</span>
                    <span className="text-[#19B5A5] font-semibold">SWM Rule 4(1)(a)</span>
                  </div>
                  <p className="text-[11px] text-[#718096] leading-normal">
                    Household separation of wet biodegradables, clean dry recyclables, and domestic hazardous waste before channelization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Feature Callout: PrithveX Circularity Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E3E8EF] rounded-2xl p-6 sm:p-10 shadow-sm overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7F8F6] text-[#138D81] text-xs font-bold">
                <Compass className="w-3.5 h-3.5" />
                Dedicated Platform Feature
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111C2E]">
                PrithveX Circularity Map
              </h2>
              <p className="text-sm text-[#718096] leading-relaxed">
                Connect your household or enterprise directly to nearby recycling centres, certified scrap dealers, waste buyers, e-waste drop-off points, composting stations, and citizen-reported waste hotspots across India.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 text-[#253247] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#19B5A5]" />
                  <span>11 Category Markers</span>
                </div>
                <div className="flex items-center gap-2 text-[#253247] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#19B5A5]" />
                  <span>"Find Near Me" GPS</span>
                </div>
                <div className="flex items-center gap-2 text-[#253247] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#19B5A5]" />
                  <span>Smart Route Directions</span>
                </div>
                <div className="flex items-center gap-2 text-[#253247] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#19B5A5]" />
                  <span>Civic Hotspot Tracking</span>
                </div>
                <div className="flex items-center gap-2 text-[#253247] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#19B5A5]" />
                  <span>Smart Matching Engine</span>
                </div>
                <div className="flex items-center gap-2 text-[#253247] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#19B5A5]" />
                  <span>SPCB Verified Hubs</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('map')}
                  className="px-5 py-2.5 bg-[#111C2E] hover:bg-[#253247] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm"
                >
                  <Compass className="w-4 h-4 text-[#19B5A5]" />
                  <span>Open Interactive Map</span>
                </button>
                <button
                  onClick={() => onNavigate('map', 'ewaste_centre')}
                  className="px-4 py-2.5 bg-[#F4F6F8] hover:bg-[#E3E8EF] text-[#253247] text-xs font-semibold rounded-xl transition-all border border-[#E3E8EF]"
                >
                  Find E-Waste Centers
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#F4F6F8] rounded-xl p-5 border border-[#E3E8EF]">
              <div className="flex items-center justify-between pb-3 border-b border-[#E3E8EF] text-xs font-bold text-[#111C2E]">
                <span>Active Map Legend</span>
                <span className="text-[#19B5A5]">Pan-India Network</span>
              </div>
              <div className="space-y-2.5 mt-3 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E3E8EF]">
                  <span className="flex items-center gap-2 font-medium text-[#253247]">
                    <span className="w-3 h-3 rounded-full bg-[#19B5A5]" />
                    Recycling Centres
                  </span>
                  <span className="font-bold text-[#718096]">SZW, Hasiru Dala</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E3E8EF]">
                  <span className="flex items-center gap-2 font-medium text-[#253247]">
                    <span className="w-3 h-3 rounded-full bg-[#7667E8]" />
                    E-Waste Collection Hubs
                  </span>
                  <span className="font-bold text-[#718096]">Attero, Chintan</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E3E8EF]">
                  <span className="flex items-center gap-2 font-medium text-[#253247]">
                    <span className="w-3 h-3 rounded-full bg-[#E8A84E]" />
                    Scrap Dealers & Aggregators
                  </span>
                  <span className="font-bold text-[#718096]">ScrapUncle, RaddiConnect</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E3E8EF]">
                  <span className="flex items-center gap-2 font-medium text-[#253247]">
                    <span className="w-3 h-3 rounded-full bg-[#EA580C]" />
                    Circular Donation Hubs
                  </span>
                  <span className="font-bold text-[#718096]">Goonj, Greensole</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E3E8EF]">
                  <span className="flex items-center gap-2 font-medium text-[#253247]">
                    <span className="w-3 h-3 rounded-full bg-[#E11D48]" />
                    Civic Waste Hotspots
                  </span>
                  <span className="font-bold text-[#BE123C]">Citizen Reported</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Complete Circular Journey */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-[#E3E8EF] rounded-2xl bg-white p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl mb-8">
            <p className="text-xs font-bold text-[#138D81] uppercase tracking-wider">
              End-to-End Circular Process
            </p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#111C2E] mt-1">
              From Discard to Circular Recovery
            </h2>
            <p className="text-xs sm:text-sm text-[#718096] mt-1.5">
              PrithveX connects every touchpoint: Identify → Prepare → Donate / Sell → Channelize → Track Environmental Footprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="border-l-2 border-[#111C2E] pl-3.5 space-y-1">
              <p className="text-[11px] font-bold text-[#111C2E] font-mono">01. IDENTIFY</p>
              <h3 className="font-bold text-xs text-[#111C2E]">Vision AI Scan</h3>
              <p className="text-[11px] text-[#718096] leading-relaxed">
                Detect resin polymer codes, hazardous markers, and bin color coding.
              </p>
            </div>

            <div className="border-l-2 border-[#19B5A5] pl-3.5 space-y-1">
              <p className="text-[11px] font-bold text-[#138D81] font-mono">02. PREPARE</p>
              <h3 className="font-bold text-xs text-[#111C2E]">Rinse & Segregate</h3>
              <p className="text-[11px] text-[#718096] leading-relaxed">
                Follow statutory preparation checklist to avoid batch cross-contamination.
              </p>
            </div>

            <div className="border-l-2 border-[#7667E8] pl-3.5 space-y-1">
              <p className="text-[11px] font-bold text-[#5B4DE0] font-mono">03. REUSE / DONATE</p>
              <h3 className="font-bold text-xs text-[#111C2E]">Circular Secondary Life</h3>
              <p className="text-[11px] text-[#718096] leading-relaxed">
                Donate wearable clothes & books to vetted NGOs like Goonj & SADS.
              </p>
            </div>

            <div className="border-l-2 border-[#E8A84E] pl-3.5 space-y-1">
              <p className="text-[11px] font-bold text-[#B87216] font-mono">04. SELL SCRAP</p>
              <h3 className="font-bold text-xs text-[#111C2E]">Connect to Buyers</h3>
              <p className="text-[11px] text-[#718096] leading-relaxed">
                Check weekly scrap index rates and book doorstep pickup with certified scales.
              </p>
            </div>

            <div className="border-l-2 border-[#0284C7] pl-3.5 space-y-1">
              <p className="text-[11px] font-bold text-[#0369A1] font-mono">05. MAP ROUTING</p>
              <h3 className="font-bold text-xs text-[#111C2E]">Circularity Map</h3>
              <p className="text-[11px] text-[#718096] leading-relaxed">
                Find authorized recyclers within 5-50km with turn-by-turn directions.
              </p>
            </div>

            <div className="border-l-2 border-[#16A34A] pl-3.5 space-y-1">
              <p className="text-[11px] font-bold text-[#15803D] font-mono">06. TRACK IMPACT</p>
              <h3 className="font-bold text-xs text-[#111C2E]">Diversion Audit</h3>
              <p className="text-[11px] text-[#718096] leading-relaxed">
                Log sorted items to measure diverted weight (kg) and avoided CO2 footprint.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Platform Capabilities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-bold text-[#718096] uppercase tracking-wider">
            Enterprise & Citizen Tools
          </p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#111C2E] mt-1">
            Platform Capabilities & Services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Vision AI */}
          <div 
            onClick={() => onNavigate('identify')}
            className="p-6 bg-white rounded-2xl border border-[#E3E8EF] hover:border-[#19B5A5] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F0EEFC] text-[#5B4DE0] flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#111C2E]">AI Waste Identifier</h3>
              <p className="text-xs text-[#718096] mt-1.5 leading-relaxed">
                Computer-vision analysis detecting resin codes, exact bin color, and safety handling instructions.
              </p>
            </div>
            <span className="text-xs font-bold text-[#7667E8] mt-4 inline-flex items-center gap-1">
              Launch Vision AI <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 2: Circularity Map */}
          <div 
            onClick={() => onNavigate('map')}
            className="p-6 bg-white rounded-2xl border border-[#E3E8EF] hover:border-[#19B5A5] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#E7F8F6] text-[#138D81] flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#111C2E]">Circularity Map</h3>
              <p className="text-xs text-[#718096] mt-1.5 leading-relaxed">
                Geo-referenced directory of recyclers, scrap dealers, e-waste drop-offs, and civic waste hotspots.
              </p>
            </div>
            <span className="text-xs font-bold text-[#19B5A5] mt-4 inline-flex items-center gap-1">
              Explore Map <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 3: Waste Buyers */}
          <div 
            onClick={() => onNavigate('buyers')}
            className="p-6 bg-white rounded-2xl border border-[#E3E8EF] hover:border-[#E8A84E] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FEF6EC] text-[#B87216] flex items-center justify-center mb-4">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#111C2E]">Commercial Waste Buyers</h3>
              <p className="text-xs text-[#718096] mt-1.5 leading-relaxed">
                Connect with bulk scrap aggregators, polymer recovery plants, and certified EPR partners.
              </p>
            </div>
            <span className="text-xs font-bold text-[#B87216] mt-4 inline-flex items-center gap-1">
              Explore Buyers <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 4: Marketplace */}
          <div 
            onClick={() => onNavigate('marketplace')}
            className="p-6 bg-white rounded-2xl border border-[#E3E8EF] hover:border-[#19B5A5] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#E7F8F6] text-[#138D81] flex items-center justify-center mb-4">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#111C2E]">P2P Waste Marketplace</h3>
              <p className="text-xs text-[#718096] mt-1.5 leading-relaxed">
                Buy and sell sorted PET, corrugated cardboard, metal lots, and electronics with direct negotiation.
              </p>
            </div>
            <span className="text-xs font-bold text-[#19B5A5] mt-4 inline-flex items-center gap-1">
              View Marketplace <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>

      {/* 5. Frequently Looked-Up Household Items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-bold text-[#718096] uppercase tracking-wider">
              Common Indian Household Items
            </p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#111C2E] mt-1">
              Frequently Segregated Materials
            </h2>
            <p className="text-xs sm:text-sm text-[#718096] mt-1">
              Click any item to inspect its complete statutory disposal protocol.
            </p>
          </div>

          <button
            onClick={() => onNavigate('search')}
            className="text-xs font-bold text-[#111C2E] hover:text-[#19B5A5] inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Browse complete 30+ items catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularItems.map((item) => (
            <WasteCard
              key={item.id}
              item={item}
              onFindRecycler={(category) => onNavigate('recyclers', category)}
              onFindBuyer={(category) => onNavigate('buyers', category)}
              onGoMarketplace={() => onNavigate('marketplace')}
              onLogItem={onLogItem}
            />
          ))}
        </div>
      </section>

      {/* 6. Civic Action Callout: Waste Black-Spots */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-[#E3E8EF] rounded-2xl bg-white p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#BE123C]">
              <AlertTriangle className="w-4 h-4 text-[#E11D48]" />
              <span>Civic Waste Grievance Reporting</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#111C2E]">
              Spotted an Illegal Garbage Black-Spot in Your Locality?
            </h2>
            <p className="text-xs sm:text-sm text-[#718096] leading-relaxed">
              Capture photo evidence, pin exact GPS coordinates on the Circularity Map, and submit a municipal complaint ticket. Track progress from Submitted → Under Review → Assigned → Resolved.
            </p>
          </div>

          <button
            onClick={() => onNavigate('report')}
            className="px-5 py-3 bg-[#111C2E] hover:bg-[#253247] text-white font-bold rounded-xl text-xs shrink-0 transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            <span>Report Waste Hotspot</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
