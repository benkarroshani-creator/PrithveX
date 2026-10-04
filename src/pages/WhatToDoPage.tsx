import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Recycle, 
  Sparkles,
  ArrowRight,
  Layers
} from 'lucide-react';
import { WASTE_ITEMS } from '../data/wasteItems';
import { WasteCard } from '../components/WasteCard';
import { WasteItem, WasteCategory, DisposalPathway } from '../types';

interface WhatToDoPageProps {
  initialSearch?: string;
  onNavigate: (tab: string, filter?: string) => void;
  onLogItem: (item: WasteItem) => void;
}

export const WhatToDoPage: React.FC<WhatToDoPageProps> = ({
  initialSearch = '',
  onNavigate,
  onLogItem
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPathway, setSelectedPathway] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'plastic', label: 'Plastic' },
    { id: 'wet_organic', label: 'Wet / Organic' },
    { id: 'paper', label: 'Paper & Cardboard' },
    { id: 'e_waste', label: 'E-Waste' },
    { id: 'batteries', label: 'Batteries' },
    { id: 'medical', label: 'Medical / Pharma' },
    { id: 'hazardous', label: 'Hazardous' },
    { id: 'sanitary', label: 'Sanitary' },
    { id: 'textile', label: 'Textile' },
    { id: 'glass', label: 'Glass' },
    { id: 'metal', label: 'Metal' },
    { id: 'used_cooking_oil', label: 'Used Cooking Oil' },
    { id: 'special_waste', label: 'Special (Thermocol/Debris)' },
  ];

  const pathways: { id: string; label: string }[] = [
    { id: 'all', label: 'All Pathways' },
    { id: 'Recyclable', label: 'Recyclable' },
    { id: 'Compostable', label: 'Compostable' },
    { id: 'Reusable', label: 'Reusable' },
    { id: 'Donate', label: 'Donation' },
    { id: 'Repair', label: 'Repairable' },
    { id: 'Hazardous / safe disposal', label: 'Hazardous Disposal' },
    { id: 'Reject / residual waste', label: 'Reject / Residual' },
  ];

  const filteredItems = useMemo(() => {
    return WASTE_ITEMS.filter((item) => {
      // Search term matching
      const matchesSearch =
        !searchTerm.trim() ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.hindiName && item.hindiName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category matching
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      // Pathway matching
      const matchesPathway =
        selectedPathway === 'all' ||
        item.pathways.includes(selectedPathway as DisposalPathway);

      return matchesSearch && matchesCategory && matchesPathway;
    });
  }, [searchTerm, selectedCategory, selectedPathway]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedPathway('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Searchable Structured Waste Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
          What Should I Do With This Waste?
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Search over 30 everyday items in Indian homes. Discover preparation steps, the right municipal bin, reuse and repair feasibility, and statutory CPCB disposal guidelines.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        {/* Main Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search waste item (e.g. milk pouch, old jeans, battery, paracetamol, banana peel, glass jar)..."
            className="w-full pl-11 pr-10 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-2xl focus:outline-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-slate-50/50 focus:bg-white transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-emerald-600" />
              <span>Filter by Waste Category:</span>
            </span>
            {(selectedCategory !== 'all' || selectedPathway !== 'all' || searchTerm) && (
              <button
                onClick={handleClearFilters}
                className="text-emerald-700 font-semibold text-[11px] hover:underline"
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Disposal Pathway Filter */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-600">Disposal Pathway:</span>
          {pathways.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPathway(p.id)}
              className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors ${
                selectedPathway === p.id
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & AI fallback CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
        <p>
          Showing <strong>{filteredItems.length}</strong> items matching your criteria
        </p>

        <div className="flex items-center gap-2">
          <span>Can't find your item?</span>
          <button
            onClick={() => onNavigate('identify')}
            className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Use AI Vision Identifier</span>
          </button>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <WasteCard
              key={item.id}
              item={item}
              onFindRecycler={() => onNavigate('recyclers', item.category)}
              onLogItem={onLogItem}
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-3xl p-12 text-center space-y-4 border border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-white text-slate-400 flex items-center justify-center mx-auto shadow-xs">
            <Search className="w-6 h-6 text-slate-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              No matching waste items found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find "{searchTerm}" in our curated Indian catalog. Try a different keyword or let our multimodal AI identify it.
            </p>
          </div>
          <div className="flex justify-center gap-2">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white"
            >
              Clear Filters
            </button>
            <button
              onClick={() => onNavigate('identify')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Identify with AI Vision</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
