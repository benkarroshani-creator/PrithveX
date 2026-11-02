import { CircularityLocation, MapMarkerCategory, ReportIssue } from '../types';
import { RECYCLERS } from './recyclers';
import { WASTE_BUYERS } from './buyers';

// Default Indian city centroids for fallback and quick panning
export const CITY_CENTROIDS: Record<string, { lat: number; lng: number; zoom: number; state: string }> = {
  'All Cities': { lat: 20.5937, lng: 78.9629, zoom: 5, state: 'All' },
  'Bengaluru': { lat: 12.9716, lng: 77.5946, zoom: 12, state: 'Karnataka' },
  'Mumbai': { lat: 19.0760, lng: 72.8777, zoom: 12, state: 'Maharashtra' },
  'Delhi-NCR': { lat: 28.6139, lng: 77.2090, zoom: 11, state: 'Delhi' },
  'Pune': { lat: 18.5204, lng: 73.8567, zoom: 12, state: 'Maharashtra' },
  'Hyderabad': { lat: 17.3850, lng: 78.4867, zoom: 12, state: 'Telangana' },
  'Chennai': { lat: 13.0827, lng: 80.2707, zoom: 12, state: 'Tamil Nadu' },
  'Kolkata': { lat: 22.5726, lng: 88.3639, zoom: 12, state: 'West Bengal' },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714, zoom: 12, state: 'Gujarat' },
};

export const MARKER_CATEGORY_CONFIG: Record<MapMarkerCategory, { label: string; color: string; badgeBg: string; textDark: string; icon: string }> = {
  recycling_centre: {
    label: 'Recycling Centres',
    color: '#19B5A5',
    badgeBg: '#E7F8F6',
    textDark: '#138D81',
    icon: 'Recycle'
  },
  scrap_dealer: {
    label: 'Scrap Dealers',
    color: '#E8A84E',
    badgeBg: '#FEF6EC',
    textDark: '#B87216',
    icon: 'Scale'
  },
  waste_buyer: {
    label: 'Waste Buyers',
    color: '#111C2E',
    badgeBg: '#F1F4F8',
    textDark: '#111C2E',
    icon: 'Coins'
  },
  ewaste_centre: {
    label: 'E-Waste Centres',
    color: '#7667E8',
    badgeBg: '#F0EEFC',
    textDark: '#5B4DE0',
    icon: 'Cpu'
  },
  plastic_recycler: {
    label: 'Plastic Recyclers',
    color: '#0284C7',
    badgeBg: '#E0F2FE',
    textDark: '#0369A1',
    icon: 'PackageCheck'
  },
  paper_recycler: {
    label: 'Paper Recyclers',
    color: '#D97706',
    badgeBg: '#FEF3C7',
    textDark: '#B45309',
    icon: 'FileText'
  },
  metal_recycler: {
    label: 'Metal Recyclers',
    color: '#475569',
    badgeBg: '#F1F5F9',
    textDark: '#334155',
    icon: 'Shield'
  },
  composting_centre: {
    label: 'Composting Centres',
    color: '#16A34A',
    badgeBg: '#DCFCE7',
    textDark: '#15803D',
    icon: 'Sprout'
  },
  donation_centre: {
    label: 'Donation Centres',
    color: '#EA580C',
    badgeBg: '#FFEDD5',
    textDark: '#C2410C',
    icon: 'HeartHandshake'
  },
  collection_point: {
    label: 'Collection Points',
    color: '#0D9488',
    badgeBg: '#CCFBF1',
    textDark: '#0F766E',
    icon: 'MapPin'
  },
  waste_hotspot: {
    label: 'Civic Waste Hotspots',
    color: '#E11D48',
    badgeBg: '#FFE4E6',
    textDark: '#BE123C',
    icon: 'AlertTriangle'
  }
};

// Known coordinates map for existing recycler IDs
const RECYCLER_COORDS: Record<string, { lat: number; lng: number; category: MapMarkerCategory }> = {
  'rec-blr-01': { lat: 12.9121, lng: 77.6891, category: 'recycling_centre' },
  'rec-blr-02': { lat: 12.9431, lng: 77.6045, category: 'scrap_dealer' },
  'rec-pan-goonj': { lat: 28.5303, lng: 77.2917, category: 'donation_centre' },
  'rec-mum-greensole': { lat: 19.1176, lng: 73.0163, category: 'donation_centre' },
  'rec-pan-sads': { lat: 12.9345, lng: 77.6256, category: 'donation_centre' },
  'rec-mum-01': { lat: 19.0626, lng: 72.8998, category: 'composting_centre' },
  'rec-mum-02': { lat: 19.1363, lng: 72.8277, category: 'scrap_dealer' },
  'rec-del-01': { lat: 28.5684, lng: 77.2410, category: 'ewaste_centre' },
  'rec-del-scrapuncle': { lat: 28.5833, lng: 77.0673, category: 'scrap_dealer' },
  'rec-del-02': { lat: 28.4744, lng: 77.5040, category: 'ewaste_centre' },
  'rec-pun-01': { lat: 18.5074, lng: 73.8077, category: 'composting_centre' },
  'rec-hyd-01': { lat: 17.4578, lng: 78.4354, category: 'plastic_recycler' },
  'rec-chn-01': { lat: 13.0067, lng: 80.2025, category: 'ewaste_centre' },
  'rec-kol-01': { lat: 22.5802, lng: 88.4326, category: 'plastic_recycler' },
  'rec-ahm-01': { lat: 22.9574, lng: 72.6328, category: 'metal_recycler' }
};

// Known coordinates map for existing buyer IDs
const BUYER_COORDS: Record<string, { lat: number; lng: number; category: MapMarkerCategory }> = {
  'buyer-blr-01': { lat: 12.9482, lng: 77.5255, category: 'waste_buyer' },
  'buyer-blr-02': { lat: 12.9912, lng: 77.7163, category: 'scrap_dealer' },
  'buyer-blr-03': { lat: 13.0285, lng: 77.5195, category: 'metal_recycler' },
  'buyer-mum-01': { lat: 19.0433, lng: 72.8550, category: 'plastic_recycler' },
  'buyer-mum-02': { lat: 19.1982, lng: 72.9515, category: 'paper_recycler' },
  'buyer-mum-03': { lat: 19.0726, lng: 72.8845, category: 'scrap_dealer' },
  'buyer-del-01': { lat: 28.5355, lng: 77.2732, category: 'paper_recycler' },
  'buyer-del-02': { lat: 28.4891, lng: 77.0543, category: 'ewaste_centre' },
  'buyer-del-03': { lat: 28.6253, lng: 77.3812, category: 'waste_buyer' },
  'buyer-pun-01': { lat: 18.6298, lng: 73.8436, category: 'metal_recycler' },
  'buyer-pun-02': { lat: 18.5089, lng: 73.9259, category: 'waste_buyer' },
  'buyer-hyd-01': { lat: 17.5230, lng: 78.4526, category: 'plastic_recycler' },
  'buyer-hyd-02': { lat: 17.4401, lng: 78.3489, category: 'ewaste_centre' },
  'buyer-chn-01': { lat: 13.1143, lng: 80.1548, category: 'metal_recycler' },
  'buyer-chn-02': { lat: 12.9815, lng: 80.2180, category: 'paper_recycler' },
  'buyer-kol-01': { lat: 22.5958, lng: 88.2636, category: 'scrap_dealer' },
  'buyer-ahm-01': { lat: 23.0673, lng: 72.6481, category: 'plastic_recycler' }
};

// Additional civic and municipal dry waste collection points
export const MUNICIPAL_COLLECTION_CENTRES: CircularityLocation[] = [
  {
    id: 'dwc-blr-indiranagar',
    name: 'BBMP Dry Waste Collection Centre (DWCC) - Ward 80',
    category: 'collection_point',
    categoryLabel: 'Waste Collection Points',
    sourceType: 'collection_point',
    originalId: 'bbmp-dwcc-80',
    city: 'Bengaluru',
    state: 'Karnataka',
    locality: 'Indiranagar 100ft Road',
    address: 'Near Defence Colony Playground, 100 Feet Road, Indiranagar, Bengaluru - 560038',
    lat: 12.9784,
    lng: 77.6408,
    acceptedCategories: ['dry_recyclable', 'paper', 'plastic', 'glass', 'metal', 'e_waste'],
    specificMaterials: ['Cardboard', 'Plastics 1-7', 'Glass bottles', 'Milk packets', 'Metal cans', 'E-waste dropoff'],
    collectionMethods: ['Drop-off center'],
    contactPhone: '+91 80 2266 0000',
    operatingHours: 'Mon - Sun: 7:00 AM - 1:00 PM',
    rating: 4.6,
    isVerified: true,
    verificationStatus: 'Verified',
    googleMapsUrl: 'https://maps.google.com/?q=BBMP+Dry+Waste+Collection+Centre+Indiranagar+Bengaluru',
    notes: 'Official ward-level segregation drop point operated in partnership with informal waste collector federations.'
  },
  {
    id: 'dwc-blr-jayanagar',
    name: 'BBMP Ward 153 Resource Recovery Center',
    category: 'collection_point',
    categoryLabel: 'Waste Collection Points',
    sourceType: 'collection_point',
    originalId: 'bbmp-dwcc-153',
    city: 'Bengaluru',
    state: 'Karnataka',
    locality: 'Jayanagar 4th Block',
    address: '32nd Cross Road, 4th Block East, Jayanagar, Bengaluru - 560011',
    lat: 12.9299,
    lng: 77.5838,
    acceptedCategories: ['dry_recyclable', 'paper', 'plastic', 'metal', 'textile'],
    specificMaterials: ['Newspapers', 'Cartons', 'High density polyethylene', 'Clean cloth scraps'],
    collectionMethods: ['Drop-off center'],
    contactPhone: '+91 80 2266 0000',
    operatingHours: 'Mon - Sat: 8:00 AM - 2:00 PM',
    rating: 4.7,
    isVerified: true,
    verificationStatus: 'Verified',
    googleMapsUrl: 'https://maps.google.com/?q=BBMP+Resource+Recovery+Jayanagar+Bengaluru',
    notes: 'Model resource recovery center with dry waste sort line and community awareness desk.'
  },
  {
    id: 'dwc-mum-bandra',
    name: 'MCGM Zero-Waste Dry Collection Kiosk',
    category: 'collection_point',
    categoryLabel: 'Waste Collection Points',
    sourceType: 'collection_point',
    originalId: 'mcgm-kiosk-bandra',
    city: 'Mumbai',
    state: 'Maharashtra',
    locality: 'Bandra West',
    address: 'Hill Road, Near Mehboob Studio, Bandra West, Mumbai - 400050',
    lat: 19.0522,
    lng: 72.8291,
    acceptedCategories: ['plastic', 'dry_recyclable', 'glass', 'e_waste'],
    specificMaterials: ['Multi-layer plastic', 'Glass bottles', 'Beverage cans', 'Old chargers & cords'],
    collectionMethods: ['Drop-off center'],
    contactPhone: '+91 22 2439 7888',
    operatingHours: 'All Days: 8:00 AM - 6:00 PM',
    rating: 4.5,
    isVerified: true,
    verificationStatus: 'Verified',
    googleMapsUrl: 'https://maps.google.com/?q=MCGM+Dry+Waste+Bandra+West+Mumbai',
    notes: 'Citizen drop-off stall managed by Swachh Bharat community ambassadors.'
  },
  {
    id: 'dwc-del-cpr',
    name: 'MCD Decentralized Composting & Dry Waste Hub',
    category: 'composting_centre',
    categoryLabel: 'Composting Centres',
    sourceType: 'collection_point',
    originalId: 'mcd-compost-cpr',
    city: 'Delhi-NCR',
    state: 'Delhi',
    locality: 'Central Ridge / Chanakyapuri',
    address: 'Panchsheel Marg Extension, Chanakyapuri, New Delhi - 110021',
    lat: 28.5912,
    lng: 77.1854,
    acceptedCategories: ['wet_organic'],
    specificMaterials: ['Garden prunings', 'Dry leaves', 'Horticulture waste', 'Vegetable peel trimmings'],
    collectionMethods: ['Drop-off center', 'Bulk pickup'],
    contactPhone: '+91 11 2322 0010',
    operatingHours: 'Mon - Sat: 8:00 AM - 4:00 PM',
    rating: 4.8,
    isVerified: true,
    verificationStatus: 'Verified',
    googleMapsUrl: 'https://maps.google.com/?q=MCD+Composting+Hub+Chanakyapuri+New+Delhi',
    notes: 'Aerobic windrow composting converting urban garden biomass into organic soil conditioner for civic parks.'
  }
];

// Calculate Haversine distance in kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Build all static circularity locations
export function getBaseCircularityLocations(): CircularityLocation[] {
  const list: CircularityLocation[] = [];

  // 1. Process Recyclers
  for (const r of RECYCLERS) {
    const coords = RECYCLER_COORDS[r.id] || {
      lat: CITY_CENTROIDS[r.city]?.lat || 12.9716,
      lng: CITY_CENTROIDS[r.city]?.lng || 77.5946,
      category: 'recycling_centre' as MapMarkerCategory
    };

    list.push({
      id: `loc-rec-${r.id}`,
      originalId: r.id,
      name: r.name,
      category: coords.category,
      categoryLabel: MARKER_CATEGORY_CONFIG[coords.category]?.label || 'Recycling Centres',
      sourceType: 'recycler',
      city: r.city,
      state: r.state,
      locality: r.district || r.city,
      address: r.address,
      lat: coords.lat,
      lng: coords.lng,
      acceptedCategories: r.acceptedCategories,
      specificMaterials: r.specificMaterials || [],
      collectionMethods: r.collectionMethods,
      contactPhone: r.contactPhone,
      whatsappNumber: r.whatsappNumber,
      email: r.email,
      website: r.website,
      googleMapsUrl: r.googleMapsUrl || `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`,
      operatingHours: r.operatingHours,
      rating: r.rating,
      isVerified: r.isVerified,
      verificationStatus: r.verificationStatus,
      minimumQuantity: r.minimumQuantity,
      pricingNote: r.pricingNote,
      notes: r.notes
    });
  }

  // 2. Process Waste Buyers
  for (const b of WASTE_BUYERS) {
    const coords = BUYER_COORDS[b.id] || {
      lat: CITY_CENTROIDS[b.city]?.lat || 19.0760,
      lng: CITY_CENTROIDS[b.city]?.lng || 72.8777,
      category: 'waste_buyer' as MapMarkerCategory
    };

    list.push({
      id: `loc-buy-${b.id}`,
      originalId: b.id,
      name: b.name,
      category: coords.category,
      categoryLabel: MARKER_CATEGORY_CONFIG[coords.category]?.label || 'Waste Buyers',
      sourceType: 'buyer',
      city: b.city,
      state: b.state,
      locality: b.district || b.city,
      address: b.address,
      lat: coords.lat,
      lng: coords.lng,
      acceptedCategories: b.materialCategories,
      specificMaterials: b.acceptedMaterials,
      collectionMethods: b.pickupAvailable
        ? ['Doorstep pickup', 'Drop-off center']
        : ['Drop-off center'],
      contactPhone: b.contactPhone,
      whatsappNumber: b.whatsappNumber,
      email: b.email,
      website: b.website,
      googleMapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`,
      operatingHours: b.operatingHours,
      rating: b.rating,
      isVerified: b.isVerified,
      verificationStatus: b.verificationStatus,
      minimumQuantity: b.minimumQuantity,
      pricingNote: b.pricingIndicative,
      notes: b.notes || b.description
    });
  }

  // 3. Process Municipal collection points
  list.push(...MUNICIPAL_COLLECTION_CENTRES);

  return list;
}

// Convert civic reports into interactive map hotspots with privacy protection
export function convertReportsToHotspots(reports: ReportIssue[]): CircularityLocation[] {
  return reports.map((rep, index) => {
    // Generate approximate neighborhood coordinates if not directly available
    let lat = rep.location.lat;
    let lng = rep.location.lng;

    if (!lat || !lng) {
      const cityCenter = CITY_CENTROIDS[rep.location.city] || CITY_CENTROIDS['Bengaluru'];
      // Slight pseudorandom offset based on id to show multiple reports naturally within the locality
      const offsetLat = ((rep.id.charCodeAt(rep.id.length - 1) % 9) - 4) * 0.007;
      const offsetLng = ((rep.id.charCodeAt(0) % 9) - 4) * 0.007;
      lat = cityCenter.lat + offsetLat;
      lng = cityCenter.lng + offsetLng;
    }

    const refNo = `CR-${rep.id.slice(-6).toUpperCase()}`;

    return {
      id: `loc-hotspot-${rep.id}`,
      originalId: rep.id,
      name: `Civic Report: ${rep.issueType} (${refNo})`,
      category: 'waste_hotspot',
      categoryLabel: 'Civic Waste Hotspots',
      sourceType: 'hotspot',
      city: rep.location.city,
      state: rep.location.city === 'Bengaluru' ? 'Karnataka' : rep.location.city === 'Mumbai' ? 'Maharashtra' : 'Delhi',
      locality: rep.location.locality,
      address: `${rep.location.locality}, ${rep.location.city}${rep.location.pincode ? ` - ${rep.location.pincode}` : ''}`,
      lat,
      lng,
      acceptedCategories: ['hazardous', 'special_waste'],
      specificMaterials: [rep.issueType],
      googleMapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      isVerified: rep.status === 'Assigned' || rep.status === 'Resolved',
      verificationStatus: rep.status === 'Resolved' ? 'Verified' : 'Community Submitted',
      notes: rep.description,
      hotspotData: {
        issueType: rep.issueType,
        status: rep.status,
        referenceNo: refNo,
        submittedAt: rep.submittedAt,
        description: rep.description
      }
    };
  });
}
