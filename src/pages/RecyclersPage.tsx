import React, { useState, useMemo, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Phone, 
  Mail, 
  Globe, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  Navigation,
  X,
  Building2,
  ExternalLink,
  MessageSquare,
  Bookmark,
  BookmarkCheck,
  Plus,
  Coins,
  Store,
  CheckCircle2,
  Truck,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Filter
} from 'lucide-react';
import { RECYCLERS, CITIES_LIST, STATES_LIST } from '../data/recyclers';
import { Recycler, WasteCategory } from '../types';
import { 
  toggleSavedItem, 
  getUserProfile, 
  submitDirectoryCorrection 
} from '../services/storageService';

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory && initialCategory !== 'all' ? [initialCategory] : []
  );
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [selectedVerifications, setSelectedVerifications] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalRecycler, setActiveModalRecycler] = useState<Recycler | null>(null);

  // Sync if initialCategory prop changes from external navigation
  useEffect(() => {
    if (initialCategory && initialCategory !== 'all') {
      setSelectedCategories((prev) => 
        prev.includes(initialCategory) ? prev : [...prev, initialCategory]
      );
    }
  }, [initialCategory]);

  // User saved recyclers
  const [savedRecyclerIds, setSavedRecyclerIds] = useState<string[]>(
    getUserProfile().savedRecyclerIds || []
  );

  // Suggest Recycler / Correction modal
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [suggestName, setSuggestName] = useState('');
  const [suggestCity, setSuggestCity] = useState('Bengaluru');
  const [suggestMaterials, setSuggestMaterials] = useState('');
  const [suggestContact, setSuggestContact] = useState('');
  const [suggestNotes, setSuggestNotes] = useState('');
  const [suggestSuccess, setSuggestSuccess] = useState(false);

  // Correction for specific facility
  const [correctionRecycler, setCorrectionRecycler] = useState<Recycler | null>(null);
  const [correctionNote, setCorrectionNote] = useState('');
  const [correctionPhone, setCorrectionPhone] = useState('');
  const [correctionSuccess, setCorrectionSuccess] = useState(false);

  const categories: { id: WasteCategory; label: string }[] = [
    { id: 'plastic', label: 'Plastics & Packaging' },
    { id: 'paper', label: 'Paper & Cardboard' },
    { id: 'e_waste', label: 'E-Waste & Electronics' },
    { id: 'batteries', label: 'Batteries & Cells' },
    { id: 'textile', label: 'Textiles & Clothes' },
    { id: 'glass', label: 'Glass & Bottles' },
    { id: 'metal', label: 'Metals & Scrap' },
    { id: 'used_cooking_oil', label: 'Used Cooking Oil' },
    { id: 'dry_recyclable', label: 'Mixed Dry Recyclables' },
    { id: 'wet_organic', label: 'Organic & Compost' },
    { id: 'hazardous', label: 'Hazardous / Medical' },
  ];

  const collectionMethods = [
    { 
      id: 'Doorstep pickup', 
      label: 'Doorstep Pickup', 
      icon: Truck,
      description: 'Collector visits home or office'
    },
    { 
      id: 'Drop-off center', 
      label: 'Drop-off Center', 
      icon: Store,
      description: 'Physical hub or kiosk drop-in'
    },
    { 
      id: 'Bulk pickup', 
      label: 'Bulk / Society Pickup', 
      icon: Building2,
      description: 'Apartments, societies & commercial'
    },
  ];

  const verificationOptions = [
    {
      id: 'verified',
      label: 'SPCB / CPCB Authorized',
      icon: ShieldCheck,
      description: 'Govt. verified PROs & recyclers'
    },
    {
      id: 'community',
      label: 'Community Aggregators & NGOs',
      icon: CheckCircle2,
      description: 'Grassroots circular initiatives'
    }
  ];

  // Dynamic counts for each filter
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((cat) => {
      counts[cat.id] = RECYCLERS.filter((rec) =>
        rec.acceptedCategories.includes(cat.id)
      ).length;
    });
    return counts;
  }, []);

  const methodCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    collectionMethods.forEach((m) => {
      counts[m.id] = RECYCLERS.filter((rec) =>
        rec.collectionMethods.includes(m.id as any)
      ).length;
    });
    return counts;
  }, []);

  const verificationCounts = useMemo(() => {
    return {
      verified: RECYCLERS.filter((r) => r.isVerified).length,
      community: RECYCLERS.filter((r) => !r.isVerified).length,
    };
  }, []);

  // Multi-select toggle handlers
  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const toggleMethod = (methodId: string) => {
    setSelectedMethods((prev) =>
      prev.includes(methodId) ? prev.filter((id) => id !== methodId) : [...prev, methodId]
    );
  };

  const toggleVerification = (statusId: string) => {
    setSelectedVerifications((prev) =>
      prev.includes(statusId) ? prev.filter((id) => id !== statusId) : [...prev, statusId]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedMethods([]);
    setSelectedVerifications([]);
    setSelectedCity('All Cities');
    setSearchQuery('');
  };

  const activeFilterCount =
    selectedCategories.length +
    selectedMethods.length +
    selectedVerifications.length +
    (selectedCity !== 'All Cities' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const handleToggleSave = (recId: string) => {
    const isSaved = toggleSavedItem('recycler', recId);
    if (isSaved) {
      setSavedRecyclerIds((prev) => [...prev, recId]);
      onShowToast('Facility saved to your profile bookmarks.', 'success');
    } else {
      setSavedRecyclerIds((prev) => prev.filter((id) => id !== recId));
      onShowToast('Removed from saved facilities.', 'info');
    }
  };

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      onShowToast('Geolocation is not supported by your browser.', 'info');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        onShowToast('Location detected. Filtered to nearest recycling partners in Bengaluru.', 'success');
        setSelectedCity('Bengaluru');
      },
      () => {
        onShowToast('Location access declined. Please select your city manually.', 'info');
      }
    );
  };

  const handleSuggestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitDirectoryCorrection({
      targetType: 'recycler',
      targetName: suggestName,
      suggestedName: suggestName,
      city: suggestCity,
      state: 'India',
      suggestedCategory: suggestMaterials,
      notes: `New Recycler Suggestion: Materials: ${suggestMaterials}. Notes: ${suggestNotes}`,
      reporterContact: suggestContact,
    });

    setSuggestSuccess(true);
    setTimeout(() => {
      setShowSuggestModal(false);
      setSuggestName('');
      setSuggestMaterials('');
      setSuggestContact('');
      setSuggestNotes('');
      setSuggestSuccess(false);
    }, 2200);
  };

  const handleCorrectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionRecycler) return;

    await submitDirectoryCorrection({
      targetType: 'recycler',
      targetId: correctionRecycler.id,
      targetName: correctionRecycler.name,
      city: correctionRecycler.city,
      state: correctionRecycler.state,
      notes: correctionNote,
      reporterContact: correctionPhone,
    });

    setCorrectionSuccess(true);
    setTimeout(() => {
      setCorrectionRecycler(null);
      setCorrectionNote('');
      setCorrectionPhone('');
      setCorrectionSuccess(false);
    }, 2200);
  };

  const filteredRecyclers = useMemo(() => {
    return RECYCLERS.filter((rec) => {
      const matchesCity =
        selectedCity === 'All Cities' || rec.city === selectedCity;

      const matchesCategory =
        selectedCategories.length === 0 ||
        rec.acceptedCategories.some((cat) => selectedCategories.includes(cat));

      const matchesMethod =
        selectedMethods.length === 0 ||
        rec.collectionMethods.some((m) => selectedMethods.includes(m as any));

      const matchesVerification =
        selectedVerifications.length === 0 ||
        (selectedVerifications.includes('verified') && rec.isVerified) ||
        (selectedVerifications.includes('community') && !rec.isVerified);

      const matchesSearch =
        !searchQuery.trim() ||
        rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rec.district && rec.district.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (rec.specificMaterials &&
          rec.specificMaterials.some((m) =>
            m.toLowerCase().includes(searchQuery.toLowerCase())
          ));

      return (
        matchesCity &&
        matchesCategory &&
        matchesMethod &&
        matchesVerification &&
        matchesSearch
      );
    });
  }, [selectedCity, selectedCategories, selectedMethods, selectedVerifications, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <span>Circular Infrastructure</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>State Pollution Control Board & CPCB Verified</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Recyclers, Recovery Hubs & Circular NGOs
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Verified e-waste dismantlers, textile reuse foundations (Goonj, Greensole), plastics recovery facilities, and authorized collection centers across India.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowSuggestModal(true)}
            className="text-xs font-semibold text-slate-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg px-3 py-2 transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-teal-700" />
            <span>Suggest a Recycler</span>
          </button>

          <button
            onClick={() => onNavigate('buyers')}
            className="text-xs font-semibold text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 transition-colors inline-flex items-center gap-1.5"
          >
            <Coins className="w-3.5 h-3.5 text-amber-600" />
            <span>Find Waste Buyers</span>
          </button>

          <button
            onClick={handleRequestLocation}
            className="text-xs font-medium text-slate-700 border border-slate-300 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5 text-slate-500" />
            <span>Detect City</span>
          </button>
        </div>
      </div>

      {/* Operational notice */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5 text-xs text-slate-700">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Operating Guidance:</strong> Contact facilities prior to dispatching high-volume waste. Weight thresholds, doorstep pickup minimums, and purchase rates vary per municipal ward.
        </p>
      </div>

      {/* Filter Matrix with Multi-Select Filters */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-5">
        {/* Row 1: Search & City Dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Search Query */}
          <div className="md:col-span-7">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Search Facility Name, Locality or Material
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Goonj, Saahas, ScrapUncle, Chembur, Lithium, HDPE..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-slate-900 bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* City Selector */}
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Filter by City Hub
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full pl-9 pr-8 text-xs border border-slate-300 rounded-lg py-2 bg-white text-slate-900 focus:outline-slate-900 appearance-none font-medium cursor-pointer"
              >
                {CITIES_LIST.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 1: Multi-Select Waste Categories */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-900">
                Waste Category Streams
              </span>
              <span className="text-[11px] text-slate-500">
                (Multi-select: select one or more)
              </span>
            </div>

            {selectedCategories.length > 0 && (
              <button
                onClick={() => setSelectedCategories([])}
                className="text-[11px] font-medium text-teal-700 hover:text-teal-800 underline inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset categories ({selectedCategories.length})</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-0.5">
            <button
              onClick={() => setSelectedCategories([])}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all inline-flex items-center gap-1.5 border ${
                selectedCategories.length === 0
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span>All Streams</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                selectedCategories.length === 0 ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {RECYCLERS.length}
              </span>
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id);
              const count = categoryCounts[cat.id] || 0;

              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  aria-pressed={isSelected}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all inline-flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[10px] transition-colors ${
                    isSelected
                      ? 'bg-teal-500 border-teal-500 text-white'
                      : 'border-slate-300 bg-white text-transparent'
                  }`}>
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                    isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Multi-Select Service Type & Verification Status */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Service / Collection Type Multi-Select */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-semibold text-slate-900">
                  Service / Collection Type
                </span>
              </div>
              {selectedMethods.length > 0 && (
                <button
                  onClick={() => setSelectedMethods([])}
                  className="text-[11px] font-medium text-slate-500 hover:text-slate-800 underline"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {collectionMethods.map((m) => {
                const isSelected = selectedMethods.includes(m.id);
                const IconComponent = m.icon;
                const count = methodCounts[m.id] || 0;

                return (
                  <button
                    key={m.id}
                    onClick={() => toggleMethod(m.id)}
                    aria-pressed={isSelected}
                    className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                        : 'border-slate-200 bg-slate-50/70 hover:bg-slate-50 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <IconComponent className={`w-4 h-4 ${isSelected ? 'text-teal-400' : 'text-slate-600'}`} />
                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                        isSelected
                          ? 'bg-teal-500 border-teal-500 text-white'
                          : 'border-slate-300 bg-white text-transparent'
                      }`}>
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold leading-snug">{m.label}</div>
                      <div className={`text-[10px] line-clamp-1 mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {m.description}
                      </div>
                    </div>
                    <div className="mt-2 pt-1 border-t border-slate-200/40 text-[10px] font-medium flex items-center justify-between">
                      <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>Facilities</span>
                      <span className={`px-1.5 py-0.2 rounded font-semibold ${isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-200/80 text-slate-700'}`}>
                        {count}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Verification Status Multi-Select */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span className="text-xs font-semibold text-slate-900">
                  Verification Status
                </span>
              </div>
              {selectedVerifications.length > 0 && (
                <button
                  onClick={() => setSelectedVerifications([])}
                  className="text-[11px] font-medium text-slate-500 hover:text-slate-800 underline"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {verificationOptions.map((opt) => {
                const isSelected = selectedVerifications.includes(opt.id);
                const IconComponent = opt.icon;
                const count = opt.id === 'verified' ? verificationCounts.verified : verificationCounts.community;

                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleVerification(opt.id)}
                    aria-pressed={isSelected}
                    className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                        : 'border-slate-200 bg-slate-50/70 hover:bg-slate-50 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <IconComponent className={`w-4 h-4 ${
                        isSelected 
                          ? 'text-teal-400' 
                          : opt.id === 'verified' ? 'text-teal-600' : 'text-slate-500'
                      }`} />
                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                        isSelected
                          ? 'bg-teal-500 border-teal-500 text-white'
                          : 'border-slate-300 bg-white text-transparent'
                      }`}>
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold leading-snug">{opt.label}</div>
                      <div className={`text-[10px] line-clamp-1 mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {opt.description}
                      </div>
                    </div>
                    <div className="mt-2 pt-1 border-t border-slate-200/40 text-[10px] font-medium flex items-center justify-between">
                      <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>Facilities</span>
                      <span className={`px-1.5 py-0.2 rounded font-semibold ${isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-200/80 text-slate-700'}`}>
                        {count}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Filters Summary Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-900">
              Showing {filteredRecyclers.length} of {RECYCLERS.length} facilities
            </span>

            {/* Active chips */}
            {selectedCity !== 'All Cities' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-medium text-[11px] border border-slate-200">
                <span>City: {selectedCity}</span>
                <button
                  onClick={() => setSelectedCity('All Cities')}
                  className="hover:text-red-600 ml-0.5"
                  title="Remove city filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCategories.map((catId) => {
              const label = categories.find((c) => c.id === catId)?.label || catId;
              return (
                <span
                  key={catId}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 font-medium text-[11px] border border-teal-200"
                >
                  <span>{label}</span>
                  <button
                    onClick={() => toggleCategory(catId)}
                    className="hover:text-red-600 ml-0.5"
                    title={`Remove ${label}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}

            {selectedMethods.map((methodId) => (
              <span
                key={methodId}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-medium text-[11px] border border-blue-200"
              >
                <span>{methodId}</span>
                <button
                  onClick={() => toggleMethod(methodId)}
                  className="hover:text-red-600 ml-0.5"
                  title={`Remove ${methodId}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {selectedVerifications.map((vId) => (
              <span
                key={vId}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 font-medium text-[11px] border border-purple-200"
              >
                <span>{vId === 'verified' ? 'SPCB Authorized' : 'Community Hub'}</span>
                <button
                  onClick={() => toggleVerification(vId)}
                  className="hover:text-red-600 ml-0.5"
                  title="Remove verification filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-medium text-[11px] border border-amber-200">
                <span>"{searchQuery}"</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:text-red-600 ml-0.5"
                  title="Clear search query"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="font-medium text-slate-600 hover:text-slate-900 underline inline-flex items-center gap-1 text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Recyclers Grid */}
      {filteredRecyclers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecyclers.map((recycler) => {
            const isSaved = savedRecyclerIds.includes(recycler.id);
            const whatsappUrl = recycler.whatsappNumber
              ? `https://wa.me/${recycler.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${recycler.name}, I found your contact on PrithveX. I would like to inquire about recycling / drop-off.`
                )}`
              : null;

            return (
              <article
                key={recycler.id}
                className="bg-white rounded-xl border border-slate-200/90 p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-2xs transition-all group"
              >
                <div className="space-y-3">
                  {/* Meta Row: City, District & Verification */}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium text-slate-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{recycler.district ? `${recycler.district}, ` : ''}{recycler.city}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      {recycler.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          <ShieldCheck className="w-3 h-3 text-teal-600" />
                          <span>{recycler.verificationStatus || 'Verified'}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Community Aggregator</span>
                      )}

                      <button
                        onClick={() => handleToggleSave(recycler.id)}
                        className={`p-1 rounded transition-colors ${
                          isSaved ? 'text-teal-700' : 'text-slate-400 hover:text-slate-700'
                        }`}
                        title={isSaved ? 'Saved' : 'Save'}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4 h-4 fill-current" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Recycler Title */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-slate-700 transition-colors">
                      {recycler.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {recycler.address}
                    </p>
                  </div>

                  {/* Description */}
                  {recycler.notes && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {recycler.notes}
                    </p>
                  )}

                  {/* Specific / Accepted Streams */}
                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-[11px] font-medium text-slate-700 mb-1">
                      Materials Accepted:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {(recycler.specificMaterials && recycler.specificMaterials.length > 0
                        ? recycler.specificMaterials
                        : recycler.acceptedCategories
                      ).slice(0, 5).map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                        >
                          {typeof item === 'string' ? item.replace('_', ' ') : item}
                        </span>
                      ))}
                      {(recycler.specificMaterials?.length || recycler.acceptedCategories.length) > 5 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-400">
                          +more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Collection Method & Timings */}
                  <div className="text-[11px] text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{recycler.operatingHours}</span>
                    </div>
                    {recycler.minimumQuantity && (
                      <div className="text-slate-600 text-[10px]">
                        <strong>Min. Qty:</strong> {recycler.minimumQuantity}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 mt-4 text-xs">
                  <button
                    onClick={() => setActiveModalRecycler(recycler)}
                    className="font-medium text-slate-900 hover:text-teal-700 transition-colors inline-flex items-center gap-1"
                  >
                    <span>Full Details</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {recycler.contactPhone && (
                      <a
                        href={`tel:${recycler.contactPhone}`}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-medium text-[11px] inline-flex items-center transition-colors"
                        title="Call"
                      >
                        <Phone className="w-3 h-3 text-slate-600" />
                      </a>
                    )}

                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] inline-flex items-center transition-colors"
                        title="WhatsApp Chat"
                      >
                        <MessageSquare className="w-3 h-3" />
                      </a>
                    )}

                    {recycler.googleMapsUrl && (
                      <a
                        href={recycler.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] inline-flex items-center transition-colors"
                        title="Open in Google Maps"
                      >
                        <MapPin className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 border border-slate-200 text-center space-y-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">
            No Recycling Facilities Match Filters
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try switching to "All Cities" or selecting a broader material stream category.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors inline-block mt-2"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Recycler Detail Modal */}
      {activeModalRecycler && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span>{activeModalRecycler.city}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  {activeModalRecycler.isVerified && (
                    <span className="text-teal-700 font-semibold">{activeModalRecycler.verificationStatus || 'SPCB Registered'}</span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-slate-900">{activeModalRecycler.name}</h2>
              </div>
              <button
                onClick={() => setActiveModalRecycler(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
              {activeModalRecycler.notes && (
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Facility Overview</h4>
                  <p className="text-slate-600 leading-relaxed">{activeModalRecycler.notes}</p>
                </div>
              )}

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <h4 className="font-semibold text-slate-900">Contact & Address</h4>
                <p className="text-slate-700 leading-normal">{activeModalRecycler.address}</p>
                <div className="pt-1 flex flex-col gap-1 text-[11px]">
                  {activeModalRecycler.contactPhone && (
                    <p>Phone: <strong>{activeModalRecycler.contactPhone}</strong></p>
                  )}
                  {activeModalRecycler.whatsappNumber && (
                    <p>WhatsApp: <strong>{activeModalRecycler.whatsappNumber}</strong></p>
                  )}
                  {activeModalRecycler.email && (
                    <p>Email: <strong>{activeModalRecycler.email}</strong></p>
                  )}
                  {activeModalRecycler.website && (
                    <p>
                      Website:{' '}
                      <a
                        href={activeModalRecycler.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-700 underline font-medium"
                      >
                        {activeModalRecycler.website}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Specific Materials Accepted</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(activeModalRecycler.specificMaterials || activeModalRecycler.acceptedCategories).map((c, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-medium"
                    >
                      {typeof c === 'string' ? c.replace('_', ' ') : c}
                    </span>
                  ))}
                </div>
              </div>

              {activeModalRecycler.pricingNote && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 text-[11px]">
                  <strong>Scrap Rate / Commercial Policy:</strong> {activeModalRecycler.pricingNote}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {activeModalRecycler.contactPhone && (
                  <a
                    href={`tel:${activeModalRecycler.contactPhone}`}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                )}
                {activeModalRecycler.googleMapsUrl && (
                  <a
                    href={activeModalRecycler.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Google Maps</span>
                  </a>
                )}
              </div>

              <button
                onClick={() => {
                  setCorrectionRecycler(activeModalRecycler);
                  setActiveModalRecycler(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-900 underline"
              >
                Report Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suggest Recycler Modal */}
      {showSuggestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Suggest a Recycler or NGO</h3>
              <button onClick={() => setShowSuggestModal(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {suggestSuccess ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-900">Thank you for contributing!</p>
                <p className="text-xs text-slate-500 mt-1">Our team will verify the contact and publish it.</p>
              </div>
            ) : (
              <form onSubmit={handleSuggestSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Organization / Recycler Name *</label>
                  <input
                    required
                    type="text"
                    value={suggestName}
                    onChange={(e) => setSuggestName(e.target.value)}
                    placeholder="E.g. GreenEarth E-Waste Solutions"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">City *</label>
                    <input
                      required
                      type="text"
                      value={suggestCity}
                      onChange={(e) => setSuggestCity(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={suggestContact}
                      onChange={(e) => setSuggestContact(e.target.value)}
                      placeholder="+91..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Materials Accepted *</label>
                  <input
                    required
                    type="text"
                    value={suggestMaterials}
                    onChange={(e) => setSuggestMaterials(e.target.value)}
                    placeholder="E.g. Clothes, electronics, glass bottles"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Notes / Address details</label>
                  <textarea
                    rows={3}
                    value={suggestNotes}
                    onChange={(e) => setSuggestNotes(e.target.value)}
                    placeholder="Drop-off location or doorstep pickup information"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSuggestModal(false)}
                    className="px-3 py-2 font-medium text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 font-semibold text-slate-950 bg-teal-500 hover:bg-teal-600 rounded-lg shadow-xs"
                  >
                    Submit Recycler
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Facility Correction Modal */}
      {correctionRecycler && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Update Info: {correctionRecycler.name}
              </h3>
              <button onClick={() => setCorrectionRecycler(null)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {correctionSuccess ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-900">Thank you!</p>
                <p className="text-xs text-slate-500 mt-1">Our team will verify the correction.</p>
              </div>
            ) : (
              <form onSubmit={handleCorrectionSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Details to update *</label>
                  <textarea
                    required
                    rows={3}
                    value={correctionNote}
                    onChange={(e) => setCorrectionNote(e.target.value)}
                    placeholder="New phone number, moved to a different address, or changes in operating hours"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Contact (Optional)</label>
                  <input
                    type="text"
                    value={correctionPhone}
                    onChange={(e) => setCorrectionPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCorrectionRecycler(null)}
                    className="px-3 py-2 font-medium text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                  >
                    Submit Correction
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
