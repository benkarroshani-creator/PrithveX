import React, { useState, useEffect, useMemo } from 'react';
import { 
  Store, 
  Search, 
  Plus, 
  Filter, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Calendar, 
  Tag, 
  Package, 
  Truck, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { MarketplaceListing, WasteCategory, MarketplaceEnquiry } from '../types';
import { 
  getMarketplaceListings, 
  subscribeToMarketplaceListings, 
  addMarketplaceListing, 
  submitMarketplaceEnquiry, 
  toggleSavedItem, 
  getUserProfile 
} from '../services/storageService';
import { CITIES_LIST } from '../data/recyclers';

interface MarketplacePageProps {
  onNavigate?: (tab: string) => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ onNavigate }) => {
  const [listings, setListings] = useState<MarketplaceListing[]>(getMarketplaceListings());
  const [activeTab, setActiveTab] = useState<'sell' | 'buy'>('sell');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  
  // Bookmarked listings
  const [savedListingIds, setSavedListingIds] = useState<string[]>(
    getUserProfile().savedListingIds || []
  );

  // Post Listing Modal
  const [showPostModal, setShowPostModal] = useState(false);
  const [postType, setPostType] = useState<'sell' | 'buy'>('sell');
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState<WasteCategory>('plastic');
  const [postMaterialType, setPostMaterialType] = useState('');
  const [postQuantity, setPostQuantity] = useState<number>(50);
  const [postUnit, setPostUnit] = useState<'kg' | 'tonnes' | 'pieces' | 'bundles' | 'bags'>('kg');
  const [postCondition, setPostCondition] = useState<MarketplaceListing['condition']>('Clean & Baled');
  const [postPrice, setPostPrice] = useState('');
  const [postCity, setPostCity] = useState('Bengaluru');
  const [postLocality, setPostLocality] = useState('');
  const [postState, setPostState] = useState('Karnataka');
  const [postLogistics, setPostLogistics] = useState<MarketplaceListing['pickupOrDelivery']>('Pickup only');
  const [postName, setPostName] = useState('');
  const [postPhone, setPostPhone] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postWhatsapp, setPostWhatsapp] = useState(true);
  const [postSuccess, setPostSuccess] = useState(false);

  // Enquiry Modal
  const [enquiryModalListing, setEnquiryModalListing] = useState<MarketplaceListing | null>(null);
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryContact, setEnquiryContact] = useState('');
  const [enquiryOffer, setEnquiryOffer] = useState('');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToMarketplaceListings((loaded) => {
      setListings(loaded);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleSave = (listingId: string) => {
    const isSaved = toggleSavedItem('listing', listingId);
    if (isSaved) {
      setSavedListingIds((prev) => [...prev, listingId]);
    } else {
      setSavedListingIds((prev) => prev.filter((id) => id !== listingId));
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    await addMarketplaceListing({
      type: postType,
      title: postTitle,
      category: postCategory,
      materialType: postMaterialType,
      quantity: Number(postQuantity),
      unit: postUnit,
      condition: postCondition,
      description: postDescription,
      expectedPrice: postPrice || 'Negotiable',
      city: postCity,
      locality: postLocality || postCity,
      state: postState,
      pickupOrDelivery: postLogistics,
      contactName: postName || 'Anonymous Member',
      contactPhone: postPhone,
      whatsappPreferred: postWhatsapp,
      status: 'available',
      userId: 'citizen-user',
    });

    setPostSuccess(true);
    setTimeout(() => {
      setShowPostModal(false);
      setPostTitle('');
      setPostMaterialType('');
      setPostDescription('');
      setPostPrice('');
      setPostSuccess(false);
    }, 2000);
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryModalListing) return;

    await submitMarketplaceEnquiry({
      listingId: enquiryModalListing.id,
      senderName: enquiryName,
      senderContact: enquiryContact,
      offeredPrice: enquiryOffer,
      message: enquiryMessage,
    });

    setEnquirySuccess(true);
    setTimeout(() => {
      setEnquiryModalListing(null);
      setEnquiryName('');
      setEnquiryContact('');
      setEnquiryOffer('');
      setEnquiryMessage('');
      setEnquirySuccess(false);
    }, 2000);
  };

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchesType = item.type === activeTab;
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesCity = selectedCity === 'All Cities' || item.city.toLowerCase() === selectedCity.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.materialType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesCategory && matchesCity && matchesSearch;
    });
  }, [listings, activeTab, selectedCategory, selectedCity, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-medium tracking-wide uppercase mb-3">
                <Store className="w-3.5 h-3.5" />
                Circular Waste Exchange
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                PrithveX Waste Marketplace
              </h1>
              <p className="mt-2 text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
                Connect directly with apartments, recyclers, and scrap aggregators. List segregated recyclables for sale or post bulk raw material procurement requirements.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setPostType('sell');
                  setShowPostModal(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Post Waste For Sale
              </button>
              <button
                onClick={() => {
                  setPostType('buy');
                  setShowPostModal(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-medium text-sm transition-colors"
              >
                <TrendingUp className="w-4 h-4 text-teal-400" />
                Post Buying Requirement
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Fair-Trade Guidelines */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex items-center bg-slate-200/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('sell')}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'sell'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4 text-emerald-600" />
              Available Waste Offers (I Have Waste to Sell)
            </button>
            <button
              onClick={() => setActiveTab('buy')}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'buy'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-teal-600" />
              Buyer Procurement Requests (Looking to Buy)
            </button>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 flex items-center gap-3 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0" />
            <div>
              <span className="font-bold">Trade Safe:</span> Always verify tare weight on certified digital scales before payment. PrithveX does not charge seller commission.
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 sm:p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search listings by material (e.g. PET, Cardboard, Copper), locality..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              >
                {CITIES_LIST.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              >
                <option value="all">All Categories</option>
                <option value="plastic">Plastics (PET, HDPE, PP)</option>
                <option value="paper">Paper & Cardboard (OCC)</option>
                <option value="metal">Metals (Aluminium, Steel, Copper)</option>
                <option value="e_waste">E-Waste & Electronics</option>
                <option value="used_cooking_oil">Used Cooking Oil (RUCO)</option>
                <option value="textile">Textiles & Fabric</option>
                <option value="dry_recyclable">Mixed Dry Recyclables</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Listing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-slate-600">
            Showing <span className="font-semibold text-slate-900">{filteredListings.length}</span> active {activeTab === 'sell' ? 'waste offers' : 'procurement requirements'}
          </p>
        </div>

        {filteredListings.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-900">No active listings found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Be the first to post your recyclable materials or procurement requirement in this category.
            </p>
            <button
              onClick={() => {
                setShowPostModal(true);
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-600 rounded-lg"
            >
              Post First Listing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              const isSaved = savedListingIds.includes(listing.id);
              const whatsappUrl = listing.contactPhone
                ? `https://wa.me/${listing.contactPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello ${listing.contactName}, I saw your listing on PrithveX: "${listing.title}". Is it still available?`
                  )}`
                : null;

              return (
                <div
                  key={listing.id}
                  className="bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="p-5">
                    {/* Top Row: Type and Condition Badges */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide ${
                            listing.type === 'sell'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-teal-100 text-teal-800'
                          }`}
                        >
                          {listing.type === 'sell' ? 'For Sale' : 'Looking to Buy'}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {listing.condition}
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleSave(listing.id)}
                        className={`p-1.5 rounded-md border text-slate-400 hover:text-slate-700 transition-colors ${
                          isSaved ? 'text-teal-700 bg-teal-50 border-teal-300' : 'border-slate-200'
                        }`}
                        title={isSaved ? 'Saved' : 'Save listing'}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Bookmark className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {listing.title}
                    </h3>

                    {/* Quantity & Expected Price */}
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 uppercase font-semibold block">
                          Quantity:
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          {listing.quantity} {listing.unit}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 uppercase font-semibold block">
                          Expected Price:
                        </span>
                        <span className="text-sm font-bold text-emerald-700">
                          {listing.expectedPrice || 'Negotiable'}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {listing.description}
                    </p>

                    {/* Meta Info */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">
                          {listing.locality}, {listing.city}, {listing.state}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{listing.pickupOrDelivery}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>Posted by: {listing.contactName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 rounded-b-xl flex items-center justify-between gap-2">
                    <button
                      onClick={() => setEnquiryModalListing(listing)}
                      className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-colors"
                    >
                      Send Offer / Enquire
                    </button>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${listing.contactPhone}`}
                        className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Call"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>

                      {whatsappUrl && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                          title="WhatsApp Chat"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Post Listing Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {postType === 'sell' ? 'Post Waste For Sale' : 'Post Material Buying Requirement'}
              </h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {postSuccess ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <p className="text-base font-bold text-slate-900">Listing Published!</p>
                <p className="text-xs text-slate-500 mt-1">
                  Your listing is live on the marketplace. Verified recyclers and aggregators can now contact you.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
                {/* Type selector */}
                <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setPostType('sell')}
                    className={`flex-1 py-1.5 font-semibold rounded-md ${
                      postType === 'sell' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-600'
                    }`}
                  >
                    I Have Waste to Sell
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostType('buy')}
                    className={`flex-1 py-1.5 font-semibold rounded-md ${
                      postType === 'buy' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-600'
                    }`}
                  >
                    I Am Looking to Buy
                  </button>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Listing Title *
                  </label>
                  <input
                    required
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="E.g., 80 kg Baled PET Bottles or 400 kg OCC Cardboard"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                    <select
                      value={postCategory}
                      onChange={(e) => setPostCategory(e.target.value as WasteCategory)}
                      className="w-full px-2.5 py-2 border border-slate-200 rounded-lg focus:outline-none"
                    >
                      <option value="plastic">Plastic</option>
                      <option value="paper">Paper & Cardboard</option>
                      <option value="metal">Metal</option>
                      <option value="e_waste">E-Waste</option>
                      <option value="used_cooking_oil">Used Cooking Oil</option>
                      <option value="textile">Textile</option>
                      <option value="dry_recyclable">Dry Recyclable</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Condition *</label>
                    <select
                      value={postCondition}
                      onChange={(e) => setPostCondition(e.target.value as any)}
                      className="w-full px-2.5 py-2 border border-slate-200 rounded-lg focus:outline-none"
                    >
                      <option value="Clean & Baled">Clean & Baled</option>
                      <option value="Segregated & Rinsed">Segregated & Rinsed</option>
                      <option value="Mixed Scrap Lot">Mixed Scrap Lot</option>
                      <option value="Grade A Recyclable">Grade A Recyclable</option>
                      <option value="Refurbishable">Refurbishable</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Quantity & Unit *</label>
                    <div className="flex gap-2">
                      <input
                        required
                        type="number"
                        min="1"
                        value={postQuantity}
                        onChange={(e) => setPostQuantity(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                      />
                      <select
                        value={postUnit}
                        onChange={(e) => setPostUnit(e.target.value as any)}
                        className="px-2 py-2 border border-slate-200 rounded-lg focus:outline-none"
                      >
                        <option value="kg">kg</option>
                        <option value="tonnes">tonnes</option>
                        <option value="pieces">pieces</option>
                        <option value="bundles">bundles</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Expected Price</label>
                    <input
                      type="text"
                      value={postPrice}
                      onChange={(e) => setPostPrice(e.target.value)}
                      placeholder="E.g., ₹18/kg or Free"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">City *</label>
                    <input
                      required
                      type="text"
                      value={postCity}
                      onChange={(e) => setPostCity(e.target.value)}
                      className="w-full px-2.5 py-2 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Locality *</label>
                    <input
                      required
                      type="text"
                      value={postLocality}
                      onChange={(e) => setPostLocality(e.target.value)}
                      placeholder="E.g. Indiranagar"
                      className="w-full px-2.5 py-2 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Logistics</label>
                    <select
                      value={postLogistics}
                      onChange={(e) => setPostLogistics(e.target.value as any)}
                      className="w-full px-2 py-2 border border-slate-200 rounded-lg focus:outline-none"
                    >
                      <option value="Pickup only">Pickup only</option>
                      <option value="Delivery available">Delivery</option>
                      <option value="Flexible / Negotiable">Negotiable</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={postDescription}
                    onChange={(e) => setPostDescription(e.target.value)}
                    placeholder="Describe cleanliness, packaging, loading accessibility, or payment expectations."
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Name *</label>
                    <input
                      required
                      type="text"
                      value={postName}
                      onChange={(e) => setPostName(e.target.value)}
                      placeholder="E.g. Suresh Kumar"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Contact Phone *</label>
                    <input
                      required
                      type="text"
                      value={postPhone}
                      onChange={(e) => setPostPhone(e.target.value)}
                      placeholder="+91 98450 12345"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="px-3 py-2 font-medium text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-xs"
                  >
                    Publish Listing
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Enquiry Modal */}
      {enquiryModalListing && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Contact Seller / Make an Offer
              </h3>
              <button
                onClick={() => setEnquiryModalListing(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {enquirySuccess ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-900">Enquiry Dispatched!</p>
                <p className="text-xs text-slate-500 mt-1">
                  The lister has been notified of your proposal. You can also contact them directly on WhatsApp.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-3.5 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-semibold text-slate-900 block truncate">
                    {enquiryModalListing.title}
                  </span>
                  <span className="text-slate-500">
                    {enquiryModalListing.quantity} {enquiryModalListing.unit} · {enquiryModalListing.city}
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Name *</label>
                  <input
                    required
                    type="text"
                    value={enquiryName}
                    onChange={(e) => setEnquiryName(e.target.value)}
                    placeholder="E.g., Arvind Sharma (Recycling Aggregator)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Phone / WhatsApp *</label>
                    <input
                      required
                      type="text"
                      value={enquiryContact}
                      onChange={(e) => setEnquiryContact(e.target.value)}
                      placeholder="+91 98450 12345"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Offered Price (Optional)</label>
                    <input
                      type="text"
                      value={enquiryOffer}
                      onChange={(e) => setEnquiryOffer(e.target.value)}
                      placeholder="E.g., ₹20/kg"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Message *</label>
                  <textarea
                    required
                    rows={3}
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    placeholder="Specify when you can inspect/pickup, vehicle capacity, or digital weighing scale details."
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEnquiryModalListing(null)}
                    className="px-3 py-2 font-medium text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                  >
                    Send Enquiry
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
