import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  increment as firestoreIncrement 
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { 
  CommunityPost, 
  ReportIssue, 
  UserProfile, 
  WasteBuyer, 
  MarketplaceListing, 
  MarketplaceEnquiry, 
  DirectoryCorrection 
} from '../types';
import { INITIAL_COMMUNITY_POSTS, INITIAL_REPORTS, INITIAL_USER_PROFILE } from '../data/mockData';
import { WASTE_BUYERS } from '../data/buyers';
import { INITIAL_MARKETPLACE_LISTINGS } from '../data/marketplaceData';

// In-memory caches for ultra-responsive, zero-flicker UI
let cachedReports: ReportIssue[] = [...INITIAL_REPORTS];
let cachedPosts: CommunityPost[] = [...INITIAL_COMMUNITY_POSTS];
let cachedUser: UserProfile = { ...INITIAL_USER_PROFILE };
let cachedBuyers: WasteBuyer[] = [...WASTE_BUYERS];
let cachedListings: MarketplaceListing[] = [...INITIAL_MARKETPLACE_LISTINGS];
let cachedCorrections: DirectoryCorrection[] = [];

// =========================================================================
// 1. Community Posts CRUD
// =========================================================================

export function getCommunityPosts(): CommunityPost[] {
  return cachedPosts;
}

export function subscribeToCommunityPosts(callback: (posts: CommunityPost[]) => void): () => void {
  const postsCollection = 'communityPosts';
  try {
    const q = query(collection(db, postsCollection));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: CommunityPost[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...docSnap.data() } as CommunityPost);
          });
          loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          cachedPosts = loaded;
          callback(loaded);
        } else {
          seedInitialPosts().then(() => callback(cachedPosts));
        }
      },
      (error) => {
        console.warn(`Firestore onSnapshot error for ${postsCollection}:`, error);
        callback(cachedPosts);
      }
    );
  } catch (err) {
    console.warn('Fallback to cached posts:', err);
    callback(cachedPosts);
    return () => {};
  }
}

async function seedInitialPosts() {
  for (const post of INITIAL_COMMUNITY_POSTS) {
    try {
      await setDoc(doc(db, 'communityPosts', post.id), {
        authorId: 'seed-author',
        authorName: post.authorName,
        authorCity: post.authorCity,
        title: post.title,
        content: post.content,
        category: post.type,
        type: post.type,
        likesCount: post.likesCount || 0,
        likedBy: [],
        status: post.status,
        createdAt: post.createdAt,
        tags: post.tags || [],
      });
    } catch (e) {
      console.debug('Seed post skipped:', e);
    }
  }
}

export async function addCommunityPost(
  post: Omit<CommunityPost, 'id' | 'status' | 'likesCount' | 'createdAt'>
): Promise<CommunityPost> {
  const uid = auth.currentUser?.uid || 'guest-citizen';
  const id = `post-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const newPost: CommunityPost = {
    ...post,
    id,
    status: 'Pending review',
    likesCount: 0,
    createdAt: new Date().toISOString(),
  };

  cachedPosts = [newPost, ...cachedPosts];

  const path = `communityPosts/${id}`;
  try {
    await setDoc(doc(db, 'communityPosts', id), {
      authorId: uid,
      authorName: newPost.authorName,
      authorCity: newPost.authorCity,
      title: newPost.title,
      content: newPost.content,
      category: newPost.type,
      type: newPost.type,
      likesCount: 0,
      likedBy: [],
      status: 'Pending review',
      createdAt: newPost.createdAt,
      tags: newPost.tags || [],
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }

  recordUserActivity('Published Community Post', newPost.title);
  incrementUserStat('sustainableActions', 1);

  return newPost;
}

export async function toggleLikeCommunityPost(id: string): Promise<CommunityPost | null> {
  const post = cachedPosts.find((p) => p.id === id);
  if (!post) return null;

  const newLikes = (post.likesCount || 0) + 1;
  const updatedPost = { ...post, likesCount: newLikes };
  cachedPosts = cachedPosts.map((p) => (p.id === id ? updatedPost : p));

  const path = `communityPosts/${id}`;
  try {
    await updateDoc(doc(db, 'communityPosts', id), {
      likesCount: firestoreIncrement(1),
    });
  } catch (error) {
    console.warn('Firestore like update error, saved in memory:', error);
  }

  return updatedPost;
}

export async function updatePostModerationStatus(
  id: string,
  status: 'Approved' | 'Pending review' | 'Rejected'
): Promise<void> {
  cachedPosts = cachedPosts.map((p) => (p.id === id ? { ...p, status } : p));
  const path = `communityPosts/${id}`;
  try {
    await updateDoc(doc(db, 'communityPosts', id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// =========================================================================
// 2. Waste Issue Reports CRUD
// =========================================================================

export function getReports(): ReportIssue[] {
  return cachedReports;
}

export function subscribeToReports(callback: (reports: ReportIssue[]) => void): () => void {
  const reportsCollection = 'reports';
  try {
    const q = query(collection(db, reportsCollection));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: ReportIssue[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...docSnap.data() } as ReportIssue);
          });
          loaded.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
          cachedReports = loaded;
          callback(loaded);
        } else {
          seedInitialReports().then(() => callback(cachedReports));
        }
      },
      (error) => {
        console.warn(`Firestore onSnapshot error for ${reportsCollection}:`, error);
        callback(cachedReports);
      }
    );
  } catch (err) {
    console.warn('Fallback to cached reports:', err);
    callback(cachedReports);
    return () => {};
  }
}

async function seedInitialReports() {
  for (const rep of INITIAL_REPORTS) {
    try {
      await setDoc(doc(db, 'reports', rep.id), {
        reporterId: 'seed-reporter',
        reporterName: rep.reporterName || 'Citizen',
        reporterContact: rep.reporterContact || '',
        issueType: rep.issueType,
        description: rep.description,
        location: rep.location,
        imageUrl: rep.imageUrl || '',
        status: rep.status,
        submittedAt: rep.submittedAt,
        updatedAt: rep.updatedAt,
        assignedWard: rep.assignedWard || '',
        resolutionNotes: rep.resolutionNotes || '',
      });
    } catch (e) {
      console.debug('Seed report skipped:', e);
    }
  }
}

export async function submitReport(
  reportData: Omit<ReportIssue, 'id' | 'status' | 'submittedAt' | 'updatedAt'>
): Promise<ReportIssue> {
  const uid = auth.currentUser?.uid || 'guest-citizen';
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const id = `PVX-2026-${randomSuffix}`;
  const now = new Date().toISOString();

  const newReport: ReportIssue = {
    ...reportData,
    id,
    status: 'Submitted',
    submittedAt: now,
    updatedAt: now,
  };

  cachedReports = [newReport, ...cachedReports];

  const path = `reports/${id}`;
  try {
    await setDoc(doc(db, 'reports', id), {
      reporterId: uid,
      reporterName: newReport.reporterName || auth.currentUser?.displayName || 'Citizen',
      reporterContact: newReport.reporterContact || auth.currentUser?.email || '',
      issueType: newReport.issueType,
      description: newReport.description,
      location: newReport.location,
      imageUrl: newReport.imageUrl || '',
      status: 'Submitted',
      submittedAt: now,
      updatedAt: now,
      assignedWard: '',
      resolutionNotes: '',
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }

  recordUserActivity('Submitted Waste Issue Report', `Issue #${id} in ${newReport.location.city}`);
  incrementUserStat('reportsSubmitted', 1);

  return newReport;
}

export async function updateReportStatus(
  id: string,
  status: 'Submitted' | 'Under review' | 'Assigned' | 'Resolved',
  assignedWard?: string,
  resolutionNotes?: string
): Promise<void> {
  cachedReports = cachedReports.map((r) => {
    if (r.id === id) {
      return {
        ...r,
        status,
        assignedWard: assignedWard !== undefined ? assignedWard : r.assignedWard,
        resolutionNotes: resolutionNotes !== undefined ? resolutionNotes : r.resolutionNotes,
        updatedAt: new Date().toISOString(),
      };
    }
    return r;
  });

  const path = `reports/${id}`;
  try {
    const updatePayload: Record<string, any> = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (assignedWard !== undefined) updatePayload.assignedWard = assignedWard;
    if (resolutionNotes !== undefined) updatePayload.resolutionNotes = resolutionNotes;

    await updateDoc(doc(db, 'reports', id), updatePayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// =========================================================================
// 3. Waste Buyers Directory CRUD
// =========================================================================

export function getWasteBuyers(): WasteBuyer[] {
  return cachedBuyers;
}

export function subscribeToWasteBuyers(callback: (buyers: WasteBuyer[]) => void): () => void {
  const collectionName = 'wasteBuyers';
  try {
    const q = query(collection(db, collectionName));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: WasteBuyer[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...docSnap.data() } as WasteBuyer);
          });
          cachedBuyers = loaded;
          callback(loaded);
        } else {
          seedInitialBuyers().then(() => callback(cachedBuyers));
        }
      },
      (error) => {
        console.warn(`Firestore onSnapshot error for ${collectionName}:`, error);
        callback(cachedBuyers);
      }
    );
  } catch (err) {
    console.warn('Fallback to cached buyers:', err);
    callback(cachedBuyers);
    return () => {};
  }
}

async function seedInitialBuyers() {
  for (const buyer of WASTE_BUYERS) {
    try {
      await setDoc(doc(db, 'wasteBuyers', buyer.id), {
        ...buyer
      });
    } catch (e) {
      console.debug('Seed buyer skipped:', e);
    }
  }
}

// =========================================================================
// 4. Marketplace Listings & Enquiries CRUD
// =========================================================================

export function getMarketplaceListings(): MarketplaceListing[] {
  return cachedListings;
}

export function subscribeToMarketplaceListings(callback: (listings: MarketplaceListing[]) => void): () => void {
  const collectionName = 'marketplaceListings';
  try {
    const q = query(collection(db, collectionName));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: MarketplaceListing[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...docSnap.data() } as MarketplaceListing);
          });
          loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          cachedListings = loaded;
          callback(loaded);
        } else {
          seedInitialListings().then(() => callback(cachedListings));
        }
      },
      (error) => {
        console.warn(`Firestore onSnapshot error for ${collectionName}:`, error);
        callback(cachedListings);
      }
    );
  } catch (err) {
    console.warn('Fallback to cached listings:', err);
    callback(cachedListings);
    return () => {};
  }
}

async function seedInitialListings() {
  for (const listing of INITIAL_MARKETPLACE_LISTINGS) {
    try {
      await setDoc(doc(db, 'marketplaceListings', listing.id), {
        ...listing
      });
    } catch (e) {
      console.debug('Seed listing skipped:', e);
    }
  }
}

export async function addMarketplaceListing(
  listing: Omit<MarketplaceListing, 'id' | 'createdAt' | 'enquiriesCount'>
): Promise<MarketplaceListing> {
  const uid = auth.currentUser?.uid || 'guest-citizen';
  const id = `mkt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const newListing: MarketplaceListing = {
    ...listing,
    id,
    userId: uid,
    createdAt: now,
    enquiriesCount: 0,
    status: 'available',
  };

  cachedListings = [newListing, ...cachedListings];

  const path = `marketplaceListings/${id}`;
  try {
    await setDoc(doc(db, 'marketplaceListings', id), newListing);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }

  recordUserActivity(
    listing.type === 'sell' ? 'Listed Waste on Marketplace' : 'Posted Buying Requirement',
    newListing.title
  );
  if (listing.type === 'sell') {
    incrementUserStat('itemsSold', 1);
  } else {
    incrementUserStat('sustainableActions', 1);
  }

  return newListing;
}

export async function updateMarketplaceListingStatus(
  id: string,
  status: 'available' | 'in_negotiation' | 'completed' | 'cancelled'
): Promise<void> {
  cachedListings = cachedListings.map((l) => (l.id === id ? { ...l, status } : l));
  const path = `marketplaceListings/${id}`;
  try {
    await updateDoc(doc(db, 'marketplaceListings', id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function submitMarketplaceEnquiry(
  enquiryData: Omit<MarketplaceEnquiry, 'id' | 'createdAt' | 'status'>
): Promise<MarketplaceEnquiry> {
  const id = `enq-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const newEnquiry: MarketplaceEnquiry = {
    ...enquiryData,
    id,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };

  // Increment listing enquiriesCount
  cachedListings = cachedListings.map((l) => {
    if (l.id === enquiryData.listingId) {
      return { ...l, enquiriesCount: (l.enquiriesCount || 0) + 1 };
    }
    return l;
  });

  const path = `marketplaceEnquiries/${id}`;
  try {
    await setDoc(doc(db, 'marketplaceEnquiries', id), newEnquiry);
    await updateDoc(doc(db, 'marketplaceListings', enquiryData.listingId), {
      enquiriesCount: firestoreIncrement(1),
    });
  } catch (error) {
    console.warn('Enquiry creation error, saved locally:', error);
  }

  recordUserActivity('Submitted Marketplace Enquiry', `Offer on listing #${enquiryData.listingId.slice(-6)}`);
  return newEnquiry;
}

// =========================================================================
// 5. Directory Corrections & Feedback CRUD
// =========================================================================

export function getDirectoryCorrections(): DirectoryCorrection[] {
  return cachedCorrections;
}

export function subscribeToDirectoryCorrections(callback: (corrections: DirectoryCorrection[]) => void): () => void {
  const collectionName = 'directoryCorrections';
  try {
    const q = query(collection(db, collectionName));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: DirectoryCorrection[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...docSnap.data() } as DirectoryCorrection);
          });
          loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          cachedCorrections = loaded;
          callback(loaded);
        } else {
          callback(cachedCorrections);
        }
      },
      (error) => {
        console.warn(`Firestore onSnapshot error for ${collectionName}:`, error);
        callback(cachedCorrections);
      }
    );
  } catch (err) {
    console.warn('Fallback to cached corrections:', err);
    callback(cachedCorrections);
    return () => {};
  }
}

export async function submitDirectoryCorrection(
  correctionData: Omit<DirectoryCorrection, 'id' | 'createdAt' | 'status'>
): Promise<DirectoryCorrection> {
  const id = `cor-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const newCorrection: DirectoryCorrection = {
    ...correctionData,
    id,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };

  cachedCorrections = [newCorrection, ...cachedCorrections];

  const path = `directoryCorrections/${id}`;
  try {
    await setDoc(doc(db, 'directoryCorrections', id), newCorrection);
  } catch (error) {
    console.warn('Directory correction saved locally:', error);
  }

  recordUserActivity('Suggested Directory Correction', `${correctionData.targetType}: ${correctionData.targetName}`);
  return newCorrection;
}

export async function updateDirectoryCorrectionStatus(
  id: string,
  status: 'pending' | 'verified' | 'rejected'
): Promise<void> {
  cachedCorrections = cachedCorrections.map((c) => (c.id === id ? { ...c, status } : c));
  const path = `directoryCorrections/${id}`;
  try {
    await updateDoc(doc(db, 'directoryCorrections', id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// =========================================================================
// 6. User Profile & Saved Items / Bookmarks
// =========================================================================

export function getUserProfile(): UserProfile {
  return cachedUser;
}

export function setCachedUserProfile(profile: UserProfile): void {
  cachedUser = profile;
}

export function subscribeToUserProfile(uid: string, callback: (profile: UserProfile) => void): () => void {
  const userPath = `users/${uid}`;
  try {
    return onSnapshot(
      doc(db, 'users', uid),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const profile: UserProfile = {
            id: uid,
            name: data.name || 'Citizen',
            email: data.email || 'citizen@prithvex.org',
            city: data.city || 'Bengaluru',
            joinedDate: data.joinedDate || new Date().toISOString().split('T')[0],
            isLoggedIn: true,
            stats: { ...INITIAL_USER_PROFILE.stats, ...data.stats },
            badges: data.badges || INITIAL_USER_PROFILE.badges,
            recentActivity: data.recentActivity || INITIAL_USER_PROFILE.recentActivity,
            savedRecyclerIds: data.savedRecyclerIds || [],
            savedBuyerIds: data.savedBuyerIds || [],
            savedListingIds: data.savedListingIds || [],
            bookmarkedGuideIds: data.bookmarkedGuideIds || [],
          };
          cachedUser = profile;
          callback(profile);
        }
      },
      (error) => {
        console.warn(`Firestore onSnapshot error for ${userPath}:`, error);
        callback(cachedUser);
      }
    );
  } catch (err) {
    console.warn('Fallback to cached user:', err);
    callback(cachedUser);
    return () => {};
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  cachedUser = profile;
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const path = `users/${uid}`;
  try {
    await setDoc(
      doc(db, 'users', uid),
      {
        uid,
        name: profile.name,
        email: profile.email,
        city: profile.city,
        joinedDate: profile.joinedDate,
        stats: profile.stats,
        badges: profile.badges,
        recentActivity: profile.recentActivity || [],
        savedRecyclerIds: profile.savedRecyclerIds || [],
        savedBuyerIds: profile.savedBuyerIds || [],
        savedListingIds: profile.savedListingIds || [],
        bookmarkedGuideIds: profile.bookmarkedGuideIds || [],
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function toggleSavedItem(
  type: 'recycler' | 'buyer' | 'listing' | 'guide',
  itemId: string
): boolean {
  if (!cachedUser) return false;

  let isSaved = false;
  if (type === 'recycler') {
    const list = cachedUser.savedRecyclerIds || [];
    if (list.includes(itemId)) {
      cachedUser.savedRecyclerIds = list.filter((id) => id !== itemId);
      isSaved = false;
    } else {
      cachedUser.savedRecyclerIds = [...list, itemId];
      isSaved = true;
    }
  } else if (type === 'buyer') {
    const list = cachedUser.savedBuyerIds || [];
    if (list.includes(itemId)) {
      cachedUser.savedBuyerIds = list.filter((id) => id !== itemId);
      isSaved = false;
    } else {
      cachedUser.savedBuyerIds = [...list, itemId];
      isSaved = true;
    }
  } else if (type === 'listing') {
    const list = cachedUser.savedListingIds || [];
    if (list.includes(itemId)) {
      cachedUser.savedListingIds = list.filter((id) => id !== itemId);
      isSaved = false;
    } else {
      cachedUser.savedListingIds = [...list, itemId];
      isSaved = true;
    }
  } else if (type === 'guide') {
    const list = cachedUser.bookmarkedGuideIds || [];
    if (list.includes(itemId)) {
      cachedUser.bookmarkedGuideIds = list.filter((id) => id !== itemId);
      isSaved = false;
    } else {
      cachedUser.bookmarkedGuideIds = [...list, itemId];
      isSaved = true;
    }
  }

  saveUserProfile(cachedUser);
  return isSaved;
}

export function recordUserActivity(action: string, details: string): void {
  const newActivity = {
    id: `act-${Date.now()}`,
    action,
    timestamp: 'Just now',
    details,
  };
  cachedUser.recentActivity = [newActivity, ...(cachedUser.recentActivity || []).slice(0, 14)];
  saveUserProfile(cachedUser);
}

export function incrementUserStat(
  statKey: 
    | 'itemsIdentified' 
    | 'itemsSegregated' 
    | 'itemsReused' 
    | 'itemsDonated' 
    | 'itemsSold' 
    | 'reportsSubmitted' 
    | 'sustainableActions',
  amount = 1
): void {
  if (cachedUser.stats) {
    cachedUser.stats[statKey] = (cachedUser.stats[statKey] || 0) + amount;

    // Diverted waste heuristics (transparent 350g per segregated/diverted item)
    if (['itemsIdentified', 'itemsSegregated', 'itemsReused', 'itemsDonated', 'itemsSold'].includes(statKey)) {
      cachedUser.stats.wasteDivertedKg = +(cachedUser.stats.wasteDivertedKg + 0.35 * amount).toFixed(1);
      cachedUser.stats.co2AvoidedKg = +(cachedUser.stats.co2AvoidedKg + 0.52 * amount).toFixed(1);
    }

    saveUserProfile(cachedUser);
  }
}
