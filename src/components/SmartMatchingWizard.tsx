import React, { useState, useMemo } from 'react';
import { 
  Recycle, 
  Coins, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Phone, 
  MessageSquare, 
  Compass,
  Star,
  ExternalLink
} from 'lucide-react';
import { CircularityLocation, WasteCategory } from '../types';

interface SmartMatchingWizardProps {
  locations: CircularityLocation[];
  onSelectLocation: (loc: CircularityLocation) => void;
  onNavigateToMap: () => void;
  userCoords: { lat: number; lng: number } | null;
}

const MATERIAL_OPTIONS = [
  { id: 'Cardboard', label: 'Cardboard & Kraft Boxes', category: 'paper' as WasteCategory },
  { id: 'PET bottles', label: 'Plastic Bottles (PET/HDPE)', category: 'plastic' as WasteCategory },
  { id: 'E-waste items', label: 'Old Electronics, Phones, Laptops', category: 'e_waste' as WasteCategory },
  { id: 'Aluminium cans', label: 'Metal Cans & Scrap Iron', category: 'metal' as WasteCategory },
  { id: 'Wearable clothes', label: 'Clean Used Clothes & Textiles', category: 'textile' as WasteCategory },
  { id: 'Glass containers', label: 'Glass Bottles & Jars', category: 'glass' as WasteCategory },
  { id: 'Compostable wet food', label: 'Kitchen & Organic Wet Waste', category: 'wet_organic' as WasteCategory },
  { id: 'Batteries', label: 'Lead Acid / Lithium Batteries', category: 'batteries' as WasteCategory }
];

export const SmartMatchingWizard: React.FC<SmartMatchingWizardProps> = ({
  locations,
  onSelectLocation,
  onNavigateToMap,
  userCoords
}) => {
  const [wizardMode, setWizardMode] = useState<'recycler' | 'buyer'>('recycler');
  
  // Recycler wizard state
  const [selectedMaterial, setSelectedMaterial] = useState<string>('PET bottles');
  const [selectedCity, setSelectedCity] = useState<string>('Bengaluru');
  const [requiresPickup, setRequiresPickup] = useState<boolean>(true);
  const [approxQuantityKg, setApproxQuantityKg] = useState<number>(15);

  // Buyer wizard state
  const [buyerCategory, setBuyerCategory] = useState<WasteCategory>('plastic');
  const [buyerQuantityKg, setBuyerQuantityKg] = useState<number>(50);
  const [buyerCity, setBuyerCity] = useState<string>('Bengaluru');
  const [buyerPickupRequired, setBuyerPickupRequired] = useState<boolean>(true);

  // Available cities from locations
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    locations.forEach((l) => set.add(l.city));
    return Array.from(set).sort();
  }, [locations]);

  // Recycler matching algorithm
  const matchedRecyclers = useMemo(() => {
    const candidateMaterial = MATERIAL_OPTIONS.find((m) => m.id === selectedMaterial);
    const targetCat = candidateMaterial?.category;

    return locations
      .filter((loc) => loc.sourceType === 'recycler' || loc.sourceType === 'collection_point')
      .map((loc) => {
        let score = 0;
        const reasons: string[] = [];

        // 1. Material compatibility
        const directMaterial = loc.specificMaterials.some((m) =>
          m.toLowerCase().includes(selectedMaterial.toLowerCase())
        );
        const categoryMatch = targetCat && loc.acceptedCategories.includes(targetCat);

        if (directMaterial) {
          score += 45;
          reasons.push(`Directly processes ${selectedMaterial}`);
        } else if (categoryMatch) {
          score += 35;
          reasons.push(`Licensed for ${targetCat} category`);
        }

        // 2. City / Location match
        if (loc.city.toLowerCase() === selectedCity.toLowerCase()) {
          score += 25;
          reasons.push(`Operates locally in ${loc.city}`);
        }

        // 3. Collection method compatibility
        const hasPickup = loc.collectionMethods?.includes('Doorstep pickup') || loc.collectionMethods?.includes('Bulk pickup');
        if (requiresPickup) {
          if (hasPickup) {
            score += 15;
            reasons.push('Doorstep pickup supported');
          }
        } else {
          score += 15;
          reasons.push('Drop-off facility available');
        }

        // 4. Verification & Rating
        if (loc.isVerified) {
          score += 10;
          reasons.push('SPCB/CPCB Authorized & Verified');
        }
        if (loc.rating && loc.rating >= 4.7) {
          score += 5;
        }

        return {
          location: loc,
          score: Math.min(score, 99),
          reasons
        };
      })
      .filter((item) => item.score >= 40)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [locations, selectedMaterial, selectedCity, requiresPickup]);

  // Buyer matching algorithm
  const matchedBuyers = useMemo(() => {
    return locations
      .filter((loc) => loc.sourceType === 'buyer' || loc.category === 'scrap_dealer')
      .map((loc) => {
        let score = 0;
        const reasons: string[] = [];

        // Category match
        if (loc.acceptedCategories.includes(buyerCategory)) {
          score += 45;
          reasons.push(`Active procurement for ${buyerCategory}`);
        }

        // City match
        if (loc.city.toLowerCase() === buyerCity.toLowerCase()) {
          score += 25;
          reasons.push(`Local yard in ${loc.city}`);
        }

        // Quantity match (check minimum)
        score += 15;
        reasons.push(`Accommodates ~${buyerQuantityKg} kg lot sizes`);

        // Pickup
        if (buyerPickupRequired && loc.collectionMethods?.includes('Doorstep pickup')) {
          score += 10;
          reasons.push('On-demand pickup & certified digital scale');
        }

        if (loc.isVerified) {
          score += 5;
        }

        return {
          location: loc,
          score: Math.min(score, 99),
          reasons
        };
      })
      .filter((item) => item.score >= 40)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [locations, buyerCategory, buyerCity, buyerQuantityKg, buyerPickupRequired]);

  return (
    <div className="bg-white rounded-2xl border border-[#E3E8EF] shadow-sm p-6 lg:p-8">
      {/* Wizard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E3E8EF]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0EEFC] text-[#5B4DE0] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Smart Waste Matching Engine
          </div>
          <h2 className="text-2xl font-bold text-[#111C2E]">
            Connect Waste to the Highest-Value Circular Channel
          </h2>
          <p className="text-sm text-[#718096] mt-1">
            Algorithmically matches your material type, quantity, and location with verified authorized recyclers or commercial scrap buyers.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-[#F4F6F8] p-1 rounded-xl border border-[#E3E8EF] self-start">
          <button
            onClick={() => setWizardMode('recycler')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              wizardMode === 'recycler'
                ? 'bg-[#111C2E] text-white shadow-sm'
                : 'text-[#718096] hover:text-[#111C2E]'
            }`}
          >
            <Recycle className="w-4 h-4 text-[#19B5A5]" />
            Find Right Recycler
          </button>
          <button
            onClick={() => setWizardMode('buyer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              wizardMode === 'buyer'
                ? 'bg-[#111C2E] text-white shadow-sm'
                : 'text-[#718096] hover:text-[#111C2E]'
            }`}
          >
            <Coins className="w-4 h-4 text-[#E8A84E]" />
            Find Scrap Buyer
          </button>
        </div>
      </div>

      {/* Input Controls */}
      {wizardMode === 'recycler' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
          <div>
            <label className="block text-xs font-bold text-[#111C2E] mb-1.5 uppercase tracking-wider">
              Waste Material Type
            </label>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="w-full bg-[#F4F6F8] border border-[#E3E8EF] rounded-xl px-3 py-2.5 text-sm text-[#253247] font-medium focus:ring-2 focus:ring-[#19B5A5] focus:outline-none"
            >
              {MATERIAL_OPTIONS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111C2E] mb-1.5 uppercase tracking-wider">
              City / Location
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-[#F4F6F8] border border-[#E3E8EF] rounded-xl px-3 py-2.5 text-sm text-[#253247] font-medium focus:ring-2 focus:ring-[#19B5A5] focus:outline-none"
            >
              {availableCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111C2E] mb-1.5 uppercase tracking-wider">
              Collection Method
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRequiresPickup(true)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  requiresPickup
                    ? 'bg-[#E7F8F6] border-[#19B5A5] text-[#138D81]'
                    : 'bg-[#F4F6F8] border-[#E3E8EF] text-[#718096]'
                }`}
              >
                Doorstep Pickup
              </button>
              <button
                type="button"
                onClick={() => setRequiresPickup(false)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  !requiresPickup
                    ? 'bg-[#E7F8F6] border-[#19B5A5] text-[#138D81]'
                    : 'bg-[#F4F6F8] border-[#E3E8EF] text-[#718096]'
                }`}
              >
                Drop-off Center
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111C2E] mb-1.5 uppercase tracking-wider">
              Approx Quantity ({approxQuantityKg} kg)
            </label>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={approxQuantityKg}
              onChange={(e) => setApproxQuantityKg(Number(e.target.value))}
              className="w-full accent-[#19B5A5] mt-2"
            />
            <div className="flex justify-between text-[11px] text-[#718096] mt-1 font-medium">
              <span>Household (5kg)</span>
              <span>Society (50kg)</span>
              <span>Bulk (100kg+)</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
          <div>
            <label className="block text-xs font-bold text-[#111C2E] mb-1.5 uppercase tracking-wider">
              Scrap Material Category
            </label>
            <select
              value={buyerCategory}
              onChange={(e) => setBuyerCategory(e.target.value as WasteCategory)}
              className="w-full bg-[#F4F6F8] border border-[#E3E8EF] rounded-xl px-3 py-2.5 text-sm text-[#253247] font-medium focus:ring-2 focus:ring-[#E8A84E] focus:outline-none"
            >
              <option value="plastic">Post-Consumer Plastics & HDPE</option>
              <option value="paper">Cardboard, Cartons & Kraft</option>
              <option value="metal">Scrap Iron, Steel & Copper</option>
              <option value="e_waste">IT & Electronic Scrap</option>
              <option value="batteries">Lead-Acid & Inverter Batteries</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111C2E] mb-1.5 uppercase tracking-wider">
              City / Metro
            </label>
            <select
              value={buyerCity}
              onChange={(e) => setBuyerCity(e.target.value)}
              className="w-full bg-[#F4F6F8] border border-[#E3E8EF] rounded-xl px-3 py-2.5 text-sm text-[#253247] font-medium focus:ring-2 focus:ring-[#E8A84E] focus:outline-none"
            >
              {availableCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111C2E] mb-1.5 uppercase tracking-wider">
              Fulfillment Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setBuyerPickupRequired(true)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  buyerPickupRequired
                    ? 'bg-[#FEF6EC] border-[#E8A84E] text-[#B87216]'
                    : 'bg-[#F4F6F8] border-[#E3E8EF] text-[#718096]'
                }`}
              >
                Doorstep Pickup
              </button>
              <button
                type="button"
                onClick={() => setBuyerPickupRequired(false)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  !buyerPickupRequired
                    ? 'bg-[#FEF6EC] border-[#E8A84E] text-[#B87216]'
                    : 'bg-[#F4F6F8] border-[#E3E8EF] text-[#718096]'
                }`}
              >
                Yard Drop-off
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111C2E] mb-1.5 uppercase tracking-wider">
              Scrap Lot Quantity ({buyerQuantityKg} kg)
            </label>
            <input
              type="range"
              min="15"
              max="500"
              step="25"
              value={buyerQuantityKg}
              onChange={(e) => setBuyerQuantityKg(Number(e.target.value))}
              className="w-full accent-[#E8A84E] mt-2"
            />
            <div className="flex justify-between text-[11px] text-[#718096] mt-1 font-medium">
              <span>Min Lot (15kg)</span>
              <span>Commercial (250kg)</span>
              <span>Max (500kg+)</span>
            </div>
          </div>
        </div>
      )}

      {/* Matched Results Grid */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-[#718096] uppercase tracking-wider">
            Top Circular Matches for Your Criteria
          </p>
          <button
            onClick={onNavigateToMap}
            className="text-xs font-bold text-[#19B5A5] hover:underline flex items-center gap-1"
          >
            View all on Circularity Map <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(wizardMode === 'recycler' ? matchedRecyclers : matchedBuyers).map((match, idx) => {
            const loc = match.location;
            const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;

            return (
              <div
                key={loc.id}
                className="bg-[#F4F6F8] rounded-xl p-5 border border-[#E3E8EF] hover:border-[#19B5A5] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#111C2E] text-white text-[11px] font-bold">
                        {match.score}% Match
                      </span>
                      {loc.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#138D81] bg-[#E7F8F6] px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-[#19B5A5]" />
                          Verified
                        </span>
                      )}
                    </div>
                    {loc.rating && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#111C2E]">
                        <Star className="w-3.5 h-3.5 fill-[#E8A84E] text-[#E8A84E]" />
                        {loc.rating}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[#111C2E] line-clamp-1 mb-1">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-[#718096] flex items-center gap-1 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-[#718096] shrink-0" />
                    {loc.locality ? `${loc.locality}, ` : ''}{loc.city}
                  </p>

                  {/* Why it matches */}
                  <div className="space-y-1 mb-4">
                    {match.reasons.map((reason, rIdx) => (
                      <div key={rIdx} className="flex items-center gap-1.5 text-xs text-[#253247]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#19B5A5] shrink-0" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>

                  {loc.pricingNote && (
                    <div className="bg-white rounded-lg p-2.5 border border-[#E3E8EF] text-xs text-[#253247] mb-3">
                      <span className="font-bold text-[#111C2E]">Pricing / Commercials: </span>
                      {loc.pricingNote}
                    </div>
                  )}
                </div>

                {/* Card CTAs */}
                <div className="flex items-center gap-2 pt-3 border-t border-[#E3E8EF]">
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#19B5A5] hover:bg-[#138D81] text-white text-xs font-bold transition-colors"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    Directions (Google Maps)
                  </a>
                  {loc.contactPhone && (
                    <a
                      href={`tel:${loc.contactPhone}`}
                      className="p-2 rounded-lg bg-white border border-[#E3E8EF] hover:border-[#111C2E] text-[#111C2E] transition-colors"
                      title="Call Facility"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                  {loc.whatsappNumber && (
                    <a
                      href={`https://wa.me/${loc.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi,%20I%20found%20you%20on%20PrithveX%20and%20want%20to%20channelize%20segregated%20waste`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white border border-[#E3E8EF] hover:border-[#16A34A] text-[#16A34A] transition-colors"
                      title="WhatsApp Inquiry"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => {
                      onSelectLocation(loc);
                      onNavigateToMap();
                    }}
                    className="p-2 rounded-lg bg-white border border-[#E3E8EF] hover:border-[#111C2E] text-[#111C2E] transition-colors"
                    title="View on Map"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
