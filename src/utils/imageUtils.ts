/**
 * PrithveX - Image Assets & Production Fallback Utilities
 * Ensures 100% reliable image integration in local dev and live Netlify / static production deployments.
 */

import heroSegregationImg from '../assets/images/hero_segregation_clean_1791110763384.jpg';
import wasteBinsImg from '../assets/images/waste_bins_station_1794270999638.jpg';
import petBottlesImg from '../assets/images/pet_bottles_recycling_1794271016540.jpg';
import cardboardBalesImg from '../assets/images/cardboard_paper_bales_1794271030832.jpg';
import ewasteHubImg from '../assets/images/ewaste_sorting_hub_1794271046459.jpg';
import mrfFacilityImg from '../assets/images/mrf_recycling_facility_1791110775187.jpg';

export {
  heroSegregationImg,
  wasteBinsImg,
  petBottlesImg,
  cardboardBalesImg,
  ewasteHubImg,
  mrfFacilityImg
};

// Curated high-resolution photography for waste categories & items
// Each has reliable CDN links + local fallback
export const WASTE_PHOTOGRAPHY: Record<string, string> = {
  // Plastic streams
  'plastic': petBottlesImg,
  'milk-pouch': 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=600&q=80',
  'sample-bottle': petBottlesImg,
  'sample-milk': 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=600&q=80',
  'single-use-plastic-cutlery': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',

  // Paper & Cardboard streams
  'paper': cardboardBalesImg,
  'cardboard-carton': cardboardBalesImg,
  'sample-carton': cardboardBalesImg,
  'newspaper-raddi': 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80',

  // Wet & Organic streams
  'wet_organic': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
  'vegetable-fruit-peels': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  'sample-banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
  'coconut-shell': 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?auto=format&fit=crop&w=600&q=80',

  // Metals
  'metal': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
  'aluminium-can': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
  'sample-can': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',

  // Glass
  'glass': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
  'glass-bottle': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
  'sample-glass': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',

  // E-waste & Batteries
  'e_waste': ewasteHubImg,
  'smartphone-ewaste': ewasteHubImg,
  'sample-battery': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
  'batteries': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
  'lithium-ion-battery': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',

  // Textiles & Reuse
  'textile': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
  'old-textile-clothes': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
  'sample-jeans': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',

  // Medical & Hazardous
  'medical': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
  'expired-medicine-blister': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
  'sample-medicine': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
  'hazardous': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
  'paint-can-chemicals': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',

  // Used cooking oil (RUCO)
  'used_cooking_oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
  'used-cooking-oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
  'sample-oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',

  // Special waste
  'special_waste': 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
  'thermocol-eps': 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
  'sample-thermocol': 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',

  // Sanitary
  'sanitary': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
  'menstrual-pads-diapers': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
};

/**
 * Returns the best image for a given waste item ID or category.
 * Always returns a valid, high-fidelity image URL.
 */
export function getWasteItemImage(itemId: string, category?: string): string {
  if (WASTE_PHOTOGRAPHY[itemId]) {
    return WASTE_PHOTOGRAPHY[itemId];
  }
  if (category && WASTE_PHOTOGRAPHY[category]) {
    return WASTE_PHOTOGRAPHY[category];
  }
  return petBottlesImg;
}

/**
 * Fallback image handler for <img> elements:
 * Switches to bundled local image if an external URL is slow or blocked.
 */
export function handleImageFallback(e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackImg = petBottlesImg) {
  const target = e.currentTarget;
  if (target.src !== fallbackImg) {
    target.src = fallbackImg;
  }
}
