import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  MapPin, 
  BookOpen, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Recycle, 
  ShieldCheck, 
  TrendingUp, 
  Leaf, 
  Cpu, 
  HeartHandshake, 
  Droplet,
  ExternalLink
} from 'lucide-react';
import { WASTE_ITEMS, WASTE_CATEGORIES_INFO } from '../data/wasteItems';
import { WasteCard } from '../components/WasteCard';
import { WasteItem } from '../types';

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
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative background mesh */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-xs">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span>Circular India Initiative • SWM Rules 2016 Compliant</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            Turn Every Discard into a Resource with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">PrithveX</span>
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto font-normal leading-relaxed">
            India generates 62 million tonnes of waste every year. PrithveX bridges the gap with instant vision-assisted waste identification, responsible disposal pathways, and verified local recycling directories.
          </p>

          {/* Quick Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            className="max-w-xl mx-auto relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 shadow-2xl focus-within:ring-2 focus-within:ring-emerald-400 focus-within:bg-white/15 transition-all"
          >
            <Search className="w-5 h-5 text-emerald-300 ml-3 shrink-0" />
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Search an item (e.g. milk packet, battery, medicine, jeans)..."
              className="w-full px-3 py-2 text-sm text-white placeholder-emerald-200/60 bg-transparent focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shrink-0 shadow-sm"
            >
              Search
            </button>
          </form>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('identify')}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-sm shadow-lg shadow-emerald-600/30 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Identify Your Waste (AI Vision)</span>
            </button>

            <button
              onClick={() => onNavigate('recyclers')}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold rounded-2xl text-sm backdrop-blur-xs flex items-center gap-2 transition-all"
            >
              <MapPin className="w-4 h-4 text-emerald-300" />
              <span>Find a Recycler Nearby</span>
            </button>
          </div>

          {/* Micro Stat Badges */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-left text-xs">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
              <p className="text-emerald-400 font-black text-lg">14+</p>
              <p className="text-emerald-100/70 text-[11px]">Waste Categories Covered</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
              <p className="text-teal-400 font-black text-lg">8 Major</p>
              <p className="text-emerald-100/70 text-[11px]">Indian City Recycler Hubs</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
              <p className="text-emerald-300 font-black text-lg">100%</p>
              <p className="text-emerald-100/70 text-[11px]">CPCB SWM 2016 Compliant</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
              <p className="text-teal-300 font-black text-lg">Dual AI</p>
              <p className="text-emerald-100/70 text-[11px]">Gemini 3.8 + Offline Fallback</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Navigation Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div 
            onClick={() => onNavigate('identify')}
            className="cursor-pointer bg-white rounded-2xl p-4 border border-slate-200 shadow-md hover:shadow-lg hover:border-emerald-500 transition-all flex flex-col items-center text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Identify Waste</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Upload image or photo</p>
          </div>

          <div 
            onClick={() => onNavigate('search')}
            className="cursor-pointer bg-white rounded-2xl p-4 border border-slate-200 shadow-md hover:shadow-lg hover:border-blue-500 transition-all flex flex-col items-center text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Search an Item</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">30+ Indian items database</p>
          </div>

          <div 
            onClick={() => onNavigate('recyclers')}
            className="cursor-pointer bg-white rounded-2xl p-4 border border-slate-200 shadow-md hover:shadow-lg hover:border-teal-500 transition-all flex flex-col items-center text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Find Recycler</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Doorstep & drop-off hubs</p>
          </div>

          <div 
            onClick={() => onNavigate('learn')}
            className="cursor-pointer bg-white rounded-2xl p-4 border border-slate-200 shadow-md hover:shadow-lg hover:border-purple-500 transition-all flex flex-col items-center text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Learn Segregation</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Composting & 5R guides</p>
          </div>

          <div 
            onClick={() => onNavigate('report')}
            className="cursor-pointer bg-white rounded-2xl p-4 border border-slate-200 shadow-md hover:shadow-lg hover:border-rose-500 transition-all flex flex-col items-center text-center group col-span-2 sm:col-span-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Report Waste Issue</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Garbage dumps & overflow</p>
          </div>
        </div>
      </section>

      {/* Visual Segregation Section (The 5-Stream Rule in India) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Source Segregation Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            The 5 Standard Segregation Streams
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Solid Waste Management Rules 2016 mandate separation at the point of origin. Putting the wrong item in the wrong stream renders recyclables worthless and hazardous.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* 1. Wet / Organic */}
          <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  01
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                  Green Bin
                </span>
              </div>
              <h3 className="font-bold text-emerald-950 text-sm">Wet / Organic</h3>
              <p className="text-xs text-emerald-800 mt-1">
                Vegetable rinds, fruit peels, leftover raw scraps, tea leaves.
              </p>
              <div className="mt-3 p-2 bg-white/80 rounded-xl text-[11px] text-emerald-900 border border-emerald-200">
                <strong>Destination:</strong> Home compost khamba, community vermicompost, or biogas digesters.
              </div>
            </div>
            <button 
              onClick={() => onNavigate('search', 'vegetable peels')}
              className="mt-4 text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
            >
              <span>Explore Wet Stream</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 2. Dry Recyclable */}
          <div className="bg-blue-50/70 border-2 border-blue-300 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  02
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-900">
                  Blue Bin
                </span>
              </div>
              <h3 className="font-bold text-blue-950 text-sm">Dry Recyclable</h3>
              <p className="text-xs text-blue-800 mt-1">
                Clean rinsed milk pouches, cardboard cartons, newspapers, metal cans, glass jars.
              </p>
              <div className="mt-3 p-2 bg-white/80 rounded-xl text-[11px] text-blue-900 border border-blue-200">
                <strong>Destination:</strong> Scrap dealers (kabadiwalas), Material Recovery Facilities (MRF).
              </div>
            </div>
            <button 
              onClick={() => onNavigate('search', 'milk pouch')}
              className="mt-4 text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1"
            >
              <span>Explore Dry Stream</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 3. Hazardous Waste */}
          <div className="bg-rose-50/70 border-2 border-rose-300 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                  03
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-900">
                  Red Bin
                </span>
              </div>
              <h3 className="font-bold text-rose-950 text-sm">Domestic Hazardous</h3>
              <p className="text-xs text-rose-800 mt-1">
                Paints, chemical thinners, expired pills, thermometers, insecticide cans.
              </p>
              <div className="mt-3 p-2 bg-white/80 rounded-xl text-[11px] text-rose-900 border border-rose-200">
                <strong>Destination:</strong> Common Hazardous Waste Facilities (TSDF) for safe neutralization.
              </div>
            </div>
            <button 
              onClick={() => onNavigate('search', 'expired medicine')}
              className="mt-4 text-xs font-bold text-rose-800 hover:text-rose-950 flex items-center gap-1"
            >
              <span>Explore Hazardous</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 4. E-Waste & Batteries */}
          <div className="bg-slate-100 border-2 border-slate-300 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center font-bold text-xs">
                  04
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-900">
                  Grey Stream
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">E-Waste & Batteries</h3>
              <p className="text-xs text-slate-600 mt-1">
                Dead phones, charging cords, Li-ion batteries, laptop power bricks.
              </p>
              <div className="mt-3 p-2 bg-white/80 rounded-xl text-[11px] text-slate-800 border border-slate-200">
                <strong>Destination:</strong> CPCB registered e-waste recyclers for precious metal recovery.
              </div>
            </div>
            <button 
              onClick={() => onNavigate('search', 'battery')}
              className="mt-4 text-xs font-bold text-slate-800 hover:text-slate-950 flex items-center gap-1"
            >
              <span>Explore E-Waste</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 5. Sanitary Waste */}
          <div className="bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                  05
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                  Red Mark Wrap
                </span>
              </div>
              <h3 className="font-bold text-amber-950 text-sm">Sanitary & Diapers</h3>
              <p className="text-xs text-amber-800 mt-1">
                Menstrual pads, infant diapers, swabs. Wrapped in paper with red mark.
              </p>
              <div className="mt-3 p-2 bg-white/80 rounded-xl text-[11px] text-amber-900 border border-amber-200">
                <strong>Destination:</strong> Municipal sanitary reject stream for high-temp incineration.
              </div>
            </div>
            <button 
              onClick={() => onNavigate('search', 'sanitary pads')}
              className="mt-4 text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1"
            >
              <span>Explore Sanitary</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Popular Waste Items Quick Check */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Popular Indian Household Items
            </h2>
            <p className="text-xs text-slate-600">
              Everyday items that cause the most common sorting confusion.
            </p>
          </div>
          <button
            onClick={() => onNavigate('search')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
          >
            <span>View all 30+ items database</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularItems.map((item) => (
            <WasteCard 
              key={item.id} 
              item={item} 
              onFindRecycler={() => onNavigate('recyclers')}
              onLogItem={onLogItem}
            />
          ))}
        </div>
      </section>

      {/* How It Works (5-Step Framework) */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Citizen Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">
            How PrithveX Transforms Waste Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            A seamless 5-step loop designed for Indian households, housing societies, and college campuses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-sm text-slate-100">Identify</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload a photo or search by name. Vision AI recognizes material, polymer type, and packaging style.
            </p>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="font-bold text-sm text-slate-100">Segregate</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Match with the official bin stream (Green, Blue, Red, Grey) and follow rinse/dry preparation instructions.
            </p>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center">
              3
            </span>
            <h3 className="font-bold text-sm text-slate-100">Choose Route</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Assess whether the item can be Reused, Repaired, Donated, Composted, or Recycled before final binning.
            </p>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center">
              4
            </span>
            <h3 className="font-bold text-sm text-slate-100">Find Recycler</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Locate authorized CPCB recyclers, scrap collectors, and RUCO oil drop-off points in your city.
            </p>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center">
              5
            </span>
            <h3 className="font-bold text-sm text-slate-100">Track Impact</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monitor your diverted kilograms, estimated CO2 avoided, and earn citizen sustainability badges.
            </p>
          </div>
        </div>
      </section>

      {/* Realistic Sustainability Statistics (Clearly labeled heuristic model) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-8 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Data Grounding
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                The Scale of India's Waste Challenge
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                National estimates published by Central Pollution Control Board (CPCB) & Ministry of Housing & Urban Affairs (MoHUA).
              </p>
            </div>
            <div className="text-[11px] text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              Note: Sample metrics derived from CPCB Annual SWM reports (2021-2024).
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
              <p className="text-3xl font-black text-slate-900">62 MT</p>
              <p className="font-bold text-slate-800 text-xs mt-1">Annual Municipal Waste</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Generated across Indian urban local bodies per year, growing at 5% annually.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
              <p className="text-3xl font-black text-amber-600">~22%</p>
              <p className="font-bold text-slate-800 text-xs mt-1">Segregation at Source</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Current household sorting rate; 78% still reaches transit yards mixed and contaminated.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
              <p className="text-3xl font-black text-emerald-700">70%</p>
              <p className="font-bold text-slate-800 text-xs mt-1">Potential Landfill Diversion</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Achievable if wet waste is composted and clean dry plastics reach registered MRFs.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
              <p className="text-3xl font-black text-teal-700">1.4 kg</p>
              <p className="font-bold text-slate-800 text-xs mt-1">CO₂e Avoided per kg Recycled</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Conservative greenhouse gas emission reduction benchmark for dry recyclable paper and polymers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Collective Civic Responsibility
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Spotted illegal garbage dumping or an overflowing bin in your ward?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Report the issue directly through PrithveX with photos and location. Track the municipal review status transparently.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => onNavigate('report')}
              className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Report Waste Dumping</span>
            </button>
            <button
              onClick={() => onNavigate('community')}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Community Wall</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
