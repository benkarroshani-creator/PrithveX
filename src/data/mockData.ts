import { CommunityPost, ReportIssue, UserProfile } from '../types';

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-01',
    authorName: 'Aarav Sharma',
    authorCity: 'Bengaluru',
    title: 'Set up a 3-pot Khamba in our 4th floor balcony — zero smell!',
    type: 'Composting activity',
    content: 'We produce about 600g of vegetable peels daily. Following the 2:1 brown-to-green rule with neem leaves and cocopeat, we haven’t sent a single gram of wet waste to the municipal tipper in 45 days. Our balcony marigolds are blooming!',
    status: 'Approved',
    likesCount: 38,
    createdAt: '2026-09-24T14:30:00Z',
    tags: ['balcony-composting', 'wet-waste', 'zero-waste', 'bengaluru']
  },
  {
    id: 'post-02',
    authorName: 'Dr. Priya Nambiar',
    authorCity: 'Kochi / Mumbai',
    title: 'Apartment Society Plastic Drive: 140kg collected with local Kabadiwala',
    type: 'Community cleanup',
    content: 'Our 80-flat society organized a "Clean & Dry Milk Pouch" weekend challenge. Residents washed and collected pouches. A local scrap aggregator paid Rs 2,400 for the batch, which we donated to the society security welfare fund!',
    status: 'Approved',
    likesCount: 52,
    createdAt: '2026-09-27T09:15:00Z',
    tags: ['society-drive', 'milk-pouches', 'circular-economy', 'mumbai']
  },
  {
    id: 'post-03',
    authorName: 'Rohan Deshmukh',
    authorCity: 'Pune',
    title: 'Repurposing old denim jeans into heavy-duty grocery tote bags',
    type: 'Waste reduction idea',
    content: 'Rather than discarding 3 pairs of worn jeans with ripped knees, our local tailor stitched them into 4 indestructible tote bags that hold up to 15kg of sabzi market produce. Cost: Rs 150 total for stitching.',
    status: 'Approved',
    likesCount: 29,
    createdAt: '2026-09-29T16:00:00Z',
    tags: ['upcycling', 'denim', 'jugaad', 'pune']
  },
  {
    id: 'post-04',
    authorName: 'Sunita Mehra',
    authorCity: 'Delhi-NCR',
    title: 'E-waste drop-off at local tech park collection center',
    type: 'Recycling experience',
    content: 'Cleared out a drawer with 6 old charging cables, 2 swollen feature phones, and a dead mixer-grinder motor. Deposited them at an authorized CPCB bin. Received a verification green certificate on my email!',
    status: 'Approved',
    likesCount: 19,
    createdAt: '2026-10-01T11:20:00Z',
    tags: ['e-waste', 'delhi', 'cpcb', 'take-back']
  },
  {
    id: 'post-05',
    authorName: 'Vikram Joshi',
    authorCity: 'Ahmedabad',
    title: 'Starting a residential used cooking oil (RUCO) collection drop-box',
    type: 'Local initiative',
    content: 'Drafting a proposal for our 200-home gated community to pool used kadai oil into 20-litre drums for weekly biofuel aggregator pickup. Looking for volunteer ward leads to help with awareness flyers.',
    status: 'Pending review',
    likesCount: 6,
    createdAt: '2026-10-02T06:45:00Z',
    tags: ['ruco', 'cooking-oil', 'biofuel', 'ahmedabad']
  }
];

export const INITIAL_REPORTS: ReportIssue[] = [
  {
    id: 'PVX-2026-8812',
    issueType: 'Overflowing bin',
    description: 'Community garbage vat on 80ft road near bus stop is overflowing onto pedestrian walkway. Stray animals are scattering plastic into stormwater drain.',
    location: {
      city: 'Bengaluru',
      locality: 'Indiranagar 80ft Road, near junction',
      pincode: '560038',
      lat: 12.9716,
      lng: 77.5946
    },
    reporterName: 'Kavita Sundaram',
    reporterContact: '+91 98450 XXXXX',
    status: 'Assigned',
    submittedAt: '2026-10-01T08:30:00Z',
    updatedAt: '2026-10-01T14:10:00Z',
    assignedWard: 'Ward 89 (Jogupalya), BBMP Solid Waste Division',
    resolutionNotes: 'Compactor vehicle scheduled for clearance in afternoon shift.'
  },
  {
    id: 'PVX-2026-8809',
    issueType: 'Garbage dumping',
    description: 'Illegal dumping of commercial renovation debris (gypsum boards, ceramic tiles, and packaging thermocol) in open plot near lake periphery.',
    location: {
      city: 'Pune',
      locality: 'Pashan Lake Link Road',
      pincode: '411021',
      lat: 18.5204,
      lng: 73.8567
    },
    reporterName: 'Anand Kulkarni',
    status: 'Under review',
    submittedAt: '2026-10-01T17:45:00Z',
    updatedAt: '2026-10-02T05:00:00Z',
    assignedWard: 'Aundh-Baner Ward Office',
    resolutionNotes: 'Sanitary inspector inspecting site for issuing municipal notice to plot owner.'
  },
  {
    id: 'PVX-2026-8794',
    issueType: 'Plastic pollution',
    description: 'Heaps of single-use thin plastic bags and styrofoam plates left behind after festive community gathering in public park.',
    location: {
      city: 'Delhi-NCR',
      locality: 'Sector 15 Community Park, Noida',
      pincode: '201301',
      lat: 28.5355,
      lng: 77.3910
    },
    reporterName: 'Sameer Verma',
    status: 'Resolved',
    submittedAt: '2026-09-28T09:00:00Z',
    updatedAt: '2026-09-29T12:00:00Z',
    assignedWard: 'Noida Authority Sanitation Zone 2',
    resolutionNotes: 'Cleaned by zonal special sweep team; 120kg segregated dry waste transferred to Sector 68 MRF.'
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-demo-01',
  name: 'Devansh Verma',
  email: 'devansh@prithvex.org',
  city: 'Bengaluru',
  avatarSeed: 'prithvex-eco',
  joinedDate: '2026-08-10',
  isLoggedIn: true,
  stats: {
    itemsIdentified: 14,
    reportsSubmitted: 2,
    sustainableActions: 9,
    wasteDivertedKg: 28.5,
    co2AvoidedKg: 42.7
  },
  badges: [
    {
      id: 'b-01',
      title: 'Segregation Starter',
      description: 'Identified your first 5 waste items correctly',
      unlockedAt: '2026-08-15',
      icon: 'CheckCircle2'
    },
    {
      id: 'b-02',
      title: 'Compost Champion',
      description: 'Logged 30 days of organic kitchen waste composting',
      unlockedAt: '2026-09-01',
      icon: 'Sprout'
    },
    {
      id: 'b-03',
      title: 'Civic Guardian',
      description: 'Reported a local waste issue for municipal attention',
      unlockedAt: '2026-09-18',
      icon: 'ShieldCheck'
    }
  ],
  recentActivity: [
    {
      id: 'act-01',
      action: 'Identified Milk Pouch (LDPE)',
      timestamp: '2 hours ago',
      details: 'Followed proper rinse & dry protocol before dry waste binning'
    },
    {
      id: 'act-02',
      action: 'Searched E-Waste Recyclers in Bengaluru',
      timestamp: 'Yesterday',
      details: 'Located Saahas Zero Waste drop-off center on Sarjapur Road'
    },
    {
      id: 'act-03',
      action: 'Logged Balcony Composting Batch',
      timestamp: '3 days ago',
      details: 'Added 1.2kg chopped melon and cucumber scraps to khamba pot'
    }
  ]
};

export const SAMPLE_PRESET_ITEMS = [
  {
    id: 'sample-container',
    label: 'Plastic Container (PP 5)',
    category: 'Rigid Plastic',
    hint: 'rigid plastic takeaway food container meal box tupperware dabba PP 5',
    color: 'border-teal-500 bg-teal-50 text-teal-800'
  },
  {
    id: 'sample-bottle',
    label: 'PET Water Bottle',
    category: 'PET Plastic #1',
    hint: 'transparent plastic mineral water bottle beverage cold drink PET 1',
    color: 'border-cyan-500 bg-cyan-50 text-cyan-800'
  },
  {
    id: 'sample-milk',
    label: 'Milk Pouch (LDPE)',
    category: 'Plastic Film',
    hint: 'used flexible plastic milk pouch Amul 500ml LDPE packet',
    color: 'border-blue-500 bg-blue-50 text-blue-800'
  },
  {
    id: 'sample-banana',
    label: 'Banana Peel',
    category: 'Wet / Organic',
    hint: 'banana peel organic fruit skin kitchen waste',
    color: 'border-emerald-500 bg-emerald-50 text-emerald-800'
  },
  {
    id: 'sample-can',
    label: 'Aluminium Can',
    category: 'Metal',
    hint: 'aluminium cold drink beverage soda can',
    color: 'border-sky-500 bg-sky-50 text-sky-800'
  },
  {
    id: 'sample-glass',
    label: 'Glass Sauce Jar',
    category: 'Glass',
    hint: 'glass pickle condiment sauce jar bottle kaanch',
    color: 'border-emerald-500 bg-emerald-50 text-emerald-800'
  },
  {
    id: 'sample-battery',
    label: 'Li-Ion Phone Battery',
    category: 'Hazardous / E-Waste',
    hint: 'old swollen lithium ion smartphone battery',
    color: 'border-rose-500 bg-rose-50 text-rose-800'
  },
  {
    id: 'sample-medicine',
    label: 'Expired Paracetamol Blister',
    category: 'Medical / Domestic Hazardous',
    hint: 'expired paracetamol pharmaceutical blister pack tablets',
    color: 'border-red-500 bg-red-50 text-red-800'
  },
  {
    id: 'sample-carton',
    label: 'Amazon Delivery Box',
    category: 'Paper & Cardboard',
    hint: 'brown corrugated cardboard packaging box',
    color: 'border-amber-500 bg-amber-50 text-amber-800'
  },
  {
    id: 'sample-oil',
    label: 'Used Cooking Oil',
    category: 'Used Cooking Oil',
    hint: 'used frying mustard vegetable oil kadai',
    color: 'border-yellow-500 bg-yellow-50 text-yellow-800'
  },
  {
    id: 'sample-thermocol',
    label: 'Thermocol Packaging',
    category: 'Special Waste',
    hint: 'white styrofoam thermocol packaging block',
    color: 'border-slate-500 bg-slate-50 text-slate-800'
  },
  {
    id: 'sample-jeans',
    label: 'Old Cotton Jeans',
    category: 'Textile',
    hint: 'worn out cotton denim jeans fabric chindi',
    color: 'border-indigo-500 bg-indigo-50 text-indigo-800'
  }
];
