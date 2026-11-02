import React, { useState, useMemo, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Compass, 
  Filter, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  ExternalLink, 
  Bookmark, 
  Sparkles, 
  AlertTriangle, 
  Layers, 
  List, 
  Map as MapIcon, 
  SlidersHorizontal,
  X,
  Truck,
  RotateCcw
} from 'lucide-react';
import { CircularityLocation, MapMarkerCategory, ReportIssue, UserProfile } from '../types';
import { 
  getBaseCircularityLocations, 
  convertReportsToHotspots, 
  CITY_CENTROIDS, 
  MARKER_CATEGORY_CONFIG, 
  calculateDistanceKm 
} from '../data/circularityLocations';
import { CircularityMap } from '../components/CircularityMap';
import { SmartMatchingWizard } from '../components/SmartMatchingWizard';

interface CircularityMapPageProps {
  reports: ReportIssue[];
  currentUser: UserProfile;
  onNavigate: (tab: string, filter?: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  initialCategory?: string;
}

export const CircularityMapPage: React.FC<CircularityMapPageProps> = ({
  reports,
  currentUser,
  onNavigate,
  onShowToast,
  initialCategory
}) => {
  // Base raw locations + dynamic community reports
  const allLocations = useMemo(() => {
    const base = getBaseCircularityLocations();
    const hotspots = convertReportsToHotspots(reports);
    return [...base, ...hotspots];
  }, [reports]);

  // UI state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [collectionMethodFilter, setCollectionMethodFilter] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'split' | 'map' | 'list'>('split');
  const [selectedLocation, setSelectedLocation] = useState<CircularityLocation | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('prithvex_saved_locations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Geolocation state
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [maxDistanceRadiusKm, setMaxDistanceRadiusKm] = useState<number>(50);
  const [isRadiusFilterActive, setIsRadiusFilterActive] = useState<boolean>(false);

  // Map viewport center
  const [centerCoords, setCenterCoords] = useState<{ lat: number; lng: number; zoom: number }>(
    CITY_CENTROIDS['All Cities']
  );

  // Show smart wizard modal
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);

  // Update map center when city changes
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    if (CITY_CENTROIDS[city]) {
      setCenterCoords(CITY_CENTROIDS[city]);
    }
  };

  // Find Near Me (Geolocation)
  const handleFindNearMe = () => {
    if (!navigator.geolocation) {
      onShowToast('Geolocation is not supported by your browser', 'error');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setUserCoords(coords);
        setCenterCoords({ lat: coords.lat, lng: coords.lng, zoom: 13 });
        setIsRadiusFilterActive(true);
        setIsLocating(false);
        onShowToast('Location found! Showing circularity destinations sorted by distance.', 'success');
      },
      (err) => {
        setIsLocating(false);
        // Fallback to Bengaluru or selected city
        const fallbackCity = selectedCity !== 'All Cities' ? selectedCity : 'Bengaluru';
        setCenterCoords(CITY_CENTROIDS[fallbackCity]);
        onShowToast(`Location access denied. Centered on ${fallbackCity}.`, 'info');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Save / Bookmark location
  const handleToggleSave = (locId: string) => {
    setSavedIds((prev) => {
      const exists = prev.includes(locId);
      const updated = exists ? prev.filter((id) => id !== locId) : [...prev, locId];
      try {
        localStorage.setItem('prithvex_saved_locations', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      onShowToast(exists ? 'Location removed from bookmarks' : 'Location saved to bookmarks!', 'success');
      return updated;
    });
  };

  // Filter and enrich with distance
  const filteredLocations = useMemo(() => {
    return allLocations
      .map((loc) => {
        if (userCoords) {
          const dist = calculateDistanceKm(userCoords.lat, userCoords.lng, loc.lat, loc.lng);
          return { ...loc, distanceKm: dist };
        }
        return loc;
      })
      .filter((loc) => {
        // 1. City filter
        if (selectedCity !== 'All Cities' && loc.city.toLowerCase() !== selectedCity.toLowerCase()) {
          return false;
        }

        // 2. Category chip filter
        if (selectedCategory !== 'all') {
          if (selectedCategory === 'hotspot') {
            if (loc.category !== 'waste_hotspot') return false;
          } else if (selectedCategory === 'saved') {
            if (!savedIds.includes(loc.id)) return false;
          } else if (selectedCategory === 'recycler_all') {
            if (loc.sourceType !== 'recycler') return false;
          } else if (selectedCategory === 'buyer_all') {
            if (loc.sourceType !== 'buyer' && loc.category !== 'scrap_dealer') return false;
          } else if (loc.category !== selectedCategory) {
            return false;
          }
        }

        // 3. Collection method filter
        if (collectionMethodFilter !== 'all') {
          if (!loc.collectionMethods?.includes(collectionMethodFilter as any)) {
            return false;
          }
        }

        // 4. Verification filter
        if (verifiedOnly && !loc.isVerified) {
          return false;
        }

        // 5. Radius filter if near me active
        if (isRadiusFilterActive && loc.distanceKm !== undefined && loc.distanceKm > maxDistanceRadiusKm) {
          return false;
        }

        // 6. Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = loc.name.toLowerCase().includes(q);
          const matchLocality = loc.locality?.toLowerCase().includes(q);
          const matchCity = loc.city.toLowerCase().includes(q);
          const matchAddress = loc.address.toLowerCase().includes(q);
          const matchMaterial = loc.specificMaterials.some((m) => m.toLowerCase().includes(q));
          const matchCategory = loc.categoryLabel.toLowerCase().includes(q);

          if (!matchName && !matchLocality && !matchCity && !matchAddress && !matchMaterial && !matchCategory) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // If distance exists, sort closest first
        if (a.distanceKm !== undefined && b.distanceKm !== undefined) {
          return a.distanceKm - b.distanceKm;
        }
        return (b.rating || 0) - (a.rating || 0);
      });
  }, [
    allLocations,
    userCoords,
    selectedCity,
    selectedCategory,
    collectionMethodFilter,
    verifiedOnly,
    isRadiusFilterActive,
    maxDistanceRadiusKm,
    searchQuery,
    savedIds
  ]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: allLocations.length,
      saved: savedIds.length,
      hotspot: allLocations.filter((l) => l.category === 'waste_hotspot').length
    };
    allLocations.forEach((l) => {
      counts[l.category] = (counts[l.category] || 0) + 1;
    });
    return counts;
  }, [allLocations, savedIds]);

  return (
    <div className="min-h-screen bg-[#F4F6F8] pb-16">
      {/* Top Header Banner */}
      <div className="bg-[#111C2E] text-white border-b border-[#253247] pt-10 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#19B5A5]/15 text-[#19B5A5] text-xs font-semibold mb-3">
                <Compass className="w-3.5 h-3.5" />
                Live Circular Infrastructure · Pan-India
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                PrithveX Circularity Map
              </h1>
              <p className="text-sm sm:text-base text-[#E3E8EF] max-w-2xl mt-2 font-normal">
                Discover authorized recyclers, commercial scrap buyers, e-waste drop-off hubs, and civic waste hotspots with verified coordinates and turn-by-turn navigation.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleFindNearMe}
                disabled={isLocating}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#19B5A5] hover:bg-[#138D81] text-white text-xs font-bold transition-all shadow-sm"
              >
                <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                {isLocating ? 'Locating...' : 'Find Near Me'}
              </button>

              <button
                onClick={() => setIsWizardOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7667E8] hover:bg-[#5B4DE0] text-white text-xs font-bold transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                Smart Waste Matcher
              </button>

              <button
                onClick={() => onNavigate('report')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all"
              >
                <AlertTriangle className="w-4 h-4 text-[#E8A84E]" />
                Report Waste Hotspot
              </button>
            </div>
          </div>

          {/* Search & Location Bar */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-3 bg-white p-2 rounded-2xl shadow-md border border-[#E3E8EF]">
            {/* Search Input */}
            <div className="md:col-span-5 relative flex items-center">
              <Search className="w-4 h-4 text-[#718096] absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search facility name, material (e.g. PET, E-waste), locality..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm text-[#111C2E] placeholder-[#718096] bg-transparent focus:outline-none font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mr-2 text-[#718096] hover:text-[#111C2E]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* City Selector */}
            <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-[#E3E8EF] pl-0 md:pl-3 flex items-center">
              <MapPin className="w-4 h-4 text-[#19B5A5] mr-2 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full py-2 bg-transparent text-xs sm:text-sm text-[#111C2E] font-medium focus:outline-none cursor-pointer"
              >
                {Object.keys(CITY_CENTROIDS).map((c) => (
                  <option key={c} value={c}>
                    {c} {c !== 'All Cities' ? `(${CITY_CENTROIDS[c].state})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Collection Method */}
            <div className="md:col-span-2 border-t md:border-t-0 md:border-l border-[#E3E8EF] pl-0 md:pl-3 flex items-center">
              <Truck className="w-4 h-4 text-[#7667E8] mr-2 shrink-0" />
              <select
                value={collectionMethodFilter}
                onChange={(e) => setCollectionMethodFilter(e.target.value)}
                className="w-full py-2 bg-transparent text-xs sm:text-sm text-[#111C2E] font-medium focus:outline-none cursor-pointer"
              >
                <option value="all">All Methods</option>
                <option value="Doorstep pickup">Doorstep Pickup</option>
                <option value="Drop-off center">Drop-off Center</option>
                <option value="Bulk pickup">Bulk Pickup</option>
              </select>
            </div>

            {/* Verification & View Controls */}
            <div className="md:col-span-2 border-t md:border-t-0 md:border-l border-[#E3E8EF] pl-0 md:pl-3 flex items-center justify-between">
              <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-[#111C2E]">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded text-[#19B5A5] focus:ring-[#19B5A5] accent-[#19B5A5]"
                />
                <span>Verified</span>
              </label>

              {/* View toggle */}
              <div className="flex bg-[#F4F6F8] p-0.5 rounded-lg border border-[#E3E8EF]">
                <button
                  onClick={() => setActiveView('split')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    activeView === 'split' ? 'bg-white text-[#111C2E] shadow-sm' : 'text-[#718096]'
                  }`}
                  title="Dual Map & List"
                >
                  <Layers className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveView('map')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    activeView === 'map' ? 'bg-white text-[#111C2E] shadow-sm' : 'text-[#718096]'
                  }`}
                  title="Full Map"
                >
                  <MapIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveView('list')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    activeView === 'list' ? 'bg-white text-[#111C2E] shadow-sm' : 'text-[#718096]'
                  }`}
                  title="List Only"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-white text-[#111C2E]'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              All Facilities ({categoryCounts.all || 0})
            </button>

            <button
              onClick={() => setSelectedCategory('recycling_centre')}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'recycling_centre'
                  ? 'bg-[#19B5A5] text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Recyclers ({categoryCounts.recycling_centre || 0})
            </button>

            <button
              onClick={() => setSelectedCategory('scrap_dealer')}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'scrap_dealer'
                  ? 'bg-[#E8A84E] text-[#111C2E]'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Scrap Dealers ({categoryCounts.scrap_dealer || 0})
            </button>

            <button
              onClick={() => setSelectedCategory('waste_buyer')}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'waste_buyer'
                  ? 'bg-white text-[#111C2E]'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Waste Buyers ({categoryCounts.waste_buyer || 0})
            </button>

            <button
              onClick={() => setSelectedCategory('ewaste_centre')}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'ewaste_centre'
                  ? 'bg-[#7667E8] text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              E-Waste Hubs ({categoryCounts.ewaste_centre || 0})
            </button>

            <button
              onClick={() => setSelectedCategory('plastic_recycler')}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'plastic_recycler'
                  ? 'bg-[#0284C7] text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Plastic Recyclers ({categoryCounts.plastic_recycler || 0})
            </button>

            <button
              onClick={() => setSelectedCategory('paper_recycler')}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'paper_recycler'
                  ? 'bg-[#D97706] text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Paper Recyclers ({categoryCounts.paper_recycler || 0})
            </button>

            <button
              onClick={() => setSelectedCategory('metal_recycler')}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'metal_recycler'
                  ? 'bg-[#475569] text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Metal Recyclers ({categoryCounts.metal_recycler || 0})
            </button>

            <button
              onClick={() => setSelectedCategory('composting_centre')}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'composting_centre'
                  ? 'bg-[#16A34A] text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Composting ({categoryCounts.composting_centre || 0})
            </button>

            <button
              onClick={() => setSelectedCategory('donation_centre')}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'donation_centre'
                  ? 'bg-[#EA580C] text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Donation Hubs ({categoryCounts.donation_centre || 0})
            </button>

            <button
              onClick={() => setSelectedCategory('collection_point')}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'collection_point'
                  ? 'bg-[#0D9488] text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Collection Points ({categoryCounts.collection_point || 0})
            </button>

            <button
              onClick={() => setSelectedCategory('hotspot')}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'hotspot'
                  ? 'bg-[#E11D48] text-white'
                  : 'bg-[#E11D48]/30 text-rose-200 hover:bg-[#E11D48]/50'
              }`}
            >
              Civic Hotspots ({categoryCounts.hotspot || 0})
            </button>

            {savedIds.length > 0 && (
              <button
                onClick={() => setSelectedCategory('saved')}
                className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                  selectedCategory === 'saved'
                    ? 'bg-[#E8A84E] text-[#111C2E]'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                Saved ({savedIds.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Visual Legend Bar */}
        <div className="bg-white rounded-xl p-3 border border-[#E3E8EF] shadow-sm mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-[#111C2E]">
            <span>Active Legend:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {Object.entries(MARKER_CATEGORY_CONFIG).slice(0, 8).map(([key, config]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-[#253247] font-medium">{config.label}</span>
              </div>
            ))}
          </div>

          <div className="text-[#718096] font-semibold">
            Showing <span className="text-[#111C2E] font-bold">{filteredLocations.length}</span> verified points
          </div>
        </div>

        {/* Radius Slider if Near Me is Active */}
        {isRadiusFilterActive && userCoords && (
          <div className="bg-[#E7F8F6] border border-[#19B5A5]/30 rounded-xl p-3.5 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#19B5A5]" />
              <span className="font-bold text-[#111C2E]">
                Distance Filter Active: Within {maxDistanceRadiusKm} km of your location
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={maxDistanceRadiusKm}
                onChange={(e) => setMaxDistanceRadiusKm(Number(e.target.value))}
                className="w-36 accent-[#19B5A5]"
              />
              <button
                onClick={() => setIsRadiusFilterActive(false)}
                className="text-xs font-bold text-[#138D81] hover:underline"
              >
                Clear radius
              </button>
            </div>
          </div>
        )}

        {/* Dual Layout: Map + Facilities List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Map Column */}
          {(activeView === 'split' || activeView === 'map') && (
            <div className={`${activeView === 'map' ? 'lg:col-span-12' : 'lg:col-span-7'} sticky top-20`}>
              <div className="h-[520px] lg:h-[680px]">
                <CircularityMap
                  locations={filteredLocations}
                  selectedLocation={selectedLocation}
                  onSelectLocation={(loc) => setSelectedLocation(loc)}
                  userCoords={userCoords}
                  centerCoords={centerCoords}
                />
              </div>

              {/* Map Help / Direct Directions Tip */}
              <div className="mt-2 flex items-center justify-between text-[11px] text-[#718096] px-1">
                <span>Click any pin to inspect details or open directions</span>
                <span className="text-[#19B5A5] font-semibold">Direct Google Maps Routing Supported</span>
              </div>
            </div>
          )}

          {/* Cards List Column */}
          {(activeView === 'split' || activeView === 'list') && (
            <div className={`${activeView === 'list' ? 'lg:col-span-12' : 'lg:col-span-5'} space-y-4`}>
              {filteredLocations.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#E3E8EF] p-8 text-center">
                  <AlertTriangle className="w-10 h-10 text-[#E8A84E] mx-auto mb-3" />
                  <h3 className="text-base font-bold text-[#111C2E]">No facilities match your active filters</h3>
                  <p className="text-xs text-[#718096] mt-1 mb-4">
                    Try broadening your search term, switching city to "All Cities", or clearing the radius slider.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCity('All Cities');
                      setSelectedCategory('all');
                      setCollectionMethodFilter('all');
                      setVerifiedOnly(false);
                      setIsRadiusFilterActive(false);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111C2E] text-white text-xs font-bold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset All Filters
                  </button>
                </div>
              ) : (
                filteredLocations.map((loc) => {
                  const isSelected = selectedLocation?.id === loc.id;
                  const catConfig = MARKER_CATEGORY_CONFIG[loc.category] || MARKER_CATEGORY_CONFIG.recycling_centre;
                  const isSaved = savedIds.includes(loc.id);
                  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;

                  return (
                    <div
                      key={loc.id}
                      onClick={() => setSelectedLocation(loc)}
                      className={`bg-white rounded-2xl border transition-all p-5 cursor-pointer shadow-sm ${
                        isSelected
                          ? 'border-[#19B5A5] ring-2 ring-[#19B5A5]/20 shadow-md'
                          : 'border-[#E3E8EF] hover:border-[#CBD5E1]'
                      }`}
                    >
                      {/* Top Meta */}
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: catConfig.badgeBg,
                              color: catConfig.textDark
                            }}
                          >
                            {catConfig.label}
                          </span>

                          {loc.isVerified && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#138D81] bg-[#E7F8F6] px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-[#19B5A5]" />
                              Verified
                            </span>
                          )}

                          {loc.distanceKm !== undefined && (
                            <span className="text-[10px] font-bold text-[#19B5A5] bg-[#E7F8F6] px-2 py-0.5 rounded-full">
                              {loc.distanceKm} km away
                            </span>
                          )}
                        </div>

                        {/* Bookmark Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSave(loc.id);
                          }}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isSaved
                              ? 'bg-[#FEF6EC] border-[#E8A84E] text-[#B87216]'
                              : 'bg-white border-[#E3E8EF] text-[#718096] hover:text-[#111C2E]'
                          }`}
                          title={isSaved ? 'Bookmarked' : 'Bookmark Location'}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#E8A84E]' : ''}`} />
                        </button>
                      </div>

                      {/* Name */}
                      <h3 className="text-base font-bold text-[#111C2E] leading-snug mb-1">
                        {loc.name}
                      </h3>

                      {/* Locality & Address */}
                      <p className="text-xs text-[#718096] flex items-center gap-1.5 mb-2.5">
                        <MapPin className="w-3.5 h-3.5 text-[#19B5A5] shrink-0" />
                        <span className="line-clamp-1">{loc.address}</span>
                      </p>

                      {/* Hotspot details if applicable */}
                      {loc.hotspotData && (
                        <div className="bg-[#FFE4E6] border border-[#FECDD3] rounded-xl p-3 mb-3 text-xs">
                          <div className="flex items-center justify-between font-bold text-[#BE123C] mb-1">
                            <span>Issue: {loc.hotspotData.issueType}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-white rounded-full">
                              {loc.hotspotData.status}
                            </span>
                          </div>
                          <p className="text-[#881337] line-clamp-2">{loc.hotspotData.description}</p>
                        </div>
                      )}

                      {/* Specific Materials chips */}
                      {loc.specificMaterials && loc.specificMaterials.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {loc.specificMaterials.slice(0, 4).map((m, mIdx) => (
                            <span
                              key={mIdx}
                              className="text-[10px] font-medium bg-[#F4F6F8] text-[#253247] px-2 py-0.5 rounded-md border border-[#E3E8EF]"
                            >
                              {m}
                            </span>
                          ))}
                          {loc.specificMaterials.length > 4 && (
                            <span className="text-[10px] text-[#718096] font-semibold self-center">
                              +{loc.specificMaterials.length - 4} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Pricing / Notes */}
                      {loc.pricingNote && (
                        <p className="text-[11px] text-[#253247] bg-[#F4F6F8] p-2 rounded-lg border border-[#E3E8EF] mb-3">
                          <span className="font-bold text-[#111C2E]">Pricing / Commercial: </span>
                          {loc.pricingNote}
                        </p>
                      )}

                      {/* Card Action Row */}
                      <div className="pt-3 border-t border-[#E3E8EF] flex items-center gap-2">
                        <a
                          href={directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#19B5A5] hover:bg-[#138D81] text-white text-xs font-bold transition-colors"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          Directions in Google Maps
                        </a>

                        {loc.contactPhone && (
                          <a
                            href={`tel:${loc.contactPhone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-xl bg-[#F4F6F8] border border-[#E3E8EF] hover:border-[#111C2E] text-[#111C2E] transition-colors"
                            title="Call Phone"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        )}

                        {loc.whatsappNumber && (
                          <a
                            href={`https://wa.me/${loc.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello,%20I%20found%20you%20on%20PrithveX%20and%20want%20to%20channelize%20segregated%20materials`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-xl bg-[#F4F6F8] border border-[#E3E8EF] hover:border-[#16A34A] text-[#16A34A] transition-colors"
                            title="WhatsApp Chat"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>
                        )}

                        {loc.website && (
                          <a
                            href={loc.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-xl bg-[#F4F6F8] border border-[#E3E8EF] hover:border-[#111C2E] text-[#718096] hover:text-[#111C2E] transition-colors"
                            title="Official Website"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Smart Waste Matching Engine Modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111C2E]/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-4xl my-8">
            <button
              onClick={() => setIsWizardOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-[#111C2E] text-white rounded-full hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <SmartMatchingWizard
              locations={allLocations}
              onSelectLocation={(loc) => {
                setSelectedLocation(loc);
                setIsWizardOpen(false);
                setCenterCoords({ lat: loc.lat, lng: loc.lng, zoom: 14 });
              }}
              onNavigateToMap={() => setIsWizardOpen(false)}
              userCoords={userCoords}
            />
          </div>
        </div>
      )}
    </div>
  );
};
