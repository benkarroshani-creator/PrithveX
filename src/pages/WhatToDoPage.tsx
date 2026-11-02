import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Layers,
  Coins,
  Store
} from 'lucide-react';
import { WASTE_ITEMS } from '../data/wasteItems';
import { WasteCard } from '../components/WasteCard';
import { WasteItem, DisposalPathway } from '../types';

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
    { id: 'all', label: 'All Streams' },
    { id: 'plastic', label: 'Plastic' },
    { id: 'wet_organic', label: 'Wet / Organic' },
    { id: 'paper', label: 'Paper & Board' },
    { id: 'e_waste', label: 'E-Waste' },
    { id: 'batteries', label: 'Batteries' },
    { id: 'medical', label: 'Medical' },
    { id: 'hazardous', label: 'Hazardous' },
    { id: 'sanitary', label: 'Sanitary' },
    { id: 'textile', label: 'Textile' },
    { id: 'glass', label: 'Glass' },
    { id: 'metal', label: 'Metal' },
    { id: 'used_cooking_oil', label: 'Cooking Oil' },
    { id: 'special_waste', label: 'Special / Debris' },
  ];

  const pathways: { id: string; label: string }[] = [
    { id: 'all', label: 'All Pathways' },
    { id: 'Recyclable', label: 'Recyclable' },
    { id: 'Compostable', label: 'Compostable' },
    { id: 'Reusable', label: 'Reusable' },
    { id: 'Donate', label: 'Donation' },
    { id: 'Repair', label: 'Repairable' },
    { id: 'Hazardous / safe disposal', label: 'Hazardous Disposal' },
    { id: 'Reject / residual waste', label: 'Residual / Reject' },
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
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Household Segregation Directory</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>CPCB SWM 2016 Compliant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Waste Database & Disposal Protocols
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Inspect everyday items generated in Indian households. Review preparation steps, designated bin streams, circular feasibility, and direct links to recyclers & buyers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('buyers')}
            className="text-xs font-semibold text-slate-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg px-3 py-2 transition-colors inline-flex items-center gap-1.5"
          >
            <Coins className="w-3.5 h-3.5 text-amber-700" />
            <span>Waste Buyers Directory</span>
          </button>
          <button
            onClick={() => onNavigate('marketplace')}
            className="text-xs font-semibold text-slate-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg px-3 py-2 transition-colors inline-flex items-center gap-1.5"
          >
            <Store className="w-3.5 h-3.5 text-emerald-700" />
            <span>P2P Marketplace</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search waste item (e.g. milk pouch, jeans, battery, paracetamol, banana peel, glass jar)..."
            className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-slate-900 bg-white placeholder-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Horizontal Filter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">Filter by Material Category:</span>
            {(selectedCategory !== 'all' || selectedPathway !== 'all' || searchTerm) && (
              <button
                onClick={handleClearFilters}
                className="text-slate-500 hover:text-slate-900 text-[11px] underline"
              >
                Reset filters
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors shrink-0 font-medium ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Pathway Filter */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 shrink-0 text-[11px]">Circular Pathway:</span>
          {pathways.map((pw) => {
            const isActive = selectedPathway === pw.id;
            return (
              <button
                key={pw.id}
                onClick={() => setSelectedPathway(pw.id)}
                className={`text-[11px] px-2.5 py-1 rounded transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {pw.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Waste Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
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
      ) : (
        <div className="bg-white rounded-xl p-12 border border-slate-200 text-center space-y-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">
            No Items Matched Your Filter
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or selecting a different category stream.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors inline-block mt-2"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
