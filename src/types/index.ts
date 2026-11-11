export type WasteCategory =
  | 'wet_organic'
  | 'dry_recyclable'
  | 'paper'
  | 'plastic'
  | 'glass'
  | 'metal'
  | 'e_waste'
  | 'batteries'
  | 'hazardous'
  | 'sanitary'
  | 'medical'
  | 'textile'
  | 'used_cooking_oil'
  | 'special_waste';

export type DisposalPathway =
  | 'Recyclable'
  | 'Reusable'
  | 'Compostable'
  | 'Donate'
  | 'Repair'
  | 'Special collection'
  | 'Hazardous / safe disposal'
  | 'Reject / residual waste';

export type BinColor = 'green' | 'blue' | 'red' | 'black' | 'yellow' | 'special';

export type VerificationStatus =
  | 'Verified'
  | 'Verification Pending'
  | 'Community Submitted'
  | 'Information Needs Updating';

export interface WasteItem {
  id: string;
  name: string;
  hindiName?: string;
  category: WasteCategory;
  categoryLabel: string;
  binColor: BinColor;
  binName: string;
  pathways: DisposalPathway[];
  primaryPathway: DisposalPathway;
  isRecyclable: boolean;
  isReusable: boolean;
  isCompostable: boolean;
  isHazardous: boolean;
  canDonate: boolean;
  canRepair: boolean;
  shortDescription: string;
  preparationSteps: string[];
  safeDisposalInstructions: string;
  reuseOptions?: string;
  recyclingOptions?: string;
  warnings?: string;
  cpcbGuideline?: string;
  commonExamples?: string[];
  tags: string[];
  imageUrl?: string;
}

export interface ClassificationResult {
  itemName: string;
  category: WasteCategory;
  categoryLabel: string;
  confidence: number;
  explanation: string;
  disposalMethod: string;
  primaryPathway: DisposalPathway;
  binColor: BinColor;
  binName: string;
  preparationSteps: string[];
  reuseOptions: string;
  recyclingOptions: string;
  warnings?: string;
  suggestedNextAction: string;
  isHazardous: boolean;
  cpcbRegulation?: string;
  provider: string;
  timestamp: string;
}

export interface Recycler {
  id: string;
  name: string;
  city: string;
  state: string;
  district?: string;
  address: string;
  acceptedCategories: WasteCategory[];
  specificMaterials?: string[];
  collectionMethods: ('Doorstep pickup' | 'Drop-off center' | 'Bulk pickup')[];
  contactPhone: string;
  whatsappNumber?: string;
  email?: string;
  website?: string;
  googleMapsUrl?: string;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  lastVerifiedDate: string;
  sourceOfInformation?: string;
  operatingHours: string;
  rating: number;
  pricingNote?: string;
  minimumQuantity?: string;
  pickupAvailable?: boolean;
  isDropoffAvailable?: boolean;
  notes?: string;
}

export interface WasteBuyer {
  id: string;
  name: string;
  businessType: 'Authorized Recycler' | 'Scrap Merchant / Aggregator' | 'EPR Fulfillment Agency' | 'Industrial Processor' | 'Social Enterprise';
  description: string;
  state: string;
  city: string;
  district?: string;
  address: string;
  materialCategories: WasteCategory[];
  acceptedMaterials: string[];
  minimumQuantity: string;
  maximumQuantity?: string;
  pricingIndicative: string;
  unit: 'kg' | 'tonne' | 'piece' | 'bundle';
  priceUpdateDate?: string;
  pickupAvailable: boolean;
  deliveryAccepted: boolean;
  contactPhone: string;
  whatsappNumber?: string;
  email?: string;
  website?: string;
  operatingHours: string;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  sourceOfInformation: string;
  lastVerifiedDate: string;
  rating: number;
  notes?: string;
}

export interface MarketplaceListing {
  id: string;
  type: 'sell' | 'buy'; // sell = I have waste; buy = Looking to buy
  title: string;
  category: WasteCategory;
  materialType: string;
  quantity: number;
  unit: 'kg' | 'tonnes' | 'pieces' | 'bundles' | 'bags';
  condition: 'Clean & Baled' | 'Segregated & Rinsed' | 'Mixed Scrap Lot' | 'Grade A Recyclable' | 'Refurbishable';
  description: string;
  expectedPrice?: string; // e.g. "₹14/kg" or "Free collection" or "Negotiable"
  city: string;
  locality: string;
  state: string;
  pickupOrDelivery: 'Pickup only' | 'Delivery available' | 'Flexible / Negotiable';
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  whatsappPreferred?: boolean;
  status: 'available' | 'in_negotiation' | 'completed' | 'cancelled';
  createdAt: string;
  userId: string;
  enquiriesCount: number;
  imageUrl?: string;
}

export interface MarketplaceEnquiry {
  id: string;
  listingId: string;
  senderName: string;
  senderContact: string;
  senderEmail?: string;
  offeredPrice?: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface DirectoryCorrection {
  id: string;
  targetType: 'recycler' | 'buyer' | 'waste_item';
  targetId?: string;
  targetName: string;
  suggestedName?: string;
  city: string;
  state: string;
  suggestedCategory?: string;
  notes: string;
  reporterContact?: string;
  createdAt: string;
  status: 'pending' | 'verified' | 'rejected';
}

export interface ReportIssue {
  id: string;
  issueType: 'Garbage dumping' | 'Overflowing bin' | 'Uncollected waste' | 'Mixed waste' | 'Plastic pollution' | 'Hazardous discharge' | 'Other';
  description: string;
  location: {
    city: string;
    locality: string;
    pincode?: string;
    lat?: number;
    lng?: number;
  };
  imageUrl?: string;
  reporterName?: string;
  reporterContact?: string;
  status: 'Submitted' | 'Under review' | 'Assigned' | 'Resolved';
  submittedAt: string;
  updatedAt: string;
  assignedWard?: string;
  resolutionNotes?: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorCity: string;
  title: string;
  type: 'Sustainable action' | 'Waste reduction idea' | 'Recycling experience' | 'Community cleanup' | 'Composting activity' | 'Local initiative';
  content: string;
  imageUrl?: string;
  status: 'Approved' | 'Pending review' | 'Rejected';
  likesCount: number;
  createdAt: string;
  tags: string[];
}

export interface EducationalGuide {
  id: string;
  title: string;
  subtitle: string;
  category: WasteCategory | 'general_sustainability';
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  estimatedMinutes: number;
  summary: string;
  materialsNeeded: string[];
  steps: {
    title: string;
    description: string;
    tip?: string;
  }[];
  dos: string[];
  donts: string[];
  safetyNotes: string[];
  relatedCategories: WasteCategory[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  city: string;
  avatarSeed?: string;
  joinedDate: string;
  isLoggedIn: boolean;
  savedRecyclerIds: string[];
  savedBuyerIds: string[];
  savedListingIds: string[];
  bookmarkedGuideIds: string[];
  savedLocationIds?: string[];
  stats: {
    itemsIdentified: number;
    itemsSegregated: number;
    itemsReused: number;
    itemsDonated: number;
    itemsSold: number;
    reportsSubmitted: number;
    sustainableActions: number;
    wasteDivertedKg: number;
    co2AvoidedKg: number;
  };
  badges: {
    id: string;
    title: string;
    description: string;
    unlockedAt: string;
    icon: string;
  }[];
  recentActivity: {
    id: string;
    action: string;
    timestamp: string;
    details: string;
  }[];
}

export type MapMarkerCategory =
  | 'recycling_centre'
  | 'scrap_dealer'
  | 'waste_buyer'
  | 'ewaste_centre'
  | 'plastic_recycler'
  | 'paper_recycler'
  | 'metal_recycler'
  | 'composting_centre'
  | 'donation_centre'
  | 'collection_point'
  | 'waste_hotspot';

export interface CircularityLocation {
  id: string;
  name: string;
  category: MapMarkerCategory;
  categoryLabel: string;
  sourceType: 'recycler' | 'buyer' | 'hotspot' | 'collection_point';
  originalId: string;
  city: string;
  state: string;
  locality?: string;
  address: string;
  lat: number;
  lng: number;
  acceptedCategories: WasteCategory[];
  specificMaterials: string[];
  collectionMethods?: ('Doorstep pickup' | 'Drop-off center' | 'Bulk pickup')[];
  contactPhone?: string;
  whatsappNumber?: string;
  email?: string;
  website?: string;
  googleMapsUrl: string;
  operatingHours?: string;
  rating?: number;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  minimumQuantity?: string;
  pricingNote?: string;
  notes?: string;
  distanceKm?: number;
  hotspotData?: {
    issueType: string;
    status: string;
    referenceNo: string;
    submittedAt: string;
    description: string;
  };
}

