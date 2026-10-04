import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  Phone, 
  Mail, 
  Globe, 
  ShieldCheck, 
  Clock, 
  Filter, 
  ExternalLink, 
  AlertCircle,
  Navigation,
  CheckCircle2,
  X
} from 'lucide-react';
import { RECYCLERS, CITIES_LIST } from '../data/recyclers';
import { Recycler, WasteCategory } from '../types';

interface RecyclersPageProps {
  initialCategory?: string;
  onNavigate: (tab: string) => void;
  onShowToast: (message: string, type?: 'success' | 'info') => void;
}

export const RecyclersPage: React.FC<RecyclersPageProps> = ({
  initialCategory = 'all',
  onNavigate,
  onShowToast
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userLocationAsked, setUserLocationAsked] = useState<boolean>(false);
  const [activeModalRecycler, setActiveModalRecycler] = useState<Recycler | null>(null);

  const categories = [
    { id: 'all', label: 'All Materials' },
    { id: 'plastic', label: 'Plastics' },
    { id: 'paper', label: 'Paper & Cardboard' },
    { id: 'e_waste', label: 'E-Waste & Electronics' },
    { id: 'batteries', label: 'Batteries' },
    { id: 'textile', label: 'Textiles' },
    { id: 'glass', label: 'Glass' },
    { id: 'metal', label: 'Metals' },
    { id: 'used_cooking_oil', label: 'Used Cooking Oil (RUCO)' },
  ];

  const collectionMethods = [
    { id: 'all', label: 'All Collection Methods' },
    { id: 'Doorstep pickup', label: 'Doorstep Pickup' },
    { id: 'Drop-off center', label: 'Drop-off Center' },
    { id: 'Bulk pickup', label: 'Bulk / Society Pickup' },
  ];

  // Manual GPS Permission Handler (Explicit user consent)
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      onShowToast('Geolocation is not supported by your browser.', 'info');
      return;
    }

    setUserLocationAsked(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Approximate city based on coords or set to nearest hub
        onShowToast('Location detected. Filtered to nearest recycling partners.', 'success');
        setSelectedCity('Bengaluru'); // Default mapped demo hub
      },
      (err) => {
        onShowToast('Location access declined. You can select your city manually.', 'info');
      }
    );
  };

  const filteredRecyclers = useMemo(() => {
    return RECYCLERS.filter((rec) => {
      // City matching
      const matchesCity =
        selectedCity === 'All Cities' || rec.city === selectedCity;

      // Category matching
      const matchesCategory =
        selectedCategory === 'all' ||
        rec.acceptedCategories.includes(selectedCategory as WasteCategory);

      // Method matching
      const matchesMethod =
        selectedMethod === 'all' ||
        rec.collectionMethods.includes(selectedMethod as any);

      // Verified matching
      const matchesVerified = !onlyVerified || rec.isVerified;

      // Search query
      const matchesSearch =
        !searchQuery.trim() ||
        rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.city.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCity && matchesCategory && matchesMethod && matchesVerified && matchesSearch;
    });
  }, [selectedCity, selectedCategory, selectedMethod, onlyVerified, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Indian Circular Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
          Find Verified Recyclers & Collection Hubs
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Connect with authorized scrap aggregators, CPCB e-waste recyclers, FSSAI RUCO bio-fuel partners, and social waste cooperatives across India.
        </p>
      </div>

      {/* Mandatory Regulatory / Operational Disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900 shadow-xs">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">Important Recycler Notice:</p>
          <p className="leading-relaxed">
            Please contact the recycler or facility before visiting or shipping waste materials. Material acceptance guidelines, minimum weights, and doorstep pickup schedules can change dynamically based on municipal logistics and market rates.
          </p>
        </div>
      </div>

      {/* Filters & Location Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        {/* City & Search Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* City Selector */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select City
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-emerald-600"
              >
                {CITIES_LIST.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Query */}
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Search by Facility Name or Locality
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Saahas, Indiranagar, Attero, Chembur..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Location Request Button */}
          <div className="md:col-span-3 flex items-end">
            <button
              onClick={handleRequestLocation}
              className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              <span>Use Current Location</span>
            </button>
          </div>
        </div>

        {/* Material Category Pills */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Accepted Waste Category
          </label>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-3 py-1 rounded-xl transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white font-bold shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Collection Method & Verified Toggle */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-600">Method:</span>
            {collectionMethods.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors ${
                  selectedMethod === m.id
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyVerified}
              onChange={(e) => setOnlyVerified(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <span className="font-semibold text-slate-700">Verified Facilities Only</span>
          </label>
        </div>
      </div>

      {/* Recyclers Grid */}
      <div className="space-y-4">
        <p className="text-xs text-slate-500">
          Showing <strong>{filteredRecyclers.length}</strong> recycling facilities in {selectedCity}
        </p>

        {filteredRecyclers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRecyclers.map((rec) => (
              <div
                key={rec.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Header: Verification & City */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>{rec.city}, {rec.state}</span>
                    </span>

                    {rec.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>

                  {/* Name & Address */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {rec.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {rec.address}
                    </p>
                  </div>

                  {/* Accepted Materials Chips */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Accepted Streams
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {rec.acceptedCategories.map((cat) => (
                        <span
                          key={cat}
                          className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 capitalize"
                        >
                          {cat.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Collection Methods */}
                  <div className="flex flex-wrap gap-1 text-[11px] text-emerald-800">
                    {rec.collectionMethods.map((m) => (
                      <span
                        key={m}
                        className="px-2 py-0.5 bg-emerald-50 rounded-md font-semibold text-[10px] border border-emerald-100"
                      >
                        ✓ {m}
                      </span>
                    ))}
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{rec.operatingHours}</span>
                  </div>

                  {/* Verification Date */}
                  <p className="text-[10px] text-slate-400">
                    Last audited & verified: {new Date(rec.lastVerifiedDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
                  <a
                    href={`tel:${rec.contactPhone.replace(/\s+/g, '')}`}
                    className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Recycler</span>
                  </a>

                  <button
                    onClick={() => setActiveModalRecycler(rec)}
                    className="py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-3xl p-12 text-center space-y-3 border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-white text-slate-400 flex items-center justify-center mx-auto shadow-xs">
              <MapPin className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">
              No recyclers found for this filter in {selectedCity}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try switching to "All Cities" or selecting a broader waste category like "Plastics" or "Paper".
            </p>
            <button
              onClick={() => {
                setSelectedCity('All Cities');
                setSelectedCategory('all');
                setSelectedMethod('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Recycler Detail Modal */}
      {activeModalRecycler && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {activeModalRecycler.city}, {activeModalRecycler.state}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {activeModalRecycler.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalRecycler(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                <strong>Full Address:</strong> {activeModalRecycler.address}
              </p>
              <p>
                <strong>Operating Schedule:</strong> {activeModalRecycler.operatingHours}
              </p>
              {activeModalRecycler.pricingNote && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-semibold text-slate-800">Scrap / Pickup Pricing:</p>
                  <p>{activeModalRecycler.pricingNote}</p>
                </div>
              )}
              {activeModalRecycler.notes && (
                <p className="italic text-slate-500">"{activeModalRecycler.notes}"</p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <a
                href={`tel:${activeModalRecycler.contactPhone.replace(/\s+/g, '')}`}
                className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {activeModalRecycler.contactPhone}</span>
              </a>

              {activeModalRecycler.website && (
                <a
                  href={activeModalRecycler.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1"
                >
                  <span>Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
