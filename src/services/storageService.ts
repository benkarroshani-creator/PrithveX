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
import { CommunityPost, ReportIssue, UserProfile } from '../types';
import { INITIAL_COMMUNITY_POSTS, INITIAL_REPORTS, INITIAL_USER_PROFILE } from '../data/mockData';

// In-memory cache for ultra-responsive UI
let cachedReports: ReportIssue[] = [...INITIAL_REPORTS];
let cachedPosts: CommunityPost[] = [...INITIAL_COMMUNITY_POSTS];
let cachedUser: UserProfile = { ...INITIAL_USER_PROFILE };

// --- 1. Community Posts CRUD ---

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
          // Sort by creation date descending
          loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          cachedPosts = loaded;
          callback(loaded);
        } else {
          // If Firestore collection is empty, seed it with initial posts
          seedInitialPosts().then(() => callback(cachedPosts));
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, postsCollection);
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
    status: 'Pending review', // Requires moderation
    likesCount: 0,
    createdAt: new Date().toISOString(),
  };

  // Optimistic cache update
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

// --- 2. Waste Issue Reports CRUD ---

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
        handleFirestoreError(error, OperationType.LIST, reportsCollection);
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

  // Optimistic update
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

  // Record in user activity
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

// --- 3. User Profile & Impact Stats CRUD ---

export function getUserProfile(): UserProfile {
  return cachedUser;
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
            stats: data.stats || INITIAL_USER_PROFILE.stats,
            badges: data.badges || INITIAL_USER_PROFILE.badges,
            recentActivity: data.recentActivity || INITIAL_USER_PROFILE.recentActivity,
          };
          cachedUser = profile;
          callback(profile);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, userPath);
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
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function recordUserActivity(action: string, details: string): void {
  const newActivity = {
    id: `act-${Date.now()}`,
    action,
    timestamp: 'Just now',
    details,
  };
  cachedUser.recentActivity = [newActivity, ...(cachedUser.recentActivity || []).slice(0, 9)];
  saveUserProfile(cachedUser);
}

export function incrementUserStat(
  statKey: 'itemsIdentified' | 'reportsSubmitted' | 'sustainableActions',
  amount = 1
): void {
  if (cachedUser.stats) {
    cachedUser.stats[statKey] = (cachedUser.stats[statKey] || 0) + amount;
    if (statKey === 'itemsIdentified') {
      cachedUser.stats.wasteDivertedKg = +(cachedUser.stats.wasteDivertedKg + 0.35 * amount).toFixed(1);
      cachedUser.stats.co2AvoidedKg = +(cachedUser.stats.co2AvoidedKg + 0.52 * amount).toFixed(1);
    }
    saveUserProfile(cachedUser);
  }
}
