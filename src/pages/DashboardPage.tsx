import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  Bookmark, 
  Coins, 
  Store, 
  MapPin, 
  ExternalLink, 
  Phone, 
  Compass,
  Layers
} from 'lucide-react';
import { UserProfile, CircularityLocation } from '../types';
import { RECYCLERS } from '../data/recyclers';
import { WASTE_BUYERS } from '../data/buyers';
import { INITIAL_MARKETPLACE_LISTINGS } from '../data/marketplaceData';
import { getBaseCircularityLocations } from '../data/circularityLocations';

interface DashboardPageProps {
  user: UserProfile;
  onNavigate: (tab: string, filter?: string) => void;
  onOpenAuth: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  onNavigate,
  onOpenAuth
}) => {
  const [activeBookmarkTab, setActiveBookmarkTab] = useState<'recyclers' | 'buyers' | 'marketplace' | 'locations'>('recyclers');
  const [savedMapLocations, setSavedMapLocations] = useState<CircularityLocation[]>([]);

  const savedRecyclers = RECYCLERS.filter((r) => (user.savedRecyclerIds || []).includes(r.id));
  const savedBuyers = WASTE_BUYERS.filter((b) => (user.savedBuyerIds || []).includes(b.id));
  const savedListings = INITIAL_MARKETPLACE_LISTINGS.filter((l) => (user.savedListingIds || []).includes(l.id));

  useEffect(() => {
    try {
      const raw = localStorage.getItem('prithvex_saved_locations');
      const savedIds: string[] = raw ? JSON.parse(raw) : [];
      const allLocs = getBaseCircularityLocations();
      setSavedMapLocations(allLocs.filter((l) => savedIds.includes(l.id)));
    } catch {
      setSavedMapLocations([]);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-[#F4F6F8]">
      {/* Citizen Profile Header */}
      <div className="bg-[#111C2E] text-white rounded-2xl p-6 sm:p-8 border border-[#253247] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#19B5A5]/20 text-[#19B5A5] font-black text-2xl flex items-center justify-center border border-[#19B5A5]/40 shadow-inner">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">{user.name}</h1>
              <span className="text-[11px] font-mono text-[#19B5A5] bg-[#19B5A5]/15 px-2.5 py-0.5 rounded-full border border-[#19B5A5]/30">
                Verified Citizen
              </span>
            </div>
            <p className="text-xs text-[#E3E8EF] mt-0.5">
              {user.email} · {user.city}
            </p>
            <p className="text-[11px] text-[#718096] mt-1 font-medium">
              Active circular contributor since {new Date(user.joinedDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('map')}
            className="px-4 py-2.5 bg-[#19B5A5] hover:bg-[#138D81] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Circularity Map</span>
          </button>
          <button
            onClick={() => onNavigate('identify')}
            className="px-4 py-2.5 bg-[#7667E8] hover:bg-[#5B4DE0] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Identify Waste</span>
          </button>
          <button
            onClick={onOpenAuth}
            className="px-3.5 py-2.5 border border-[#253247] hover:border-[#E3E8EF] text-[#E3E8EF] hover:text-white font-semibold rounded-xl text-xs transition-colors"
          >
            Account Settings
          </button>
        </div>
      </div>

      {/* Primary Impact Metrics - Segmented */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#111C2E]">
              Personal Environmental Balance Sheet
            </h2>
            <p className="text-xs text-[#718096]">
              Segregated breakdown across AI identification, verified disposal, reuse, donation, and scrap sales
            </p>
          </div>
          <span className="text-[11px] text-[#19B5A5] font-mono font-semibold">
            Synced with Real-Time Database
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-[#E3E8EF] shadow-sm">
            <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wider block">
              Items Identified
            </span>
            <p className="text-2xl font-extrabold text-[#7667E8] mt-1 tabular-nums">
              {user.stats.itemsIdentified || 0}
            </p>
            <p className="text-[11px] text-[#718096] mt-0.5">Vision AI scans</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E3E8EF] shadow-sm">
            <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wider block">
              Items Segregated
            </span>
            <p className="text-2xl font-extrabold text-[#19B5A5] mt-1 tabular-nums">
              {user.stats.itemsSegregated || user.stats.itemsIdentified || 0}
            </p>
            <p className="text-[11px] text-[#718096] mt-0.5">Disposed in bins</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E3E8EF] shadow-sm">
            <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wider block">
              Items Reused / Fixed
            </span>
            <p className="text-2xl font-extrabold text-[#0284C7] mt-1 tabular-nums">
              {user.stats.itemsReused || 0}
            </p>
            <p className="text-[11px] text-[#718096] mt-0.5">Upcycled locally</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E3E8EF] shadow-sm">
            <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wider block">
              Items Donated
            </span>
            <p className="text-2xl font-extrabold text-[#EA580C] mt-1 tabular-nums">
              {user.stats.itemsDonated || 0}
            </p>
            <p className="text-[11px] text-[#718096] mt-0.5">Goonj & NGOs</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E3E8EF] shadow-sm">
            <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wider block">
              Scrap Sold
            </span>
            <p className="text-2xl font-extrabold text-[#E8A84E] mt-1 tabular-nums">
              {user.stats.itemsSold || 0}
            </p>
            <p className="text-[11px] text-[#718096] mt-0.5">To Aggregators</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E3E8EF] shadow-sm">
            <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wider block">
              Diverted Mass
            </span>
            <p className="text-2xl font-extrabold text-[#111C2E] mt-1 tabular-nums">
              {user.stats.wasteDivertedKg}{' '}
              <span className="text-xs font-normal text-[#718096]">kg</span>
            </p>
            <p className="text-[11px] text-[#19B5A5] font-semibold mt-0.5">Saved from landfills</p>
          </div>
        </div>
      </div>

      {/* Bookmarked / Saved Items Section */}
      <div className="bg-white rounded-2xl border border-[#E3E8EF] p-6 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E3E8EF] pb-4">
          <div>
            <h3 className="font-extrabold text-[#111C2E] text-sm flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#19B5A5]" />
              <span>Saved Facilities, Map Points & Marketplace Listings</span>
            </h3>
            <p className="text-xs text-[#718096] mt-0.5">
              Quick access to your preferred circular hubs, scrap merchants, and saved listings
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-[#F4F6F8] p-1 rounded-xl text-xs font-semibold border border-[#E3E8EF]">
            <button
              onClick={() => setActiveBookmarkTab('locations')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeBookmarkTab === 'locations'
                  ? 'bg-white text-[#111C2E] shadow-sm font-bold'
                  : 'text-[#718096] hover:text-[#111C2E]'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#19B5A5]" />
              Map Hubs ({savedMapLocations.length})
            </button>
            <button
              onClick={() => setActiveBookmarkTab('recyclers')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeBookmarkTab === 'recyclers'
                  ? 'bg-white text-[#111C2E] shadow-sm font-bold'
                  : 'text-[#718096] hover:text-[#111C2E]'
              }`}
            >
              Recyclers ({savedRecyclers.length})
            </button>
            <button
              onClick={() => setActiveBookmarkTab('buyers')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeBookmarkTab === 'buyers'
                  ? 'bg-white text-[#111C2E] shadow-sm font-bold'
                  : 'text-[#718096] hover:text-[#111C2E]'
              }`}
            >
              Buyers ({savedBuyers.length})
            </button>
            <button
              onClick={() => setActiveBookmarkTab('marketplace')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeBookmarkTab === 'marketplace'
                  ? 'bg-white text-[#111C2E] shadow-sm font-bold'
                  : 'text-[#718096] hover:text-[#111C2E]'
              }`}
            >
              Marketplace ({savedListings.length})
            </button>
          </div>
        </div>

        {/* Tab Content: Saved Map Locations */}
        {activeBookmarkTab === 'locations' && (
          <div>
            {savedMapLocations.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#718096]">
                You haven't bookmarked any map locations yet. Explore the{' '}
                <button
                  onClick={() => onNavigate('map')}
                  className="text-[#19B5A5] underline font-bold"
                >
                  Circularity Map
                </button>{' '}
                and tap the bookmark icon on any facility card.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedMapLocations.map((loc) => {
                  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;
                  return (
                    <div key={loc.id} className="p-4 rounded-xl border border-[#E3E8EF] bg-[#F4F6F8] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#111C2E] border border-[#E3E8EF]">
                            {loc.categoryLabel}
                          </span>
                          {loc.isVerified && (
                            <span className="text-[10px] font-bold text-[#138D81]">✓ Verified</span>
                          )}
                        </div>
                        <h4 className="font-bold text-xs text-[#111C2E]">{loc.name}</h4>
                        <p className="text-[11px] text-[#718096] mt-0.5">{loc.locality ? `${loc.locality}, ` : ''}{loc.city}</p>
                        {loc.pricingNote && (
                          <p className="text-[11px] text-[#253247] mt-2 line-clamp-1">
                            <span className="font-bold">Commercials:</span> {loc.pricingNote}
                          </p>
                        )}
                      </div>
                      <div className="pt-3 border-t border-[#E3E8EF] mt-3 flex items-center justify-between gap-2">
                        <a
                          href={directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-[#19B5A5] font-bold inline-flex items-center gap-1 hover:underline"
                        >
                          <Compass className="w-3 h-3" />
                          <span>Google Maps</span>
                        </a>
                        <button
                          onClick={() => onNavigate('map')}
                          className="text-[11px] text-[#111C2E] font-semibold inline-flex items-center gap-1 hover:underline"
                        >
                          <span>View on Map</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Recyclers */}
        {activeBookmarkTab === 'recyclers' && (
          <div>
            {savedRecyclers.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#718096]">
                You haven't saved any recyclers yet. Click the bookmark icon on any facility card in the{' '}
                <button
                  onClick={() => onNavigate('recyclers')}
                  className="text-[#19B5A5] underline font-bold"
                >
                  Recycler Directory
                </button>
                .
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedRecyclers.map((r) => (
                  <div key={r.id} className="p-4 rounded-xl border border-[#E3E8EF] bg-[#F4F6F8] flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-[#111C2E]">{r.name}</h4>
                      <p className="text-[11px] text-[#718096] mt-0.5">{r.city}, {r.state}</p>
                      <p className="text-[11px] text-[#253247] line-clamp-2 mt-2">{r.notes}</p>
                    </div>
                    <div className="pt-3 border-t border-[#E3E8EF] mt-3 flex items-center justify-between">
                      <a href={`tel:${r.contactPhone}`} className="text-[11px] text-[#253247] font-semibold inline-flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#718096]" />
                        <span>{r.contactPhone}</span>
                      </a>
                      <button
                        onClick={() => onNavigate('recyclers')}
                        className="text-[11px] text-[#19B5A5] font-bold inline-flex items-center gap-1"
                      >
                        <span>View</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Buyers */}
        {activeBookmarkTab === 'buyers' && (
          <div>
            {savedBuyers.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#718096]">
                You haven't saved any waste buyers yet. Discover aggregators in the{' '}
                <button
                  onClick={() => onNavigate('buyers')}
                  className="text-[#19B5A5] underline font-bold"
                >
                  Waste Buyers Directory
                </button>
                .
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedBuyers.map((b) => (
                  <div key={b.id} className="p-4 rounded-xl border border-[#E3E8EF] bg-[#F4F6F8] flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-[#111C2E]">{b.name}</h4>
                      <p className="text-[11px] text-[#718096] mt-0.5">{b.city} · {b.businessType}</p>
                      <p className="text-[11px] text-[#138D81] font-bold mt-1">{b.pricingIndicative}</p>
                    </div>
                    <div className="pt-3 border-t border-[#E3E8EF] mt-3 flex items-center justify-between">
                      <a href={`tel:${b.contactPhone}`} className="text-[11px] text-[#253247] font-semibold inline-flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#718096]" />
                        <span>Call</span>
                      </a>
                      <button
                        onClick={() => onNavigate('buyers')}
                        className="text-[11px] text-[#19B5A5] font-bold inline-flex items-center gap-1"
                      >
                        <span>View Rates</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Marketplace */}
        {activeBookmarkTab === 'marketplace' && (
          <div>
            {savedListings.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#718096]">
                No marketplace listings saved.{' '}
                <button
                  onClick={() => onNavigate('marketplace')}
                  className="text-[#19B5A5] underline font-bold"
                >
                  Browse P2P Marketplace
                </button>
                .
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedListings.map((l) => (
                  <div key={l.id} className="p-4 rounded-xl border border-[#E3E8EF] bg-[#F4F6F8] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#138D81] bg-[#E7F8F6] px-2 py-0.5 rounded-full">
                        {l.type === 'sell' ? 'For Sale' : 'Looking to Buy'}
                      </span>
                      <h4 className="font-bold text-xs text-[#111C2E] mt-1.5">{l.title}</h4>
                      <p className="text-[11px] text-[#718096] mt-0.5">{l.quantity} {l.unit} · {l.city}</p>
                    </div>
                    <div className="pt-3 border-t border-[#E3E8EF] mt-3 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#138D81]">{l.expectedPrice}</span>
                      <button
                        onClick={() => onNavigate('marketplace')}
                        className="text-[11px] text-[#19B5A5] font-bold inline-flex items-center gap-1"
                      >
                        <span>View</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Two Column Layout: Badges & Chronological Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Milestones & Badges (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#E3E8EF] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E3E8EF] pb-3">
            <h3 className="font-extrabold text-[#111C2E] text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-[#111C2E]" />
              <span>Civic Sustainability Badges</span>
            </h3>
            <span className="text-xs text-[#718096] font-semibold">
              {user.badges.filter((b) => Boolean(b.unlockedAt)).length} / {user.badges.length} Unlocked
            </span>
          </div>

          <div className="space-y-3">
            {user.badges.map((badge) => {
              const isEarned = Boolean(badge.unlockedAt);
              return (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                    isEarned
                      ? 'bg-[#F4F6F8] border-[#E3E8EF] text-[#111C2E]'
                      : 'bg-white border-[#E3E8EF] text-[#718096] opacity-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isEarned ? 'bg-[#111C2E] text-white' : 'bg-[#F4F6F8] text-[#718096]'
                  }`}>
                    <ShieldCheck className="w-4 h-4 text-[#19B5A5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-[#111C2E]">{badge.title}</h4>
                      <span className="text-[10px] font-mono font-bold text-[#19B5A5]">
                        {isEarned ? 'Earned' : 'Locked'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#718096] mt-0.5 leading-normal">
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Activity History (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E3E8EF] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E3E8EF] pb-3">
            <h3 className="font-extrabold text-[#111C2E] text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#111C2E]" />
              <span>Segregation & Diversion Timeline</span>
            </h3>
            <button
              onClick={() => onNavigate('search')}
              className="text-xs text-[#111C2E] hover:text-[#19B5A5] font-bold inline-flex items-center gap-1"
            >
              <span>Log another item</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {user.recentActivity && user.recentActivity.length > 0 ? (
              user.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="p-3 bg-[#F4F6F8] rounded-xl border border-[#E3E8EF] flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-[#111C2E]">{activity.action}</h4>
                    <p className="text-[#718096] text-[11px]">{activity.details}</p>
                  </div>
                  <span className="text-[11px] text-[#718096] shrink-0 font-mono">
                    {activity.timestamp}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#718096] text-center py-6">
                No recent activity logged. Use the "Identify Waste" scanner to begin tracking your diversion history.
              </p>
            )}
          </div>

          {/* CPCB Heuristic Methodology Note */}
          <div className="pt-3 border-t border-[#E3E8EF] text-[11px] text-[#718096] leading-relaxed">
            <strong>Calculation Heuristics:</strong> Every segregated item is modeled at an average diversion mass of 0.35kg, mitigating ~0.26kg CO₂ equivalent based on CPCB anaerobic decomposition avoidance coefficients.
          </div>
        </div>
      </div>
    </div>
  );
};
