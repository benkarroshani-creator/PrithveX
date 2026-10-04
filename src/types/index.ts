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
  provider: 'gemini-3.8-flash' | 'demo_classifier';
  timestamp: string;
}

export interface Recycler {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  acceptedCategories: WasteCategory[];
  collectionMethods: ('Doorstep pickup' | 'Drop-off center' | 'Bulk pickup')[];
  contactPhone: string;
  email?: string;
  website?: string;
  isVerified: boolean;
  lastVerifiedDate: string;
  operatingHours: string;
  rating: number;
  pricingNote?: string;
  notes?: string;
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
  stats: {
    itemsIdentified: number;
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
