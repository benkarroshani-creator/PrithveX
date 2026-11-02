import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  MapPin, 
  Phone, 
  Globe, 
  MessageSquare, 
  ShieldCheck, 
  Bookmark, 
  BookmarkCheck, 
  AlertCircle, 
  ExternalLink, 
  Filter, 
  Clock, 
  Scale, 
  Coins, 
  Plus, 
  Truck, 
  Store, 
  CheckCircle2, 
  X,
  HelpCircle
} from 'lucide-react';
import { WasteBuyer, WasteCategory, DirectoryCorrection } from '../types';
import { 
  getWasteBuyers, 
  subscribeToWasteBuyers, 
  toggleSavedItem, 
  getUserProfile, 
  submitDirectoryCorrection 
} from '../services/storageService';
import { BUYER_MATERIAL_CATEGORIES } from '../data/buyers';
import { CITIES_LIST } from '../data/recyclers';

interface BuyersPageProps {
  onNavigate?: (tab: string) => void;
}

export const BuyersPage: React.FC<BuyersPageProps> = ({ onNavigate }) => {
  const [buyers, setBuyers] = useState<WasteBuyer[]>(getWasteBuyers());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedBusinessType, setSelectedBusinessType] = useState('all');
  const [onlyPickup, setOnlyPickup] = useState(false);
  
  // User saved buyers
  const [savedBuyerIds, setSavedBuyerIds] = useState<string[]>(
    getUserProfile().savedBuyerIds || []
  );

  // Suggest Correction modal
  const [correctionModalBuyer, setCorrectionModalBuyer] = useState<WasteBuyer | null>(null);
  const [correctionNote, setCorrectionNote] = useState('');
  const [correctionContact, setCorrectionContact] = useState('');
  const [correctionSuccess, setCorrectionSuccess] = useState(false);

  // Register Buyer modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regName, setRegName] = useState('');
  const [regType, setRegType] = useState('Scrap Merchant / Aggregator');
  const [regCity, setRegCity] = useState('Bengaluru');
  const [regMaterials, setRegMaterials] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToWasteBuyers((loaded) => {
      setBuyers(loaded);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleSave = (buyerId: string) => {
    const isSaved = toggleSavedItem('buyer', buyerId);
    if (isSaved) {
      setSavedBuyerIds((prev) => [...prev, buyerId]);
    } else {
      setSavedBuyerIds((prev) => prev.filter((id) => id !== buyerId));
    }
  };

  const handleCorrectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionModalBuyer) return;

    await submitDirectoryCorrection({
      targetType: 'buyer',
      targetId: correctionModalBuyer.id,
      targetName: correctionModalBuyer.name,
      city: correctionModalBuyer.city,
      state: correctionModalBuyer.state,
      notes: correctionNote,
      reporterContact: correctionContact,
    });

    setCorrectionSuccess(true);
    setTimeout(() => {
      setCorrectionModalBuyer(null);
      setCorrectionNote('');
      setCorrectionContact('');
      setCorrectionSuccess(false);
    }, 2200);
  };

  const handleRegisterBuyerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitDirectoryCorrection({
      targetType: 'buyer',
      targetName: regName,
      suggestedName: regName,
      city: regCity,
      state: 'India',
      suggestedCategory: regMaterials,
      notes: `New Buyer Application: Type: ${regType}, Materials: ${regMaterials}, Contact: ${regPhone}`,
      reporterContact: regPhone,
    });

    setRegSuccess(true);
    setTimeout(() => {
      setShowRegisterModal(false);
      setRegName('');
      setRegMaterials('');
      setRegPhone('');
      setRegSuccess(false);
    }, 2200);
  };

  const filteredBuyers = useMemo(() => {
    return buyers.filter((buyer) => {
      const matchesSearch =
        buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buyer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buyer.acceptedMaterials.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (buyer.district && buyer.district.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' ||
        buyer.materialCategories.includes(selectedCategory as WasteCategory);

      const matchesCity =
        selectedCity === 'All Cities' || buyer.city.toLowerCase() === selectedCity.toLowerCase();

      const matchesBusinessType =
        selectedBusinessType === 'all' || buyer.businessType === selectedBusinessType;

      const matchesPickup = !onlyPickup || buyer.pickupAvailable;

      return matchesSearch && matchesCategory && matchesCity && matchesBusinessType && matchesPickup;
    });
  }, [buyers, searchQuery, selectedCategory, selectedCity, selectedBusinessType, onlyPickup]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Page Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-800 border border-slate-700 text-teal-400 text-xs font-medium tracking-wide uppercase mb-3">
                <Coins className="w-3.5 h-3.5" />
                Circular Recovery Network
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Waste Buyers & Aggregators
              </h1>
              <p className="mt-2 text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
                Connect with verified bulk scrap aggregators, polymer recovery plants, EPR fulfillment agencies, and certified electronic dismantlers purchasing post-consumer waste.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowRegisterModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-slate-950 font-semibold text-sm transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                List as Waste Buyer
              </button>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('marketplace')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-medium text-sm transition-colors"
                >
                  <Store className="w-4 h-4 text-emerald-400" />
                  Visit P2P Marketplace
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Transparency & Commodity Disclaimer Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <span className="font-semibold text-amber-950">Market Rates Notice:</span> Indicative rates shown are compiled from verified aggregator manifests and field audits. Because global and domestic spot commodity prices fluctuate with crude oil, recycled pulp, and metal indices, <strong className="font-semibold">always confirm final spot rates with the buyer before dispatching materials</strong>.
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 sm:p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by buyer name, material (e.g. PET, Cardboard, Copper), or district..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
            </div>

            {/* City */}
            <div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              >
                {CITIES_LIST.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Business Type */}
            <div>
              <select
                value={selectedBusinessType}
                onChange={(e) => setSelectedBusinessType(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              >
                <option value="all">All Business Types</option>
                <option value="Social Enterprise">Social Enterprise</option>
                <option value="Authorized Recycler">Authorized Recycler</option>
                <option value="Scrap Merchant / Aggregator">Scrap Merchant / Aggregator</option>
                <option value="EPR Fulfillment Agency">EPR Fulfillment Agency</option>
                <option value="Industrial Processor">Industrial Processor</option>
              </select>
            </div>
          </div>

          {/* Material Category Pills */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Material:
            </span>
            {BUYER_MATERIAL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}

            <label className="ml-auto inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 py-1">
              <input
                type="checkbox"
                checked={onlyPickup}
                onChange={(e) => setOnlyPickup(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <Truck className="w-3.5 h-3.5 text-slate-500" />
              Doorstep Pickup Available
            </label>
          </div>
        </div>
      </div>

      {/* Directory Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-slate-600">
            Showing <span className="font-semibold text-slate-900">{filteredBuyers.length}</span> verified buyers & recovery hubs
          </p>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            CPCB / SPCB Registered & Field Verified
          </div>
        </div>

        {filteredBuyers.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-900">No buyers found matching your criteria</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Try adjusting your material filter or selecting "All Cities" to discover regional recovery centers.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedCity('All Cities');
                setSelectedBusinessType('all');
                setOnlyPickup(false);
              }}
              className="mt-4 px-4 py-2 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBuyers.map((buyer) => {
              const isSaved = savedBuyerIds.includes(buyer.id);
              const whatsappUrl = buyer.whatsappNumber
                ? `https://wa.me/${buyer.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello ${buyer.name}, I found your contact on PrithveX. I would like to enquire about selling segregated waste.`
                  )}`
                : null;

              return (
                <div
                  key={buyer.id}
                  className="bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="p-5 sm:p-6">
                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase bg-slate-100 text-slate-700 border border-slate-200">
                            {buyer.businessType}
                          </span>
                          {buyer.isVerified && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-teal-700 bg-teal-50 border border-teal-200">
                              <ShieldCheck className="w-3 h-3" />
                              {buyer.verificationStatus}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 leading-snug">
                          {buyer.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>
                            {buyer.district ? `${buyer.district}, ` : ''}{buyer.city}, {buyer.state}
                          </span>
                        </div>
                      </div>

                      {/* Bookmark Button */}
                      <button
                        onClick={() => handleToggleSave(buyer.id)}
                        title={isSaved ? 'Remove from saved' : 'Save buyer'}
                        className={`p-2 rounded-lg border transition-colors ${
                          isSaved
                            ? 'bg-teal-50 border-teal-300 text-teal-700'
                            : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4 h-4 fill-current" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {buyer.description}
                    </p>

                    {/* Key Attributes Box */}
                    <div className="mt-4 p-3.5 bg-slate-50 rounded-lg border border-slate-100 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">Indicative Payout:</span>
                        <span className="font-bold text-emerald-700 text-xs sm:text-sm">
                          {buyer.pricingIndicative}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Min. Quantity:</span>
                        <span className="font-semibold text-slate-800">
                          {buyer.minimumQuantity}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Logistics:</span>
                        <span className="font-medium text-slate-700 flex items-center gap-1">
                          {buyer.pickupAvailable ? 'Doorstep pickup' : 'Drop-off / Self-delivery'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Operating Hours:</span>
                        <span className="font-medium text-slate-700 truncate block">
                          {buyer.operatingHours}
                        </span>
                      </div>
                    </div>

                    {/* Accepted Materials Chips */}
                    <div className="mt-3.5">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
                        Materials Accepted:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {buyer.acceptedMaterials.map((mat, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                          >
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Verification Source */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="truncate max-w-[280px]">
                        Audit Source: {buyer.sourceOfInformation}
                      </span>
                      <span>Verified: {buyer.lastVerifiedDate}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 rounded-b-xl flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${buyer.contactPhone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-medium shadow-2xs transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-600" />
                        Call
                      </a>

                      {whatsappUrl && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          WhatsApp
                        </a>
                      )}

                      {buyer.website && (
                        <a
                          href={buyer.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-slate-500 hover:text-slate-800 text-xs transition-colors"
                          title="Visit Website"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => setCorrectionModalBuyer(buyer)}
                      className="text-xs text-slate-500 hover:text-slate-900 underline underline-offset-2 transition-colors"
                    >
                      Report Rate / Detail Update
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Suggest Correction Modal */}
      {correctionModalBuyer && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Update Information: {correctionModalBuyer.name}
              </h3>
              <button
                onClick={() => setCorrectionModalBuyer(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {correctionSuccess ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-900">Thank you for your update!</p>
                <p className="text-xs text-slate-500 mt-1">
                  Our verification desk will audit the details and update the directory within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCorrectionSubmit} className="space-y-4">
                <p className="text-xs text-slate-600">
                  Help the community keep scrap prices and contact numbers accurate. Describe any change in rates, operational address, or accepted materials.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Details to correct or updated rate info *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={correctionNote}
                    onChange={(e) => setCorrectionNote(e.target.value)}
                    placeholder="E.g., They now accept PET bottles at ₹18/kg. Doorstep minimum is currently 20 kg."
                    className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Phone / Email (Optional, for verification)
                  </label>
                  <input
                    type="text"
                    value={correctionContact}
                    onChange={(e) => setCorrectionContact(e.target.value)}
                    placeholder="E.g., +91 98450 12345 or user@example.com"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCorrectionModalBuyer(null)}
                    className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                  >
                    Submit Correction
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Register Buyer Application Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                List as an Authorized Waste Buyer
              </h3>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {regSuccess ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-900">Application Received!</p>
                <p className="text-xs text-slate-500 mt-1">
                  Our verification officer will verify your GST / CPCB credentials and publish your enterprise profile.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterBuyerSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Enterprise / Agency Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="E.g. CleanLoop Scrap Aggregators"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Business Type
                    </label>
                    <select
                      value={regType}
                      onChange={(e) => setRegType(e.target.value)}
                      className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg focus:outline-none"
                    >
                      <option value="Scrap Merchant / Aggregator">Scrap Merchant</option>
                      <option value="Authorized Recycler">Authorized Recycler</option>
                      <option value="EPR Fulfillment Agency">EPR Agency</option>
                      <option value="Industrial Processor">Processor</option>
                      <option value="Social Enterprise">Social Enterprise</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary City *
                    </label>
                    <input
                      required
                      type="text"
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      placeholder="E.g. Bengaluru"
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Materials You Procure *
                  </label>
                  <input
                    required
                    type="text"
                    value={regMaterials}
                    onChange={(e) => setRegMaterials(e.target.value)}
                    placeholder="E.g. PET bottles, OCC Cardboard, Copper wire"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp / Business Phone *
                  </label>
                  <input
                    required
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-slate-950 bg-teal-500 hover:bg-teal-600 rounded-lg shadow-xs"
                  >
                    Submit for Verification
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
